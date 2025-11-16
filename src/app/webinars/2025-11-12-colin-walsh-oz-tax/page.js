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
  Play
} from 'lucide-react';

function DriveVideo({ previewUrl }) {
  return (
    <iframe
      src={previewUrl}
      className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl border border-gray-800"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowFullScreen
      title="Webinar recording"
      style={{ zIndex: 1 }}
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
        .eq('webinar_slug', '2025-11-12-colin-walsh-oz-tax')
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
      <section className="relative flex flex-col pt-8 sm:pt-12 lg:pt-16 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        {/* Geometric pattern background from best-practices page */}
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
        </div>
        {/* Image/Video Container with Responsive Aspect Ratio */}
        <div className="relative w-full z-10" style={{ aspectRatio: '16/9' }}>
          {isLoadingBanner ? (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                Loading webinar {isIcymi ? 'recording' : 'banner'}...
              </div>
            </div>
          ) : isIcymi && recordingLink && showVideo ? (
            // Render video embed when ICYMI and play button clicked
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-[90%] h-[90%] bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <DriveVideo previewUrl={recordingLink} />
              </div>
            </div>
          ) : bannerImage ? (
            // Render banner image with play button overlay when ICYMI, or just banner when active
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-[90%] h-[90%] rounded-2xl overflow-hidden">
                <Image
                  src={bannerImage}
                  alt="Opportunity Zones Unlocked: The 2026 Tax Cliff and How to Beat It"
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
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                Webinar {isIcymi ? 'recording' : 'banner'} not available
              </div>
            </div>
          )}
        </div>
        
        {/* CTA Section Below Image - Hidden during ICYMI phase */}
        {!(isIcymi && recordingLink) && (
          <div className="bg-gradient-to-br from-gray-900 to-black py-4 sm:py-2 lg:py-4">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
              <button
                onClick={() => handleCtaClick('hero-image-cta')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-5 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Register Now — Secure Your Seat
              </button>
            </div>
          </div>
        )}
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
              Are You Prepared for the Biggest <span className="font-semibold text-[#1e88e5]">Opportunity Zone Transition</span>?
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
                  For years, <span className="font-bold">Opportunity Zone investors</span> have enjoyed powerful tax incentives under <span className="font-bold">OZ 1.0</span>, but with <span className="font-bold">OZ 2.0</span> on the horizon astute investors are asking the same critical questions:
                </p>
                <div className="space-y-3 mb-4">
                  <p className="flex items-start">
                    <span className="font-semibold text-[#1e88e5] mr-2">•</span>
                    <span className="font-bold">When do the new rules take effect, and how does OZ 1.0 phase out? Should I invest now or wait for OZ 2.0?</span>
                  </p>
                </div>
                <p className="mb-4">
                  If you're holding appreciated assets, managing an OZ fund, or advising clients on tax-advantaged strategies, the stakes couldn't be higher. Misreading this transition could mean <span className="font-bold">missing out on millions in tax savings</span>, or being caught off guard by compliance changes you didn't see coming.
                </p>
                <p className="mb-4">
                  <span className="font-semibold text-gray-900 dark:text-white">The Opportunity Zone landscape is shifting.</span> Investors face uncertainty around <span className="font-bold">timelines, phase-outs, and new qualifications</span>, and most guidance online is vague or outdated.
                </p>
                <p className="mb-4">
                  Many are left wondering:
                </p>
                <div className="space-y-3 mb-4">
                  <p className="flex items-start">
                    <span className="font-semibold text-[#1e88e5] mr-2">•</span>
                    <span>Will existing OZ projects still qualify under OZ 2.0?</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-[#1e88e5] mr-2">•</span>
                    <span>How do I protect capital gains already invested?</span>
                  </p>
                  <p className="flex items-start">
                    <span className="font-semibold text-[#1e88e5] mr-2">•</span>
                    <span>Is there still time to capitalize on current OZ incentives?</span>
                  </p>
                </div>
                <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl mb-4">
                  The window for OZ 1.0 benefits is closing. Each month of delay could mean:
                </p>
                <div className="space-y-3 mb-4">
                  <p className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Losing access to deferrals that expire permanently</span>
                  </p>
                  <p className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Missing the final opportunities for <span className="font-bold">100% tax-free growth</span></span>
                  </p>
                  <p className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Failing to position your assets for the <span className="font-bold">next decade of compliant, tax-efficient investing</span></span>
                  </p>
                </div>
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-600">
                  <p className="mb-4">
                    Watch <span className="font-bold">Colin J. Walsh, J.D.</span>, Principal at <span className="font-bold">Baker Tilly</span> and national leader in <span className="font-bold">Tax Advocacy & Controversy Services</span>, in this powerful, no-fluff session on how to navigate the <span className="font-bold">OZ 1.0 to OZ 2.0 transition</span> with confidence.
                  </p>
                  <p>
                    With over fifteen years of experience guiding clients through IRS examinations, appeals, and Opportunity Zone compliance, <span className="font-bold">Colin specializes in turning complex tax rules into actionable clarity</span>. In this session, he breaks down exactly what you need to know to stay ahead of the regulatory curve.
                  </p>
                </div>
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
              {isIcymi && recordingLink ? 'Watch Recording' : 'Join Colin Walsh and Stay Ahead'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
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
            Opportunity Zones Unlocked: The <span className="font-semibold text-[#1e88e5]">2026 Tax Cliff</span> and How to Beat It
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover how to lock in OZ 1.0 benefits, protect your gains, and stay ahead of 2027 tax changes
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-5xl mx-auto"
          >
            {[
              { icon: AlertTriangle, text: "Navigate OZ 1.0 to OZ 2.0 transition" },
              { icon: Shield, text: "Protect existing capital gains investments" },
              { icon: TrendingUp, text: "Lock in current tax benefits before phase-out" }
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
            <span>{isIcymi && recordingLink ? 'Watch Recording' : 'Reserve Your Seat Now'}</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-base font-light"
          >
100% Free • Instant access to educational content 
          </motion.p>
        </div>
      </section>

      {/* What You'll Learn Section - Flexible Viewport */}
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
                title: "Pinpoint key transition dates and know exactly when OZ 1.0 phases out",
                description: "Get clarity on critical deadlines and understand the exact timeline for OZ 1.0 benefits before they expire",
                icon: Calendar,
                highlight: "Transition Timeline"
              },
              {
                title: "Compare OZ 1.0 and OZ 2.0—what's new, what's gone, and what it means for your returns",
                description: "Understand the differences between the two regimes and how they impact your investment strategy and tax benefits",
                icon: BarChart3,
                highlight: "OZ 1.0 vs 2.0"
              },
              {
                title: "Identify grandfathering opportunities to preserve your existing benefits",
                description: "Learn how to protect investments already made under OZ 1.0 and ensure continued tax advantages",
                icon: Shield,
                highlight: "Grandfathering"
              },
              {
                title: "Avoid compliance pitfalls that could trigger IRS scrutiny or lost incentives",
                description: "Navigate the regulatory landscape with confidence and avoid costly mistakes that could jeopardize your tax benefits",
                icon: AlertTriangle,
                highlight: "Compliance"
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
              {isIcymi && recordingLink ? 'Watch Recording' : 'Reserve Your Seat'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Who Should Attend Section - Flexible Viewport */}
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
              Who <span className="font-semibold text-[#1e88e5]">Should Watch</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-6">
              This recording is perfect for serious investors, advisors, and fund managers who refuse to be caught off guard by the next wave of tax reform.
            </p>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-900 dark:text-white max-w-4xl mx-auto font-medium leading-relaxed mb-6">
              If any of the following describe you, you should watch this replay:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: DollarSign,
                title: "Opportunity Zone Investors", 
                description: "who want to protect current OZ 1.0 benefits before they phase out" 
              },
              { 
                icon: User,
                title: "High-Net-Worth Individuals", 
                description: "sitting on appreciated gains looking to minimize taxes and maximize long-term wealth" 
              },
              { 
                icon: Briefcase,
                title: "Family Office Executives", 
                description: "balancing risk management, compliance, and impact-driven investment strategy" 
              },
              { 
                icon: Building,
                title: "Fund Managers & Developers", 
                description: "preparing for the OZ 2.0 transition and future project eligibility" 
              },
              { 
                icon: Scale,
                title: "Tax & Wealth Advisors", 
                description: "seeking to guide clients through evolving compliance and deferral rules" 
              },
              { 
                icon: Calculator,
                title: "CPAs & Accountants", 
                description: "helping clients navigate tax-efficient strategies and Opportunity Zone compliance requirements" 
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 sm:mt-10 lg:mt-12 text-center"
          >
            <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-light italic">
              This isn't theory or speculation—it's a practical roadmap for investors who value clarity, confidence, and control. If you're committed to building tax-free wealth with purpose and precision, this event was made for you.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Your Expert Presenter Section - Flexible Viewport */}
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
              About Your <span className="font-semibold text-[#1e88e5]">Presenter</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg bg-gray-200 dark:bg-gray-700">
                  <Image
                    src="https://authenticate.ozlistings.com/storage/v1/object/public/oz_webinars/2025-11-12-colin-walsh-oz-tax/Colin%20J.%20Walsh%20-%20Protrait.png"
                    alt="Colin J. Walsh, J.D."
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                <p className="text-gray-900 dark:text-white font-bold text-base sm:text-lg lg:text-xl">
                  Colin J. Walsh, J.D.
                </p>
                <p className="text-[#1e88e5] font-medium">
                  Principal, <span className="font-bold">Baker Tilly</span> | Leader, <span className="font-bold">Tax Advocacy & Controversy Services</span>
                </p>
                <p>
                  Colin Walsh is a seasoned tax attorney and Principal at Baker Tilly, where he leads the firm's Tax Advocacy and Controversy Services group. With over fifteen years of experience navigating IRS examinations, appeals, and complex compliance matters, he's known for turning high-stakes challenges into strategic outcomes. A recognized authority on Opportunity Zones and tax procedure, Colin's insights have been featured in The Tax Adviser and ISBA's Federal Tax Newsletter. He serves as president of the Illinois State Bar Association's Federal Tax Committee and is widely regarded as a trusted voice in tax controversy resolution.
                </p>
              </div>
            </motion.div>
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
              Watch the <span className="font-semibold text-[#1e88e5]">Replay Now</span>
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto font-light">
              Don't miss out on critical insights. Watch the full recording now and gain the clarity, confidence, and strategy you need to protect your tax advantage in 2025 and beyond.
            </p>

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
                    : 'Register now to join Colin Walsh and stay ahead of the Opportunity Zone curve.'
                }
              </span>
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block transition-transform ${ctaConfirmed ? '' : 'group-hover:translate-x-2'}`} />
            </motion.button>

            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-xs sm:text-sm lg:text-base font-light">100% Free • Instant access to educational content</p>
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

