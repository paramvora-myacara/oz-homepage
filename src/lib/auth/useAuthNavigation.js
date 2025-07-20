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
      // Instead of redirecting, we open the modal directly
      // and store the destination in session storage.
      sessionStorage.setItem('redirectTo', destination);
      openModal({
        title: 'Authentication Required',
        description: 'Please sign in to access this page.',
        redirectTo: destination,
      });
    }
  }, [user, loading, router, openModal]);

  return { navigateWithAuth };
} 