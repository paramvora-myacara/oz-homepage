'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TrendingUp, Shield, BarChart3, ArrowRight, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InvestPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  useEffect(() => {
    // Mouse tracking for interactive effects
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const handleExploreOpportunities = () => {
    router.push('/listings');
  };
  const handleCalculateBenefits = () => {
    router.push('/calculator');
  };
  const handleViewDashboard = () => {
    router.push('/state-of-oz');
  };
  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-[#1E293B] dark:text-white overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated Gradient Mesh Background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 20% 50%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 50%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 50%, rgba(217, 119, 6, 0.2) 0%, transparent 50%)',
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        {/* 3D Globe with OZ Locations */}
        <motion.div
          ref={globeRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2 }}
        >
          <motion.div
            className="relative w-96 h-96"
            animate={{ rotateY: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="w-full h-full text-[#D97706] dark:text-[#FBBF24]" />
            {/* Glowing OZ dots */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#D97706] dark:bg-[#FBBF24] rounded-full"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        </motion.div>
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
              className="text-[#D97706] dark:text-[#FBBF24]"
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
            Discover tax-advantaged opportunities nationwide
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-[#D97706] dark:bg-[#FBBF24] text-white dark:text-black rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            onClick={handleExploreOpportunities}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Explore Opportunities
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
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Tax Advantages */}
            <motion.div
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 50, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/10 to-transparent dark:from-[#FBBF24]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                className="w-16 h-16 mb-6 bg-[#D97706] dark:bg-[#FBBF24] rounded-full flex items-center justify-center relative"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <TrendingUp className="w-8 h-8 text-white dark:text-black" />
                <motion.div
                  className="absolute -top-2 -right-2 text-[#D97706] dark:text-[#FBBF24] font-bold text-sm"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  %
                </motion.div>
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Tax Advantages</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Defer capital gains taxes until 2026, reduce them by up to 10%, and pay zero taxes on Opportunity Zone appreciation after 10 years. The most powerful tax incentive in the U.S. tax code.
              </p>
              <motion.button
                className="text-[#D97706] dark:text-[#FBBF24] font-semibold hover:gap-4 gap-2 transition-all duration-300 flex items-center"
                onClick={handleCalculateBenefits}
                whileHover={{ x: 5 }}
              >
                Calculate Your Benefits <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
            {/* Vetted Opportunities */}
            <motion.div
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={handleExploreOpportunities}
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/10 to-transparent dark:from-[#FBBF24]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                className="w-16 h-16 mb-6 bg-[#D97706] dark:bg-[#FBBF24] rounded-full flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Shield className="w-8 h-8 text-white dark:text-black" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Vetted Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Every listing undergoes rigorous due diligence. We verify developer track records, validate financial projections, and ensure QOF compliance. Invest with confidence in pre-screened opportunities.
              </p>
              <div className="flex items-center text-[#D97706] dark:text-[#FBBF24] font-semibold group-hover:gap-4 gap-2 transition-all duration-300">
                Browse Listings <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>
            {/* State of OZ Dashboard */}
            <motion.div
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 50, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D97706]/10 to-transparent dark:from-[#FBBF24]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                className="w-16 h-16 mb-6 bg-[#D97706] dark:bg-[#FBBF24] rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <BarChart3 className="w-8 h-8 text-white dark:text-black" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">Market Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Access the most comprehensive Opportunity Zone data in the industry. Our State of OZ dashboard provides real-time insights, market trends, and thought leadership to inform your investment decisions.
              </p>
              <motion.button
                className="text-[#D97706] dark:text-[#FBBF24] font-semibold hover:gap-4 gap-2 transition-all duration-300 flex items-center"
                onClick={handleViewDashboard}
                whileHover={{ x: 5 }}
              >
                View State of OZ <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Building{' '}
            <span className="text-[#D97706] dark:text-[#FBBF24]">Wealth</span>{' '}
            While Making{' '}
            <span className="text-[#D97706] dark:text-[#FBBF24]">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of investors transforming communities through Opportunity Zone investments
          </p>
          <motion.button
            className="px-8 py-4 bg-[#D97706] dark:bg-[#FBBF24] text-white dark:text-black rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group"
            onClick={handleExploreOpportunities}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Explore Investment Opportunities</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}