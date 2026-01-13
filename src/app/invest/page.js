// src/app/invest/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Clock, Calculator } from 'lucide-react';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import InteractiveConstellation from '../components/Invest/InteractiveConstellation';
import DealTeaser from '../components/Invest/DealTeaser';
import ModernKpiDashboard from '../components/ModernKpiDashboard';
import OZInvestmentReasons from '../components/OZInvestmentReasons';
import OZMapVisualization from '../components/OZMapVisualization';
import OZTimeline from '../components/Invest/OZTimeline';

export default function InvestPage() {
  const { navigateWithAuth } = useAuthNavigation();
  const containerRef = useRef(null);
  const marketSectionRef = useRef(null);
  const whyOzSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 180,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Check if sections are in view for fade transitions
  const isMarketInView = useInView(marketSectionRef, { once: true, margin: "-100px" });
  const isWhyOzInView = useInView(whyOzSectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // Key for localStorage
    const STORAGE_KEY = 'oz_deadline_timestamp';
    const DURATION_DAYS = 180;
    const DURATION_MS = DURATION_DAYS * 24 * 60 * 60 * 1000;

    // Get stored timestamp or create new one
    let targetTimestamp = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!targetTimestamp) {
      targetTimestamp = now + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
    } else {
      targetTimestamp = parseInt(targetTimestamp, 10);
    }

    const calculateTimeLeft = () => {
      const currentTime = Date.now();
      const difference = targetTimestamp - currentTime;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track page visit on mount
  useEffect(() => {
    trackUserEvent("viewed_invest_page");
  }, []);

  // Track which section is currently visible using viewport midpoint
  useEffect(() => {
    const sections = [null, marketSectionRef, whyOzSectionRef]; // null for hero section

    const handleScroll = () => {
      const midPoint = window.scrollY + window.innerHeight / 2;
      let activeIndex = 0;

      sections.forEach((ref, idx) => {
        if (!ref) return; // Skip hero section
        const el = ref.current;
        if (!el) return;
        const { offsetTop, offsetHeight } = el;
        if (midPoint >= offsetTop && midPoint < offsetTop + offsetHeight) {
          activeIndex = idx;
        }
      });

      setCurrentSection(activeIndex);
    };

    // Run once to set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleExploreOpportunities = async () => {
    trackUserEvent("invest_page_button_clicked", {
      button: "see_oz_listings"
    });
    navigateWithAuth('/listings');
  };

  const handleCalculateBenefits = async () => {
    trackUserEvent("invest_page_button_clicked", {
      button: "calculate_benefits"
    });
    navigateWithAuth('/tax-calculator');
  };

  return (
    <div ref={containerRef} className="relative min-h-screen text-navy dark:text-white font-sans antialiased">
      {/* BACKGROUND: Fixed Grid */}
      <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0 pointer-events-none"></div>

      {/* Unified Hero Section */}
      <section className="relative z-10 pt-24 md:pt-16 overflow-hidden pb-16 md:pb-24">
        {/* Background Blobs for specific hero atmosphere - Removed Green/Emerald Blob & Moved Blue Blob */}
        
        {/* Unified Content Container */}
        <div className="relative z-10 w-full max-w-5xl px-6 mx-auto flex flex-col items-center text-center mt-0">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-none tracking-tight">
              <span className="text-gray-900 dark:text-white block">Defer Capital Gains.</span>
              <span className="text-primary block">Build Tax-Free Wealth.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
              The marketplace for tax-advantaged real estate. Sourcing off-market Opportunity Zone deals for family offices and accredited investors.
            </p>

            {/* Dramatic Clock Section */}
            <div className="mb-10 w-full max-w-4xl mx-auto relative px-2 sm:px-4">
               <div className="flex justify-center gap-2 sm:gap-6 md:gap-8 mb-6">
                  {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center group">
                      <div className="relative p-3 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/20 border-b-blue-500 dark:border-b-blue-400 shadow-[0_10px_40px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_50px_-5px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-1">
                        <span className="text-3xl sm:text-6xl md:text-7xl font-black text-navy dark:text-white font-mono tracking-tighter drop-shadow-sm select-none">
                          {value.toString().padStart(2, '0')}
                        </span>
                        
                        {/* Decorative gloss effect */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/80 to-transparent pointer-events-none opacity-20"></div>
                        
                        {/* Bottom Glow Line - Intensified */}
                        <div className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-[2px] sm:h-[3px] bg-blue-500 blur-[3px] sm:blur-[4px]"></div>
                      </div>
                      
                      {/* Unit label below */}
                      <span className="mt-2 sm:mt-3 text-[10px] sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 sm:px-3 py-1">
                        {unit}
                      </span>
                    </div>
                  ))}
               </div>
               
               {/* Required Urgency Text */}
               <div className="flex items-center justify-center gap-2 mt-8 px-4 text-center">
                 <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse flex-shrink-0" />
                 <p className="text-xs sm:text-sm md:text-base font-medium text-gray-600 dark:text-gray-300">
                   To qualify for benefits, gains must be reinvested within <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">180 days</span> of sale.
                 </p>
               </div>
            </div>

             {/* Buttons */}
             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <motion.button
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/40 relative overflow-hidden group flex items-center justify-center gap-2"
                  onClick={handleExploreOpportunities}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Active Deals
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 bg-white dark:bg-white/10 text-navy dark:text-white border border-gray-200 dark:border-white/20 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2"
                  onClick={handleCalculateBenefits}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Calculator className="w-5 h-5 text-gray-400" />
                  Calculate Tax Savings
                </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 items-center">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1E88E5" strokeWidth="2">
                    <path d="M5 10L8 13L15 6" />
                </svg>
                $110B+ Market Cap
              </div>
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1E88E5" strokeWidth="2">
                    <path d="M5 10L8 13L15 6" />
                </svg>
                Institutional-Grade Assets
              </div>
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1E88E5" strokeWidth="2">
                    <path d="M5 10L8 13L15 6" />
                </svg>
                Nationwide Access
              </div>
            </div>

          </motion.div>
        
        </div>

      </section>

      {/* 3. Why OZs (Primer) */}
      <section 
        ref={whyOzSectionRef}
        className="relative z-10 min-h-screen py-16 md:py-24"
      >
        <OZInvestmentReasons />
      </section>

      {/* 4. Market Overview (Summary Metrics) */}
      <motion.section 
        ref={marketSectionRef}
        className="relative z-10 min-h-screen py-16 md:py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMarketInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <ModernKpiDashboard />
      </motion.section>

      {/* 5. Deal Teaser / Listings (What We Do) */}
      <div className="relative z-10">
        <DealTeaser />
      </div>

      {/* 6. Interactive Map */}
      <section className="relative z-10 py-16 md:py-24" aria-label="Qualified Opportunity Zone Map">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-navy dark:text-white">Qualified Opportunity Zones Map</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Search by state to find designated Opportunity Zones ("QOZs") and visualize investment activity across the United States.
                </p>
            </div>
            <div className="h-[400px] md:h-[600px] w-full relative">
               <OZMapVisualization />
            </div>
        </div>
      </section>

      {/* 7. Timeline Section */}
      <div className="relative z-10">
        <OZTimeline />
      </div>

    </div>
  );
}