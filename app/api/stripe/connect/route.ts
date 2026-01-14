import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { funeral_home_id } = await request.json();

    if (!funeral_home_id) {
      return NextResponse.json({ error: '葬儀社IDが必要です' }, { status: 400 });
    }

    const { data: funeralHome, error: fetchError } = await supabase
      .from('funeral_homes')
      .select('*')
      .eq('id', funeral_home_id)
      .single();

    if (fetchError || !funeralHome) {
      return NextResponse.json({ error: '葬儀社が見つかりません' }, { status: 404 });
    }

    let accountId = funeralHome.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'standard',
        country: 'JP',
        email: funeralHome.email,
        metadata: {
          funeral_home_id: funeral_home_id,
          funeral_home_name: funeralHome.name
        }
      });

      accountId = account.id;

      await supabase
        .from('funeral_homes')
        .update({ stripe_account_id: accountId })
        .eq('id', funeral_home_id);
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `https://rei-kenpai.vercel.app/admin/settings?stripe=refresh`,
      return_url: `https://rei-kenpai.vercel.app/admin/settings?stripe=success`,
      type: 'account_onboarding'
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error) {
    console.error('Stripe Connect error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}