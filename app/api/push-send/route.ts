// ============================================
// このファイルの配置先: app/api/push-send/route.ts
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

// ビルド時エラー防止のため関数内で初期化
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function generateVapidJwt(audience: string): string {
  const privateKeyBase64 = process.env.VAPID_PRIVATE_KEY!;
  const publicKeyBase64 = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  const header = Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'ES256' })).toString('base64url');

  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    aud: audience,
    exp: now + 12 * 60 * 60,
    sub: 'mailto:info@shikakeru.co.jp',
  })).toString('base64url');

  const unsignedToken = `${header}.${payload}`;

  const privateKeyBuffer = Buffer.from(privateKeyBase64 + '='.repeat((4 - privateKeyBase64.length % 4) % 4), 'base64');
  const pkcs8 = buildPkcs8(privateKeyBuffer);

  const key = crypto.createPrivateKey({
    key: pkcs8,
    format: 'der',
    type: 'pkcs8',
  });

  const sign = crypto.createSign('SHA256');
  sign.update(unsignedToken);
  const signature = sign.sign({ key, dsaEncoding: 'ieee-p1363' });

  const jwt = `${unsignedToken}.${signature.toString('base64url')}`;
  const publicKeyForHeader = publicKeyBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `vapid t=${jwt}, k=${publicKeyForHeader}`;
}

function buildPkcs8(rawKey: Buffer): Buffer {
  const header = Buffer.from([
    0x30, 0x81, 0x87, 0x02, 0x01, 0x00, 0x30, 0x13,
    0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02,
    0x01, 0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d,
    0x03, 0x01, 0x07, 0x04, 0x6d, 0x30, 0x6b, 0x02,
    0x01, 0x01, 0x04, 0x20,
  ]);
  const footer = Buffer.from([
    0xa1, 0x44, 0x03, 0x42, 0x00,
  ]);

  const ecdh = crypto.createECDH('prime256v1');
  ecdh.setPrivateKey(rawKey);
  const publicKey = ecdh.getPublicKey();

  return Buffer.concat([header, rawKey, footer, publicKey]);
}

async function sendPushNotification(
  subscriptionJson: string,
  payload: string
): Promise<boolean> {
  const subscription = JSON.parse(subscriptionJson);
  const endpoint: string = subscription.endpoint;

  const url = new URL(endpoint);
  const audience = url.origin;

  const authorization = generateVapidJwt(audience);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': authorization,
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
    },
    body: payload,
  });

  if (response.status === 410 || response.status === 404) {
    throw Object.assign(new Error('Subscription expired'), { statusCode: response.status });
  }

  if (!response.ok) {
    throw new Error(`Push failed: ${response.status} ${response.statusText}`);
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { projectId, donorName, amount } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: 'projectId が必要です' }, { status: 400 });
    }

    const { data: project } = await supabase
      .from('projects')
      .select('deceased_name, slug')
      .eq('id', projectId)
      .single();

    const { data: subscriptions } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('project_id', projectId);

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    const displayName = donorName || '匿名の方';
    const displayAmount = amount ? `¥${amount.toLocaleString()}` : '';
    const payload = JSON.stringify({
      title: '礼 - 新しい献杯がありました',
      body: `${displayName}さんから${project?.deceased_name || ''}様へ${displayAmount}の献杯がありました`,
      tag: `kenpai-${projectId}-${Date.now()}`,
      url: project?.slug ? `/${project.slug}` : '/family',
    });

    let sent = 0;
    let failed = 0;
    const expiredEndpoints: string[] = [];

    await Promise.all(
      subscriptions.map(async (sub: any) => {
        try {
          await sendPushNotification(sub.subscription_json, payload);
          sent++;
        } catch (error: any) {
          failed++;
          if (error.statusCode === 410 || error.statusCode === 404) {
            expiredEndpoints.push(sub.endpoint);
          }
          console.error(`Push送信失敗 (${sub.endpoint}):`, error.message);
        }
      })
    );

    if (expiredEndpoints.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('endpoint', expiredEndpoints);
    }

    return NextResponse.json({ success: true, sent, failed });
  } catch (error) {
    console.error('Push send error:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}