'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import InteractiveConstellation from '../components/Invest/InteractiveConstellation';
import ModernKpiDashboard from '../components/ModernKpiDashboard';
import OZInvestmentReasons from '../components/OZInvestmentReasons';
import ClickableScrollIndicator from '../components/ClickableScrollIndicator';

export default function InvestPage() {
  const { navigateWithAuth } = useAuthNavigation();
  const containerRef = useRef(null);
  const marketSectionRef = useRef(null);
  const whyOzSectionRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

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
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-[#1E293B] dark:text-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center md:pt-20 overflow-hidden">
        {/* Interactive Constellation Background - Independent of scroll animations */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity }}
        >
          <InteractiveConstellation />
        </motion.div>
        
        {/* Animated Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto -mt-20 md:-mt-24"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Invest
            </motion.span>{' '}
            <motion.span
              className="text-primary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              With Impact
            </motion.span>
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Discover tax-advantaged OZ opportunities nationwide
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/40 relative overflow-hidden group"
            onClick={handleExploreOpportunities}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              See OZ Listings
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </motion.div>
        {/* Scroll Indicator - positioned in center of left panel */}
        <div 
          className="absolute bottom-20 z-10"
          style={{ 
            left: '50%',
            transform: 'translateX(calc(-50% - 17.5%))'
          }}
        >
          <div className="lg:hidden">
            <ClickableScrollIndicator position="absolute" targetRef={marketSectionRef} />
          </div>
        </div>
        <div 
          className="absolute bottom-20 z-10 hidden lg:block"
          style={{ 
            left: '50%',
            transform: 'translateX(calc(-50% - 12.5%))'
          }}
        >
          <ClickableScrollIndicator position="absolute" targetRef={marketSectionRef} />
        </div>
      </section>
      
      {/* Market Overview Section */}
      <motion.section 
        ref={marketSectionRef}
        className="h-screen py-4 md:py-6 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isMarketInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <ModernKpiDashboard />
      </motion.section>

      {/* Section Divider */}
      <div className="relative py-4 md:py-6">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-black/40 dark:bg-white/40 flex-shrink-0"></div>
            <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Why OZ Section */}
      <motion.section 
        ref={whyOzSectionRef}
        className="min-h-screen pt-6 md:pt-8 pb-12 md:pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: isWhyOzInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <OZInvestmentReasons />
      </motion.section>
    </div>
  );
}