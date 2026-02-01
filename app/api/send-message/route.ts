// app/api/send-message/route.ts
// メッセージのみ（金額なし）の献杯を保存するAPI

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
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

    if (!donorName && !isAnonymous) {
      return NextResponse.json(
        { error: 'お名前を入力するか、匿名を選択してください' },
        { status: 400 }
      );
    }

    if (!message || message.trim() === '') {
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
        donor_name: isAnonymous ? '匿名' : donorName,
        donor_name_kana: donorNameKana || null,
        amount: 0,
        message: message,
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