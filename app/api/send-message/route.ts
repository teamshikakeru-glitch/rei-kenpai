// app/api/send-message/route.ts
// メッセージのみ（金額なし）の献杯を保存するAPI

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 簡易レート制限（IPごとに1分10回まで）
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(request: Request) {
  // レート制限チェック
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'リクエストが多すぎます。しばらくしてからお試しください' },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const {
      projectId,
      donorName,
      donorNameKana,
      message,
      relationship,
      isAnonymous
    } = body;

    // バリデーション
    if (!projectId) {
      return NextResponse.json(
        { error: 'プロジェクトIDが必要です' },
        { status: 400 }
      );
    }

    // プロジェクト存在チェック（不正なproject_idを防止）
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'プロジェクトが見つかりません' },
        { status: 404 }
      );
    }

    // メッセージのサニタイズ（XSS防止）
    const sanitizedMessage = message?.replace(/<[^>]*>/g, '').slice(0, 2000) || '';
    const sanitizedName = donorName?.replace(/<[^>]*>/g, '').slice(0, 100) || '';

    if (!sanitizedName && !isAnonymous) {
      return NextResponse.json(
        { error: 'お名前を入力するか、匿名を選択してください' },
        { status: 400 }
      );
    }

    if (!sanitizedMessage || sanitizedMessage.trim() === '') {
      return NextResponse.json(
        { error: 'メッセージを入力してください' },
        { status: 400 }
      );
    }

    // kenpaiテーブルに保存（金額0、メッセージのみフラグ）
    const { data: kenpaiData, error: kenpaiError } = await supabase
      .from('kenpai')
      .insert({
        project_id: projectId,
        donor_name: isAnonymous ? '匿名' : sanitizedName,
        donor_name_kana: donorNameKana?.replace(/<[^>]*>/g, '').slice(0, 100) || null,
        amount: 0,
        message: sanitizedMessage,
        relationship: relationship || null,
        is_anonymous: isAnonymous || false,
        is_message_only: true,
        payment_status: 'completed',
      })
      .select()
      .single();

    if (kenpaiError) {
      console.error('Kenpai insert error:', kenpaiError);
      return NextResponse.json(
        { error: 'メッセージの送信に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'メッセージを送信しました',
      kenpaiId: kenpaiData.id
    });

  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'エラーが発生しました' },
      { status: 500 }
    );
  }
}