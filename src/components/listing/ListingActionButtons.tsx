'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAuthModal } from '@/app/contexts/AuthModalContext';
import { Tooltip } from '@/components/Tooltip';
import { ConfirmationModal } from '@/app/components/AuthModal';
import { useCASigning } from '@/hooks/useCASigning';
import { useVaultAccess } from '@/hooks/useVaultAccess';
import { useSignWell } from '@/hooks/useSignWell';
import { createClient } from '@/utils/supabase/client';

interface ListingActionButtonsProps {
  slug: string;
}

export default function ListingActionButtons({ slug }: ListingActionButtonsProps) {
  const { user } = useAuth();
  const { openModal } = useAuthModal();
  const { checkHasSignedCAForListing } = useCASigning(user?.id || null, slug);
  const { checkVaultAccessAndReturnResult } = useVaultAccess();
  const { createSignWellDocument, isLoading: isSignWellLoading } = useSignWell();

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // Legacy prop support if needed, but we use context now

  const [hasSignedCAForCurrentListing, setHasSignedCAForCurrentListing] = useState(false);
  const [isCheckingCA, setIsCheckingCA] = useState(false);

  // Check if user has signed CA for this listing
  useEffect(() => {
    const checkCAStatus = async () => {
      setIsCheckingCA(true);
      try {
        const hasSigned = await checkHasSignedCAForListing(slug);
        setHasSignedCAForCurrentListing(hasSigned);
      } catch (error) {
        console.error('Error checking CA status:', error);
        setHasSignedCAForCurrentListing(false);
      } finally {
        setIsCheckingCA(false);
      }
    };

    checkCAStatus();
  }, [slug, checkHasSignedCAForListing]);

  const handleVaultAccess = useCallback(async () => {
    if (user) {
      const hasSigned = await checkHasSignedCAForListing(slug);
      if (hasSigned) {
        window.location.href = `/listings/${slug}/access-dd-vault`;
      } else {
        // Trigger SignWell flow
        const { hasVault } = await checkVaultAccessAndReturnResult(slug);
        if (hasVault) {
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Investor';
          await createSignWellDocument(fullName, user.email!, slug);
        } else {
          setIsConfirmationModalOpen(true);
        }
      }
    } else {
      // Pending action pattern
      localStorage.setItem('OZL_PENDING_ACTION', JSON.stringify({ type: 'vault-access', slug }));
      openModal({
        title: "Request Vault Access",
        description: "Sign in to access confidential deal documents and financial projections.",
        redirectTo: `/listings/${slug}`
      });
    }
  }, [user, slug, checkHasSignedCAForListing, checkVaultAccessAndReturnResult, createSignWellDocument, openModal]);

  const handleContactDeveloper = useCallback(async () => {
    if (user) {
      setIsConfirmationModalOpen(true);
      // Logic for actually sending email/tracking could be added here
    } else {
      localStorage.setItem('OZL_PENDING_ACTION', JSON.stringify({ type: 'contact-developer', slug }));
      openModal({
        title: "Contact the Developer",
        description: "Sign in to contact the development team about this property.",
        redirectTo: `/listings/${slug}`
      });
    }
  }, [user, slug, openModal]);

  // Recovery Logic
  useEffect(() => {
    const recoverAction = async () => {
      if (user) {
        const pending = localStorage.getItem('OZL_PENDING_ACTION');
        if (pending) {
          try {
            const { type, slug: pendingSlug } = JSON.parse(pending);
            if (pendingSlug === slug) {
              if (type === 'vault-access') {
                handleVaultAccess();
              } else if (type === 'contact-developer') {
                handleContactDeveloper();
              }
            }
          } catch (e) {
            console.error('Failed to recover pending action', e);
          } finally {
            localStorage.removeItem('OZL_PENDING_ACTION');
          }
        }
      }
    };
    recoverAction();
  }, [user, slug, handleVaultAccess, handleContactDeveloper]);

  return (
    <>
      <section className="py-8 md:py-16 px-4 md:px-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 justify-center">
          <Tooltip
            content="For access to confidential deal information (i.e. - Private Placement Memorandum, Fund Operating Agreement, Subscription Agreement, and other documents)."
            position="top"
          >
            <button
              className="w-full md:w-[320px] px-8 py-4 rounded-2xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all duration-300 text-lg shadow-md hover:shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50"
              onClick={() => handleVaultAccess()}
              disabled={isCheckingCA}
            >
              {isCheckingCA
                ? 'Checking...'
                : hasSignedCAForCurrentListing
                  ? 'View Vault'
                  : 'Request Vault Access'
              }
            </button>
          </Tooltip>
          <button
            onClick={() => handleContactDeveloper()}
            className="w-full md:w-[320px] px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium hover:from-emerald-700 hover:to-green-700 transition-all duration-300 text-lg shadow-md hover:shadow-lg shadow-green-500/10 hover:shadow-green-500/20"
          >
            Contact Sponsor/Developer
          </button>
        </div>
      </section>

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
      />
    </>
  );
}

