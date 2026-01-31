'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SuccessPageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionValid, setSessionValid] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [preFilledEmail, setPreFilledEmail] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  // Handle redirect when account is created - must be outside conditional
  useEffect(() => {
    if (accountCreated) {
      const timer = setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [accountCreated, router]);

  useEffect(() => {
    const checkSessionStatus = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // DATABASE-FIRST APPROACH: Check subscription status using session_id
        console.log('🔍 Success page: Checking subscription status for session:', sessionId);
        const subscriptionResponse = await fetch('/api/check-subscription-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stripeSessionId: sessionId })
        });

        console.log('📡 Subscription API response status:', subscriptionResponse.status);

        if (subscriptionResponse.ok) {
          const subscriptionData = await subscriptionResponse.json();
          console.log('📋 Subscription data received:', {
            accountCreated: subscriptionData.accountCreated,
            userId: subscriptionData.userId ? 'exists' : 'null',
            subscriptionExists: subscriptionData.subscriptionExists
          });

          console.log('🔍 Checking condition: accountCreated && userId');
          console.log('accountCreated:', subscriptionData.accountCreated, typeof subscriptionData.accountCreated);
          console.log('userId:', subscriptionData.userId, typeof subscriptionData.userId);

          const conditionMet = subscriptionData.accountCreated && subscriptionData.userId;
          console.log('Condition result:', conditionMet);

          if (conditionMet) {
            console.log('✅ Account already exists, setting accountCreated = true');
            // Account already created - show success state
            setAccountCreated(true);
            setLoading(false);
            return;
          } else {
            console.log('❌ Condition not met, continuing with other logic');
          }

          if (subscriptionData.subscriptionExists) {
            console.log('📝 Payment exists but no account yet, showing creation form');
            // Payment exists but no account yet - try to get email and show creation form
            try {
              // Fetch session details from Stripe to get customer email
              const sessionResponse = await fetch('/api/verify-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId })
              });

              if (sessionResponse.ok) {
                const sessionData = await sessionResponse.json();
                if (sessionData.customer_email) {
                  setPreFilledEmail(sessionData.customer_email);
                }
              }
              // If Stripe call fails, continue without email pre-fill
            } catch (stripeError) {
              console.log('Stripe session verification failed, continuing without email pre-fill');
            }

            setSessionValid(true);
            setLoading(false);
            return;
          }

          console.log('❌ No subscription found in database');
        }

        // FALLBACK: If database lookup fails, try Stripe verification
        console.log('⚠️ Database lookup failed, falling back to Stripe verification');
        const response = await fetch('/api/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });

        console.log('📡 Stripe verification response status:', response.status);

        if (!response.ok) {
          console.log('❌ Stripe verification failed');
          throw new Error('Invalid session');
        }

        console.log('✅ Stripe verification succeeded');

        const sessionData = await response.json();

        // Store customer email for pre-filling the form
        if (sessionData.customer_email) {
          setPreFilledEmail(sessionData.customer_email);
        }

        // Check subscription status using customer ID
        const fallbackSubscriptionResponse = await fetch('/api/check-subscription-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stripeCustomerId: sessionData.customer })
        });

        const fallbackSubscriptionData = await fallbackSubscriptionResponse.json();

        if (fallbackSubscriptionData.accountCreated && fallbackSubscriptionData.userId) {
          // Account already created - show success state
          setAccountCreated(true);
          setLoading(false);
          return;
        }

        // Payment exists but no account yet - show creation form
        setSessionValid(true);

      } catch (error) {
        console.error('💥 Session verification failed:', error);
        console.error('Error details:', error.message);
        setError('Unable to verify payment status. Please contact support if you believe this is an error.');
        setSessionValid(false);
        console.log('❌ Setting sessionValid = false due to error');
      }

      setLoading(false);
    };

    checkSessionStatus();
  }, [sessionId]);

  console.log('🎨 SuccessPage render state:', {
    loading,
    sessionValid,
    accountCreated
  });

  if (loading) {
    console.log('⏳ Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e88e5] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Verifying payment...</p>
        </div>
      </div>
    );
  }

  // Account already created takes precedence - redirect to account page
  if (accountCreated) {
    console.log('✅ Account created, redirecting to account page');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <svg
                className="h-8 w-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Account Created!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Redirecting you to your account page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionValid) {
    console.log('❌ Showing invalid session error');
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Invalid Session
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              This payment session appears to be invalid.
            </p>
          </div>
          <a href="/pricing" className="bg-[#1e88e5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1565c0] transition-colors">
            Return to Pricing
          </a>
        </div>
      </div>
    );
  }

  // Default: Show account creation form
  console.log('📝 Showing account creation form');
  return <AccountCreationForm
    sessionId={sessionId}
    preFilledEmail={preFilledEmail}
    onSuccess={() => setAccountCreated(true)}
  />;
}

function AccountCreationForm({ sessionId, preFilledEmail, onSuccess }) {
  const router = useRouter();
  const [email, setEmail] = useState(preFilledEmail || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
        // onSuccess will trigger the useEffect in parent component to redirect
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4 pt-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Create your account to set up your listing.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Create a password"
              minLength={6}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e88e5] focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              placeholder="Confirm your password"
              minLength={6}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e88e5] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1565c0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating Account...' : 'Create account'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e88e5] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
