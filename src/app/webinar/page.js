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

const handleRegistrationClick = async (source) => {
  await trackUserEvent("webinar_registration_click", {
    source,
    action: "register_for_webinar",
    timestamp: new Date().toISOString(),
  });
  // Direct to Eventbrite registration
  window.open('https://www.eventbrite.com/e/how-family-offices-unlock-tax-free-growth-with-opportunity-zones-strategies-tickets-1721738318659', '_blank');
};

export default function WebinarLandingPage() {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 14,
    minutes: 23,
    seconds: 45
  });

  const scrollToFinalCta = async () => {
    await trackUserEvent("webinar_scroll_to_final_cta", {
      source: "top-urgency-badge",
      action: "scroll_to_final_cta",
      timestamp: new Date().toISOString(),
    });
    const target = document.getElementById('final-cta');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    setIsClient(true);
    
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
  }, []);

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
              onClick={scrollToFinalCta}
              className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-full text-sm sm:text-base md:text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Reserve Your Seat
            </button>
           
          </div>
        </div>
      </section>

      {/* Hero Content Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-4 text-center">
          {/* Urgency Badge */}
          <motion.button
            onClick={scrollToFinalCta}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-[#1e88e5] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium text-sm mb-6 shadow-lg hover:bg-[#1565c0] transition-all duration-300 cursor-pointer"
          >
            <Timer className="w-4 h-4" />
            <span className="hidden sm:inline">LIMITED SEATS: Only 50 Family Offices Accepted</span>
            <span className="sm:hidden">LIMITED: 50 Seats Only</span>
          </motion.button>

          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight mb-4 sm:mb-5 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Stop Losing <span className="font-semibold text-[#1e88e5]">$2.3M+</span> Annually
            <br />
            <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-600 dark:text-gray-300">to Capital Gains Taxes</span>
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Exclusive webinar reveals how elite family offices are <span className="font-medium text-[#1e88e5]">eliminating capital gains taxes entirely</span> while generating 15-25% IRR through Opportunity Zone investments
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
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                <benefit.icon className="w-10 h-10 sm:w-12 sm:h-12 text-[#1e88e5] mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-4 sm:mb-6">Webinar Starts In:</h3>
            <div className="flex justify-center items-center space-x-4 sm:space-x-6">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-3 sm:p-4 shadow-lg mb-2">
                    <span className="text-2xl sm:text-3xl font-bold text-[#1e88e5]">{item.value.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Primary CTA */}
          <motion.button
            onClick={() => handleRegistrationClick('hero')}
            className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full font-semibold text-base sm:text-lg lg:text-xl shadow-xl transition-all duration-300 group mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">Reserve Your Seat</span>
            <span className="sm:hidden">Reserve Your Seat</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 inline-block group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-light"
          >
            No credit card required • Instant access • Exclusively for family offices
          </motion.p>
        </div>
      </section>

      {/* Problem Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white leading-tight">
                  The <span className="font-semibold text-[#1e88e5]">$2.3M Problem</span>
                  <br />
                  Every Family Office Faces
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706]"></div>
              </div>
              
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="text-base sm:text-lg lg:text-xl">
                  <span className="font-semibold text-red-600">The average family office managing $100M+ pays $2.3M annually in unnecessary capital gains taxes.</span>
                </p>
                <p className="text-sm sm:text-base lg:text-lg">
                  While you focus on growing wealth, the IRS quietly claims 20-37% of your gains. That's capital that could be:
                </p>
                <ul className="space-y-3 sm:space-y-4 ml-4 sm:ml-6">
                  {[
                    "Reinvested for exponential compound growth",
                    "Preserved for future generations",
                    "Deployed into higher-return opportunities"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-[#1e88e5] rounded-full mt-3 mr-4 flex-shrink-0"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 sm:p-6 rounded-2xl border-l-4 border-red-500">
                  <p className="text-base sm:text-lg lg:text-xl font-semibold text-red-700 dark:text-red-300">
                    Over 10 years, that's $23M+ in lost wealth.
                  </p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700"
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-center text-gray-900 dark:text-white">Tax Impact Calculator</h3>
              <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                <div className="flex justify-between items-center p-3 sm:p-4 lg:p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl">
                  <span className="font-medium text-xs sm:text-sm lg:text-base">Annual Capital Gains</span>
                  <span className="font-bold text-lg sm:text-2xl lg:text-3xl text-gray-900 dark:text-white">$10M</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 lg:p-6 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800">
                  <span className="font-medium text-xs sm:text-sm lg:text-base">Traditional Tax (23.8%)</span>
                  <span className="font-bold text-lg sm:text-2xl lg:text-3xl text-red-600">-$2.38M</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 lg:p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                  <span className="font-medium text-xs sm:text-sm lg:text-base">With OZ Strategy</span>
                  <span className="font-bold text-lg sm:text-2xl lg:text-3xl text-green-600">$0</span>
                </div>
                <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-3 sm:pt-4 lg:pt-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base sm:text-lg lg:text-xl font-semibold">Annual Savings:</span>
                    <span className="font-bold text-xl sm:text-3xl lg:text-4xl text-[#1e88e5]">$2.38M</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Solution Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
              The <span className="font-semibold text-[#1e88e5]">Opportunity Zone</span> Solution
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#1565c0] mx-auto mb-4 sm:mb-5"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              How elite family offices are using Qualified Opportunity Funds to eliminate capital gains taxes while generating superior returns
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              {
                step: "1",
                title: "Defer Taxes Until 2026",
                description: "Roll capital gains into QOF within 180 days. Pay zero taxes until December 31, 2026.",
                benefit: "Immediate tax relief"
              },
              {
                step: "2", 
                title: "Reduce Tax Burden by 15%",
                description: "Hold QOF investment for 7+ years and reduce original capital gains tax by 15%.",
                benefit: "Permanent tax reduction"
              },
              {
                step: "3",
                title: "Eliminate Future Taxes",
                description: "Hold for 10+ years and pay ZERO taxes on all appreciation within the QOF.",
                benefit: "Tax-free growth forever"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1e88e5] text-white rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{step.description}</p>
                <div className="bg-[#1e88e5]/10 dark:bg-[#1e88e5]/20 border border-[#1e88e5]/20 dark:border-[#1e88e5]/30 p-3 rounded-xl">
                  <span className="font-semibold text-[#1e88e5] flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {step.benefit}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* What You'll Learn Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 sm:p-6 rounded-2xl shadow-xl"
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">What You'll Learn</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl text-left">
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-[#1e88e5]">Tax Optimization Strategies</h4>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <li>• How to defer capital gains taxes until December 31, 2026</li>
                  <li>• Eliminating all taxes on appreciation after 10-year holding periods</li>
                  <li>• Opportunity Zones 1.0 vs 2.0 explained</li>
                </ul>
              </div>
              <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl text-left">
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-[#1e88e5]">Implementation Framework</h4>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <li>• Due diligence criteria for selecting qualified opportunity zone funds</li>
                  <li>• Portfolio allocation strategies for maximum tax efficiency</li>
                  <li>• Compliance requirements and IRS reporting obligations</li>
                </ul>
              </div>
              <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700 rounded-xl text-left">
                <h4 className="text-base sm:text-lg font-semibold mb-3 text-[#1e88e5]">Risk Management</h4>
                <ul className="space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  <li>• Evaluating fund managers and investment structures</li>
                  <li>• Liquidity considerations for family office portfolios</li>
                  <li>• Exit strategies that preserve tax benefits</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who Should Attend Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Who Should <span className="font-semibold text-[#1e88e5]">Attend</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4">
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
                  className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#1e88e5]/10 to-[#d97706]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:from-[#1e88e5]/20 group-hover:to-[#d97706]/20 transition-all duration-300">
                    <attendee.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#1e88e5]" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">{attendee.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-xs sm:text-sm lg:text-base">{attendee.description}</p>
                </motion.div>
            ))}
          </div>
          
          <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
            <motion.button
              onClick={() => handleRegistrationClick('audience')}
              className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Reserve My Seat
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* Expert Guide Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="relative inline-block">
                <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 rounded-3xl overflow-hidden mx-auto lg:mx-0 shadow-2xl">
                  <Image
                    src="/images/Jeff.png"
                    alt="Dr. Jeff Richmond"
                    width={384}
                    height={384}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-3 sm:-bottom-4 lg:-bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-4 sm:px-6 lg:px-8 py-1 sm:py-2 lg:py-3 rounded-full font-semibold text-sm sm:text-lg lg:text-xl shadow-lg">
                  Dr. Jeff Richmond
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-10"
            >
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white leading-tight">
                  Your <span className="font-semibold text-[#1e88e5]">Expert Guide</span>
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706]"></div>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                  Dr. Jeff Richmond has personally guided over <span className="font-semibold text-[#1e88e5]">$500M in Opportunity Zone investments</span> for family offices and high-net-worth individuals. As founder of OZ Listings, he's the go-to expert for sophisticated tax optimization strategies.
                </p>
              </div>

              {/* Credentials */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  { icon: DollarSign, metric: "$500M+", label: "Capital Deployed" },
                  { icon: Users, metric: "1,000+", label: "Investors Served" },
                  { icon: Award, metric: "10+", label: "Years Experience" },
                  { icon: TrendingUp, metric: "22%", label: "Avg. Returns" }
                ].map((item, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-3 sm:p-4 lg:p-6 xl:p-8 rounded-2xl shadow-lg text-center border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#1e88e5] mx-auto mb-2 sm:mb-3 lg:mb-4" />
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">{item.metric}</div>
                    <div className="text-gray-600 dark:text-gray-300 font-light uppercase tracking-wider text-xs sm:text-sm">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Full Viewport */}
      <section id="final-cta" className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full py-8 lg:py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Urgency Header */}
            <div className="bg-[#1e88e5] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base mb-6 inline-block shadow-lg">
              🔥 FINAL CALL: Only 12 Seats Remaining
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-900 dark:text-white mb-6 sm:mb-8 leading-tight">
              Don't Let Another <span className="font-semibold text-[#1e88e5]">$2.3M</span> Slip Away
            </h2>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto font-light">
              This exclusive webinar reveals the exact strategies elite family offices use to eliminate capital gains taxes. 
              <span className="font-medium text-[#1e88e5]"> Limited to 50 family offices only.</span>
            </p>

            {/* What's Included */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-6">What You'll Receive</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { text: "Complete OZ investment framework", icon: BarChart3 },
                  { text: "Tax optimization calculator", icon: Calculator },
                  { text: "First two chapters of 'The Ultimate Guide to Opportunity Zones' by Jeff Richmond", icon: BookOpen },
                  { text: "Lifetime access to recordings", icon: Video }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e88e5] flex-shrink-0 mt-1" />
                    <div className="text-gray-900 dark:text-white font-medium text-sm sm:text-base leading-relaxed text-left">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Countdown */}
            <div className="mb-8">
              <div className="text-gray-900 dark:text-white font-medium mb-4 text-lg sm:text-xl">Webinar starts in:</div>
              <div className="flex justify-center items-center space-x-3 sm:space-x-4">
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Minutes', value: timeLeft.minutes },
                  { label: 'Seconds', value: timeLeft.seconds }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2 sm:p-3 shadow-lg mb-2">
                      <span className="text-xl sm:text-2xl font-bold text-[#1e88e5]">{item.value.toString().padStart(2, '0')}</span>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final CTA */}
            <motion.button
              onClick={() => handleRegistrationClick('final-cta')}
              className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full font-semibold text-base sm:text-lg lg:text-xl shadow-xl transition-all duration-300 group mb-4"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden sm:inline">Claim Your Seat</span>
              <span className="sm:hidden">Claim Your Seat</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-3 inline-block group-hover:translate-x-2 transition-transform" />
            </motion.button>

            <div className="text-gray-500 dark:text-gray-400">
              <p className="text-sm sm:text-base font-light">No credit card required • Instant access • Exclusively for family offices</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
      );
  } 