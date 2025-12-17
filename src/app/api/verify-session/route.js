import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { sessionId } = await request.json();
    console.log('🔍 verify-session called with sessionId:', sessionId ? `${sessionId.substring(0, 20)}...` : null);

    // Retrieve the session from Stripe
    console.log('📡 Calling Stripe API to retrieve session...');
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('✅ Stripe session retrieved:', {
      id: session.id,
      customer: session.customer,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email ? `${session.customer_details.email.substring(0, 10)}...` : null
    });

    // Only return essential data for security
    const response = {
      customer: session.customer,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email
    };
    console.log('📤 Returning session data:', {
      customer: response.customer ? `${response.customer.substring(0, 10)}...` : null,
      payment_status: response.payment_status,
      has_email: !!response.customer_email
    });
    return NextResponse.json(response);
  } catch (error) {
    console.error('💥 Session verification failed:', {
      message: error.message,
      type: error.type,
      code: error.code
    });
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }
}