'use client'

import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { useAuthModal } from '../../app/contexts/AuthModalContext'

/**
 * Hook for authentication-protected navigation
 * @returns {Function} navigateWithAuth - Function that checks auth before navigation
 */
export function useAuthNavigation() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { openModal } = useAuthModal()

  const navigateWithAuth = useCallback((destination) => {
    if (loading) {
      // Still loading, do nothing to prevent premature navigation
      return;
    }

    if (user) {
      router.push(destination);
    } else {
      // Instead of just opening the modal, we'll redirect to a URL
      // that includes the necessary query params to trigger the modal.
      // The AuthObserver component will see these params and open the modal.
      const params = new URLSearchParams({
        auth: 'required',
        redirectTo: destination,
      });
      
      // Redirect to the homepage with query parameters.
      // This ensures a clean URL and state before showing the modal.
      router.push(`/?${params.toString()}`);
    }
  }, [user, loading, router, openModal]);

  return { navigateWithAuth };
} 