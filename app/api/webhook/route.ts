import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  let event: Stripe.Event;
  try { event = JSON.parse(body) as Stripe.Event; } catch (err) { return NextResponse.json({ error: 'Invalid payload' }, { status: 400 }); }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { donor_name, project_id, message } = session.metadata || {};
    const amount = session.amount_total;
    if (donor_name && project_id && amount) {
      await supabase.from('ケンパイ').insert({ project_id, donor_name, amount, message: message || null });
    }
  }
  return NextResponse.json({ received: true });
}


