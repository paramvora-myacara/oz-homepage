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
  Building
} from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useAuthModal } from '../contexts/AuthModalContext';
import InvestmentComparisonChart from '../components/InvestmentComparisonChart';

const handleRegistrationClick = async (source) => {
  await trackUserEvent("webinar_registration_click", {
    source,
    action: "register_for_webinar",
    timestamp: new Date().toISOString(),
  });
  console.log("Webinar registration clicked from:", source);
  // This is where the registration logic will go
};

export default function WebinarLandingPage() {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRegisterClick = async (source) => {
    await handleRegistrationClick(source);
    if (loading) return;
    if (user) {
      // Logic for already signed-in user
      alert("Registration successful!");
    } else {
      openModal({
        title: 'Register for the Webinar',
        description: 'Sign in to reserve your spot.',
        redirectTo: '/webinar',
      });
    }
  };

  return (
    <div className="relative w-full text-[#212C38] transition-colors duration-300 dark:text-white">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden pt-8">
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col items-center text-center">
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              <div>
                <motion.h1 
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  How Family Offices Unlock Tax-Free Growth through{" "}
                  <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
                    Opportunity Zones
                  </span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 dark:text-gray-300 mb-4 leading-relaxed max-w-6xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  Are you certain your family office is capturing every possible tax advantage—or are hidden opportunities quietly slipping away? Capital gains can be an anchor, limiting your flexibility and draining wealth through taxes. For family offices with large portfolios, every missed strategy compounds over time—eroding not just wealth, but also the legacy you're building for future generations.
                </motion.p>
                
                <motion.p 
                  className="text-xl text-gray-600 dark:text-gray-300 mb-4 leading-relaxed max-w-6xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  This exclusive webinar reveals how <strong>Qualified Opportunity Funds (QOFs)</strong> can help you <strong>defer capital gains taxes until 2026</strong>, <strong>eliminate taxes on future appreciation after 10 years</strong>, and <strong>optimize portfolios for both impact and returns</strong>. You'll gain clarity, strategies, and a proven framework for making Opportunity Zone investing work for your family office.
                </motion.p>
              </div>
            </motion.div>

            {/* Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center w-full mt-2"
            >
              <div className="relative w-full max-w-5xl h-[32rem] bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center">
                <Image
                  src="/images/webinar/FOWebinar.png"
                  alt="Webinar promotional image"
                  fill
                  className="rounded-2xl object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why This Matters Now Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 py-8 md:py-12 flex items-center justify-center min-h-[80vh] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                    Why This Matters Now
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-6xl mx-auto leading-relaxed">
                    Every investment shapes the story your family office leaves behind. Opportunity Zones create a path to preserve wealth for future generations while funding projects that strengthen communities. By reinvesting capital gains into a Qualified Opportunity Fund, you unlock tax-free growth for a full decade, realize as much as 62.5% higher after-tax returns compared to non-QOF investments, and align your financial legacy with lasting social impact. This is more than strategy—it's stewardship of both wealth and values.
                </p>
            </motion.div>
            <div className="w-full">
              <div className="relative w-full max-w-3xl bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center mx-auto">
                <Image
                  src="/images/webinar/TaxCalc.png"
                  alt="Tax Calculator"
                  width={2664}
                  height={1640}
                  className="rounded-2xl w-full h-auto"
                />
              </div>
            </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-black py-12 md:py-16 overflow-hidden">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-blue-300 dark:text-blue-700"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 rounded-full mix-blend-multiply filter blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600 rounded-full mix-blend-multiply filter blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                    What You'll Learn
                </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Tax Optimization Strategies",
                  points: [
                    "How to defer capital gains taxes until December 31, 2026",
                    "Eliminating all taxes on appreciation after 10-year holding periods",
                    "Opportunity Zones 1.0 vs 2.0 explained"
                  ]
                },
                {
                  title: "Implementation Framework",
                  points: [
                    "Due diligence criteria for selecting qualified opportunity zone funds",
                    "Portfolio allocation strategies for maximum tax efficiency",
                    "Compliance requirements and IRS reporting obligations"
                  ]
                },
                {
                  title: "Risk Management",
                  points: [
                    "Evaluating fund managers and investment structures",
                    "Liquidity considerations for family office portfolios",
                    "Exit strategies that preserve tax benefits"
                  ]
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{item.title}</h3>
                  <ul className="space-y-4">
                    {item.points.map((point, i) => (
                      <li key={i} className="flex items-start text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <motion.button
                onClick={() => {
                  const finalSection = document.getElementById('final-cta-section');
                  finalSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl overflow-hidden transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Unlock Your Tax-Free Growth
              </motion.button>
            </div>
        </div>
      </section>

      {/* Who Should Attend Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-800 py-12 md:py-16 overflow-hidden">
        {/* Floating Elements Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/40 dark:bg-blue-700/20 rounded-full animate-float"></div>
          <div className="absolute top-60 right-20 w-24 h-24 bg-indigo-200/40 dark:bg-indigo-700/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-purple-200/40 dark:bg-purple-700/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-200/40 dark:bg-pink-700/20 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
          
          {/* Subtle lines */}
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-300/30 dark:via-blue-600/20 to-transparent"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-300/30 dark:via-indigo-600/20 to-transparent"></div>
        </div>
        
        <div className="max-w-6xl mx-auto p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
                    Who Should Attend
                </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: "Family office investment committees", description: "For those guiding the financial future of family legacies." },
                { title: "Chief investment officers", description: "Tasked with maximizing portfolio performance and managing risk." },
                { title: "Tax and wealth planning advisors", description: "Advising high-net-worth clients on sophisticated tax-saving strategies." },
                { title: "Private wealth managers overseeing $50M+ portfolios", description: "Managing substantial assets where tax efficiency is paramount." }
              ].map((attendee, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800/60 p-8 rounded-2xl shadow-lg text-center flex flex-col"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 min-h-[7rem] flex items-center justify-center">{attendee.title}</h3>
                  </div>
                  <div className="flex-grow flex items-center">
                    <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">{attendee.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <motion.button
                onClick={() => {
                  const finalSection = document.getElementById('final-cta-section');
                  finalSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl overflow-hidden transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Save My Spot
              </motion.button>
            </div>
        </div>
      </section>

      {/* Why You Can't Afford to Miss Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-slate-100 to-blue-50 dark:from-gray-800 dark:via-slate-900 dark:to-gray-900 py-12 md:py-16 overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/6 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-indigo-500/30 dark:from-blue-600/20 dark:to-indigo-700/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-blue-500/30 dark:from-purple-600/20 dark:to-blue-700/20 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          
          {/* Subtle geometric shapes */}
          <div className="absolute top-40 right-40 w-16 h-16 border border-blue-300/40 dark:border-blue-600/30 rotate-45 animate-spin-slow"></div>
          <div className="absolute bottom-60 left-40 w-12 h-12 border border-indigo-300/40 dark:border-indigo-600/30 rotate-12 animate-bounce-slow"></div>
          <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-blue-400/30 dark:bg-blue-600/20 rounded-full animate-ping"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              Why You Can't Afford to Miss
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-6xl mx-auto leading-relaxed mb-8 text-left">
              This is not a generic tax webinar—it's an exclusive, power session designed for family offices facing substantial capital gains exposure. Rather than focusing on generic advice, this session dives into practical, real-world applications that directly impact portfolio performance. You'll walk away with a deeper understanding of how advanced Opportunity Zone strategies can unlock powerful advantages that traditional approaches often overlook.
            </p>
            <div className="text-left max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Here's what you can expect to gain:</h3>
              <ul className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Clarity on tax strategy:</strong> Learn how new Opportunity Zone structures are being leveraged to significantly reduce capital gains burdens.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Evidence-based insights:</strong> Review insider case studies showing how family offices are achieving up to <strong>62.5% higher after-tax returns</strong> compared to similar non-QOF investments.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Practical applications:</strong> Discover frameworks and structures you can bring back to your investment committee, tax team, or advisors for immediate evaluation.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <span><strong>Big-picture perspective:</strong> Understand how these strategies fit into a broader wealth planning approach designed to preserve capital, enhance returns, and build long-term impact.</span>
                </li>
              </ul>
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Take Action—Secure Your Advantage</h3>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Don't let another tax year slip by without taking advantage of these powerful strategies. This is your chance to join a select group of forward-thinking family offices who refuse to leave money on the table.
              </p>
              <motion.button
                onClick={() => {
                  const finalSection = document.getElementById('final-cta-section');
                  finalSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-12 py-4 rounded-full font-bold text-xl shadow-xl overflow-hidden transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Secure Your Family Office's Future
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Speaker Section Placeholder */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-white via-blue-50/50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-800 py-12 md:py-16 overflow-hidden">
        {/* Elegant background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 via-transparent to-indigo-100/20 dark:from-blue-900/10 dark:via-transparent dark:to-indigo-900/10"></div>
          
          {/* Subtle radial gradients */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-radial-gradient from-blue-200/30 to-transparent dark:from-blue-800/20 dark:to-transparent rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-radial-gradient from-indigo-200/30 to-transparent dark:from-indigo-800/20 dark:to-transparent rounded-full"></div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/3 left-10 w-2 h-32 bg-gradient-to-b from-blue-400/40 to-transparent dark:from-blue-600/30 dark:to-transparent rotate-12"></div>
          <div className="absolute bottom-1/3 right-10 w-2 h-40 bg-gradient-to-b from-indigo-400/40 to-transparent dark:from-indigo-600/30 dark:to-transparent -rotate-12"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-8">
              About the Speaker
            </h2>
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

      {/* Reserve Your Spot Section */}
      <section id="final-cta-section" className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-blue-900/20 dark:to-gray-900 py-8 md:py-12 overflow-hidden">
        {/* Final section dramatic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-indigo-100/30 to-purple-100/40 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-purple-900/20"></div>
          
          {/* Large background elements */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-400/20 dark:from-blue-700/15 dark:to-indigo-800/15 rounded-full filter blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-gradient-to-br from-indigo-300/20 to-purple-400/20 dark:from-indigo-700/15 dark:to-purple-800/15 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-200/10 to-indigo-300/10 dark:from-blue-800/10 dark:to-indigo-900/10 rounded-full filter blur-3xl"></div>
          
          {/* Sparkle effects */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 dark:bg-blue-300 rounded-full animate-twinkle"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-purple-400 dark:bg-purple-300 rounded-full animate-twinkle" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="w-full px-4 sm:px-6 text-center flex flex-col justify-center h-full relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
                Reserve Your Spot
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed mb-6 md:mb-8">
                Don't let another tax year slip by without taking advantage of these powerful strategies. This is your chance to join a select group of forward-thinking family offices who refuse to leave money on the table.
            </p>
            <div className="w-full mb-6 md:mb-8">
              <div className="relative w-full h-[25rem] sm:h-[30rem] md:h-[35rem] lg:h-[40rem] bg-gray-200 dark:bg-gray-800 rounded-2xl shadow-2xl flex items-center justify-center">
                <Image
                  src="/images/webinar/FOWebinar.png"
                  alt="Webinar promotional image"
                  fill
                  className="rounded-2xl object-cover"
                />
              </div>
            </div>
            <motion.button
                onClick={() => window.open('https://www.eventbrite.com/e/how-family-offices-unlock-tax-free-growth-with-opportunity-zones-strategies-tickets-1721738318659', '_blank')}
                className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl shadow-xl overflow-hidden transition-all duration-300 mx-auto max-w-fit"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
            >
                Register today and gain the strategies that could redefine your family office's legacy.
            </motion.button>
        </div>
      </section>
    </div>
  );
} 