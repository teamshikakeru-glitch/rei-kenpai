import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.STRIPE_SECRET_KEY || 'fallback-secret-key-change-me'
);

export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json({ error: '葬儀社名とパスワードを入力してください' }, { status: 400 });
    }

    const { data, error: dbError } = await supabase
      .from('funeral_homes')
      .select('id, name, password')
      .eq('name', name.trim())
      .single();

    if (dbError || !data) {
      return NextResponse.json({ error: '葬儀社名またはパスワードが正しくありません' }, { status: 401 });
    }

    // bcryptハッシュかどうか判定（既存の平文パスワードとの互換性維持）
    let isValid = false;
    if (data.password.startsWith('$2a$') || data.password.startsWith('$2b$')) {
      isValid = await bcrypt.compare(password, data.password);
    } else {
      isValid = data.password === password;
      if (isValid) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await supabase
          .from('funeral_homes')
          .update({ password: hashedPassword })
          .eq('id', data.id);
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: '葬儀社名またはパスワードが正しくありません' }, { status: 401 });
    }

    // JWTトークン発行（24時間有効）
    const token = await new SignJWT({
      funeral_home_id: data.id,
      funeral_home_name: data.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      funeral_home: { id: data.id, name: data.name }
    });

    // HttpOnly Cookieにトークンを保存（クライアントJSからアクセス不可）
    response.cookies.set('rei_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24時間
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'ログインに失敗しました' }, { status: 500 });
  }
}
