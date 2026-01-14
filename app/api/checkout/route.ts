import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PLATFORM_FEE_PERCENT = 8;

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const { amount, donor_name, project_id, slug, message, is_anonymous } = await request.json();

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('funeral_home_id')
      .eq('id', project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'プロジェクトが見つかりません' }, { status: 404 });
    }

    const { data: funeralHome, error: homeError } = await supabase
      .from('funeral_homes')
      .select('stripe_account_id, stripe_onboarding_complete')
      .eq('id', project.funeral_home_id)
      .single();

    if (homeError || !funeralHome) {
      return NextResponse.json({ error: '葬儀社が見つかりません' }, { status: 404 });
    }

    const hasConnectAccount = funeralHome.stripe_account_id && funeralHome.stripe_onboarding_complete;
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENT / 100);

    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: '献杯',
              description: '故人様への献杯',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/${slug}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/${slug}?canceled=true`,
      metadata: {
        donor_name: donor_name || '匿名',
        project_id,
        message: message || '',
        is_anonymous: is_anonymous ? 'true' : 'false',
        funeral_home_id: project.funeral_home_id,
      },
    };

    if (hasConnectAccount) {
      sessionOptions.payment_intent_data = {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: funeralHome.stripe_account_id,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}