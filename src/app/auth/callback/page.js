'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '../../../lib/supabase/client'

function AuthCallbackForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createClient()

      const setInitialRouteIfNeeded = async () => {
        const redirectTo = sessionStorage.getItem('redirectTo');

        if (redirectTo && redirectTo !== '/') {
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const route = redirectTo.startsWith('/') ? redirectTo.substring(1) : redirectTo;
            
            // Retry logic to handle race condition with user record creation
            const maxRetries = 5;
            let retryCount = 0;
            let success = false;
            
            while (retryCount < maxRetries && !success) {
              try {
                // Check if user record exists and get current first_auth_source
                const { data: existingUser, error: fetchError } = await supabase
                  .from('users')
                  .select('first_auth_source')
                  .eq('id', user.id)
                  .single();

                if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
                  console.error('Error fetching user record:', fetchError);
                  retryCount++;
                  if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                  continue;
                }

                // If user exists and already has first_auth_source, don't overwrite
                if (existingUser && existingUser.first_auth_source) {
                  success = true;
                  continue;
                }

                // User doesn't exist or first_auth_source is null, so upsert
                const { error } = await supabase
                  .from('users')
                  .upsert({
                    id: user.id,
                    email: user.email,
                    first_auth_source: `oz-homepage/${route}`
                  }, {
                    onConflict: 'id',
                    ignoreDuplicates: false
                  });

                if (error) {
                  console.error('Error setting initial route:', error);
                  retryCount++;
                  if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                  }
                } else {
                  success = true;
                }
              } catch (err) {
                console.error('Unexpected error setting initial route:', err);
                retryCount++;
                if (retryCount < maxRetries) {
                  await new Promise(resolve => setTimeout(resolve, 500));
                }
              }
            }

            if (!success) {
              console.warn('Failed to set initial route after all retries');
            }
          }
        }
      };
      
      try {
        // Handle the auth callback
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage(error.message || 'Authentication failed')
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Authentication successful! Redirecting...')
          
          await setInitialRouteIfNeeded();
          
          // Get redirect URL and clean up session storage
          const redirectTo = sessionStorage.getItem('redirectTo') || searchParams.get('redirectTo') || '/'
          sessionStorage.removeItem('redirectTo');
          
          // Small delay for user feedback, then redirect
          setTimeout(() => {
            router.push(redirectTo)
          }, 1500)
        } else {
          // Check if this is an email confirmation
          const accessToken = searchParams.get('access_token')
          const refreshToken = searchParams.get('refresh_token')
          
          if (accessToken && refreshToken) {
            // Set the session with the tokens
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            
            if (sessionError) {
              console.error('Session error:', sessionError);
              setStatus('error')
              setMessage(sessionError.message || 'Failed to confirm email')
            } else {
              setStatus('success')
              setMessage('Email confirmed! Redirecting...')
              
              await setInitialRouteIfNeeded();
              
              const redirectTo = sessionStorage.getItem('redirectTo') || searchParams.get('redirectTo') || '/'
              sessionStorage.removeItem('redirectTo');
              
              setTimeout(() => {
                router.push(redirectTo)
              }, 1500)
            }
          } else {
            setStatus('error')
            setMessage('No valid session found')
          }
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setStatus('error')
        setMessage('An unexpected error occurred')
      }
    }

    handleAuthCallback().catch(err => {
      console.error("Error in handleAuthCallback:", err);
    });
  }, [router, searchParams])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#1e88e5] border-t-transparent rounded-full"
          />
        )
      case 'success':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
        )
      case 'error':
        return (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.div>
        )
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-[#1e88e5]'
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'error':
        return 'text-red-600 dark:text-red-400'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          {getIcon()}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {status === 'loading' && 'Processing Authentication...'}
          {status === 'success' && 'Authentication Successful!'}
          {status === 'error' && 'Authentication Failed'}
        </h1>
        
        <p className={`text-sm ${getStatusColor()} mb-6`}>
          {message}
        </p>
        
        {status === 'error' && (
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-[#1e88e5] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#1976d2] transition-colors duration-300"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-300"
            >
              Go Home
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-12 h-12 border-4 border-[#1e88e5] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AuthCallbackForm />
    </Suspense>
  )
} 