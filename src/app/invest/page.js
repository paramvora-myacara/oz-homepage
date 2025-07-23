'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import InteractiveConstellation from '../components/Invest/InteractiveConstellation';
import ValuePropCard from '../components/Invest/ValuePropCard';

export default function InvestPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  const handleExploreOpportunities = () => {
    router.push('/listings');
  };

  const handleCalculateBenefits = () => {
    router.push('/tax-calculator');
  };

  const handleViewDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-[#1E293B] dark:text-white overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Interactive Constellation Background */}
        <div className="absolute inset-0 z-0">
          <InteractiveConstellation />
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
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
            onClick={handleViewDashboard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              State of OZ Dashboard
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </div>
      </motion.section>
      {/* Value Props Section */}
      <section className="min-h-screen px-6 flex items-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ValuePropCard
              icon={
                <>
                  <TrendingUp className="w-10 h-10 text-white" />
                  <motion.div
                    className="absolute -top-2 -right-2 text-primary font-bold text-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    %
                  </motion.div>
                </>
              }
              title="Tax Advantages"
              description="Defer capital gains taxes until 2026, reduce them by up to 10%, and pay zero taxes on Opportunity Zone appreciation after 10 years. The most powerful tax incentive in the U.S. tax code."
              ctaText="Calculate Your Benefits"
              onClick={handleCalculateBenefits}
              animationProps={{
                initial: { opacity: 0, y: 50, rotateX: -10 },
                whileInView: { opacity: 1, y: 0, rotateX: 0 },
                viewport: { once: true },
                transition: { duration: 0.6, delay: 0.1 }
              }}
              iconAnimation={{
                whileHover: { rotate: 360 },
                transition:{ duration: 0.8 }
              }}
            />

            <ValuePropCard
              icon={<Shield className="w-10 h-10 text-white" />}
              title="Vetted Opportunities"
              description="Every listing undergoes rigorous due diligence. We verify developer track records, validate financial projections, and ensure QOF compliance. Invest with confidence in pre-screened opportunities."
              ctaText="Browse Listings"
              onClick={handleExploreOpportunities}
              animationProps={{
                initial: { opacity: 0, y: 50 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.6, delay: 0.2 }
              }}
              iconAnimation={{
                animate: { rotate: [0, 10, -10, 0] },
                transition: { duration: 4, repeat: Infinity }
              }}
            />

            <ValuePropCard
              icon={<BarChart3 className="w-10 h-10 text-white" />}
              title="Market Intelligence"
              description="Access the most comprehensive Opportunity Zone data in the industry. Our State of OZ dashboard provides real-time insights, market trends, and thought leadership to inform your investment decisions."
              ctaText="View State of OZ"
              onClick={handleViewDashboard}
              animationProps={{
                initial: { opacity: 0, y: 50, rotateX: 10 },
                whileInView: { opacity: 1, y: 0, rotateX: 0 },
                viewport: { once: true },
                transition: { duration: 0.6, delay: 0.3 }
              }}
              iconAnimation={{
                whileHover: { scale: 1.1 }
              }}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}