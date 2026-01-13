"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  KeyIcon,
  StarIcon,
  ChartBarIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useAuthModal } from '../contexts/AuthModalContext';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import Image from "next/image";
import Link from "next/link";
import EdgeChevronsIndicator from "../components/EdgeChevronsIndicator";
import { createClient } from '../../lib/supabase/client';
import Navbar from '../components/landing/Navbar';
import OZTimeline from '../components/Invest/OZTimeline';

const benefits = [
  {
    title: "Exclusive Access",
    description: "Be first to discover premium off-market Opportunity Zone deals.",
    Icon: KeyIcon,
  },
  {
    title: "AI-First Platform",
    description: "Leverage advanced AI to discover, analyze, and match with the best OZ opportunities.",
    Icon: BoltIcon,
  },
  {
    title: "White-Glove Service",
    description: "Get concierge-level support from dedicated OZ experts.",
    Icon: StarIcon,
  },
  {
    title: "Insider Insights",
    description: "Access expert analysis and detailed market reports.",
    Icon: ChartBarIcon,
  },
];

const blue = "#1e88e5";

export default function CommunityPage() {
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [webinars, setWebinars] = useState([]);
  const [currentWebinarIndex, setCurrentWebinarIndex] = useState(0);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [pastEvents, setPastEvents] = useState([]);
  const [currentPastEventIndex, setCurrentPastEventIndex] = useState(0);
  const [isLoadingPastBanner, setIsLoadingPastBanner] = useState(true);
  const [activeBenefitIndex, setActiveBenefitIndex] = useState(0);
  const { resolvedTheme } = useTheme();
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  // Theme-aware gold color
  const gold = resolvedTheme === 'dark' ? "#FFD700" : "#D4AF37";

  const fetchAllWebinars = async () => {
    try {
      const supabase = createClient();
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('oz_webinars')
        .select('webinar_slug, banner_image_link, webinar_name, start_time')
        .gt('start_time', now) // Only get events where start_time is in the future
        .order('start_time', { ascending: true }); // Sort by start_time ascending (earliest upcoming first)

      if (error) {
        console.error('Error fetching webinars:', error);
        setIsLoadingBanner(false);
        return;
      }

      if (data && data.length > 0) {
        // Filter out webinars without banner images and get only the most recent upcoming event
        const webinarsWithBanners = data.filter(w => w.banner_image_link);
        // Get the first one (earliest upcoming event)
        const mostRecentUpcoming = webinarsWithBanners.length > 0 ? [webinarsWithBanners[0]] : [];
        setWebinars(mostRecentUpcoming);
      } else {
        setWebinars([]);
      }
      setIsLoadingBanner(false);
    } catch (error) {
      console.error('Error fetching webinars:', error);
      setIsLoadingBanner(false);
    }
  };

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
    setIsClient(true);
    fetchAllWebinars();
    fetchPastEvents();

    // Track community page view event
    const trackCommunityView = async () => {
      await trackUserEvent("community_interest_expressed", {
        source: "community_page_visit",
        timestamp: new Date().toISOString(),
      });
    };

    trackCommunityView();

    // Cycle through benefits
    const interval = setInterval(() => {
      setActiveBenefitIndex((prev) => (prev + 1) % benefits.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-cycle through webinars
  useEffect(() => {
    if (webinars.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentWebinarIndex((prevIndex) => (prevIndex + 1) % webinars.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [webinars.length]);

  // Auto-cycle through past events
  useEffect(() => {
    if (pastEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPastEventIndex((prevIndex) => (prevIndex + 1) % pastEvents.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [pastEvents.length]);

  // Handle authentication state changes
  useEffect(() => {
    // If user just authenticated and we're on this page, they joined the community
    if (user && !loading && !hasJoinedCommunity) {
      // Check if this was a redirect from auth flow
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('joined') === 'true' || window.location.pathname === '/community') {
        setHasJoinedCommunity(true);
        // Clean up URL
        window.history.replaceState(null, '', '/community');
      }
    }
  }, [user, loading, hasJoinedCommunity]);

  const handleJoinCommunity = async () => {
    if (hasJoinedCommunity) {
      // User has already joined, do nothing or show a message
      return;
    }

    if (loading) {
      // Still loading auth state, wait
      return;
    }

    // Track community join button click
    await trackUserEvent("community_interest_expressed", {
      source: "join_community_button",
      timestamp: new Date().toISOString(),
    });

    if (user) {
      // User is logged in, show welcome popup
      setShowWelcomePopup(true);
    } else {
      // User not logged in, show auth modal
      openModal({
        title: 'Join Our Exclusive Community',
        description: 'Sign in to join the OZ Marketplace and get access to exclusive deals and insights.\n\n🔐 Password-free login\n✨ One-time signup, lifetime access',
        redirectTo: '/community',
        onClose: () => {
          // Check if user signed in after auth modal closes
          if (user) {
            setHasJoinedCommunity(true);
          }
        }
      });
    }
  };

  const handleWelcomeConfirm = () => {
    setShowWelcomePopup(false);
    setHasJoinedCommunity(true);
  };

  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
  };

  // Container sizing
  const containerHeight = 'min-h-screen';
  const contentHeight = 'h-auto min-h-screen';

  const headingMarginBottom = 'mb-12';
  const cardsMarginBottom = 'mb-12';
  const verticalPadding = 'py-8';

  const handleWebinarNav = async (source) => {
    try {
      await trackUserEvent("webinar_navigation", {
        source,
        from_page: "community",
        timestamp: new Date().toISOString(),
      });
    } catch (_) {
      // noop
    }
  };

  const goToPreviousWebinar = () => {
    setCurrentWebinarIndex((prevIndex) =>
      prevIndex === 0 ? webinars.length - 1 : prevIndex - 1
    );
  };

  const goToNextWebinar = () => {
    setCurrentWebinarIndex((prevIndex) =>
      prevIndex === webinars.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePastEventNav = async (source) => {
    try {
      await trackUserEvent("past_event_navigation", {
        source,
        from_page: "community",
        timestamp: new Date().toISOString(),
      });
    } catch (_) {
      // noop
    }
  };

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
    <div className="relative w-full bg-white text-[#212C38] transition-colors duration-300 dark:bg-black dark:text-white">
      <Navbar />
      {isLoadingBanner ? (
        // Show loading state for entire page until data is fetched
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
          <div className="text-center">
            <div className="border-primary-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Webinar Hero Image Section - Only show if there's an upcoming event */}
          {webinars.length > 0 && (
            <section id="community-hero" className="relative pt-24 sm:pt-28 lg:pt-24 lg:min-h-screen lg:flex lg:items-center overflow-hidden">
              {/* NEW BACKGROUND: Grid + Radial Gradient */}
              <div className="absolute inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-radial-gradient from-blue-500/10 to-transparent blur-[100px]"></div>

              <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center lg:py-4">
                <div className="max-w-4xl mx-auto mb-6">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white"
                  >
                    Upcoming <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">Events</span>
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
                      {isLoadingBanner ? (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                          <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                            Loading webinar banners...
                          </div>
                        </div>
                      ) : webinars.length > 0 ? (
                        <Link
                          key={webinars[0].webinar_slug}
                          href={`/webinars/${webinars[0].webinar_slug}`}
                          aria-label={`Go to ${webinars[0].webinar_name || 'Webinar'}`}
                          onClick={() => handleWebinarNav('banner')}
                        >
                          <motion.div
                            className="absolute inset-0 rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: 1,
                              scale: 1
                            }}
                            transition={{
                              duration: 0.8,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                            <Image
                              src={webinars[0].banner_image_link}
                              alt={webinars[0].webinar_name || 'Webinar'}
                              fill
                              className="object-contain object-center bg-white dark:bg-gray-900"
                              priority
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                            />
                          </motion.div>
                        </Link>
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                            Webinar banners not available
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="py-1 sm:py-2 lg:py-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Link
                    href="/webinar"
                    onClick={() => handleWebinarNav('cta')}
                    className="inline-block w-full sm:w-auto bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-full text-sm sm:text-base md:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  >
                    Go to Webinar Page
                  </Link>
                </motion.div>
              </div>
            </section>
          )}

          {/* JOIN THE COMMUNITY SECTION */}
          <div id="community-join" ref={containerRef} className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-0 pb-4 bg-white dark:bg-black">

            {/* NEW BACKGROUND: Grid + Radial Gradient */}
            <div className="absolute inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[600px] w-[600px] rounded-full bg-radial-gradient from-blue-500/20 to-transparent blur-[100px]"></div>

            {/* Main Content */}
            <div className={`relative z-10 w-full ${contentHeight} flex flex-col items-center justify-start pt-12 lg:pt-20 px-4 ${verticalPadding}`}>

              {/* Heading Section */}
              <motion.div
                className={`w-full max-w-4xl text-center ${headingMarginBottom}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {user ? (
                    <>
                      Welcome to the{" "}
                      <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
                        OZ Marketplace
                      </span>{" "}
                      Community!
                    </>
                  ) : (
                    <>
                      Join the{" "}
                      <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
                        OZ Marketplace
                      </span>{" "}
                      of the Future!
                    </>
                  )}
                </motion.h1>
                <motion.p
                  className="text-base sm:text-lg lg:text-xl font-light text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {user ? (
                    "You're part of an exclusive community of visionary investors and developers shaping the future of OZ investments."
                  ) : (
                    "Step into an exclusive community of visionary investors and developers shaping the future of OZ investments."
                  )}
                </motion.p>
              </motion.div>

              {/* Cards Section - Looping Animation */}
              <div className={`w-full max-w-7xl mx-auto ${cardsMarginBottom}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-5xl mx-auto">
                  {benefits.map((benefit, idx) => {
                    const isActive = idx === activeBenefitIndex;
                    return (
                      <motion.div
                        key={benefit.title}
                        className={`relative rounded-xl p-6 transition-all duration-500 overflow-hidden ${isActive
                          ? 'lg:bg-blue-50 lg:dark:bg-blue-900/20 lg:border-2 lg:border-[#1e88e5] lg:shadow-[0_0_30px_rgba(30,136,229,0.2)] lg:scale-105 lg:z-10'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm lg:opacity-70 lg:scale-95 lg:hover:opacity-100'
                          }`}
                        animate={{
                          scale: isActive ? 1.05 : 1,
                          borderColor: isActive ? '#1e88e5' : 'rgba(229, 231, 235, 0.5)'
                        }}
                      >
                        {/* Active highlight background */}
                        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center text-center space-y-4 h-full justify-start">
                          <div className={`mb-3 p-4 rounded-lg transition-colors duration-500 ${isActive ? 'bg-[#1e88e5] text-white' : 'bg-blue-50 dark:bg-gray-700 text-[#1e88e5] dark:text-gray-400'
                            }`}>
                            <benefit.Icon className="h-8 w-8" />
                          </div>
                          <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${isActive ? 'text-[#1e88e5]' : 'text-gray-900 dark:text-white'}`}>
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Section */}
              <motion.div
                className="text-center mt-8 lg:mt-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                <motion.button
                  className={`relative rounded-full ${hasJoinedCommunity
                    ? 'bg-gradient-to-r from-green-600 to-green-700 cursor-default'
                    : 'bg-gradient-to-r from-[#1e88e5] to-[#1565c0]'
                    } px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-xl overflow-hidden group`}
                  onClick={handleJoinCommunity}
                  whileHover={hasJoinedCommunity ? {} : { scale: 1.05 }}
                  whileTap={hasJoinedCommunity ? {} : { scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {hasJoinedCommunity ? "You're In! Welcome to the Community!" : 'Join the Community Now'}
                    {!hasJoinedCommunity && (
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    )}
                    {hasJoinedCommunity && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </span>
                  {!hasJoinedCommunity && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#1565c0] to-[#0d47a1]"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              </motion.div>
            </div>

            {/* Welcome Popup */}
            <AnimatePresence>
              {showWelcomePopup && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md"
                  onClick={handleWelcomeClose}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-8 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
                      >
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                          className="text-3xl text-green-600 dark:text-green-400"
                        >
                          ✓
                        </motion.span>
                      </motion.div>

                      <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                      >
                        Welcome to the Community!
                      </motion.h2>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                      >
                        Hello, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Investor'}!
                        <br />
                        You're now part of our exclusive OZ community.
                      </motion.p>

                      <div className="flex gap-3">
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          onClick={handleWelcomeConfirm}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                          Continue
                        </motion.button>
                        <motion.button
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          onClick={handleWelcomeClose}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                        >
                          Close
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Past Events Section */}
          <section id="past-events" className="relative pt-8 pb-24 sm:pt-12 lg:pt-8 min-h-[70vh] lg:flex lg:items-center overflow-hidden bg-white dark:bg-black">
            {/* NEW GRID BACKGROUND */}
            <div className="absolute inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute right-0 bottom-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-radial-gradient from-blue-500/10 to-transparent blur-[80px]"></div>

            <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center lg:py-4">
              <div className="max-w-4xl mx-auto mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-navy dark:text-white font-brand-black"
                >
                  Past <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">Events</span>
                </motion.h2>
              </div>

              {/* Stacked Cards Container */}
              <div className="relative w-full max-w-4xl mx-auto h-[250px] sm:h-[350px] lg:h-[450px] flex items-center justify-center">
                <div className="relative w-full h-full perspective-1000 flex items-center justify-center">
                  {isLoadingPastBanner ? (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl flex items-center justify-center">
                      <span className="text-gray-400">Loading events...</span>
                    </div>
                  ) : pastEvents.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                      {pastEvents.map((event, index) => {
                        // Calculate visual offset
                        const offset = (index - currentPastEventIndex + pastEvents.length) % pastEvents.length;

                        // We only render the first 3 cards in the stack context
                        if (offset > 2) return null;

                        return (
                          <motion.div
                            key={`${event.webinar_slug}-${index}`}
                            className="absolute w-full max-w-3xl aspect-[16/9] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
                            style={{
                              zIndex: 30 - offset, // 30, 29, 28
                            }}
                            initial={{
                              scale: 0.9,
                              y: 50,
                              opacity: 0
                            }}
                            animate={{
                              scale: 1 - offset * 0.05, // 1, 0.95, 0.9
                              y: offset * 30, // 0, 30, 60
                              opacity: 1 - offset * 0.3, // 1, 0.7, 0.4
                            }}
                            exit={{
                              y: 100,
                              opacity: 0,
                              scale: 0.9,
                              transition: { duration: 0.3 }
                            }}
                            transition={{
                              duration: 0.5,
                              ease: "easeInOut"
                            }}
                          >
                            <Link
                              href={`/webinars/${event.webinar_slug}`}
                              className="block h-full w-full relative group"
                              onClick={(e) => {
                                if (offset !== 0) {
                                  e.preventDefault();
                                  goToNextPastEvent();
                                } else {
                                  handlePastEventNav('card');
                                }
                              }}
                            >
                              <Image
                                src={event.banner_image_link}
                                alt={event.webinar_name || 'Event'}
                                fill
                                className="object-cover"
                                priority={offset === 0}
                              />
                              {/* Overlay for depth effect on back cards */}
                              <motion.div
                                className="absolute inset-0 bg-white/60 dark:bg-black/60 transition-opacity"
                                animate={{ opacity: offset === 0 ? 0 : 0.6 }}
                              />

                              {/* Hover effect for top card */}
                              {offset === 0 && (
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-blue-500/10 transition-colors duration-300" />
                              )}
                            </Link>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  ) : (
                    <div className="relative w-full max-w-3xl aspect-[16/9] bg-gray-100 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center p-8">
                      <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-full mb-4">
                        <ChartBarIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400">No past events found</h3>
                      <p className="text-gray-400 dark:text-gray-500 mt-2">Check back soon for new webinar recordings.</p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                {pastEvents.length > 1 && (
                  <div className="absolute -bottom-12 md:-bottom-2 lg:bottom-auto lg:right-[-80px] flex lg:flex-col gap-4 z-40">
                    <button
                      onClick={goToPreviousPastEvent}
                      className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-110 transition-transform text-navy dark:text-white"
                      aria-label="Previous"
                    >
                      <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={goToNextPastEvent}
                      className="p-3 rounded-full bg-[#1e88e5] shadow-lg hover:bg-blue-600 hover:scale-110 transition-transform text-white"
                      aria-label="Next"
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <OZTimeline />

          <EdgeChevronsIndicator />
        </>
      )}
    </div>
  );
}