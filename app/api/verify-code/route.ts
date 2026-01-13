import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'パスワードは6文字以上で設定してください' }, { status: 400 });
    }

    // コードを検証
    const { data: verification, error: verifyError } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (verifyError || !verification) {
      return NextResponse.json({ error: '認証コードが無効または期限切れです' }, { status: 400 });
    }

    // 葬儀社を登録
    const { data: newFuneralHome, error: insertError } = await supabase
      .from('funeral_homes')
      .insert({
        name: verification.funeral_home_name,
        email: email,
        password: password
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: '登録に失敗しました' }, { status: 500 });
    }

    // コードを使用済みに
    await supabase
      .from('verification_codes')
      .update({ used: true })
      .eq('id', verification.id);

    return NextResponse.json({ success: true, funeral_home: newFuneralHome });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}