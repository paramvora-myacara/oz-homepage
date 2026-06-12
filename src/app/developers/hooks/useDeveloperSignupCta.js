'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { trackUserEvent } from '../../../lib/analytics/trackUserEvent';

const MODAL_TITLE = 'Start Your Project For Free';
const MODAL_DESCRIPTION =
  'Sign in to list your Opportunity Zone project on OZ Listings.\n\nNo credit card needed — takes about 5 minutes.\n\n🔐 Password-free login\n✨ One-time signup, lifetime access';

export function useDeveloperSignupCta(source) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  const destination = `/pricing/success?plan=Standard&source=${source}`;

  const handleDeveloperCta = useCallback(
    async (location) => {
      await trackUserEvent('developers_page_cta_clicked', {
        button: 'start_project_free',
        location,
      });

      if (loading) return;

      if (user) {
        try {
          const adminRes = await fetch('/api/admin/me');
          if (adminRes.ok) {
            router.push('/dashboard');
            return;
          }
        } catch {
          // Continue to onboarding if dashboard session is missing
        }
        router.push(destination);
        return;
      }

      sessionStorage.setItem('redirectTo', destination);
      openModal({
        title: MODAL_TITLE,
        description: MODAL_DESCRIPTION,
        redirectTo: destination,
      });
    },
    [loading, user, router, destination, openModal]
  );

  return { handleDeveloperCta, loading };
}
