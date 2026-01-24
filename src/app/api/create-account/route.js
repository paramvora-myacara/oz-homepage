import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId, email, password } = await request.json();
    console.log('🔍 create-account called with:', {
      sessionId: sessionId ? `${sessionId.substring(0, 20)}...` : null,
      email: email ? `${email.substring(0, 10)}...` : null
    });

    // Verify the Stripe session
    console.log('📡 Verifying Stripe session...');
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Session verified:', {
      customer: session.customer,
      payment_status: session.payment_status
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const supabase = await createClient();

    // Comprehensive duplicate prevention checks
    console.log('🔍 Running duplicate prevention checks...');
    const [emailCheck, subscriptionCheck] = await Promise.all([
      // Check if email already exists in admin_users
      supabase.from('admin_users').select('id').eq('email', email).single(),

      // Check if this Stripe customer already has a linked account
      supabase.from('subscriptions')
        .select('user_id, account_created')
        .eq('stripe_customer_id', session.customer)
        .neq('user_id', null)
        .single()
    ]);

    console.log('📋 Duplicate check results:', {
      email_exists: !!emailCheck.data,
      subscription_linked: !!subscriptionCheck.data?.user_id
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
    if (subscriptionCheck.data?.user_id) {
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

    // Link the subscription to the new user and mark as account created
    console.log('🔗 Linking subscription to user...');
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({
        user_id: newUser.id,
        account_created: true
      })
      .eq('stripe_customer_id', session.customer);

    if (subscriptionError) {
      console.error('❌ Error linking subscription:', subscriptionError);
    } else {
      console.log('✅ Subscription linked successfully');
    }

    if (subscriptionError) {
      console.error('Error linking subscription:', subscriptionError);
      // Don't fail the whole request if subscription linking fails
      // The subscription exists, just not linked - can be fixed manually
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