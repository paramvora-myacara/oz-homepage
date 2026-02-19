import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { trackAdminEvent } from '@/lib/admin-events';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId, email, password, planName } = await request.json();
    console.log('🔍 create-account called with:', {
      sessionId: sessionId ? `${sessionId.substring(0, 20)}...` : null,
      email: email ? `${email.substring(0, 10)}...` : null,
      planName
    });

    const isStandardFree = planName === 'Standard';
    let session = null;

    if (!isStandardFree) {
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required for paid plans' }, { status: 400 });
      }
      // Verify the Stripe session
      console.log('📡 Verifying Stripe session...');
      session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('✅ Session verified:', {
        customer: session.customer,
        payment_status: session.payment_status
      });

      if (session.payment_status !== 'paid') {
        return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
      }
    }

    const supabase = await createClient();

    // Comprehensive duplicate prevention checks
    console.log('🔍 Running duplicate prevention checks...');
    const checks = [
      // Check if email already exists in admin_users
      supabase.from('admin_users').select('id').eq('email', email).single()
    ];

    if (!isStandardFree) {
      // Check if this Stripe customer already has a linked account
      checks.push(
        supabase.from('subscriptions')
          .select('user_id, account_created')
          .eq('stripe_customer_id', session.customer)
          .neq('user_id', null)
          .single()
      );
    }

    const [emailCheck, subscriptionCheck] = await Promise.all(checks);

    console.log('📋 Duplicate check results:', {
      email_exists: !!emailCheck.data,
      subscription_linked: !isStandardFree ? !!subscriptionCheck?.data?.user_id : 'skipped'
    });

    // Email already registered
    if (emailCheck.data) {
      console.log('❌ Email already registered');
      return NextResponse.json({
        error: 'Email already registered',
        redirectTo: '/login'
      }, { status: 400 });
    }

    // Subscription already linked to an account
    if (!isStandardFree && subscriptionCheck?.data?.user_id) {
      console.log('❌ Subscription already linked to account');
      return NextResponse.json({
        error: 'Account already exists for this payment',
        redirectTo: '/login'
      }, { status: 400 });
    }
    console.log('✅ No duplicates found, proceeding with account creation');

    // Create admin_users record (plain text password as requested)
    console.log('👤 Creating admin_users record...');
    const { data: newUser, error: userError } = await supabase
      .from('admin_users')
      .insert({
        email,
        password: password,
        role: 'customer'
      })
      .select()
      .single();

    if (userError) {
      console.error('❌ Error creating user:', userError);
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }
    console.log('✅ Created user:', newUser.id);

    // Link or create the subscription record
    if (isStandardFree) {
      console.log('📝 Creating manual subscription for free plan...');
      // Find plan ID for Standard
      const { data: planRecord } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', 'Standard')
        .single();

      if (planRecord) {
        const { error: subInsertError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: newUser.id,
            plan_id: planRecord.id,
            status: 'active',
            account_created: true,
            stripe_subscription_id: null,
            stripe_customer_id: null,
            stripe_session_id: null
          });

        if (subInsertError) {
          console.error('❌ Error creating subscription:', subInsertError);
          // Rollback: Delete the user if subscription fails
          console.log('🔄 Rolling back: Deleting user...', newUser.id);
          await supabase.from('admin_users').delete().eq('id', newUser.id);

          return NextResponse.json({
            error: 'Failed to create subscription record. Please contact support.',
            details: subInsertError.message
          }, { status: 500 });
        } else {
          console.log('✅ Manual subscription created successfully');
        }
      } else {
        console.error('❌ Could not find Standard plan ID in database');
        // Rollback
        console.log('🔄 Rolling back: Deleting user...', newUser.id);
        await supabase.from('admin_users').delete().eq('id', newUser.id);

        return NextResponse.json({
          error: 'Configuration error: Standard plan not found in database. Please contact support.'
        }, { status: 500 });
      }
    } else {
      console.log('🔗 Linking Stripe subscription to user...');
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({
          user_id: newUser.id,
          account_created: true
        })
        .eq('stripe_customer_id', session.customer);

      if (subscriptionError) {
        console.error('❌ Error linking subscription:', subscriptionError);
        // Rollback
        console.log('🔄 Rolling back: Deleting user...', newUser.id);
        await supabase.from('admin_users').delete().eq('id', newUser.id);

        return NextResponse.json({
          error: 'Failed to link subscription. Please contact support.'
        }, { status: 500 });
      } else {
        console.log('✅ Subscription linked successfully');
      }
    }

    // Set admin cookie to automatically log in the user after account creation
    console.log('🍪 Setting admin cookie for auto-login...');
    const basic = Buffer.from(`${email}:${password}`).toString('base64');
    const cookieStore = await cookies();

    // Check if we're in production (HTTPS) or development (HTTP)
    const isSecure = process.env.NODE_ENV === 'production';

    // Set httpOnly cookie for server-side auth
    cookieStore.set('oz_admin_basic', basic, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isSecure,
      path: '/',
    });

    // Track admin event for Slack notification
    console.log('📝 Creating admin event for signup notification...');
    await trackAdminEvent(supabase, 'developer_signup', {
      email,
      plan: planName,
      user_id: newUser.id
    });

    return NextResponse.json({
      success: true,
      userId: newUser.id,
      email: newUser.email,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Account creation error:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}