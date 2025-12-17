# Stripe Billing Testing Guide

## Overview
This guide provides comprehensive testing strategies for the Stripe billing integration using Stripe's test mode. All testing is completely free and uses fake payment data.

## Prerequisites

### 1. Install Stripe CLI
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms: https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe CLI
```bash
stripe login
```

### 3. Start Local Webhook Forwarding
```bash
# In oz-homepage directory
cd oz-homepage
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

Copy the webhook signing secret from the CLI output and add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Test Card Numbers

Use these test cards in Stripe checkout (no real charges):

| Card Number | Description | Result |
|-------------|-------------|---------|
| `4242 4242 4242 4242` | Success | Payment succeeds |
| `4000 0000 0000 0002` | Decline | Payment declined |
| `4000 0025 0000 3155` | Authentication | Requires 3D Secure |
| `4000 0000 0000 0069` | Expired | Card expired |
| `4000 0000 0000 0127` | Incorrect CVC | CVC check fails |

All test cards use:
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **Name**: Any name
- **Address**: Any valid address

## Test Scenarios

### Scenario 1: Successful Subscription Creation

**Steps:**
1. Navigate to `/pricing` page
2. Click "Get Started" on any plan (Standard/Pro/Elite)
3. Select Monthly or Annual billing
4. Complete checkout with card `4242 4242 4242 4242`
5. Verify redirect to success page

**Verification:**
```sql
-- Check database
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1;
SELECT * FROM payments ORDER BY created_at DESC LIMIT 1;
```
- Should see new subscription record
- Should see new payment record
- Check Stripe dashboard → Subscriptions

### Scenario 2: Failed Payment Handling

**Steps:**
1. Attempt checkout with declined card `4000 0000 0000 0002`
2. Verify error message displayed
3. Check no new records in database

**Expected Result:**
- User sees error message
- No subscription created
- No payment record created

### Scenario 3: Webhook Reliability

**Steps:**
1. Complete successful purchase (Scenario 1)
2. Stop local server (`Ctrl+C`)
3. Make another purchase (webhook fails)
4. Restart server
5. Run `stripe listen --forward-to localhost:3000/api/stripe/webhooks` again
6. Check Stripe dashboard for pending webhooks
7. Trigger replay: `stripe events resend evt_...`

**Verification:**
- Webhooks process after server restart
- No duplicate records created

### Scenario 4: Duplicate Webhook Prevention

**Steps:**
1. Complete successful purchase
2. Manually trigger same webhook event twice
3. Check database for duplicates

**Expected Result:**
- Only one payment record created
- Unique constraint prevents duplicates

### Scenario 5: Multiple Plan Testing

**Steps:**
1. Test all three plans (Standard, Pro, Elite)
2. Test both monthly and annual billing for each
3. Verify correct Stripe price IDs used

**Verification:**
```sql
-- Check plan assignments
SELECT sp.name, s.created_at
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
ORDER BY s.created_at DESC;
```

### Scenario 6: Database Integrity

**Steps:**
1. Create multiple test subscriptions
2. Verify foreign key constraints
3. Test cascade deletes

**Verification:**
```sql
-- Test constraints
DELETE FROM users WHERE id = 'test-user-id';
-- Should cascade delete subscriptions and payments
```

## Automated Testing

### Unit Tests
```javascript
// tests/stripe-api.test.js
import { describe, it, expect } from '@jest/globals';

describe('Stripe API Routes', () => {
  it('creates checkout session', async () => {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName: 'Pro', isAnnual: false })
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.url).toContain('checkout.stripe.com');
  });

  it('handles invalid plan name', async () => {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planName: 'InvalidPlan', isAnnual: false })
    });

    expect(response.status).toBe(404);
  });
});
```

### Integration Tests
```javascript
// tests/stripe-webhook.test.js
describe('Stripe Webhooks', () => {
  it('processes checkout.session.completed', async () => {
    const mockWebhook = {
      type: 'checkout.session.completed',
      data: {
        object: {
          subscription: 'sub_test123',
          customer: 'cus_test123',
          metadata: { plan_name: 'Pro' }
        }
      }
    };

    // Test webhook processing logic
    const response = await fetch('/api/stripe/webhooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 'mock-signature'
      },
      body: JSON.stringify(mockWebhook)
    });

    expect(response.status).toBe(200);
  });
});
```

## Stripe CLI Commands

### Useful Commands
```bash
# List recent events
stripe events list --limit 5

# Get event details
stripe events retrieve evt_xxx

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger invoice.payment_succeeded

# View webhook endpoints
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Resend failed webhooks
stripe events resend evt_xxx
```

### Debugging Webhooks
```bash
# View webhook attempts
stripe webhook_endpoints list

# Check webhook delivery logs
stripe webhook_endpoints retrieve we_xxx
```

## Common Issues & Solutions

### Webhook Signature Verification Fails
**Symptom:** Webhook requests return 400 error
**Solution:**
1. Ensure `STRIPE_WEBHOOK_SECRET` matches CLI output
2. Verify webhook endpoint URL is correct
3. Check timestamp is within tolerance

### Duplicate Records Created
**Symptom:** Multiple payment/subscription records
**Solution:**
1. Check unique constraints are applied
2. Verify `.onConflict().doNothing()` in webhook handler
3. Ensure idempotency keys are properly used

### Checkout Session Creation Fails
**Symptom:** 500 error on checkout creation
**Solution:**
1. Verify `STRIPE_SECRET_KEY` is correct
2. Check Stripe price IDs exist in test mode
3. Ensure plan names match database records

### Database Connection Issues
**Symptom:** Webhook processing fails
**Solution:**
1. Verify Supabase connection string
2. Check database permissions
3. Ensure foreign key constraints are satisfied

## Performance Testing

### Load Testing Webhooks
```bash
# Simulate multiple webhook calls
for i in {1..10}; do
  stripe trigger checkout.session.completed &
done
```

### Database Performance
```sql
-- Check index usage
EXPLAIN ANALYZE SELECT * FROM subscriptions WHERE user_id = 'test-id';
EXPLAIN ANALYZE SELECT * FROM payments WHERE stripe_payment_intent_id = 'pi_test';
```

## Monitoring & Logging

### Add to Webhook Handler
```javascript
// Log all webhook events
console.log(`Webhook received: ${event.type}`, {
  eventId: event.id,
  created: event.created,
  data: event.data.object
});
```

### Stripe Dashboard Monitoring
- Check Events section for webhook deliveries
- Monitor Subscription metrics
- Review failed payment attempts

## Cleanup After Testing

### Remove Test Data
```sql
-- Delete test subscriptions and payments
DELETE FROM payments WHERE created_at > '2025-01-01';
DELETE FROM subscriptions WHERE created_at > '2025-01-01';
```

### Reset Stripe Test Data
- Delete test customers in Stripe dashboard
- Cancel test subscriptions
- Remove test payment methods

## Success Criteria

✅ All test scenarios pass without errors
✅ No duplicate records in database
✅ Webhooks process reliably
✅ Error handling works correctly
✅ Stripe dashboard shows correct data
✅ No real charges incurred

## Next Steps After Testing

1. **Production Deployment**: Switch to live Stripe keys
2. **Customer Portal**: Implement subscription management
3. **Email Notifications**: Add payment confirmations
4. **Analytics**: Track conversion funnels
5. **Monitoring**: Set up error alerting

---

**Remember**: All testing uses Stripe's test mode - no real payments are processed, and you won't be charged anything!