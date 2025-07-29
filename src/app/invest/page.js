'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import InteractiveConstellation from '../components/Invest/InteractiveConstellation';
import ModernKpiDashboard from '../components/ModernKpiDashboard';
import OZInvestmentReasons from '../components/OZInvestmentReasons';

export default function InvestPage() {
  const { navigateWithAuth } = useAuthNavigation();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const handleExploreOpportunities = () => {
    navigateWithAuth('/listings');
  };

  const handleCalculateBenefits = () => {
    navigateWithAuth('/tax-calculator');
  };

  const handleViewDashboard = () => {
    navigateWithAuth('/dashboard');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-[#1E293B] dark:text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-16 md:pt-0">
        {/* Interactive Constellation Background - Independent of scroll animations */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ opacity: heroOpacity }}
        >
          <InteractiveConstellation />
        </motion.div>
        
        {/* Animated Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
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
              Explore Marketplace
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
      </section>
      
      {/* Market Overview Section */}
      <section className="min-h-screen">
        <ModernKpiDashboard />
      </section>

      {/* Section Divider */}
      <div className="relative py-8 mt-4 mb-6">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl px-4">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
            <div className="w-2 h-2 rounded-full bg-black/40 dark:bg-white/40 flex-shrink-0"></div>
            <div className="h-px flex-1 bg-black/20 dark:bg-white/20"></div>
          </div>
        </div>
      </div>

      {/* Why OZ Section */}
      <section className="min-h-screen md:min-h-fit pb-12 md:pb-8">
        <OZInvestmentReasons />
      </section>
    </div>
  );
}