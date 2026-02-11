// ============================================
// このファイルの配置先: app/api/push-subscribe/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ビルド時エラー防止のため関数内で初期化
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { subscription, projectId, role } = await request.json();

    if (!subscription || !projectId) {
      return NextResponse.json({ error: '必須項目が不足しています' }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', subscription.endpoint)
      .eq('project_id', projectId)
      .single();

    if (existing) {
      await supabase
        .from('push_subscriptions')
        .update({
          subscription_json: JSON.stringify(subscription),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('push_subscriptions')
        .insert({
          endpoint: subscription.endpoint,
          subscription_json: JSON.stringify(subscription),
          project_id: projectId,
          role: role || 'family',
        });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push subscribe error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { endpoint } = await request.json();

    if (!endpoint) {
      return NextResponse.json({ error: 'endpoint が必要です' }, { status: 400 });
    }

    await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}