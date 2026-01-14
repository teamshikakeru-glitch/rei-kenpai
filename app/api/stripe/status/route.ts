import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { funeral_home_id } = await request.json();

    if (!funeral_home_id) {
      return NextResponse.json({ error: '葬儀社IDが必要です' }, { status: 400 });
    }

    const { data: funeralHome } = await supabase
      .from('funeral_homes')
      .select('stripe_account_id')
      .eq('id', funeral_home_id)
      .single();

    if (!funeralHome?.stripe_account_id) {
      return NextResponse.json({ 
        connected: false, 
        onboarding_complete: false 
      });
    }

    const account = await stripe.accounts.retrieve(funeralHome.stripe_account_id);
    const isComplete = account.charges_enabled && account.payouts_enabled;

    if (isComplete) {
      await supabase
        .from('funeral_homes')
        .update({ stripe_onboarding_complete: true })
        .eq('id', funeral_home_id);
    }

    return NextResponse.json({
      connected: true,
      onboarding_complete: isComplete,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled
    });
  } catch (error) {
    console.error('Stripe status error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}