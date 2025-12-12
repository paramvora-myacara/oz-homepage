"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '../../lib/supabase/client';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useTheme } from '../contexts/ThemeContext';
import Image from "next/image";
import Link from "next/link";

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
  const heading = searchParams.get('heading');

  const [webinarTitle, setWebinarTitle] = useState(null);
  const [recordingLink, setRecordingLink] = useState(null);
  const [loading, setLoading] = useState(false);

  // Past events state
  const [pastEvents, setPastEvents] = useState([]);
  const [currentPastEventIndex, setCurrentPastEventIndex] = useState(0);
  const [isLoadingPastBanner, setIsLoadingPastBanner] = useState(true);
  const { resolvedTheme } = useTheme();

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

  const fetchPastEvents = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('oz_webinars')
        .select('webinar_slug, banner_image_link, webinar_name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching past events:', error);
        setIsLoadingPastBanner(false);
        return;
      }

      if (data && data.length > 0) {
        // Filter out events without banner images
        const eventsWithBanners = data.filter(w => w.banner_image_link);
        setPastEvents(eventsWithBanners);
      }
      setIsLoadingPastBanner(false);
    } catch (error) {
      console.error('Error fetching past events:', error);
      setIsLoadingPastBanner(false);
    }
  };

  useEffect(() => {
    fetchPastEvents();
  }, []);

  // Auto-cycle through past events
  useEffect(() => {
    if (pastEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPastEventIndex((prevIndex) => (prevIndex + 1) % pastEvents.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [pastEvents.length]);

  const goToPreviousPastEvent = () => {
    setCurrentPastEventIndex((prevIndex) =>
      prevIndex === 0 ? pastEvents.length - 1 : prevIndex - 1
    );
  };

  const goToNextPastEvent = () => {
    setCurrentPastEventIndex((prevIndex) =>
      prevIndex === pastEvents.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="pt-10">
      {(heading || slug) && (
        <section className="relative pt-12 sm:pt-16 pb-16 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
            {/* Header Section */}
            <div className={`text-center ${(recordingLink || loading) ? 'mb-12 sm:mb-16 lg:mb-20' : 'mb-6 sm:mb-8'}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-2 leading-tight lg:whitespace-nowrap">
                {heading ? decodeURIComponent(heading) : webinarTitle ? webinarTitle : 'Loading...'}
              </h1>
              {webinarTitle && !heading && (
                <p className="-mt-1 text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"> Webinar Recording</p>
              )}
            </div>

            {/* Webinar Recording Section */}
            {(recordingLink || loading) && (
              <div className="max-w-6xl mx-auto mb-16 sm:mb-20">
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
            )}

            {/* Past Events Section - Inline */}
            {pastEvents.length > 0 && (
              <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
                <div className="mb-4">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white mb-4"
                  >
                    Past <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">Events</span>
                  </motion.h2>
                </div>

            <motion.div
              className="max-w-[980px] mx-auto mb-2 sm:mb-3"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <motion.div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-5 lg:p-6 hover:shadow-3xl transition-all duration-500"
              >
                <div className="relative w-full rounded-lg sm:rounded-xl overflow-hidden border border-gray-200/30 dark:border-gray-700/30" style={{ aspectRatio: '16/9' }}>
                  {isLoadingPastBanner ? (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                        Loading past event banners...
                      </div>
                    </div>
                  ) : pastEvents.length > 0 ? (
                    <>
                      {pastEvents.map((event, index) => (
                        <Link
                          key={event.webinar_slug}
                          href={`/webinars/${event.webinar_slug}`}
                          aria-label={`Go to ${event.webinar_name || 'Event'}`}
                        >
                          <motion.div
                            className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: index === currentPastEventIndex ? 1 : 0,
                              scale: index === currentPastEventIndex ? 1 : 0.98
                            }}
                            transition={{
                              duration: 0.8,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                            <Image
                              src={event.banner_image_link}
                              alt={event.webinar_name || `Event ${index + 1}`}
                              fill
                              className="object-contain object-center bg-white dark:bg-gray-900"
                              priority={index === 0}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                            />
                          </motion.div>
                        </Link>
                      ))}

                      {/* Navigation Chevrons */}
                      {pastEvents.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              goToPreviousPastEvent();
                            }}
                            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 group"
                            aria-label="Previous event"
                          >
                            <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200 group-hover:text-[#1e88e5] transition-colors" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              goToNextPastEvent();
                            }}
                            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-700 group"
                            aria-label="Next event"
                          >
                            <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-200 group-hover:text-[#1e88e5] transition-colors" />
                          </button>
                        </>
                      )}

                      {/* Carousel indicators */}
                      {pastEvents.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                          {pastEvents.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentPastEventIndex(index);
                              }}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentPastEventIndex
                                  ? 'bg-white shadow-lg w-6'
                                  : 'bg-white/50 hover:bg-white/75 w-2'
                              }`}
                              aria-label={`Go to event ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                        Past event banners not available
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
              </div>
            )}
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