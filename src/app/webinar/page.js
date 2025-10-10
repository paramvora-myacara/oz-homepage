"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

export default function WebinarRedirectPage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const redirectToMostRecentWebinar = async () => {
      try {
        const supabase = createClient();
        
        // Get the most recent webinar based on created_at
        const { data, error } = await supabase
          .from('oz_webinars')
          .select('webinar_slug')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching most recent webinar:', error);
          // Fallback to a default webinar if there's an error
          router.push('/webinars/2025-10-14-legal-101');
          return;
        }

        if (data && data.webinar_slug) {
          router.push(`/webinars/${data.webinar_slug}`);
        } else {
          // Fallback if no webinars found
          router.push('/webinars/2025-10-14-legal-101');
        }
      } catch (error) {
        console.error('Error in webinar redirect:', error);
        // Fallback to a default webinar if there's an error
        router.push('/webinars/2025-10-14-legal-101');
      } finally {
        setIsLoading(false);
      }
    };

    redirectToMostRecentWebinar();
  }, [router]);

  // Show loading state while redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e88e5] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Redirecting to latest webinar...</p>
        </div>
      </div>
    );
  }

  return null;
}