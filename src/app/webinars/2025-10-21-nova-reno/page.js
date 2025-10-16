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
  Lightbulb
} from 'lucide-react';

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

  const fireRegistrationEvent = async () => {
    await trackUserEvent("webinar_registration_click", {
      source: 'final-cta',
      action: "register_for_webinar",
      timestamp: new Date().toISOString(),
    });
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
        .eq('webinar_slug', '2025-10-14-legal-101')
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
        setIsLoadingBanner(false);
        
        // Calculate time until start_time
        if (data.start_time) {
          const startTime = new Date(data.start_time);
          const now = new Date();
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

    // Countdown timer
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
      // Clean up script if component unmounts
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div className="relative w-full text-gray-900 dark:text-white">
      
      {/* Hero Image Section - Responsive Height */}
      <section className="relative flex flex-col pt-16 sm:pt-20 lg:pt-24">
        {/* Image Container with Responsive Aspect Ratio */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {isLoadingBanner ? (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                Loading webinar banner...
              </div>
            </div>
          ) : bannerImage ? (
            <Image
              src={bannerImage}
              alt="Legal 101 Webinar"
              fill
              className="object-contain object-center"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-gray-400 dark:text-gray-500 text-lg font-medium">
                Webinar banner not available
              </div>
            </div>
          )}
          {/* Subtle overlay for better readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
        
        {/* CTA Section Below Image - Never Overlaps */}
        <div className="bg-gradient-to-br from-gray-900 to-black py-4 sm:py-2 lg:py-4">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <button
              onClick={() => scrollToFinalCta('hero-image-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-5 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Register Now — Secure Your Seat
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
            Opportunity Zones: From <span className="font-semibold text-[#1e88e5]">Legal 101</span> to OZ 2.0
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="font-medium text-[#1e88e5]">Protect your legacy, avoid IRS traps, and unlock tax-free growth</span>
            <br />
            with bulletproof OZ deal structures.
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-5xl mx-auto"
          >
            {[
              { icon: Shield, text: "Avoid costly structural mistakes" },
              { icon: Scale, text: "Bulletproof legal compliance" },
              { icon: TrendingUp, text: "Maximize OZ 2.0 opportunities" }
            ].map((benefit, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#1e88e5] mx-auto mb-2 sm:mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm lg:text-base leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Countdown Timer - Improved responsive layout */}
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

          {/* Primary CTA */}
          <motion.button
            onClick={() => scrollToFinalCta('hero-primary-cta')}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Register Now — Secure Your Seat</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-base font-light"
          >
            No credit card required • Instant access • Expert legal guidance
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
              Are Your Opportunity Zone Investments Set Up to <span className="font-semibold text-green-600">Succeed</span>—or Destined to <span className="font-semibold text-red-600">Unravel</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
            {/* Problem Statement */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-red-500" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-4">The Hidden Crisis</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Too many investors and fund managers jump into OZ deals with enthusiasm, only to discover years later that a <span className="font-semibold text-red-600">small structural misstep</span> cost them compliance, tax advantages, and millions in potential returns.
                </p>
                <p>
                  The consequences aren't just inconvenient—they're <span className="font-semibold text-red-600">catastrophic</span>. Failed funds, IRS penalties, investor lawsuits, and reputational damage all trace back to one root cause: <span className="font-semibold text-red-600">poor legal structuring from the start</span>.
                </p>
              </div>
            </motion.div>

            {/* Solution Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-500" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-4">The Solution</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  The good news? These mistakes are <span className="font-semibold text-green-600">preventable</span>—and we're going to show you how.
                </p>
                <p>
                  Learn from <span className="font-semibold text-[#1e88e5]">Michael Krueger</span>, one of the nation's top OZ attorneys, alongside the OZ Listings team who are pioneering the next evolution of Opportunity Zone investing.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => scrollToFinalCta('problem-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn How to Avoid These Mistakes
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
              Why You <span className="font-semibold text-[#1e88e5]">Can't Afford</span> to Miss This Webinar
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              This isn't another surface-level OZ discussion. It's a deep dive into the structural do's and don'ts every investor and fund manager must know right now.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
            {/* Deep Dive Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-[#1e88e5]/10 to-sky-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#1e88e5]" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-4">Real-World Insights</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  With <span className="font-semibold text-[#1e88e5]">OZ 2.0 on the horizon</span>, the rules are shifting—and if you're not positioned correctly, you'll be left behind while others capitalize.
                </p>
                <p>
                  Real-world <span className="font-semibold text-red-600">"horror stories"</span> will be shared—deals gone wrong, botched setups, and costly mistakes made by those who relied on inexperienced advisors.
                </p>
              </div>
            </motion.div>

            {/* Blueprint Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-500" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white mb-4">The Blueprint for Success</h3>
              </div>
              
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  But you'll also see the <span className="font-semibold text-green-600">blueprint for doing it right</span>: proven legal guardrails, case studies of successful projects, and proactive solutions that keep your investments bulletproof.
                </p>
                <p>
                  This is your chance to learn from <span className="font-semibold text-[#1e88e5]">Michael Krueger</span>, one of the nation's top OZ attorneys, alongside the OZ Listings team who are pioneering the next evolution of Opportunity Zone investing.
                </p>
              </div>
            </motion.div>
          </div>

          {/* CTA */}
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => scrollToFinalCta('why-miss-section-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Secure Your Seat Today
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
              Your <span className="font-semibold text-[#1e88e5]">Legal Expert</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Learn from <span className="font-semibold text-[#1e88e5]">Michael Krueger</span>, one of the nation's top OZ attorneys, alongside the OZ Listings team who are pioneering the next evolution of Opportunity Zone investing.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
            {/* OZ Listings Team (Left) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
                  <Image
                    src="/images/Jeff.png"
                    alt="Dr. Jeff Richmond"
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="text-gray-900 dark:text-white font-semibold">
                  Dr. Jeff Richmond — CEO and founding partner of OZ Listings™, the premier marketplace for Opportunity Zone investing.
                </p>
                <p>
                  With a decade of experience in real estate, capital strategy, and business development, Jeff bridges the gap between investors, developers, and OZ assets nationwide. His expertise lies in structuring tax-advantaged deals, driving investor engagement, and scaling systems that make OZ investing more transparent and accessible.
                </p>
              </div>
            </motion.div>

            {/* Michael Krueger (Right) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
            >
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 xl:w-48 xl:h-48 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
                    <Image
                      src="/images/Michael Krueger.png"
                      alt="Michael Krueger"
                      width={192}
                      height={192}
                      className="object-cover w-full h-full"
                    />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="text-gray-900 dark:text-white font-semibold">
                  Michael Krueger — Partner at Lucosky Brookman law firm, and a leading authority on Opportunity Zones.
                </p>
                <p>
                  Michael helps investors, developers, and business owners unlock tax-advantaged growth through strategic deal structuring and compliance-driven fund formation. With deep expertise in business transactions, real estate finance, and private equity, Michael is known for turning complex regulations into clear strategies that protect wealth, mitigate IRS risks, and maximize long-term returns. 
                </p>
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
              What You'll <span className="font-semibold text-[#1e88e5]">Learn</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Walk away with clarity, confidence, and strategies you can immediately apply to protect your investments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Common OZ Fund Structuring Mistakes",
                description: "The most common mistakes that destroy compliance and how to avoid them completely.",
                icon: AlertTriangle,
                highlight: "Avoid Costly Errors"
              },
              {
                title: "Step-by-Step Best Practices",
                description: "Complete framework for setting up an Opportunity Zone fund the right way from day one.",
                icon: Target,
                highlight: "Bulletproof Setup"
              },
              {
                title: "OZ 2.0 Legal Implications",
                description: "How new guidelines will impact investors and funds, and how to position yourself correctly.",
                icon: TrendingUp,
                highlight: "Stay Ahead of Changes"
              },
              {
                title: "Investor Due Diligence",
                description: "Red flags to watch for, essential due diligence steps, and tax position risks to avoid.",
                icon: UserCheck,
                highlight: "Protect Your Investment"
              },
              {
                title: "Fund Manager Responsibilities",
                description: "Compliance requirements, governance best practices, and how to avoid IRS traps.",
                icon: Briefcase,
                highlight: "Maintain Compliance"
              },
              {
                title: "Successful Case Studies",
                description: "Real examples of projects that maximized returns through proper legal structuring.",
                icon: BarChart3,
                highlight: "Proven Results"
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
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
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

        </div>
      </section>

      {/* Who's This For Section - Flexible Viewport */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Who's This <span className="font-semibold text-[#1e88e5]">For</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4 mb-6">
              If you're serious about protecting your wealth, maximizing tax advantages, and avoiding the hidden traps that derail Opportunity Zone investments, this session is designed for you.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: DollarSign,
                title: "Investors & Tech Employees", 
                description: "Safeguard returns, avoid IRS headaches, and ensure OZ positions deliver long-term wealth—especially tech employees facing massive capital gains ahead of 2027 deadlines." 
              },
              { 
                icon: Building,
                title: "Fund Operators, Managers & Developers", 
                description: "Build bulletproof structures from day one with clear legal guardrails and explore OZ structures as innovative capital stack solutions." 
              },
              { 
                icon: Briefcase,
                title: "Family Offices & Wealth Managers", 
                description: "Seek diversification strategies and reliable tax shelters for your clients. Navigate complex OZ compliance requirements while maximizing after-tax returns for high-net-worth families." 
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
                  {attendee.title === "Investors & Tech Employees" ? (
                    <>Investors &<br />Tech Employees</>
                  ) : attendee.title === "Family Offices & Wealth Managers" ? (
                    <>Family Offices &<br />Wealth Managers</>
                  ) : (
                    attendee.title
                  )}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-xs sm:text-sm lg:text-base">{attendee.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => scrollToFinalCta('whos-this-for-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Secure Your Seat Today
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Why Register Now Section - Flexible Viewport */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8 lg:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Why Register <span className="font-semibold text-[#1e88e5]">Now</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4">
              The truth is, many OZ funds already have hidden problems baked into their structures. Fixes are costly, stressful, and sometimes impossible.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: AlertTriangle,
                title: "Hidden Problems Already Exist", 
                description: "Many OZ funds have structural issues that will cost millions to fix later." 
              },
              { 
                icon: DollarSign,
                title: "Prevention Costs Less", 
                description: "Proactive prevention strategies cost less upfront than painful restructurings later." 
              },
              { 
                icon: Timer,
                title: "OZ 2.0 Changes Coming", 
                description: "New guidelines are on the horizon—get positioned correctly before it's too late." 
              }
            ].map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-3xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-[#1e88e5]/10 to-[#d97706]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:from-[#1e88e5]/20 group-hover:to-[#d97706]/20 transition-all duration-300">
                  <reason.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-[#1e88e5]" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">{reason.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-xs sm:text-sm lg:text-base">{reason.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => scrollToFinalCta('why-register-cta')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Secure Your Seat Today
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Flexible Viewport */}
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
              Don't Let <span className="font-semibold text-[#1e88e5]">Legal Mistakes</span> Cost You Millions
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto font-light">
              <span className="font-medium text-[#1e88e5]">This is your chance to get ahead of the curve, protect your capital,</span>
              <br />
              and seize Opportunity Zone 2.0 opportunities with confidence.
            </p>

            {/* What's Included */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">What You'll Receive</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  { text: "Complete OZ legal framework", icon: Scale },
                  { text: "Lifetime access to recordings", icon: Video }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-[#1e88e5] flex-shrink-0 mt-1" />
                    <div className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm lg:text-base leading-relaxed text-left">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Countdown - Improved responsive layout */}
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

            {/* Final CTA */}
            <motion.button
              onClick={handleFinalCtaClick}
              className={`bg-gradient-to-r ${ctaConfirmed ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'} text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4`}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{ctaConfirmed ? "You're in!" : 'Register Now — Secure Your Seat'}</span>
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block transition-transform ${ctaConfirmed ? '' : 'group-hover:translate-x-2'}`} />
            </motion.button>

            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-xs sm:text-sm lg:text-base font-light">No credit card required • Instant access • Expert legal guidance</p>
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
              <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">Register for Updates</h2>
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
