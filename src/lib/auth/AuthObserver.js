'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useAuthModal } from '../../app/contexts/AuthModalContext';

export default function AuthObserver() {
  const { user, loading, setRedirectTo } = useAuth();
  const searchParams = useSearchParams();
  const { openModal } = useAuthModal();

  // Effect to handle redirectTo from URL on page load.
  useEffect(() => {
    const redirectToFromParams = searchParams.get('redirectTo');
    if (redirectToFromParams) {
      setRedirectTo(redirectToFromParams);
      sessionStorage.setItem('redirectTo', redirectToFromParams);
    }
  }, [searchParams, setRedirectTo]);

  // Effect to handle modals for pages that require auth.
  useEffect(() => {
    if (loading || user) return;

    if (searchParams.get('auth') === 'required') {
      const redirectTo = searchParams.get('redirectTo') || '/';
      sessionStorage.setItem('redirectTo', redirectTo);
      
      let title = "Gain Exclusive Access";
      let description = "Sign in or create an account to view this page and other exclusive content.";
      
      if (redirectTo.includes('schedule-a-call')) {
        title = "Schedule a Consultation";
        description = "Please sign in to book a time with our team of OZ experts.";
      } else if (redirectTo.includes('listings')) {
        title = "Access a Curated Marketplace";
        description = "Join our platform to view detailed information on investment opportunities.";
      }
      
      openModal({ title, description, redirectTo });
    }
  }, [loading, user, searchParams, openModal]);

  return null;
} 