import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

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
      // ハッシュ化済み → bcryptで比較
      isValid = await bcrypt.compare(password, data.password);
    } else {
      // 平文のまま残っている → 直接比較 + ハッシュ化して更新
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

    return NextResponse.json({
      success: true,
      funeral_home: { id: data.id, name: data.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'ログインに失敗しました' }, { status: 500 });
  }
}
