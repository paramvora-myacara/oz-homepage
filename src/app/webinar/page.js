"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from '../contexts/ThemeContext';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import { useState, useEffect } from 'react';
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
  Video
} from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useAuthModal } from '../contexts/AuthModalContext';

export default function WebinarLandingPage() {
  const { resolvedTheme } = useTheme();
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 14,
    minutes: 23,
    seconds: 45
  });
  const [ctaConfirmed, setCtaConfirmed] = useState(false);

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
    if (loading) return;

    if (user) {
      await fireRegistrationEvent();
    } else {
      // Persist an intent flag so we can fire after auth automatically
      sessionStorage.setItem('pending_webinar_registration', 'true');
      openModal({
        title: 'Reserve Your Webinar Seat',
        description: 'Please sign in to complete your registration.\n\n• Password-free login\n• 10-second signup, lifetime webinar access\n• Get reminders and bonus materials',
        redirectTo: '/webinar',
      });
    }
  };

  useEffect(() => {
    setIsClient(true);

    // On return from auth, if user is signed in and intent exists, fire event once
    if (user && typeof window !== 'undefined') {
      const pending = sessionStorage.getItem('pending_webinar_registration');
      if (pending === 'true' && !ctaConfirmed) {
        sessionStorage.removeItem('pending_webinar_registration');
        fireRegistrationEvent();
      }
    }
    
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

    return () => clearInterval(timer);
  }, [user, ctaConfirmed]);

  return (
    <div className="relative w-full text-gray-900 dark:text-white">
      
      {/* Hero Image Section - Responsive Height */}
      <section className="relative flex flex-col pt-16 sm:pt-20 lg:pt-24">
        {/* Image Container with Responsive Aspect Ratio */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <Image
            src="/images/webinar/FOWebinar.png"
            alt="Family Office Webinar"
            fill
            className="object-contain object-center"
            priority
          />
          {/* Subtle overlay for better readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
        
        {/* CTA Section Below Image - Never Overlaps */}
        <div className="bg-gradient-to-br from-gray-900 to-black py-4 sm:py-2 lg:py-4">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
            <button
              onClick={() => scrollToFinalCta('hero-image-cta')}
              className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-4 sm:px-6 md:px-8 lg:px-12 py-2 sm:py-3 md:py-4 lg:py-5 rounded-full text-xs sm:text-sm md:text-base lg:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Reserve Your Seat
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
          {/* Urgency Badge */}
          <motion.button
            onClick={() => scrollToFinalCta('hero-urgency-badge')}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#1e88e5] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-medium text-xs sm:text-sm mb-6 shadow-lg hover:bg-[#1565c0] transition-all duration-300 cursor-pointer"
          >
            <Timer className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">LIMITED SEATS: Only 50 Family Offices Accepted</span>
            <span className="sm:hidden">LIMITED: 50 Seats Only</span>
          </motion.button>

          <motion.h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light leading-tight mb-4 sm:mb-5 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stop Losing <span className="font-semibold text-[#1e88e5]">$2.3M+</span> Annually to Capital Gains Taxes
          </motion.h1>
          
          <motion.p 
            className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="font-medium text-[#1e88e5]">Limited to 50 family offices only.</span>
            <br />
            Exclusive webinar reveals how elite family offices are eliminating capital gains taxes entirely while generating 15-25% IRR through Opportunity Zone investments
          </motion.p>

          {/* Key Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 max-w-5xl mx-auto"
          >
            {[
              { icon: DollarSign, text: "Defer ALL capital gains taxes until 2026" },
              { icon: TrendingUp, text: "Eliminate taxes on 10+ year appreciation" },
              { icon: Shield, text: "Reduce overall tax burden by 40-60%" }
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
            className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Reserve Your Seat</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm lg:text-base font-light"
          >
            No credit card required • Instant access • Exclusively for family offices
          </motion.p>
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
              Your <span className="font-semibold text-[#1e88e5]">Expert Hosts</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              <span className="font-semibold text-[#1e88e5]">Together</span>, Todd and Jeff will engage in a dynamic conversation, trading perspectives, insider case studies, and practical frameworks that you can bring directly to your investment committee.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
            {/* Dr. Jeff Richmond (Left) */}
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

            {/* Todd Vitzthum (Right) */}
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
                    src="/images/webinar/ToddBio/Todd.png"
                    alt="Todd Vitzthum"
                    width={192}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="text-gray-900 dark:text-white font-semibold">
                  Todd Vitzthum — President of ACARA Management and co-founder of OZListings.com.
                </p>
                <p>
                  A nationally recognized expert in real estate investment and private equity, Todd has over 20 years of executive leadership experience at firms including CBRE, Cushman & Wakefield, and Greystone. Having closed billions in transactions, he's trusted by family offices and institutional sponsors to structure tax-advantaged equity, optimize capital stacks, and source resilient, high-yield projects across the U.S.
                </p>
                
                {/* Career Highlights - Single Row */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-center items-center gap-3 sm:gap-4 lg:gap-6">
                    {/* Greystone */}
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-white rounded-lg p-1 sm:p-2 shadow-sm mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                        <Image
                          src="/images/webinar/ToddBio/Greystone Real Estate Logo.jpeg"
                          alt="Greystone Real Estate Logo"
                          width={40}
                          height={40}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Exec VP</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Greystone</div>
                    </div>
                    
                    {/* Cushman & Wakefield */}
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-white rounded-lg p-1 sm:p-2 shadow-sm mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                        <Image
                          src="/images/webinar/ToddBio/Cushman Wakefield Logo.jpeg"
                          alt="Cushman & Wakefield Logo"
                          width={40}
                          height={40}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Exec MD</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Cushman & Wakefield</div>
                    </div>
                    
                    {/* CBRE */}
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-white rounded-lg p-1 sm:p-2 shadow-sm mx-auto mb-1 sm:mb-2 flex items-center justify-center">
                        <Image
                          src="/images/webinar/ToddBio/CBRE Logo from Todd Vitzthum.jpeg"
                          alt="CBRE Logo"
                          width={40}
                          height={40}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Sr VP</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">CBRE</div>
                    </div>
                  </div>
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
              What You'll Hear in the <span className="font-semibold text-[#1e88e5]">Conversation</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              An exclusive deep-dive into the strategies that elite family offices use to eliminate capital gains taxes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Tax Optimization Strategies",
                description: "How to defer capital gains until Dec 31, 2026 and eliminate taxes on appreciation after 10 years.",
                icon: Calculator,
                highlight: "Defer & Eliminate Taxes"
              },
              {
                title: "Opportunity Zones 1.0 vs 2.0",
                description: "What's changed, what's next, and how family offices can stay ahead.",
                icon: TrendingUp,
                highlight: "Stay Ahead of Changes"
              },
              {
                title: "Implementation Frameworks",
                description: "From due diligence criteria to portfolio allocation strategies and IRS compliance.",
                icon: Target,
                highlight: "Complete Framework"
              },
              {
                title: "Risk Management & Exit Planning",
                description: "Evaluating fund managers, liquidity considerations, and preserving benefits on exit.",
                icon: Shield,
                highlight: "Protect Your Investment"
              },
              {
                title: "Insider Case Studies",
                description: "How top family offices are achieving up to 62.5% higher after-tax returns compared to non-QOF investments.",
                icon: BarChart3,
                highlight: "62.5% Higher Returns",
                featured: true
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group relative ${
                  item.featured ? 'lg:col-span-2 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/10 border-[#1e88e5]/20' : ''
                }`}
              >
                {item.featured && (
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                    Featured Insight
                  </div>
                )}
                
                <div className="flex items-start gap-3 sm:gap-4 lg:gap-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-[#1e88e5]/10 to-[#1565c0]/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:from-[#1e88e5]/20 group-hover:to-[#1565c0]/20 transition-all duration-300">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-[#1e88e5] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 sm:gap-3 mb-2 sm:mb-3 lg:mb-4">
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <div className="inline-flex items-center justify-center text-center bg-[#1e88e5]/10 dark:bg-[#1e88e5]/20 border border-[#1e88e5]/20 dark:border-[#1e88e5]/30 px-3 sm:px-4 lg:px-6 py-1 rounded-full self-start">
                        <span className="font-medium text-[#1e88e5] text-xs sm:text-sm whitespace-nowrap">
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



      {/* Who Should Attend Section - Flexible Viewport */}
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
              Who Should <span className="font-semibold text-[#1e88e5]">Attend</span>
            </h2>
            <div className="w-12 sm:w-16 lg:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6 lg:mb-8"></div>
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4">
              This exclusive session is designed for sophisticated investors managing substantial family wealth
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { 
                icon: Briefcase,
                title: "Family Office Investment Committees", 
                description: "Guiding the financial future of multi-generational wealth." 
              },
              { 
                icon: ChartLine,
                title: "Chief Investment Officers", 
                description: "Maximizing portfolio performance while managing tax efficiency." 
              },
              { 
                icon: UserCheck,
                title: "Tax & Wealth Planning Advisors", 
                description: "Advising UHNW clients on sophisticated tax optimization strategies." 
              },
              { 
                icon: Building,
                title: "Private Wealth Managers", 
                description: "Overseeing $50M+ portfolios where tax efficiency is paramount." 
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
                  <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">{attendee.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-xs sm:text-sm lg:text-base">{attendee.description}</p>
                </motion.div>
            ))}
          </div>
          
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => scrollToFinalCta('who-should-attend-cta')}
              className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 rounded-full font-semibold text-xs sm:text-sm lg:text-base xl:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Reserve My Seat
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
            {/* Urgency Header */}
            <div className="bg-[#1e88e5] text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full font-semibold text-xs sm:text-sm lg:text-base mb-6 inline-block shadow-lg">
              🔥 FINAL CALL: Only 12 Seats Remaining
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              Don't Let Another <span className="font-semibold text-[#1e88e5]">$2.3M</span> Slip Away
            </h2>
            
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto font-light">
              <span className="font-medium text-[#1e88e5]">Limited to 50 family offices only.</span>
              <br />
              Interview‑style power session for family offices with major capital gains exposure—practical tactics, real‑world strategies, and candid insights from two leading experts.
            </p>

            {/* What's Included */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-base sm:text-lg lg:text-xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">What You'll Receive</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  { text: "Complete OZ investment framework", icon: BarChart3 },
                  { text: "Tax optimization calculator", icon: Calculator },
                  { text: "First two chapters of 'The Ultimate Guide to Opportunity Zones' by Jeff Richmond", icon: BookOpen },
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
              className={`bg-gradient-to-r ${ctaConfirmed ? 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' : 'from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1]'} text-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2 sm:py-3 lg:py-4 xl:py-5 rounded-full font-semibold text-sm sm:text-base lg:text-lg xl:text-xl shadow-xl transition-all duration-300 group mb-4`}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{ctaConfirmed ? "You're in!" : 'Claim Your Seat'}</span>
              <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 ml-2 sm:ml-3 inline-block transition-transform ${ctaConfirmed ? '' : 'group-hover:translate-x-2'}`} />
            </motion.button>

            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-xs sm:text-sm lg:text-base font-light">No credit card required • Instant access • Exclusively for family offices</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
      );
  } 