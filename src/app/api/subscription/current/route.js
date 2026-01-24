import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  try {
    const supabase = await createClient();
    
    // Get user email from request headers or query params
    const headersList = await headers();
    const email = headersList.get('x-user-email') || new URL(request.url).searchParams.get('email');
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Authenticate user from admin_users table
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', email)
      .single();
    
    if (userError || !adminUser) {
      return NextResponse.json({ error: 'Unauthorized - User not found' }, { status: 401 });
    }

    // Get user's subscription
    // Include both 'active' and 'trialing' statuses (trialing = free trial period)
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select(`
        id,
        stripe_subscription_id,
        stripe_customer_id,
        status,
        created_at,
        plan_id,
        subscription_plans (
          id,
          name,
          stripe_price_id_monthly,
          stripe_price_id_yearly
        )
      `)
      .eq('user_id', adminUser.id)
      .in('status', ['active', 'trialing'])
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ 
        hasSubscription: false,
        subscription: null 
      });
    }

    // Get Stripe subscription details for billing info
    let stripeSubscription = null;
    try {
      stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id, {
        expand: ['items.data.price']
      });
    } catch (stripeError) {
      console.error('Error fetching Stripe subscription:', stripeError);
    }

    // Determine if plan is monthly or annual by comparing price ID
    let billingPeriod = null;
    if (stripeSubscription?.items?.data?.[0]?.price?.id) {
      const currentPriceId = stripeSubscription.items.data[0].price.id;
      if (currentPriceId === subscription.subscription_plans?.stripe_price_id_monthly) {
        billingPeriod = 'monthly';
      } else if (currentPriceId === subscription.subscription_plans?.stripe_price_id_yearly) {
        billingPeriod = 'annual';
      }
    }

    return NextResponse.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        planName: subscription.subscription_plans?.name,
        planId: subscription.plan_id,
        status: subscription.status,
        stripeSubscriptionId: subscription.stripe_subscription_id,
        stripeCustomerId: subscription.stripe_customer_id,
        currentPeriodEnd: stripeSubscription?.current_period_end,
        trialEnd: stripeSubscription?.trial_end,
        cancelAtPeriodEnd: stripeSubscription?.cancel_at_period_end,
        billingPeriod: billingPeriod, // 'monthly' or 'annual'
        hasPromoCode: stripeSubscription?.metadata?.promo_code_applied === 'TODD-OZL-2026' || 
                      stripeSubscription?.metadata?.free_period_end === '2026-05-31'
      }
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}
