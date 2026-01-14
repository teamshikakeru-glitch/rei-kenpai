import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { funeral_home_id, new_email } = await request.json();

    if (!funeral_home_id || !new_email) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // 新しいメールアドレスが既に使用されていないか確認
    const { data: existingEmail } = await supabase
      .from('funeral_homes')
      .select('id')
      .eq('email', new_email)
      .single();

    if (existingEmail) {
      return NextResponse.json({ error: 'このメールアドレスは既に使用されています' }, { status: 400 });
    }

    // 6桁の認証コードを生成
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分間有効

    // 既存の認証コードを削除
    await supabase
      .from('email_change_codes')
      .delete()
      .eq('funeral_home_id', funeral_home_id);

    // 新しい認証コードを保存
    const { error: insertError } = await supabase.from('email_change_codes').insert({
      funeral_home_id,
      new_email,
      code,
      expires_at: expiresAt.toISOString()
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
    }

    // Resend APIでメール送信
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Rei <noreply@smartkenpai.com>',
        to: new_email,
        subject: '【Rei】メールアドレス変更の認証コード',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #c9a227, #8b6914); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">礼</div>
              <h1 style="font-size: 24px; margin-top: 16px; color: #1a1a1a;">Rei</h1>
            </div>
            <p style="color: #333; line-height: 1.8;">メールアドレス変更の認証コードをお送りします。</p>
            <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
              <p style="font-size: 12px; color: #888; margin-bottom: 8px;">認証コード</p>
              <p style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a; margin: 0;">${code}</p>
            </div>
            <p style="color: #888; font-size: 13px;">このコードは10分間有効です。</p>
            <p style="color: #888; font-size: 13px;">心当たりがない場合は、このメールを無視してください。</p>
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