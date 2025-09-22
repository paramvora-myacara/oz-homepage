"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from '../contexts/ThemeContext';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Building2, 
  TrendingUp, 
  Landmark, 
  Scale, 
  Target,
  CheckCircle,
  Users,
  Building,
  BarChart3
} from 'lucide-react';
import PdfPreviewModal from '../components/PdfPreviewModal';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useAuthModal } from '../contexts/AuthModalContext';

const openInNewTab = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const handleLeadMagnetClick = async (source = "book_landing_page") => {
  await trackUserEvent("book_lead_magnet_click", {
    source,
    action: "download_free_chapter",
    timestamp: new Date().toISOString(),
  });
  // TODO: Open email capture modal or redirect to signup
  console.log("Lead magnet clicked from:", source);
};

const handleSecondaryCtaClick = async (cta) => {
  await trackUserEvent("book_secondary_cta_click", {
    cta,
    timestamp: new Date().toISOString(),
  });
};

export default function BookLandingPage() {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-open the PDF modal after auth redirect if requested
  useEffect(() => {
    if (!isClient || loading) return;
    const params = new URLSearchParams(window.location.search);
    const shouldOpen = params.get('open') === 'pdf';
    if (user && shouldOpen) {
      setPdfModalOpen(true);
      // Clean up the URL
      window.history.replaceState(null, '', '/book');
    }
  }, [isClient, loading, user]);

  const openPdfModal = () => setPdfModalOpen(true);

  const handleGetFreeChapterClick = async (source) => {
    await handleLeadMagnetClick(source);
    if (loading) return;
    if (user) {
      openPdfModal();
    } else {
      openModal({
        title: 'Get Your Free Chapter',
        description: 'Sign in to download your free chapter.',
        redirectTo: '/book?open=pdf',
      });
    }
  };

  return (
    <div className="relative w-full text-gray-900 dark:text-white">
      
      {/* Hero Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-16 sm:pt-20 lg:pt-24">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Book Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="relative bg-white dark:bg-gray-800 p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-center h-[75vw] max-h-[90vh] w-[55vw] max-w-[98vw] min-h-[350px] min-w-[220px] lg:h-[80vh] lg:w-[40vw]">
                  <Image
                    src="/images/book-landing-page/oz-book-ecover-flat.png"
                    alt="The OZ Investor's Guide"
                    width={1500}
                    height={1989}
                    sizes="(max-width: 768px) 98vw, (max-width: 1200px) 55vw, 40vw"
                    className="rounded-2xl shadow-lg object-contain w-full h-full"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 sm:space-y-8"
            >
              <div>
                <motion.h1 
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight mb-4 sm:mb-5 text-gray-900 dark:text-white whitespace-nowrap"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  The{" "}
                  <span className="font-semibold text-[#1e88e5]">
                    OZ Investor's
                  </span>{" "}
                  Guide
                </motion.h1>
                
                <motion.p 
                  className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed max-w-4xl mx-auto font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Protect Your Wealth and Reduce Taxes with <span className="font-medium text-[#1e88e5]">Proven Opportunity Zone Strategies</span>
                </motion.p>

                <motion.p 
                  className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Discover a time-tested yet under-the-radar tax strategy to defer, reduce, and potentially eliminate capital gains taxes while building lasting family wealth.
                </motion.p>

                {/* Key Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8"
                >
                  {[
                    { icon: DollarSign, text: "Proven methods to defer and reduce capital gains taxes legally" },
                    { icon: TrendingUp, text: "Step-by-step framework for evaluating investment opportunities" },
                    { icon: Target, text: "How to avoid costly mistakes that can derail your investment" },
                    { icon: BarChart3, text: "Real-world case studies from successful investors" }
                  ].map((benefit, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group">
                      <benefit.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#1e88e5] mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300" />
                      <p className="text-gray-900 dark:text-white font-medium text-sm sm:text-base leading-relaxed">{benefit.text}</p>
                    </div>
                  ))}
                </motion.div>
                
                {/* Primary CTA */}
                <motion.button
                  onClick={() => handleGetFreeChapterClick('hero_primary_cta')}
                  className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full font-semibold text-base sm:text-lg lg:text-xl shadow-xl transition-all duration-300 group mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Your Free Chapter Now
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-light"
                >
                  No credit card required • Instant access • 100% secure
                </motion.p>
              </div>
            </motion.div>
          </div>
          
          {/* Centered CTA Button below the grid */}
          
        </div>
      </section>

      {/* About the Author Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Meet Your <span className="font-semibold text-[#1e88e5]">Expert Guide</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4">
              The trusted expert who has helped thousands of investors protect and grow their wealth
            </p>
          </motion.div>

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
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                  Dr. Jeff Richmond has personally guided over <span className="font-semibold text-[#1e88e5]">$500M in Opportunity Zone investments</span> for family offices and high-net-worth individuals. As founder of OZ Listings, he's the go-to expert for sophisticated tax optimization strategies.
                </p>
              </div>

              {/* Credentials */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  { icon: DollarSign, metric: "$500M+", label: "Capital Deployed" },
                  { icon: Users, metric: "1,000+", label: "Investors Served" },
                  { icon: Building, metric: "10+", label: "Years Experience" },
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

      {/* Who Is This Book For Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Who Should <span className="font-semibold text-[#1e88e5]">Read This</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4">
              Whether you're planning for retirement or looking to grow your wealth, this guide provides the strategies you need
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: Users,
                title: "Family Office Principal",
                description: "Steward generational wealth and optimize after-tax returns."
              },
              {
                icon: Landmark,
                title: "High Net Worth Individual",
                description: "Preserve and grow assets with sophisticated, tax-smart strategies."
              },
              {
                icon: Building2,
                title: "Real Estate Investor",
                description: "Defer taxes on gains while diversifying into high-growth markets."
              },
              {
                icon: DollarSign,
                title: "Business Owner",
                description: "Minimize taxes on major exits and protect family wealth."
              },
              {
                icon: TrendingUp,
                title: "Pre-Retiree or Retiree",
                description: "Protect your nest egg and create tax-efficient income."
              },
              {
                icon: Scale,
                title: "Professional Advisor",
                description: "Stay current on OZ strategies for high-net-worth clients."
              }
            ].map((persona, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg text-center group hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#1e88e5]/10 to-[#d97706]/10 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 lg:mb-6 group-hover:from-[#1e88e5]/20 group-hover:to-[#d97706]/20 transition-all duration-300">
                  <persona.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-[#1e88e5]" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">{persona.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-light text-xs sm:text-sm lg:text-base">{persona.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Peek Inside Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
              What's <span className="font-semibold text-[#1e88e5]">Inside This Guide</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Here's what you'll discover in this comprehensive 200+ page investment guide
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl lg:col-span-2"
            >
              <h3 className="text-lg sm:text-xl lg:text-2xl font-light text-gray-900 dark:text-white mb-3 text-center">Complete Table of Contents</h3>
              <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center max-h-[45vh] sm:max-h-[50vh] overflow-y-auto w-full transition-all duration-300">
                {[
                  "What Are Opportunity Zones?",
                  "How the OZ Program Works — And Why Almost Everyone Gets It Wrong",
                  "The Tax Benefits, Explained Simply — And Why OZ 2.0 Is Still the Roth IRA for Capital Gains",
                  "OZ 2.0 — The Big, Beautiful Bill That Changed Everything",
                  "Choosing the Right OZ Fund in the 2.0 Era",
                  "Building the Perfect Capital Stack in an OZ Deal",
                  "The Timeline: The OZ Game is Won or Lost in the Margins of the Calendar",
                  "The Power of the QOF/QOZB Structure — Your Engine Inside the OZ Machine",
                  "Mastering the 180-Day Rule — The Clock That Rules Everything",
                  "The Power of the Exit — The 10-Year Rule That Turns Good Deals into Generational Wealth",
                  "The Window is Closing — Why the Smartest Money Moves Early",
                  "Structuring for Maximum Leverage — Building the Machine Before You Hit “Go”",
                  "Capital Stack Mastery — Engineering the Flow of Money",
                  "The Ten-Year Window — Designing for the Long Game",
                  "Designing the Perfect Exit",
                  "Institutional-Grade Operations in an OZ Framework",
                  "Partnerships That Make or Break the Deal",
                  "The Capital Stack Conversation No One Wants to Have",
                  "Investor Alignment Is a Continuous Process",
                  "The Investor Flywheel — The Endgame of Opportunity Zone Mastery",
                  "The Continuity Engine — Building What Outlives You",
                  "The Long Horizon — Wealth, Impact, and the Legacy You Leave Behind",
                  "Bonus Chapter — The OZ Strategist’s Playbook: 17 Moves That Redefine the Game"
                ].map((chapter, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[2.5rem_1fr] items-center text-gray-700 dark:text-gray-300 mb-4 last:mb-0 text-left gap-3"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1e88e5] text-white rounded-lg flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">
                      {index + 1}
                    </div>
                    <span className="text-xs sm:text-sm lg:text-base leading-tight">{chapter}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 flex flex-col"
            >
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 sm:p-4 rounded-2xl shadow-xl">
                <h4 className="text-base sm:text-lg lg:text-xl font-light text-gray-900 dark:text-white mb-3 sm:mb-4 text-center">What You'll Master</h4>
                <div className="space-y-2 sm:space-y-3">
                  {[
                    "How to defer 100% of your capital gains taxes legally",
                    "The exact criteria for qualifying investments", 
                    "Risk assessment frameworks used by professionals",
                    "How to potentially eliminate taxes on gains forever",
                    "Timing strategies to leverage the 180-day rule",
                    "Designing exits that maximize after-tax outcomes",
                    "Capital stack design for optimal leverage and flexibility"
                  ].map((item, index) => (
                    <div key={index} className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-left">
                      <div className="flex items-start">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#1e88e5] flex-shrink-0 mt-1 mr-2" />
                        <span className="text-gray-900 dark:text-white font-medium text-xs sm:text-sm leading-snug">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Removed the button from here */}
            </motion.div>
          </div>

          {/* Centered CTA below TOC and What You'll Master */}
          <div className="mt-4 sm:mt-6 text-center">
            <motion.button
              onClick={() => handleGetFreeChapterClick('peek_inside_cta')}
              className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base lg:text-lg shadow-xl transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Your Free Chapter Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              What Our <span className="font-semibold text-[#1e88e5]">Readers Say</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-light leading-relaxed px-4">
              Join thousands of investors who have successfully protected their wealth with these proven strategies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                quote: "This guide saved me over $200,000 in taxes on my recent business sale. The step-by-step approach made everything clear and actionable. I wish I had found this years ago.",
                name: "Eric B",
                //title: "Business Owner & Real Estate Investor",
                rating: 5
              },
              {
                quote: "As someone nearing retirement, I needed to understand how to protect my investments from taxes. This book provided exactly what I was looking for - clear, practical advice I could implement immediately.",
                name: "Baran V",
                //title: "Retired Financial Advisor",
                rating: 5
              },
              {
                quote: "The case studies were invaluable. Seeing how other successful investors structured their deals gave me the confidence to move forward with my own investment strategy.",
                name: "Karen S",
                //title: "Portfolio Manager",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex mb-4 sm:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 italic leading-relaxed font-light">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">{testimonial.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-light text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Frequently Asked <span className="font-semibold text-[#1e88e5]">Questions</span>
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-[#1e88e5] to-[#d97706] mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
              Everything you need to know before getting started
            </p>
          </motion.div>

          {/* Collapsible FAQ Cards */}
          <FAQSection />
        </div>
      </section>

      {/* Final Call to Action Section - Full Viewport */}
      <section className="relative min-h-screen lg:h-screen flex items-center bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(30, 136, 229, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full py-8 lg:py-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight mb-6 sm:mb-8 text-gray-900 dark:text-white"
          >
            Ready to <span className="font-semibold text-[#1e88e5]">Protect</span> Your Wealth?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto font-light"
          >
            Join our community of successful investors and advisors who use this guide to learn practical, tax-smart strategies for reducing tax burdens and building lasting wealth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto"
          >
            <h3 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white mb-6">Get Your Free Chapter</h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-light">
              Sign in to receive Chapter 1: "What Are Opportunity Zones?" — yours free.
            </p>
            <div className="space-y-6">
              <motion.button
                onClick={() => handleGetFreeChapterClick('final_section_cta')}
                className="w-full bg-gradient-to-r from-[#1e88e5] to-[#1565c0] hover:from-[#1565c0] hover:to-[#0d47a1] text-white px-6 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-5 rounded-full font-semibold text-base sm:text-lg lg:text-xl shadow-xl transition-all duration-300 group"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Free Chapter Now
              </motion.button>
            </div>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-6 font-light">
              No spam. Your information is 100% secure.
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full max-w-md mx-auto mb-8 sm:mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            <span className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 px-3">or explore</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          </div>

          {/* Secondary CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl mx-auto">
            <motion.a
              href="/community"
              onClick={() => handleSecondaryCtaClick("community")}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e88e5]" />
                <span className="text-sm sm:text-base lg:text-lg">Join Community</span>
              </span>
            </motion.a>

            <motion.a
              href="/listings"
              onClick={() => handleSecondaryCtaClick("listings")}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <Building className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e88e5]" />
                <span className="text-sm sm:text-base lg:text-lg">View Listings</span>
              </span>
            </motion.a>

            <motion.a
              href="/invest"
              onClick={() => handleSecondaryCtaClick("invest")}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-6 sm:px-8 py-4 sm:py-6 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e88e5]" />
                <span className="text-sm sm:text-base lg:text-lg">Start Investing</span>
              </span>
            </motion.a>
          </div>
        </div>
      </section>
      <PdfPreviewModal open={pdfModalOpen} onClose={() => setPdfModalOpen(false)} amazonLink={"https://a.co/d/1wywOI9"} />
    </div>
  );
} 

function FAQSection() {
  const faqs = [
    {
      question: "Is this guide suitable for beginners?",
      answer:
        "Absolutely. This guide is designed for both newcomers and experienced investors. We start with the fundamentals and progress to advanced strategies, ensuring everyone can understand and apply these concepts regardless of their current knowledge level.",
    },
    {
      question: "Is this information current with today's tax laws?",
      answer:
        "Yes, this guide reflects the latest regulations and IRS guidance as of 2025. We also provide updates to our readers when significant changes occur in tax law or regulations that might affect their investment strategies.",
    },
    {
      question: "Do I need a large amount of money to get started?",
      answer:
        "While Opportunity Zone investments typically require substantial capital (often $500,000 minimum), the strategies in this book can help you plan and prepare regardless of your current investment size. Many concepts apply to investors at various levels.",
    },
    {
      question: "What support do I get after downloading the guide?",
      answer:
        "You'll get access to our exclusive community of investors, regular updates on new opportunities, and notifications about regulatory changes. We're committed to your long-term success, not just providing information.",
    },
  ];
  const [openIndexes, setOpenIndexes] = useState(Array(faqs.length).fill(false));

  const toggleIndex = (idx) => {
    setOpenIndexes((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="bg-white dark:bg-gray-800 p-0 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-lg"
        >
          <button
            className="w-full text-left px-6 sm:px-8 lg:px-10 py-6 sm:py-8 focus:outline-none flex items-center justify-between group"
            onClick={() => toggleIndex(index)}
            aria-expanded={openIndexes[index]}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-0">
              {faq.question}
            </span>
            <span
              className={`ml-4 sm:ml-6 transform transition-transform duration-300 text-2xl sm:text-3xl text-[#1e88e5] group-hover:text-[#1565c0] ${openIndexes[index] ? 'rotate-45' : 'rotate-0'}`}
              aria-hidden="true"
            >
              +
            </span>
          </button>
          <motion.div
            id={`faq-answer-${index}`}
            initial={false}
            animate={{ height: openIndexes[index] ? 'auto' : 0, opacity: openIndexes[index] ? 1 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {openIndexes[index] && (
              <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                {faq.answer}
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
} 