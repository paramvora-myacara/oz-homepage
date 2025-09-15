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
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const gold = resolvedTheme === 'dark' ? "#FFD700" : "#D4AF37";
  const blue = "#1e88e5";
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
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
    <div className="relative w-full bg-white text-[#212C38] transition-colors duration-300 dark:bg-black dark:text-white">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden pt-8">
        
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 50%, ${blue}40 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, ${gold}30 0%, transparent 50%),
                radial-gradient(circle at 40% 80%, ${blue}20 0%, transparent 50%)
              `,
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Gold Floating Particles */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => {
              // Generate consistent random values based on index
              const seed1 = (i * 9301 + 49297) % 233280;
              const seed2 = (i * 1301 + 9297) % 133280;
              const seed3 = (i * 7301 + 19297) % 183280;
              const seed4 = (i * 5301 + 29297) % 223280;
              
              const rnd1 = seed1 / 233280;
              const rnd2 = seed2 / 133280;
              const rnd3 = seed3 / 183280;
              const rnd4 = seed4 / 223280;
              
              const size = rnd1 * 4 + 2;
              const startX = rnd2 * dimensions.width;
              const startY = rnd3 * dimensions.height;
              const endX = rnd4 * dimensions.width;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{ 
                    width: size,
                    height: size,
                    backgroundColor: gold,
                    filter: 'blur(0.5px)',
                  }}
                  initial={{
                    x: startX,
                    y: startY,
                    opacity: 0,
                  }}
                  animate={{
                    x: endX,
                    y: [
                      startY,
                      startY - 100,
                      startY,
                    ],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 10 + rnd1 * 20,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Book Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: resolvedTheme === 'dark' ? [0.3, 0.2, 0.3] : [0.15, 0.1, 0.15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative bg-white dark:bg-gray-800 p-2 sm:p-6 md:p-8 rounded-2xl shadow-2xl flex items-center justify-center h-[75vw] max-h-[90vh] w-[55vw] max-w-[98vw] min-h-[350px] min-w-[220px] lg:h-[80vh] lg:w-[40vw]">
                  <Image
                    src="/images/NewBookCover.jpg"
                    alt="The OZ Investor's Guide"
                    width={0}
                    height={0}
                    sizes="(max-width: 768px) 98vw, (max-width: 1200px) 55vw, 40vw"
                    className="rounded-lg shadow-lg object-contain w-full h-full"
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
              className="space-y-10"
            >
              <div>
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  The{" "}
                  <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
                    OZ Investor's
                  </span>{" "}
                  Guide
                </motion.h1>
                
                <motion.p 
                  className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  Protect Your Wealth and Reduce Taxes with Proven Opportunity Zone Strategies
                </motion.p>

                <motion.p 
                  className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Discover a time-tested yet under-the-radar tax strategy—known mostly to savvy real estate investors—to defer, reduce, and potentially eliminate capital gains taxes while building lasting family wealth.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="space-y-6 mb-10"
                >
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">Proven methods to defer and reduce capital gains taxes legally</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">Step-by-step framework for evaluating investment opportunities</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">How to avoid costly mistakes that can derail your investment</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-4">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg">Real-world case studies from successful investors</span>
                  </div>
                </motion.div>
                
                <div className="mt-8">
                  <motion.button
                    onClick={() => handleGetFreeChapterClick('hero_primary_cta')}
                    className="group relative bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl overflow-hidden transition-all duration-300"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Get Your Free Chapter Now
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-2xl"
                      >
                        →
                      </motion.span>
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#1565c0] to-[#0d47a1]"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Centered CTA Button below the grid */}
          
        </div>
      </section>

      {/* About the Author Section */}
      <section className="relative min-h-screen flex items-center bg-white dark:bg-gray-900 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              About the Author
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-none mx-auto leading-relaxed lg:whitespace-nowrap">
              Meet the trusted expert who has helped thousands of investors protect and grow their wealth
            </p>
          </motion.div>

                        <div className="grid lg:grid-cols-[46%_54%] xl:grid-cols-[42%_58%] gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center md:justify-start md:-ml-12 lg:-ml-24"
            >
              <div className="relative">
                <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full overflow-hidden">
                  <Image
                    src="/images/Jeff.png"
                    alt="Author Photo"
                    width={768}
                    height={768}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="w-full flex justify-center mt-8">
                  <span className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 shadow-md text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white text-center border border-blue-200 dark:border-blue-700">Dr Jeff Richmond</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-8 lg:max-w-[44rem] xl:max-w-[50rem]"
            >
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white lg:whitespace-nowrap">
                Your Trusted Guide to Smart Investing
              </h3>
              <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                With over a decade of experience helping investors navigate complex tax strategies, our author understands the challenges facing today's wealth builders. As the founder of OZ Listings, the premier platform for Opportunity Zone investments, they have personally guided over $500 million in qualified investments.
              </p>
              <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Their mission is simple: to help successful professionals and business owners like you keep more of what you've earned while building a secure financial future for your family.
              </p>
              <div className="flex flex-wrap gap-6 pt-6 lg:flex-nowrap">
                <div className="inline-flex items-center justify-center text-center bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full">
                  <span className="block text-center leading-snug text-blue-800 dark:text-blue-200 font-semibold text-base md:text-lg">$500M+ Invested</span>
                </div>
                <div className="inline-flex items-center justify-center text-center bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full">
                  <span className="block text-center leading-snug text-green-800 dark:text-green-200 font-semibold text-base md:text-lg">1,000+ Investors Served</span>
                </div>
                <div className="inline-flex items-center justify-center text-center bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-full">
                  <span className="block text-center leading-snug text-purple-800 dark:text-purple-200 font-semibold text-base md:text-lg">10+ Years Experience</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who Is This Book For Section */}
      <section className="relative min-h-screen flex items-center bg-gray-50 dark:bg-gray-800 py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Who It's For
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Whether you're planning for retirement or looking to grow your wealth, this guide provides the strategies you need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                className="bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <persona.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{persona.title}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{persona.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Peek Inside Section */}
      <section className="relative min-h-screen flex items-center bg-white dark:bg-gray-900 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              What's Inside This Guide
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Here's what you'll discover in this comprehensive 200+ page investment guide
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className=" rounded-xl lg:col-span-2"
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Complete Table of Contents</h3>
              <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-none text-center max-h-[60vh] sm:max-h-[60vh] overflow-y-auto w-full transition-all duration-300">
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
                    className="grid grid-cols-[3rem_1fr] items-center text-gray-700 dark:text-gray-300 mb-6 last:mb-0 text-left gap-4"
                  >
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shadow">
                      {index + 1}
                    </div>
                    <span className="text-xl">{chapter}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 flex flex-col"
            >
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 pt-8 rounded-xl border border-blue-200 dark:border-blue-700">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  <span className="inline-flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    What You'll Master
                  </span>
                </h4>
                <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-xl">How to defer 100% of your capital gains taxes legally</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-xl">The exact criteria for qualifying investments</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-xl">Risk assessment frameworks used by professionals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-xl">How to potentially eliminate taxes on gains forever</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-xl">Timing strategies to leverage the 180-day rule</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-xl">Designing exits that maximize after-tax outcomes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl">•</span>
                    <span className="text-xl">Capital stack design for optimal leverage and flexibility</span>
                  </li>
                </ul>
              </div>

              {/* Removed the button from here */}
            </motion.div>
          </div>

          {/* Centered CTA below TOC and What You'll Master */}
          <div className="mt-2 flex justify-center">
            <motion.button
              onClick={() => handleGetFreeChapterClick('peek_inside_cta')}
              className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-10 py-5 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Your Free Chapter Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials Section */}
      <section className="relative py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              What Our Readers Say
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Join thousands of investors who have successfully protected their wealth with these proven strategies
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10">
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
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-900 p-10 rounded-xl shadow-lg"
              >
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{testimonial.name}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Everything you need to know before getting started
            </p>
          </motion.div>

          {/* Collapsible FAQ Cards */}
          <FAQSection />
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="relative py-24 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 40%, ${blue}40 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, ${gold}30 0%, transparent 50%)
              `,
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8"
          >
            Ready to{" "}
            <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
              Protect
            </span>{" "}
            Your Wealth?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto"
          >
            Join our community of successful investors and advisors who use this guide to learn practical, tax-smart strategies for reducing tax burdens and building lasting wealth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-2xl max-w-2xl mx-auto mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Get Your Free Chapter</h3>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Sign in to receive Chapter 1: "What Are Opportunity Zones?" — yours free.
            </p>
            <div className="space-y-6">
              <motion.button
                onClick={() => handleGetFreeChapterClick('final_section_cta')}
                className="w-full bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-10 py-5 rounded-lg font-bold text-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Download Free Chapter Now
              </motion.button>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-6">
              No spam. Your information is 100% secure.
            </p>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full max-w-md mx-auto mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400 px-3">or explore</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
          </div>

          {/* Secondary CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
            <motion.a
              href="/community"
              onClick={() => handleSecondaryCtaClick("community")}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-6 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Users className="w-6 h-6 text-[#1e88e5]" />
                <span className="text-lg">Join Community</span>
              </span>
            </motion.a>

            <motion.a
              href="/listings"
              onClick={() => handleSecondaryCtaClick("listings")}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-6 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                <Building className="w-6 h-6 text-[#1e88e5]" />
                <span className="text-lg">View Listings</span>
              </span>
            </motion.a>

            <motion.a
              href="/invest"
              onClick={() => handleSecondaryCtaClick("invest")}
              className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-6 rounded-xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-3">
                <BarChart3 className="w-6 h-6 text-[#1e88e5]" />
                <span className="text-lg">Start Investing</span>
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
          className="bg-gray-50 dark:bg-gray-800 p-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <button
            className="w-full text-left px-10 py-8 focus:outline-none flex items-center justify-between group"
            onClick={() => toggleIndex(index)}
            aria-expanded={openIndexes[index]}
            aria-controls={`faq-answer-${index}`}
          >
            <span className="text-2xl font-bold text-gray-900 dark:text-white mb-0">
              {faq.question}
            </span>
            <span
              className={`ml-6 transform transition-transform duration-300 text-3xl text-blue-500 group-hover:text-blue-700 ${openIndexes[index] ? 'rotate-45' : 'rotate-0'}`}
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
              <div className="px-10 pb-8 text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                {faq.answer}
              </div>
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
} 