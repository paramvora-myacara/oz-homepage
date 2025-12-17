# Stripe Billing Integration Implementation Plan

## Overview

This document outlines the step-by-step implementation of Stripe billing integration for the OZ Homepage pricing page. The implementation follows a simplified approach that minimizes database complexity while providing robust subscription management.

## Architecture

### Components
- **oz-homepage**: Frontend pricing page, checkout flow, customer portal access
- **oz-dev-dash**: Database migrations and webhook handling
- **Stripe**: Payment processing and subscription management

### Data Flow
1. User selects plan on pricing page
2. Frontend creates Stripe checkout session
3. User completes payment on Stripe
4. Stripe sends webhook to oz-dev-dash
5. Database updated with subscription info
6. User redirected to success page

## Implementation Steps

### Phase 1: Database Setup (oz-dev-dash)

#### Step 1.1: Create Database Migration
Location: `oz-dev-dash/supabase/migrations/20251217000000_create_stripe_billing_tables.sql`

```sql
-- Create subscription plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  stripe_price_id_monthly TEXT UNIQUE NOT NULL,
  stripe_price_id_yearly TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table (for duplicate prevention)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE UNIQUE INDEX subscriptions_user_id_idx ON subscriptions(user_id);
CREATE INDEX subscriptions_stripe_subscription_id_idx ON subscriptions(stripe_subscription_id);
CREATE INDEX payments_stripe_payment_intent_id_idx ON payments(stripe_payment_intent_id);
```

#### Step 1.2: Seed Initial Data
Add to migration file:

```sql
-- Seed subscription plans (update with actual Stripe price IDs after setup)
INSERT INTO subscription_plans (name, stripe_price_id_monthly, stripe_price_id_yearly) VALUES
('Standard', 'price_standard_monthly_test', 'price_standard_yearly_test'),
('Pro', 'price_pro_monthly_test', 'price_pro_yearly_test'),
('Elite', 'price_elite_monthly_test', 'price_elite_yearly_test');
```

#### Step 1.3: Run Migration
```bash
cd oz-dev-dash
npx supabase db push
```

### Phase 2: Stripe Dashboard Setup

#### Step 2.1: Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create account
2. Enable test mode (top right toggle)

#### Step 2.2: Create Products and Prices
1. Go to Products section in Stripe Dashboard
2. Create three products:
   - **OZ Listings Standard**
   - **OZ Listings Pro**
   - **OZ Listings Elite**

3. For each product, create monthly and yearly prices:
   - **Standard Monthly**: $476.00 (ID: `price_standard_monthly_test`)
   - **Standard Yearly**: $4,760.00 (ID: `price_standard_yearly_test`)
   - **Pro Monthly**: $956.00 (ID: `price_pro_monthly_test`)
   - **Pro Yearly**: $9,560.00 (ID: `price_pro_yearly_test`)
   - **Elite Monthly**: $1,916.00 (ID: `price_elite_monthly_test`)
   - **Elite Yearly**: $19,160.00 (ID: `price_elite_yearly_test`)

#### Step 2.3: Get API Keys
1. Go to Developers → API Keys
2. Copy **Publishable key** (starts with `pk_test_`)
3. Copy **Secret key** (starts with `sk_test_`)

#### Step 2.4: Set Up Webhooks
1. Go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhooks`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
4. Copy **Webhook signing secret** (starts with `whsec_`)

### Phase 3: Environment Variables Setup

#### oz-homepage/.env.local
```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# URLs
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### oz-dev-dash/.env.local (if needed)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Phase 4: oz-homepage Implementation

#### Step 4.1: Install Dependencies
```bash
cd oz-homepage
npm install stripe @stripe/stripe-js
```

#### Step 4.2: Create API Routes

**app/api/stripe/create-checkout-session/route.js**
```javascript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { planName, isAnnual } = await request.json();

    // Get plan's Stripe price ID from database
    const supabase = createClient();
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('stripe_price_id_monthly, stripe_price_id_yearly')
      .eq('name', planName)
      .single();

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
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
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

**app/api/stripe/webhooks/route.js**
```javascript
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const sig = headers().get('stripe-signature');

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    const supabase = createClient();

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;

        // Get plan ID from plan name
        const { data: plan } = await supabase
          .from('subscription_plans')
          .select('id')
          .eq('name', session.metadata.plan_name)
          .single();

        if (plan) {
          await supabase.from('subscriptions').insert({
            stripe_subscription_id: session.subscription,
            stripe_customer_id: session.customer,
            plan_id: plan.id,
            user_id: session.metadata.user_id // You'll need to add this
          });
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;

        // Find user from subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', invoice.subscription)
          .single();

        if (subscription) {
          await supabase.from('payments').insert({
            user_id: subscription.user_id,
            stripe_payment_intent_id: invoice.payment_intent
          }).onConflict('stripe_payment_intent_id').doNothing();
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
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
```

#### Step 4.3: Update Pricing Page Component

**src/app/pricing/page.js** - Update the subscribe button handlers:

```javascript
const handleSubscribe = async (planName, isAnnual) => {
  try {
    setLoading(true);
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName, isAnnual })
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Subscription failed:', error);
    // Show error to user
  } finally {
    setLoading(false);
  }
};
```

#### Step 4.4: Create Success Page

**app/pricing/success/page.js**
```javascript
'use client';

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">Your subscription has been activated.</p>
        <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Return to Homepage
        </a>
      </div>
    </div>
  );
}
```

### Phase 5: Testing Plan

#### Local Testing Setup

**Step 5.1: Stripe CLI Installation**
```bash
# Install Stripe CLI
# macOS with Homebrew
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login
```

**Step 5.2: Local Webhook Forwarding**
```bash
# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

This will give you the webhook signing secret for local testing.

**Step 5.3: Test Card Numbers**
Use these test card numbers in Stripe checkout (no real charges):

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Require Authentication**: `4000 0025 0000 3155`

#### Test Scenarios

**Test 1: Successful Subscription Creation**
1. Go to pricing page
2. Click "Get Started" on any plan
3. Use test card `4242 4242 4242 4242`
4. Complete checkout
5. Verify webhook received and database updated
6. Check Stripe dashboard for subscription

**Test 2: Failed Payment**
1. Use declined card `4000 0000 0000 0002`
2. Verify error handling
3. Check no subscription created in database

**Test 3: Webhook Reliability**
1. Stop local server
2. Complete a purchase
3. Start server again
4. Run `stripe listen --forward-to localhost:3000/api/stripe/webhooks` again
5. Verify webhook replay works

**Test 4: Duplicate Prevention**
1. Complete purchase
2. Manually trigger same webhook again
3. Verify no duplicate records in payments table

**Test 5: Subscription Cancellation**
1. Go to Stripe customer portal (implement later)
2. Cancel subscription
3. Verify webhook updates database

#### Automated Testing

**tests/stripe-integration.test.js**
```javascript
import { describe, it, expect } from '@jest/globals';

describe('Stripe Integration', () => {
  it('should create checkout session', async () => {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName: 'Pro', isAnnual: true })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toContain('checkout.stripe.com');
  });

  it('should handle webhook events', async () => {
    // Mock Stripe webhook payload
    const mockEvent = {
      type: 'checkout.session.completed',
      data: {
        object: {
          subscription: 'sub_test123',
          customer: 'cus_test123',
          metadata: { plan_name: 'Pro', user_id: 'user123' }
        }
      }
    };

    // Test webhook handler logic
  });
});
```

### Phase 6: Deployment

#### Step 6.1: Environment Variables
Update production environment variables with live Stripe keys (remove `_test` suffix).

#### Step 6.2: Webhook URL Update
Update webhook endpoint URL in Stripe dashboard to production domain.

#### Step 6.3: Database Migration
Ensure migration runs in production Supabase instance.

### Phase 7: Monitoring & Maintenance

#### Step 7.1: Error Monitoring
Add Sentry or similar for webhook error tracking.

#### Step 7.2: Stripe Dashboard Monitoring
- Monitor failed payments
- Track subscription metrics
- Set up alerts for unusual activity

#### Step 7.3: Database Health Checks
Add queries to verify subscription data integrity.

## Cost Analysis

### Development Costs: $0
- Stripe test mode: Free
- Supabase: Within free tier limits
- Local development: No additional costs

### Production Costs:
- Stripe fees: 2.9% + $0.30 per transaction
- Supabase: $0.013 per GB storage beyond free tier
- No monthly fees for basic usage

## Success Metrics

- [ ] All test scenarios pass locally
- [ ] Webhooks process without errors
- [ ] Database records created correctly
- [ ] Users can complete checkout flow
- [ ] No duplicate payments processed
- [ ] Error handling works properly

## Rollback Plan

If issues arise:
1. Pause webhook processing
2. Manually verify database state
3. Update webhook handler with fixes
4. Resume webhook processing
5. Reprocess missed events using Stripe CLI

## Next Steps After Implementation

1. **Customer Portal**: Allow users to manage subscriptions
2. **Email Notifications**: Send receipts and renewal reminders
3. **Analytics**: Track conversion rates and revenue
4. **Admin Dashboard**: View subscription metrics
5. **Dunning Management**: Handle failed payments

---

## Quick Reference

### Test Commands
```bash
# Start webhook forwarding
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Trigger test webhook
stripe trigger checkout.session.completed

# View webhook events
stripe events list --limit 10
```

### Useful Stripe Dashboard URLs
- Test Dashboard: https://dashboard.stripe.com/test
- API Keys: https://dashboard.stripe.com/test/apikeys
- Webhooks: https://dashboard.stripe.com/test/webhooks
- Events: https://dashboard.stripe.com/test/events

This implementation provides a solid foundation for Stripe billing while keeping complexity low and costs minimal during development.