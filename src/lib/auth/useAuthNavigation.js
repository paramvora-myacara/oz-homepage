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
    if (loading) return;

    if (user) {
      router.push(destination);
    } else {
      let title = "Gain Exclusive Access";
      let description = "Sign in or create an account to view this page and other exclusive content.";
      
      if (destination.includes('schedule-a-call')) {
        title = "Schedule a Consultation";
        description = "Please sign in to book a time with our team of OZ experts.";
      } else if (destination.includes('listings')) {
        title = "Access a Curated Marketplace";
        description = "Join our platform to view detailed information on investment opportunities.";
      }
      
      // Persist the redirect destination before opening the modal
      sessionStorage.setItem('redirectTo', destination);

      openModal({
        title,
        description,
        redirectTo: destination,
      });
    }
  }, [user, loading, router, openModal]);

  return { navigateWithAuth };
} 