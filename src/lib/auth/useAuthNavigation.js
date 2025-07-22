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
      const searchParams = new URLSearchParams(window.location.search);
      const middlewareRedirectTo = searchParams.get('redirectTo');

      // If middleware provided a redirectTo, it is the clean, definitive URL.
      // Otherwise, we are in a client-side navigation, so use the 'destination' argument.
      const finalDestination = middlewareRedirectTo || destination;

      sessionStorage.setItem('redirectTo', finalDestination);
      
      // Customize modal content based on destination
      let title = 'Authentication Required';
      let description = 'Please sign in to access this page.';
      
      if (finalDestination.includes('schedule-a-call')) {
        title = 'Consult the Experts';
        description = 'Please sign in to book a time with our team of OZ experts.';
      } else if (finalDestination.includes('listings')) {
        title = 'Access a Curated Marketplace';
        description = 'Join our platform to view detailed information on investment opportunities.';
      } else if (finalDestination.includes('tax-calculator')) {
        title = 'Estimate Tax Savings';
        description = 'Please sign in to calculate your potential tax savings.';
      } else if (finalDestination.includes('check-oz')) {
        title = 'Check OZ Status';
        description = 'Please sign in to check if your development is in an Opportunity Zone.';
      } else if (finalDestination.includes('tax-calculator')) {
        title = 'Use Tax Calculator';
        description = 'Please sign in to calculate your potential OZ tax savings.';
      }
      
      openModal({
        title,
        description,
        redirectTo: finalDestination,
      });
    }
  }, [user, loading, router, openModal]);

  return { navigateWithAuth };
} 