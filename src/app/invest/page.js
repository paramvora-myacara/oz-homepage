// src/app/invest/page.js
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import InteractiveConstellation from '../components/Invest/InteractiveConstellation';
import DealTeaser from '../components/Invest/DealTeaser';
import ModernKpiDashboard from '../components/ModernKpiDashboard';
import OZInvestmentReasons from '../components/OZInvestmentReasons';
import OZMapVisualization from '../components/OZMapVisualization';
import OZTimeline from '../components/Invest/OZTimeline';
import TimelineUrgency from '../components/Invest/TimelineUrgency';

export default function InvestPage() {
  const { navigateWithAuth } = useAuthNavigation();
  const containerRef = useRef(null);
  const marketSectionRef = useRef(null);
  const whyOzSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);

  // Check if sections are in view for fade transitions

  // Check if sections are in view for fade transitions
  const isMarketInView = useInView(marketSectionRef, { once: true, margin: "-100px" });
  const isWhyOzInView = useInView(whyOzSectionRef, { once: true, margin: "-100px" });

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
      {/* BACKGROUND: Grid + Radial Gradient */}
      <div className="fixed inset-0 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center md:pt-16 overflow-hidden pb-10">
        {/* Interactive Constellation Background */}
        <div className="absolute inset-0 z-0">
          {/* <InteractiveConstellation /> */}
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto -mt-16 md:-mt-12">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gray-900 dark:text-white block md:inline">Defer Capital Gains.</span>
            <span className="hidden md:inline"><br /></span>
            <span className="text-primary block md:inline">Build Tax-Free Wealth.</span>
          </motion.h1>
          
          <motion.p
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            The marketplace for tax-advantaged real estate. Sourcing off-market Opportunity Zone deals for family offices and accredited investors.
          </motion.p>
          
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/40 relative overflow-hidden group"
              onClick={handleExploreOpportunities}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Active Deals
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 items-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                $110B+ Market Capitalization
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Institutional-Grade Assets
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                Nationwide Access
              </div>
            </div>
          </motion.div>
        </div>

      </section>

      {/* 2. 180-Day Clock (Investment Window) - MOVED HERE */}
      <div className="relative z-10">
        <TimelineUrgency 
            onCalculate={handleCalculateBenefits}
        />
      </div>
      
      {/* 3. Why OZs (Primer) */}
      <section 
        ref={whyOzSectionRef}
        className="relative z-10 min-h-screen py-12 md:py-20"
      >
        <OZInvestmentReasons />
      </section>

      {/* 4. Market Overview (Summary Metrics) */}
      <motion.section 
        ref={marketSectionRef}
        className="relative z-10 min-h-screen py-12 md:py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMarketInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <ModernKpiDashboard />
      </motion.section>

      {/* 5. Deal Teaser / Listings (What We Do) - MOVED HERE */}
      <div className="relative z-10">
        <DealTeaser />
      </div>

      {/* 6. Interactive Map */}
      <section className="relative z-10 py-12 md:py-20" aria-label="Qualified Opportunity Zone Map">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-navy dark:text-white">Qualified Opportunity Zones Map</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Search by state to find designated Opportunity Zones ("QOZs") and visualize investment activity across the United States.
                </p>
            </div>
            <div className="h-[600px] w-full relative">
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