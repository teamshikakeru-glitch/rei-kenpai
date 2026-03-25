import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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
    const { slug, password } = await request.json();

    if (!slug || !password) {
      return NextResponse.json({ error: 'スラッグとパスワードを入力してください' }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from('projects')
      .select('id, deceased_name, family_password')
      .eq('slug', slug)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'プロジェクトが見つかりません' }, { status: 404 });
    }

    if (password !== project.family_password) {
      return NextResponse.json({ error: 'パスワードが正しくありません' }, { status: 401 });
    }

    // JWTトークン発行（7日間有効）
    const token = await new SignJWT({
      project_id: project.id,
      slug: slug,
      type: 'family',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      project_id: project.id,
    });

    response.cookies.set(`family_session_${slug}`, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Family auth error:', error);
    return NextResponse.json({ error: '認証に失敗しました' }, { status: 500 });
  }
}
