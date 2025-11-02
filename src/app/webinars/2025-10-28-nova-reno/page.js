"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from '../../contexts/ThemeContext';
import { trackUserEvent } from '../../../lib/analytics/trackUserEvent';
import { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { 
  Calendar,
  Clock,
  User,
  CheckCircle,
  Users,
  BarChart3,
  Building,
  TrendingUp,
  Shield,
  Target,
  ArrowRight,
  Star,
  DollarSign,
  Timer,
  Award,
  Briefcase,
  ChartLine,
  UserCheck,
  Calculator,
  BookOpen,
  Video,
  AlertTriangle,
  Scale,
  FileText,
  Gavel,
  Zap,
  XCircle,
  CheckCircle2,
  Eye,
  Lightbulb,
  Gift,
  Play
} from 'lucide-react';

function DriveVideo({ previewUrl }) {
  return (
    <iframe
      src={previewUrl}
      className="absolute inset-0 w-full h-full"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      title="Webinar recording"
      style={{ 
        border: 'none',
        zIndex: 1
      }}
    />
  );
}

export default function WebinarLandingPage() {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [ctaConfirmed, setCtaConfirmed] = useState(false);
  const [showOptinModal, setShowOptinModal] = useState(false);
  const [webinarData, setWebinarData] = useState(null);
  const [bannerImage, setBannerImage] = useState(null);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [isIcymi, setIsIcymi] = useState(false);
  const [recordingLink, setRecordingLink] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const scrollToFinalCta = async (source) => {
    await trackUserEvent("webinar_scroll_to_final_cta", {
      source,
      action: "scroll_to_final_cta",
      timestamp: new Date().toISOString(),
    });
    const target = document.getElementById('final-cta');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToRecording = async (source) => {
    // Show video if not already shown
    if (!showVideo) {
      setShowVideo(true);
    }
    
    // Track event
    await trackUserEvent("webinar_scroll_to_recording", {
      source,
      action: "scroll_to_recording",
      timestamp: new Date().toISOString(),
    });
    
    // Scroll to video after a brief delay to ensure it's rendered
    setTimeout(() => {
      const videoElement = document.querySelector('[style*="aspectRatio"]');
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToTopAndPlay = async (source) => {
    // Show video if not already shown
    if (!showVideo) {
      setShowVideo(true);
    }
    
    // Track event
    await trackUserEvent("webinar_scroll_to_recording", {
      source,
      action: "scroll_to_recording",
      timestamp: new Date().toISOString(),
    });
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCtaClick = async (source) => {
    if (isIcymi && recordingLink) {
      await scrollToRecording(source);
    } else {
      await scrollToFinalCta(source);
    }
  };

  const handleOtherCtaClick = async (source) => {
    if (isIcymi && recordingLink) {
      await scrollToTopAndPlay(source);
    } else {
      await scrollToFinalCta(source);
    }
  };

  const fireRegistrationEvent = async () => {
    await trackUserEvent(
      isIcymi ? "webinar_watch_replay_click" : "webinar_registration_click",
      {
        source: 'final-cta',
        action: isIcymi ? "watch_replay" : "register_for_webinar",
        timestamp: new Date().toISOString(),
      }
    );
    setCtaConfirmed(true);
  };

  const handleFinalCtaClick = async () => {
    await fireRegistrationEvent();
    setShowOptinModal(true);
  };

  const fetchWebinarData = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('oz_webinars')
        .select('*')
        .eq('webinar_slug', '2025-10-28-nova-reno')
        .single();

      if (error) {
        console.error('Error fetching webinar data:', error);
        setIsLoadingBanner(false);
        return;
      }

      if (data) {
        setWebinarData(data);
        if (data.banner_image_link) {
          setBannerImage(data.banner_image_link);
        }
        if (data.recording_link) {
          setRecordingLink(data.recording_link);
        }
        setIsLoadingBanner(false);
        
        // Check if webinar has ended
        const now = new Date();
        let hasEnded = false;
        
        if (data.end_time) {
          // Parse end_time - handle both ISO strings and timestamp strings
          const endTime = new Date(data.end_time);
          
          // Check if date is valid
          if (!isNaN(endTime.getTime())) {
            // Compare dates (compare as timestamps to avoid timezone issues)
            hasEnded = now.getTime() > endTime.getTime();
            
            // Debug logging
            console.log('Webinar end_time check:', {
              end_time_raw: data.end_time,
              endTime: endTime.toISOString(),
              now: now.toISOString(),
              now_timestamp: now.getTime(),
              endTime_timestamp: endTime.getTime(),
              hasEnded: hasEnded,
              recording_link: data.recording_link ? 'exists' : 'missing'
            });
          } else {
            console.warn('Invalid end_time format:', data.end_time);
          }
        } else {
          console.log('No end_time set for webinar');
        }
        
        setIsIcymi(hasEnded);
        
        // Only calculate countdown if webinar hasn't ended and start_time exists
        if (!hasEnded && data.start_time) {
          const startTime = new Date(data.start_time);
          const timeDiff = startTime.getTime() - now.getTime();
          
          if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            setTimeLeft({ days, hours, minutes, seconds });
          }
        }
      } else {
        setIsLoadingBanner(false);
      }
    } catch (error) {
      console.error('Error fetching webinar data:', error);
      setIsLoadingBanner(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    fetchWebinarData();

    // Load form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Clean up script if component unmounts
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  // Separate useEffect for countdown timer - only runs when not ICYMI
  useEffect(() => {
    if (isIcymi) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [isIcymi]);

  return (
    <div className="relative w-full text-gray-900 dark:text-white">
      
      {/* Hero Image/Recording Section - Responsive Height */}
      <section className="relative flex flex-col pt-16 sm:pt-20 lg:pt-24">
        {/* Image/Video Container with Responsive Aspect Ratio */}
        <div className="relative w-full" style={{ aspectRatio: '16/9', minHeight: '400px' }}>
          {isLoadingBanner ? (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                Loading webinar {isIcymi ? 'recording' : 'banner'}...
              </div>
            </div>
          ) : isIcymi && recordingLink && showVideo ? (
            // Render video embed when ICYMI and play button clicked
            <div className="relative w-full h-full bg-black rounded-2xl shadow-2xl overflow-hidden lg:max-h-[85vh]">
              <DriveVideo previewUrl={recordingLink} />
            </div>
          ) : bannerImage ? (
            // Render banner image with play button overlay when ICYMI, or just banner when active
            <>
              <Image
                src={bannerImage}
                alt="Nova Reno Investor Webinar"
                fill
                className="object-contain object-center"
                priority
              />
              {/* Subtle overlay for better readability on banner image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
              
              {/* Play button overlay - only show when ICYMI and video not started */}
              {isIcymi && recordingLink && !showVideo && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowVideo(true)}
                >
                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-4 sm:p-6 lg:p-8 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-[#1e88e5] fill-[#1e88e5] ml-1 sm:ml-2" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                Webinar {isIcymi ? 'recording' : 'banner'} not available
              </div>
            </div>
          )}
        </div>
        
        {/* CTA Section Below Image */}
        <div className="bg-gradient-to-br from-gray-900 to-black py-4 sm:py-2 lg:py-4">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <button
              onClick={() => handleCtaClick('hero-image-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-5 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              {isIcymi && recordingLink ? 'Watch Recording' : 'Register Now — Secure Your Seat'}
            </button>
          </div>
        </div>
      </section>

      {/* Hero Content Section - Flexible Viewport */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <motion.h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light leading-tight mb-4 sm:mb-5 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Opportunity Zones Unlocked: A Case Study in <span className="font-semibold text-[#1e88e5]">Tax-Free Wealth Building</span> through Student Housing
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover the proven principles behind resilient student housing investments, and how Opportunity Zone incentives unlock 100% tax-free growth.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-5xl mx-auto"
          >
            {[
              { icon: Lightbulb, text: "Educational deep-dive into student housing" },
              { icon: Building, text: "Real-world case study: Nova Reno project" },
              { icon: TrendingUp, text: "Learn tax-free wealth building strategies" }
            ].map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#1e88e5] mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm lg:text-base leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Countdown Timer - Improved responsive layout */}
          {!isIcymi && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mb-8"
            >
              <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">Webinar Starts In:</h3>
              <div className="flex justify-center items-center gap-2 sm:gap-4 lg:gap-6 flex-wrap">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="text-center flex-shrink-0">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2 sm:p-3 lg:p-4 shadow-lg mb-2 min-w-[60px] sm:min-w-[70px] lg:min-w-[80px]">
                      <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-[#1e88e5]">{item.value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Primary CTA */}
          <motion.button
            onClick={() => handleOtherCtaClick('hero-primary-cta')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{isIcymi && recordingLink ? 'Watch Recording' : 'Reserve Your Spot & Download Free Resources'}</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-base font-light"
          >
              100% Free • Instant access to educational content • Professional resources
          </motion.p>
        </div>
      </section>

      {/* The Problem Section - Flexible Viewport */}
      <section className="relative min-h-screen flex items-center bg-white dark:bg-gray-900 py-8 lg:py-16">
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Real-World Learning: <span className="font-semibold text-[#1e88e5]">Student Housing</span> & Opportunity Zones in Action
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl mb-4">
                  This online educational session walks you through a real-world case study from UpCampus, one of the nation's leading student housing developers, revealing how education-first investing creates both stable returns and lasting community value.
                </p>
                <p className="mb-4">
                  <span className="font-semibold text-gray-900 dark:text-white">About the Insider Session</span>
                </p>
                <p>
                  In today's uncertain real estate market, investors are seeking assets that combine durability, demand, and purpose. This exclusive session uses a live Opportunity Zone development—the Nova Reno project adjacent to the University of Nevada, Reno—as a teaching framework, not a pitch.
                </p>
                <p>
                  You'll learn how disciplined underwriting, campus adjacency, and Opportunity Zone tax advantages align to create a compelling model for long-term, tax-efficient growth. Led by the UpCampus team, this session focuses on education over promotion, sharing the same due diligence principles they use to evaluate, structure, and manage high-performing student housing projects.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleOtherCtaClick('problem-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isIcymi && recordingLink ? 'Watch Recording' : 'Join This Educational Session'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Why You Can't Afford to Miss This Section - Flexible Viewport */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-900/20 dark:via-sky-900/20 dark:to-blue-900/20 py-8 lg:py-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              What <span className="font-semibold text-[#1e88e5]">You'll Learn</span>
            </h2>
           
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "How to Evaluate a Student Housing Investment",
                description: "Understand the key metrics that drive durable returns, from enrollment growth to pre-lease velocity and unit mix",
                icon: BarChart3,
                highlight: "Investment Analysis"
              },
              {
                title: "Why Opportunity Zones Pair Exceptionally Well with Student Housing",
                description: "Explore how patient capital, stable demand, and place-based incentives amplify long-term gains",
                icon: TrendingUp,
                highlight: "Strategic Alignment"
              },
              {
                title: "How to Vet a Sponsor with Confidence",
                description: "Learn what separates seasoned developers from speculative operators and what 'great looks like' in due diligence",
                icon: UserCheck,
                highlight: "Due Diligence"
              },
              {
                title: "How Market Selection Impacts Stability",
                description: "See why secondary university towns offer the ideal blend of low supply, strong fundamentals, and growth potential",
                icon: Building,
                highlight: "Market Strategy"
              },
              {
                title: "How to Structure for Tax-Free Growth",
                description: "Map each Opportunity Zone incentive to a real project outcome—lease-up, hold strategy, and exit timing",
                icon: Calculator,
                highlight: "Tax Strategy"
              },
              {
                title: "Real-World Application",
                description: "Study an actual live project to gain insight into how resilient housing assets withstand market cycles and deliver consistent income",
                icon: Eye,
                highlight: "Case Study"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group relative"
              >
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#1e88e5]/10 to-[#1565c0]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-[#1e88e5]/20 group-hover:to-[#1565c0]/20 transition-all duration-300">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-[#1e88e5] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                        {item.title}
                        {item.subtitle && (
                          <>
                            <br />
                            <span className="text-[#1e88e5]">{item.subtitle}</span>
                          </>
                        )}
                      </h3>
                      <div className="inline-flex items-center justify-center text-center bg-gray-100 dark:bg-gray-700 px-3 sm:px-4 lg:px-6 py-1 rounded-md self-start">
                        <span className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                          {item.highlight}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-xs sm:text-sm lg:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleOtherCtaClick('why-miss-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isIcymi && recordingLink ? 'Watch Recording' : 'Reserve Your Spot & Download Free Resources'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      

      {/* Your Expert Hosts Section - Flexible Viewport */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              About <span className="font-semibold text-[#1e88e5]">UpCampus</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              UpCampus is a mission-driven real estate development firm specializing in pedestrian-to-campus communities that elevate student life and strengthen local economies.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center"
            >
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  With a <span className="font-semibold text-[#1e88e5]">long track record of successful projects</span> in secondary and tertiary university markets, UpCampus combines disciplined underwriting with a purpose-driven vision—building assets that generate lasting impact and resilient returns.
                </p>
                <div className="mt-6 sm:mt-8">
                  <Image
                    src="https://authenticate.ozlistings.com/storage/v1/object/public/oz_webinars/2025-10-28-nova-reno/2025-10-28-nova-reno-team-img.png"
                    alt="UpCampus Team"
                    width={600}
                    height={400}
                    className="mx-auto rounded-2xl shadow-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* What You'll Learn Section - Flexible Viewport */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Who Should <span className="font-semibold text-[#1e88e5]">Attend</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-6">
              This online session is for investors who value education, strategy, and impact—not sales pitches.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: UserCheck,
                title: "Accredited & Emerging Investors", 
                description: "who want to evaluate deals with confidence and clarity" 
              },
              { 
                icon: Briefcase,
                title: "Family Offices & Wealth Advisors", 
                description: "seeking tax-advantaged, purpose-driven strategies" 
              },
              { 
                icon: Building,
                title: "Developers & Sponsors", 
                description: "exploring how Opportunity Zones enhance long-term returns" 
              },
              { 
                icon: Users,
                title: "Community Builders & Alumni", 
                description: "who believe real estate can strengthen local economies" 
              }
            ].map((attendee, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-3xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-[#1e88e5]/10 to-[#d97706]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:from-[#1e88e5]/20 group-hover:to-[#d97706]/20 transition-all duration-300">
                  <attendee.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-[#1e88e5]" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
                  {attendee.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-xs sm:text-sm lg:text-base">{attendee.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* Combined Final CTA Section - Flexible Viewport */}
      <section id="final-cta" className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden py-8 lg:py-16">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              Reserve Your <span className="font-semibold text-[#1e88e5]">Spot Today</span>
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto font-light">
              Learn directly from practitioners studying an actual live project—gaining insight into how resilient housing assets deliver consistent income and contribute to community revitalization.
            </p>

            {/* Free Takeaway */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-col items-center gap-2 mb-2">
                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 dark:text-white text-center">Free Takeaway for Attendees</h3>
              </div>
              <div className="space-y-2 max-w-2xl mx-auto">
                <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white text-center">
                  Download the "Due Diligence Checklist for OZ Student Housing"
                </p>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  Every attendee will receive a professional-grade checklist—used by real investors to evaluate student housing deals in Opportunity Zones. This resource empowers you to apply the same analysis immediately to your own investment opportunities.
                </p>
              </div>
            </div>

            {/* Final Countdown - Improved responsive layout */}
            {!isIcymi && (
              <div className="mb-8">
                <div className="text-gray-900 dark:text-white font-medium mb-4 text-base sm:text-lg lg:text-xl">Webinar starts in:</div>
                <div className="flex justify-center items-center gap-2 sm:gap-3 lg:gap-4 flex-wrap">
                  {[
                    { label: 'Days', value: timeLeft.days },
                    { label: 'Hours', value: timeLeft.hours },
                    { label: 'Minutes', value: timeLeft.minutes },
                    { label: 'Seconds', value: timeLeft.seconds }
                  ].map((item, index) => (
                    <div key={index} className="text-center flex-shrink-0">
                      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2 sm:p-3 shadow-lg mb-2 min-w-[50px] sm:min-w-[60px] lg:min-w-[70px]">
                        <span className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-[#1e88e5]">{item.value.toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final CTA */}
            <motion.button
              onClick={isIcymi && recordingLink ? () => handleOtherCtaClick('final-cta') : handleFinalCtaClick}
              className={`bg-gradient-to-r ${ctaConfirmed ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'} text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4`}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {isIcymi && recordingLink 
                  ? 'Watch Recording' 
                  : ctaConfirmed 
                    ? "You're in!" 
                    : 'Reserve Your Spot & Download Free Resources'
                }
              </span>
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block transition-transform ${ctaConfirmed ? '' : 'group-hover:translate-x-2'}`} />
            </motion.button>

            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-xs sm:text-sm lg:text-base font-light">100% Free • Instant access to educational content • Professional resources</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Phone Opt-in Modal */}
      {showOptinModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setShowOptinModal(false)}>
          <div className="relative w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowOptinModal(false)}
              className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full w-10 h-10 shadow flex items-center justify-center"
              aria-label="Close"
            >
              ×
            </button>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">{isIcymi ? 'Watch Replay' : 'Register for Updates'}</h2>
              <div className="w-full aspect-[3/4] min-h-[700px]">
                <iframe
                  src="https://api.leadconnectorhq.com/widget/form/NwCvNv6pNCNLQnPyLbbx"
                  style={{width:'100%',height:'100%',border:'none',borderRadius:'14px'}}
                  id="inline-NwCvNv6pNCNLQnPyLbbx" 
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="Webinar Registration Form"
                  data-height="529"
                  data-layout-iframe-id="inline-NwCvNv6pNCNLQnPyLbbx"
                  data-form-id="NwCvNv6pNCNLQnPyLbbx"
                  title="Webinar Registration Form"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
      );
  }
