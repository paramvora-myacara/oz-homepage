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
import DramaticCountdown from '../components/DramaticCountdown';

export default function InvestPage() {
  const { navigateWithAuth } = useAuthNavigation();
  const containerRef = useRef(null);
  const marketSectionRef = useRef(null);
  const whyOzSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  // Countdown Target Date State
  const [targetDate, setTargetDate] = useState(null);

  // Check if sections are in view for fade transitions
  const isMarketInView = useInView(marketSectionRef, { once: true, margin: "-100px" });
  const isWhyOzInView = useInView(whyOzSectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // Key for localStorage
    const STORAGE_KEY = 'oz_deadline_timestamp';
    const DURATION_DAYS = 180;
    const DURATION_MS = DURATION_DAYS * 24 * 60 * 60 * 1000;

    // Get stored timestamp or create new one
    let storedTimestamp = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    let finalTimestamp;

    if (!storedTimestamp) {
      finalTimestamp = now + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, finalTimestamp.toString());
    } else {
      finalTimestamp = parseInt(storedTimestamp, 10);
    }
    
    setTargetDate(finalTimestamp);
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
              The marketplace for tax-advantaged investments. Sourcing off-market Opportunity Zone deals for family offices and accredited investors.
            </p>

            {/* Dramatic Clock Section */}
            <div className="mb-10">
              <DramaticCountdown targetDate={targetDate} />
            </div>

             {/* Buttons */}
             <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <motion.button
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/40 relative overflow-hidden group flex items-center justify-center gap-2"
                  onClick={handleExploreOpportunities}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Active Deals
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
                
                <motion.button
                  className="px-8 py-4 bg-white dark:bg-white/10 text-navy dark:text-white border border-gray-200 dark:border-white/20 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-white/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)]"
                  onClick={handleCalculateBenefits}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
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