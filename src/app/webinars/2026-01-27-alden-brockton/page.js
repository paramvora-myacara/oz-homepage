"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from '../../contexts/ThemeContext';
import { trackUserEvent } from '../../../lib/analytics/trackUserEvent';
import { useState, useEffect } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useAuth } from '../../../lib/auth/AuthProvider';
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
  Play,
  MapPin,
  Train,
  Home
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
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [ctaConfirmed, setCtaConfirmed] = useState(false);
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
    if (!showVideo) {
      setShowVideo(true);
    }
    
    await trackUserEvent("webinar_scroll_to_recording", {
      source,
      action: "scroll_to_recording",
      timestamp: new Date().toISOString(),
    });
    
    setTimeout(() => {
      const videoElement = document.querySelector('[style*="aspectRatio"]');
      if (videoElement) {
        videoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const scrollToTopAndPlay = async (source) => {
    if (!showVideo) {
      setShowVideo(true);
    }
    
    await trackUserEvent("webinar_scroll_to_recording", {
      source,
      action: "scroll_to_recording",
      timestamp: new Date().toISOString(),
    });
    
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
  };

  const fetchWebinarData = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('oz_webinars')
        .select('*')
        .eq('webinar_slug', '2026-01-27-alden-brockton')
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
        
        const now = new Date();
        let hasEnded = false;
        
        if (data.end_time) {
          const endTime = new Date(data.end_time);
          
          if (!isNaN(endTime.getTime())) {
            hasEnded = now.getTime() > endTime.getTime();
          }
        }
        
        setIsIcymi(hasEnded);
        
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
  }, []);

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

  useEffect(() => {
    if (user && isClient) {
      trackUserEvent("webinar_page_viewed", {
        webinar_id: "2026-01-27-alden-brockton",
        webinar_name: "Exclusive Opportunity Zone Investments in MA [Accredited Investors Only]",
        source: "authenticated_access",
        authenticated_entry: true,
        timestamp: new Date().toISOString(),
      });
    }
  }, [user, isClient]);

  return (
    <div className="relative w-full text-gray-900 dark:text-white">
      
      {/* Hero Image/Recording Section */}
      <section className="relative flex flex-col pt-8 sm:pt-12 lg:pt-16 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
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
          <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-radial from-blue-100/20 via-transparent to-transparent dark:from-blue-900/10"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-radial from-indigo-100/15 via-transparent to-transparent dark:from-indigo-900/8"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2/3 h-1/3 bg-gradient-radial from-slate-100/25 via-transparent to-transparent dark:from-slate-800/15"></div>
        </div>
        <div className="relative w-full z-10" style={{ aspectRatio: '16/9' }}>
          {isLoadingBanner ? (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                Loading webinar {isIcymi ? 'recording' : 'banner'}...
              </div>
            </div>
          ) : isIcymi && recordingLink && showVideo ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-[90%] h-[90%] bg-black rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <DriveVideo previewUrl={recordingLink} />
              </div>
            </div>
          ) : bannerImage ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="relative w-[90%] h-[90%] rounded-2xl overflow-hidden">
                <Image
                  src={bannerImage}
                  alt="Exclusive Opportunity Zone Investments in MA [Accredited Investors Only]"
                  fill
                  className="object-contain object-center"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                
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
        
        {!(isIcymi && recordingLink) && (
          <div className="bg-gradient-to-br from-gray-900 to-black py-4 sm:py-2 lg:py-4">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
              <button
                onClick={() => handleCtaClick('hero-image-cta')}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-5 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Register Now - Save Your Seat
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Hero Content Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <motion.h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light leading-tight mb-4 sm:mb-5 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Exclusive Opportunity Zone Investments in MA<br />
            <span className="font-semibold text-[#1e88e5]">[Accredited Investors Only]</span>
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Learn why projects like "The Alden" in Brockton, MA are generating so much interest in the UHNWI and family office space.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-5xl mx-auto"
          >
            {[
              { icon: MapPin, text: "Transit-oriented development in downtown Brockton" },
              { icon: Train, text: "5 minutes from Brockton Commuter Rail" },
              { icon: TrendingUp, text: "2.6x equity multiple, 15.75% IRR, 6% pref" }
            ].map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#1e88e5] mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </motion.div>

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

          <motion.button
            onClick={() => handleOtherCtaClick('hero-primary-cta')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{isIcymi && recordingLink ? 'Watch Recording' : 'Register Now - Save Your Seat'}</span>
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

      {/* Overview Section */}
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
              Overview
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="mb-4">
                  Join OZ Listings for an exclusive live webinar and developer interview featuring <span className="font-bold">The Alden</span>, a fully entitled, transit-oriented Opportunity Zone development in downtown Brockton, MA - one of Greater Boston's most actively revitalizing urban cores.
                </p>
                <p className="mb-4">
                  This session will give accredited investors a concise, data-driven look at a <span className="font-bold">100-unit, market-rate multifamily project</span> located just five minutes from the Brockton Commuter Rail, offering direct 40-minute access to Boston's Seaport, Financial District, and Cambridge. The Alden is purpose-built to capture regional housing demand while maximizing long-term Opportunity Zone tax advantages.
                </p>
                <p className="mb-4">
                  Backed by a proven local sponsor with <span className="font-bold">95%+ occupancy across recent Brockton deliveries</span>, the project sits at the center of a city-backed downtown transformation with <span className="font-bold">2,000+ units completed, under construction, or in the pipeline</span> - positioning early investors ahead of the curve as capital flows into the district.
                </p>
                <p className="font-medium text-gray-900 dark:text-white text-lg sm:text-xl lg:text-2xl xl:text-3xl">
                  The live webinar will feature the project sponsors alongside representatives from OZ Listings, offering direct access to the deal team and OZ platform leadership.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleOtherCtaClick('overview-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isIcymi && recordingLink ? 'Watch Recording' : 'Join Us for This Exclusive Webinar'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* What We Will Cover Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 dark:from-blue-900/20 dark:via-sky-900/20 dark:to-blue-900/20 py-8 lg:py-16">
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
              We Will <span className="font-semibold text-[#1e88e5]">Cover</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "The Brockton revitalization story and demand drivers",
                description: "Understand the city-backed transformation and why 2,000+ units are driving capital into the district",
                icon: Building,
                highlight: "Market Dynamics"
              },
              {
                title: "Project overview, unit mix, and amenities",
                description: "Get a detailed look at the 100-unit, market-rate multifamily project and its strategic positioning",
                icon: Home,
                highlight: "Project Details"
              },
              {
                title: "Sponsor track record and execution plan",
                description: "Learn about the proven local sponsor with 95%+ occupancy across recent Brockton deliveries",
                icon: Award,
                highlight: "Sponsor Profile"
              },
              {
                title: "Target returns (2.6x equity multiple, 15.75% IRR, 6% pref)",
                description: "Review the projected financial performance and return structure for accredited investors",
                icon: ChartLine,
                highlight: "Returns"
              },
              {
                title: "How Opportunity Zones enable 100% tax-free growth over a 10+ year hold",
                description: "Understand the long-term tax advantages and wealth-building potential of OZ investments",
                icon: Shield,
                highlight: "Tax Benefits"
              },
              {
                title: "Direct access to sponsors and OZ platform leadership",
                description: "Engage directly with the deal team and OZ Listings leadership during the live session",
                icon: Users,
                highlight: "Live Access"
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
                      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <div className="inline-flex items-center justify-center text-center bg-gray-100 dark:bg-gray-700 px-3 sm:px-4 lg:px-6 py-1 rounded-md self-start">
                        <span className="font-medium text-gray-700 dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">
                          {item.highlight}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg xl:text-xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleOtherCtaClick('cover-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isIcymi && recordingLink ? 'Watch Recording' : 'Register Now - Save Your Seat'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Who This Webinar Is For Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
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
              Who This <span className="font-semibold text-[#1e88e5]">Webinar Is For</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-6">
              This is a live, investor-focused session with direct access to the sponsors.
            </p>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-900 dark:text-white max-w-4xl mx-auto font-bold leading-relaxed mb-6">
              Accredited investors only.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: UserCheck,
                title: "Accredited Investors", 
                description: "seeking exclusive access to high-quality Opportunity Zone deals" 
              },
              { 
                icon: Briefcase,
                title: "UHNWI & Family Offices", 
                description: "interested in tax-advantaged real estate investments in Greater Boston" 
              },
              { 
                icon: Building,
                title: "Real Estate Investors", 
                description: "looking for transit-oriented multifamily opportunities with strong fundamentals" 
              },
              { 
                icon: Target,
                title: "Opportunity Zone Investors", 
                description: "seeking projects with proven sponsors and strong execution track records" 
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
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-sm sm:text-base lg:text-lg xl:text-xl">{attendee.description}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section id="final-cta" className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden py-8 lg:py-16">
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
              Register Now - <span className="font-semibold text-[#1e88e5]">Save Your Seat</span>
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center"
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium mb-4">
                Spots are limited.
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-white max-w-4xl mx-auto font-bold">
                This is a live, investor-focused session with direct access to the sponsors.
              </p>
              <p className="text-base sm:text-lg lg:text-xl text-gray-900 dark:text-white max-w-4xl mx-auto font-bold mt-4">
                Accredited investors only.
              </p>
            </motion.div>

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
                    : 'Register Now - Save Your Seat'
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
    </div>
  );
}
