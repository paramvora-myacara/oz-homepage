import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const supabase = await createClient();

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;

        // Find plan from metadata or line items
        let planId = null;
        let planName = session.metadata?.plan_name;

        if (planName) {
          // Normal flow: get plan from metadata
          const { data: plan } = await supabase
            .from('subscription_plans')
            .select('id')
            .eq('name', planName)
            .single();
          planId = plan?.id;
        } else {
          // Testing flow: find plan from price ID in line items
          try {
            const lineItem = session.line_items?.data?.[0];
            if (lineItem?.price?.id) {
              const { data: plan } = await supabase
                .from('subscription_plans')
                .select('id, name')
                .or(`stripe_price_id_monthly.eq.${lineItem.price.id},stripe_price_id_yearly.eq.${lineItem.price.id}`)
                .single();
              planId = plan?.id;
              console.log('Found plan from price ID:', plan?.name);
            }
          } catch (error) {
            console.log('Could not find plan from line items:', error.message);
          }
        }

        if (planId) {
          console.log('💾 Creating subscription record:', {
            stripe_subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            stripe_session_id: session.id,
            plan_id: planId
          });
          // Create subscription without user_id initially (will be linked later)
          const { data, error } = await supabase.from('subscriptions').insert({
            stripe_subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            stripe_session_id: session.id, // Store session ID for database lookups
            plan_id: planId,
            user_id: null, // Will be set when user creates account
            status: 'active'
          }).select();

          if (error) {
            console.error('❌ Failed to create subscription:', error);
          } else {
            console.log('✅ Created subscription:', data[0]?.id, 'for session:', session.id);
          }
        } else {
          console.error('❌ Could not find plan for checkout session:', session.id);
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;

        // Find user from subscription (user_id may be null if account not created yet)
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();

        if (subscription && subscription.user_id) {
          await supabase.from('payments').insert({
            user_id: subscription.user_id,
            stripe_payment_intent_id: invoice.payment_intent
          }).onConflict('stripe_payment_intent_id').doNothing();
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        // Update subscription status regardless of whether user_id is set
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('stripe_subscription_id', deletedSubscription.id);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
