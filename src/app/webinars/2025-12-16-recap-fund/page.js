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
  TrendingDown,
  Home,
  Handshake
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
    setShowOptinModal(true);
  };

  const fetchWebinarData = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('oz_webinars')
        .select('*')
        .eq('webinar_slug', '2025-12-16-recap-fund')
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

    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

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
                  alt="The ReCap Strategy: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones"
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
                Register Now — Save Your Seat
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
            The <span className="font-semibold text-[#1e88e5]">"ReCap" Strategy</span>: How to Secure Immediate Cash Flow & Built-In Equity in Opportunity Zones
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Why the Smartest Capital is Shifting from "Ground-Up" Construction to Distressed Recapitalization.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-5xl mx-auto"
          >
            {[
              { icon: TrendingDown, text: "Acquire assets below replacement cost" },
              { icon: DollarSign, text: "Secure immediate cash flow" },
              { icon: TrendingUp, text: "Gain built-in equity from day one" }
            ].map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#1e88e5] mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm lg:text-base leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </motion.div>

          <motion.button
            onClick={() => handleOtherCtaClick('hero-primary-cta')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{isIcymi && recordingLink ? 'Watch Recording' : 'Register Now — Save Your Seat'}</span>
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

      {/* The Opportunity Zone Playbook Has Changed Section */}
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
              The Opportunity Zone Playbook <span className="font-semibold text-[#1e88e5]">Has Changed</span>
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
                <p className="mb-4">
                  For years, Opportunity Zone (OZ) investing meant one thing: taking on massive construction risk and waiting years for a return.
                </p>
                <p className="font-bold text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl mb-4">
                  That era is over.
                </p>
                <p className="mb-4">
                  We are entering a specific macroeconomic window defined by tightening markets and debt cycles. This shift has created a rare, <span className="font-bold">unique</span> investment strategy that most investors don't even know exists yet.
                </p>
                <p className="mb-4">
                  Join us for an exclusive webinar where we reveal the <span className="font-bold">ReCap Fund</span>—a new <span className="font-bold">"one-of-a-kind"</span> strategic approach designed to capitalize on the current debt cycle by acquiring assets below replacement cost.
                </p>
                <p className="mb-4">
                  Traditional OZ projects start with dirt, delays, rising costs, and uncertainty.
                </p>
                <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl">
                  Our new OZ recapitalization strategy gives you all the OZ tax benefits but without these drawbacks.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleOtherCtaClick('problem-section-cta')}
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

      {/* How Our ReCap Fund Strategy Works Section */}
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
              How Our <span className="font-semibold text-[#1e88e5]">ReCap Fund Strategy</span> Works
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
                <p className="mb-4">
                  The ReCap Fund strategy was created to address the specific macroeconomic shift where developers started projects 2-3 years ago and are now facing loan maturities and "balloon" payments they cannot easily refinance due to tightening markets.
                </p>
                <p className="mb-4">
                  This financial pressure effectively turns these developers into distressed sellers, creating a rare opening for the fund to step in and recapitalize the projects at a discount. By entering these deals, investors acquire assets below their current replacement cost—gaining immediate "built-in equity" because the price to build the same project today would be significantly higher.
                </p>
                <p className="mb-4">
                  Unlike traditional Opportunity Zone strategies that start with "dirt" and carry high construction risks, the ReCap Fund targets assets with already-completed construction, allowing investors to avoid development blind spots and secure immediate cash flow rather than waiting years for revenue.
                </p>
                <p className="font-medium text-gray-900 dark:text-white text-base sm:text-lg lg:text-xl">
                  In this educational deep dive, we will break down how developer distress and maturing loans are allowing savvy investors to step into fully built projects at a massive discount.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleOtherCtaClick('strategy-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isIcymi && recordingLink ? 'Watch Recording' : 'Learn More About the ReCap Strategy'}
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* What You Will Discover Section */}
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
              What <span className="font-semibold text-[#1e88e5]">You Will Discover</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "The \"Built-In Equity\" Advantage",
                description: "Learn how to enter deals at a cost basis significantly lower than what it would cost to build the project today, effectively buying instant equity.",
                icon: TrendingUp,
                highlight: "Built-In Equity"
              },
              {
                title: "How to Eliminate \"Ground-Up\" Risk",
                description: "Discover why the safest OZ bets right now are projects where construction is already complete, removing the blind spots, cost overruns, and delays that plague standard developments.",
                icon: Shield,
                highlight: "Risk Elimination"
              },
              {
                title: "The Blueprint for Immediate Cash Flow",
                description: "Unlike traditional OZ deals that burn cash for years, see how the ReCap model is structured to generate revenue and deliver cash flow to investors.",
                icon: DollarSign,
                highlight: "Cash Flow"
              },
              {
                title: "Asymmetric Upside in a Tight Market",
                description: "Understand how recapitalizing distressed deals creates a unique mark-to-market valuation that offers upside potential without early-cycle risks.",
                icon: ChartLine,
                highlight: "Market Advantage"
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

          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleOtherCtaClick('discover-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {isIcymi && recordingLink ? 'Watch Recording' : 'Register Now — Save Your Seat'}
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
              This webinar is critical for <span className="font-bold">accredited investors</span>, <span className="font-bold">high-net-worth individuals</span>, <span className="font-bold">family offices</span>, and <span className="font-bold">fund managers</span> looking for:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: CheckCircle,
                title: "OZ Tax Benefits & Cash Flow", 
                description: "without construction risk" 
              },
              { 
                icon: TrendingUp,
                title: "Built-In Equity", 
                description: "and discounted entry pricing" 
              },
              { 
                icon: Target,
                title: "Asymmetric Upside", 
                description: "with limited downside" 
              },
              { 
                icon: BarChart3,
                title: "Real-World Strategy", 
                description: "aligned with macroeconomic conditions (tight debt markets, rising replacement costs, and developer distress)" 
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
              Register Now — <span className="font-semibold text-[#1e88e5]">Save Your Seat</span>
            </h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8 text-center"
            >
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 max-w-4xl mx-auto font-medium mb-4">
                If you're serious about building wealth in 2025, this webinar will give you a strategic edge.
              </p>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-white max-w-4xl mx-auto font-bold">
                Don't buy dirt. Buy distress.
              </p>
            </motion.div>

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
                    : 'Register Now — Save Your Seat'
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

