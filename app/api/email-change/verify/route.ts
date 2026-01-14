import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { funeral_home_id, new_email, code } = await request.json();

    if (!funeral_home_id || !new_email || !code) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    // 認証コードを確認
    const { data: verificationData, error: verifyError } = await supabase
      .from('email_change_codes')
      .select('*')
      .eq('funeral_home_id', funeral_home_id)
      .eq('new_email', new_email)
      .eq('code', code)
      .single();

    if (verifyError || !verificationData) {
      return NextResponse.json({ error: '認証コードが正しくありません' }, { status: 400 });
    }

    // 有効期限を確認
    if (new Date(verificationData.expires_at) < new Date()) {
      return NextResponse.json({ error: '認証コードの有効期限が切れています' }, { status: 400 });
    }

    // メールアドレスを更新
    const { error: updateError } = await supabase
      .from('funeral_homes')
      .update({ email: new_email })
      .eq('id', funeral_home_id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json({ error: 'メールアドレスの更新に失敗しました' }, { status: 500 });
    }

    // 使用済みの認証コードを削除
    await supabase
      .from('email_change_codes')
      .delete()
      .eq('funeral_home_id', funeral_home_id);

    // 変更完了メールを新しいアドレスに送信
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Rei <noreply@smartkenpai.com>',
        to: new_email,
        subject: '【Rei】メールアドレスが変更されました',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 32px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #c9a227, #8b6914); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">礼</div>
              <h1 style="font-size: 24px; margin-top: 16px; color: #1a1a1a;">Rei</h1>
            </div>
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="color: #4caf50; font-size: 48px;">✓</span>
            </div>
            <h2 style="text-align: center; color: #1a1a1a; font-size: 18px;">メールアドレスが変更されました</h2>
            <p style="color: #666; line-height: 1.8; text-align: center;">
              このメールアドレスが新しい連絡先として登録されました。
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 32px;">
              この変更に心当たりがない場合は、すぐにサポートまでご連絡ください。
            </p>
          </div>
        `
      })
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}