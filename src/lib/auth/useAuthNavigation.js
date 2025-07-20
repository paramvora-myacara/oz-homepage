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
      
      // Customize modal content based on destination
      let title = 'Authentication Required';
      let description = 'Please sign in to access this page.';
      
      if (destination.includes('schedule-a-call')) {
        title = 'Consult the Experts';
        description = 'Please sign in to book a time with our team of OZ experts.';
      } else if (destination.includes('listings')) {
        title = 'Access a Curated Marketplace';
        description = 'Join our platform to view detailed information on investment opportunities.';
      } else if (destination.includes('check-investor-eligibility')) {
        title = 'Check Your Eligibility';
        description = 'Please sign in to check if you qualify to invest in Opportunity Zones.';
      } else if (destination.includes('check-oz')) {
        title = 'Check OZ Status';
        description = 'Please sign in to check if your development is in an Opportunity Zone.';
      } else if (destination.includes('tax-calculator')) {
        title = 'Use Tax Calculator';
        description = 'Please sign in to calculate your potential OZ tax savings.';
      }
      
      openModal({
        title,
        description,
        redirectTo: destination,
      });
    }
  }, [user, loading, router, openModal]);

  return { navigateWithAuth };
} 