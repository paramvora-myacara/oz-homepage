"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';

function DriveVideo({ previewUrl }) {
  return (
    <iframe
      src={previewUrl}
      className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl border border-gray-800"
      allow="autoplay; fullscreen"
      allowFullScreen
      title="Webinar recording"
    />
  );
}

function MiscPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('webinar-recording');

  const [webinarTitle, setWebinarTitle] = useState(null);
  const [recordingLink, setRecordingLink] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchWebinar() {
      if (!slug) return;
      setLoading(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('oz_webinars')
          .select('webinar_name, recording_link')
          .eq('webinar_slug', slug)
          .single();
        if (!isMounted) return;
        if (!error && data) {
          setWebinarTitle(data.webinar_name || null);
          setRecordingLink(data.recording_link || null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchWebinar();
    return () => { isMounted = false; };
  }, [slug]);

  return (
    <div className="pt-10">
      {slug && (loading || recordingLink) && (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
          <div className="absolute inset-0 opacity-30 dark:opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
          </div>
          {/* Geometric pattern background from Community Upcoming Events */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                  linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                  linear-gradient(30deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5),
                  linear-gradient(150deg, #1e88e5 12%, transparent 12.5%, transparent 87%, #1e88e5 87.5%, #1e88e5)
                `,
                backgroundSize: '80px 140px',
                backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px'
              }}></div>
            </div>
            {/* Radial gradient accents to add depth */}
            <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-radial from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10"></div>
            <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-indigo-100/15 via-transparent to-transparent dark:from-indigo-900/8"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/3 bg-gradient-radial from-slate-100/25 via-transparent to-transparent dark:from-slate-800/15"></div>
            {/* Subtle noise for texture */}
            <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] mix-blend-overlay">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}></div>
            </div>
          </div>
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-4 sm:mb-6 lg:mb-10">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-2 leading-tight lg:whitespace-nowrap">
                {webinarTitle ? webinarTitle : 'Loading webinar...'}
              </h2>
              {webinarTitle && (
                <p className="-mt-1 text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"> Webinar Recording</p>
              )}
            </div>
            <div className="max-w-6xl mx-auto">
              <div className="bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 pointer-events-none" />
                  </div>
                  {recordingLink ? (
                    <DriveVideo previewUrl={recordingLink} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Fetching recording...</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function MiscPage() {
  return (
    <Suspense fallback={<div className="pt-10"></div>}>
      <MiscPageContent />
    </Suspense>
  );
}