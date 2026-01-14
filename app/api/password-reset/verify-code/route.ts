import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    const { data: verificationData, error: verifyError } = await supabase
      .from('password_reset_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (verifyError || !verificationData) {
      return NextResponse.json({ error: '認証コードが正しくありません' }, { status: 400 });
    }

    if (new Date(verificationData.expires_at) < new Date()) {
      return NextResponse.json({ error: '認証コードの有効期限が切れています' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}