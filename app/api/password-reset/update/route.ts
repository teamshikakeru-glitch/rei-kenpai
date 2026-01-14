import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { email, new_password } = await request.json();

    if (!email || !new_password) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    if (new_password.length < 6) {
      return NextResponse.json({ error: 'パスワードは6文字以上で設定してください' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('funeral_homes')
      .update({ password: new_password })
      .eq('email', email);

    if (updateError) {
      return NextResponse.json({ error: 'パスワードの更新に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}