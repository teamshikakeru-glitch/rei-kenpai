import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.STRIPE_SECRET_KEY || 'fallback-secret-key-change-me'
);

export async function GET(request: NextRequest) {
  const token = request.cookies.get('rei_session')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return NextResponse.json({
      authenticated: true,
      funeral_home_id: payload.funeral_home_id,
      funeral_home_name: payload.funeral_home_name,
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

// ログアウト
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('rei_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
