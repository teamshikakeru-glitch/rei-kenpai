import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email, funeral_home_name } = await request.json();

    if (!email || !funeral_home_name) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('funeral_homes')
      .select('id')
      .eq('name', funeral_home_name)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'この葬儀社名は既に登録されています' }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await supabase.from('verification_codes').delete().eq('email', email);

    await supabase.from('verification_codes').insert({
      email,
      code,
      funeral_home_name,
      expires_at: expiresAt.toISOString()
    });

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Rei <onboarding@resend.dev>',
        to: email,
        subject: '【Rei】認証コードのお知らせ',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; text-align: center;">Rei 認証コード</h1>
            <p>新規登録の認証コードをお送りします。</p>
            <div style="background: #f5f5f5; padding: 24px; text-align: center; margin: 24px 0; border-radius: 8px;">
              <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</p>
            </div>
            <p style="color: #666; font-size: 14px;">このコードは10分間有効です。</p>
          </div>
        `
      })
    });

    if (!resendRes.ok) {
      const errorText = await resendRes.text();
      console.error('Resend error:', errorText);
      return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}