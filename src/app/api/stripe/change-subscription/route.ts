import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/utils/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Plan tier mapping for upgrade validation
const PLAN_TIERS: Record<string, number> = { 'Standard': 1, 'Pro': 2, 'Elite': 3 };

// Free period ends at end of day May 31st Pacific Time (11:59:59 PM PDT)
// May 31st, 2026 11:59:59 PM PDT = June 1st, 2026 6:59:59 AM UTC
const FREE_PERIOD_END_DATE = new Date('2026-06-01T06:59:59Z');
const VALID_PROMO_CODE = "TODD-OZL-2026";

export async function POST(request: NextRequest) {
    try {
        const { subscriptionId, newPlanName, isAnnual } = await request.json();

        if (!subscriptionId || !newPlanName) {
            return NextResponse.json({ error: 'subscriptionId and newPlanName are required' }, { status: 400 });
        }

        // Get current subscription from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        if (!subscription) {
            return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
        }

        // Get current plan from database
        const supabase = createAdminClient();
        const currentPriceId = subscription.items.data[0]?.price?.id;

        const { data: currentPlan } = await supabase
            .from('subscription_plans')
            .select('name, stripe_price_id_monthly, stripe_price_id_yearly')
            .or(`stripe_price_id_monthly.eq.${currentPriceId},stripe_price_id_yearly.eq.${currentPriceId}`)
            .single();

        if (!currentPlan) {
            return NextResponse.json({ error: 'Current plan not found in database' }, { status: 404 });
        }

        // Get new plan from database
        const { data: newPlan } = await supabase
            .from('subscription_plans')
            .select('id, stripe_price_id_monthly, stripe_price_id_yearly')
            .eq('name', newPlanName)
            .single();

        if (!newPlan) {
            return NextResponse.json({ error: 'New plan not found' }, { status: 404 });
        }

        // Validate upgrade-only policy
        const currentTier = PLAN_TIERS[currentPlan.name];
        const newTier = PLAN_TIERS[newPlanName];

        if (!currentTier || !newTier) {
            return NextResponse.json({ error: 'Invalid plan tier' }, { status: 400 });
        }

        // Check if subscription has promo code applied (free period)
        const hasPromoCode = (subscription as any).metadata?.promo_code_applied === VALID_PROMO_CODE ||
            (subscription as any).metadata?.free_period_end === '2026-05-31';
        const isFreePeriod = new Date() < FREE_PERIOD_END_DATE;

        // Enforce upgrade-only policy only if promo code was applied and we're still in free period
        if (hasPromoCode && isFreePeriod && newTier <= currentTier) {
            return NextResponse.json({
                error: 'Downgrades are not available during the promotional period. You can only upgrade to a higher tier.',
                code: 'DOWNGRADE_NOT_ALLOWED'
            }, { status: 403 });
        }

        // Get the new price ID
        const newPriceId = isAnnual ? newPlan.stripe_price_id_yearly : newPlan.stripe_price_id_monthly;

        // Prepare update object
        const updateData: Stripe.SubscriptionUpdateParams = {
            items: [{
                id: subscription.items.data[0].id,
                price: newPriceId,
            }],
            proration_behavior: 'always_invoice', // Prorate the upgrade
            metadata: {
                plan_name: newPlanName,
                free_period_end: '2026-05-31'
            }
        };

        // Preserve promo code metadata if it exists
        if (hasPromoCode) {
            (updateData.metadata as any).promo_code_applied = VALID_PROMO_CODE;
        }

        // Preserve trial_end if subscription has one and we're still in free period
        // This ensures the free trial until June 1st is maintained during upgrades
        if (hasPromoCode && isFreePeriod && subscription.trial_end) {
            updateData.trial_end = subscription.trial_end;
        }

        // Update subscription in Stripe
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, updateData);

        // Update database record
        await supabase
            .from('subscriptions')
            .update({
                plan_id: newPlan.id
            })
            .eq('stripe_subscription_id', subscriptionId);

        return NextResponse.json({
            success: true,
            subscription: {
                id: updatedSubscription.id,
                status: updatedSubscription.status,
                current_period_end: (updatedSubscription as any).current_period_end
            }
        });
    } catch (error: any) {
        console.error('Subscription change failed:', error);

        // Handle Stripe-specific errors
        if (error.type === 'StripeInvalidRequestError') {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ error: error.message || 'Failed to change subscription' }, { status: 500 });
    }
}
