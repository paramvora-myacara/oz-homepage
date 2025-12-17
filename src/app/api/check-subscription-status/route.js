import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const { stripeCustomerId, stripeSessionId } = await request.json();
    console.log('🔍 check-subscription-status called with:', {
      stripeCustomerId: stripeCustomerId ? `${stripeCustomerId.substring(0, 10)}...` : null,
      stripeSessionId: stripeSessionId ? `${stripeSessionId.substring(0, 20)}...` : null
    });

    const supabase = await createClient();

    let subscriptionQuery;
    let queryType;

    // Database-first approach: try session_id first, then fall back to customer_id
    if (stripeSessionId) {
      queryType = 'session_id';
      console.log('📊 Querying by stripe_session_id:', stripeSessionId);
      // Primary: Lookup by session_id (most reliable for success page)
      subscriptionQuery = supabase
        .from('subscriptions')
        .select('user_id, account_created, status, stripe_customer_id')
        .eq('stripe_session_id', stripeSessionId)
        .single();
    } else if (stripeCustomerId) {
      queryType = 'customer_id';
      console.log('📊 Querying by stripe_customer_id:', stripeCustomerId);
      // Fallback: Lookup by customer_id
      subscriptionQuery = supabase
        .from('subscriptions')
        .select('user_id, account_created, status, stripe_customer_id')
        .eq('stripe_customer_id', stripeCustomerId)
        .single();
    } else {
      console.log('❌ No valid parameters provided');
      return NextResponse.json({ error: 'Either stripeCustomerId or stripeSessionId required' }, { status: 400 });
    }

    console.log('🔍 Executing query...');
    const { data: subscription, error } = await subscriptionQuery;
    console.log('📋 Query result:', {
      found: !!subscription,
      error: error?.message,
      account_created: subscription?.account_created,
      user_id: subscription?.user_id ? `${subscription.user_id.substring(0, 8)}...` : null
    });

    if (error || !subscription) {
      console.log('❌ No subscription found or query error:', {
        error: error?.message,
        code: error?.code,
        details: error?.details
      });
      const response = {
        accountCreated: false,
        userId: null,
        subscriptionExists: false
      };
      console.log('📤 Returning:', response);
      return NextResponse.json(response);
    }

    const response = {
      accountCreated: subscription.account_created || false,
      userId: subscription.user_id,
      subscriptionExists: true,
      subscriptionStatus: subscription.status
    };
    console.log('✅ Subscription found, returning:', {
      ...response,
      userId: response.userId ? `${response.userId.substring(0, 8)}...` : null
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 Subscription status check failed:', error);
    console.error('Stack:', error.stack);
    return NextResponse.json({ error: 'Failed to check subscription status' }, { status: 500 });
  }
}
