import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Free period ends at end of day May 31st Pacific Time (11:59:59 PM PDT)
// May 31st, 2026 11:59:59 PM PDT = June 1st, 2026 6:59:59 AM UTC
const FREE_PERIOD_END_DATE = new Date('2026-06-01T06:59:59Z');
const FREE_PERIOD_END_UTC_TIMESTAMP = Math.floor(FREE_PERIOD_END_DATE.getTime() / 1000);

export async function POST(request) {
  try {
    const { planName, isAnnual, promoCode } = await request.json();

    // Get plan's Stripe price ID from database
    const supabase = await createClient();
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('stripe_price_id_monthly, stripe_price_id_yearly')
      .eq('name', planName)
      .single();

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Check if promo code is valid and should enable free period until May 31st
    const VALID_PROMO_CODES = ["TODD-OZL-2026", "MICHAEL-OZL-2026", "JEFF-OZL-2026", "LUCBRO"];
    const shouldApplyFreePeriod = VALID_PROMO_CODES.includes(promoCode);

    // Build checkout session configuration
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [{
        price: isAnnual ? plan.stripe_price_id_yearly : plan.stripe_price_id_monthly,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        plan_name: planName
      },
      // Allow customers to enter their email during checkout
      customer_email: undefined, // Stripe will collect this
      billing_address_collection: 'required'
    };

    // Only apply free period if promo code is valid and we're still before the end date
    const isFreePeriod = new Date() < FREE_PERIOD_END_DATE;
    if (shouldApplyFreePeriod && isFreePeriod) {
      sessionConfig.subscription_data = {
        trial_end: FREE_PERIOD_END_UTC_TIMESTAMP,
        metadata: {
          plan_name: planName,
          free_period_end: '2026-05-31',
          promo_code_applied: promoCode
        }
      };
    }

    // Create anonymous checkout session (no user authentication required)
    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
