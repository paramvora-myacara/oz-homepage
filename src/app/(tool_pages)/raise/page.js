'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Target, ArrowRight, Sparkles, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import { useAuthNavigation } from '../../../lib/auth/useAuthNavigation';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useAuthModal } from '../../contexts/AuthModalContext';
import ScheduleCallCTA from '../../components/ScheduleCallCTA';

export default function RaisePage() {
  const router = useRouter();
  const { navigateWithAuth } = useAuthNavigation();
  const supabase = createClient();
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasMounted, setHasMounted] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      // Mouse tracking for particle effects
      const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [user]);

  const handleScheduleCall = async () => {
    if (!user) {
      openModal({
        title: 'Authentication Required',
        description: 'Please sign in to raise capital for your Opportunity Zone development.\n\n🔐 Password-free login\n✨ One-time signup, lifetime access',
        redirectTo: '/raise',
      });
      return;
    }
    
    // Track analytics
    await supabase.from('analytics').insert({
      user_id: user.id,
      event_type: 'listing_inquiry_started',
      event_data: { source: 'raise_page' }
    });
    
    // Redirect to calendar with prefilled data
    const calendlyUrl = `https://calendly.com/colin-oz-listings/developer-consultation?name=${encodeURIComponent(user.user_metadata?.full_name || '')}&email=${encodeURIComponent(user.email || '')}`;
    window.open(calendlyUrl, '_blank');
  };

  const handleMarketplace = () => {
    navigateWithAuth('/listings');
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black flex flex-col justify-center items-center">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e3f0ff] via-[#f0f7ff] to-[#e3f0ff] dark:from-[#0a223a] dark:via-[#0a223a] dark:to-[#0a223a] overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated Background Elements */}
        {hasMounted && (
          <>
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-[#1e88e5]/30 rounded-full"
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    opacity: 0
                  }}
                  animate={{
                    x: mousePosition.x + (Math.random() - 0.5) * 200,
                    y: mousePosition.y + (Math.random() - 0.5) * 200,
                    opacity: [0, 0.6, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                />
              ))}
            </div>

            {/* Geometric shapes */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div
                className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#1e88e5]/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-24 h-24 border-2 border-[#1e88e5]/20 rounded-lg"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </>
        )}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 md:px-8">
          <div className="w-full max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white">
                Transform Vision Into{' '}
                <span className="bg-gradient-to-r from-[#1e88e5] to-[#1e88e5] bg-clip-text text-transparent">
                  Reality
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-[#1e88e5] dark:text-[#90caf9] max-w-2xl mx-auto leading-relaxed">
                Connect with sophisticated investors and access capital for your Opportunity Zone development project
              </p>
              
              <motion.button
                className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-[#1e88e5] to-[#1976d2] text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={() => navigateWithAuth('/schedule-a-call?userType=Developer&advertise=true')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-sm text-[#1e88e5] dark:text-[#90caf9] mb-2">Scroll to explore</p>
          <div className="w-6 h-10 border-2 border-[#1e88e5] rounded-full mx-auto relative">
            <motion.div
              className="w-1 h-2 bg-[#1e88e5] rounded-full absolute left-1/2 top-2 transform -translate-x-1/2"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Cards Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-24 md:py-32 bg-white dark:bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-8 w-full flex flex-col justify-center items-center">
          {/* Section header */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#1e88e5] dark:text-[#90caf9] mb-6">
              How We Help You Succeed
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-200 max-w-3xl mx-auto">
              Our comprehensive platform connects developers with the right investors and provides all the tools needed for successful fundraising.
            </p>
          </motion.div>

          {/* Cards grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Smart Capital Access */}
            <motion.div
              className="group relative bg-white dark:bg-[#0a223a] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#1e88e5]/20 dark:border-[#1e88e5]/40"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-[#e3f0ff] dark:bg-[#1e88e5]/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-[#1e88e5] dark:text-[#90caf9]" />
              </div>
              
              <h3 className="text-2xl font-bold text-[#1e88e5] dark:text-[#90caf9] mb-4">
                Smart Capital Access
              </h3>
              
              <p className="text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                Your development will be presented to the most sophisticated investors in the country - from institutional funds to every major family office seeking Opportunity Zone investments.
              </p>
              
              <button
                className="w-full bg-[#1e88e5] hover:bg-[#1976d2] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                onClick={() => navigateWithAuth('/schedule-a-call?userType=Developer&advertise=true')}
              >
                Schedule a Call
              </button>
            </motion.div>

            {/* See Our Work */}
            <motion.div
              className="group relative bg-gradient-to-br from-[#e3f0ff] to-[#f0f7ff] dark:from-[#1e88e5]/10 dark:to-[#1e88e5]/20 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#1e88e5]/20 dark:border-[#1e88e5]/40"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-[#1e88e5] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-[#1e88e5] dark:text-[#90caf9] mb-4">
                See What We Build For You
              </h3>
              
              <p className="text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                Experience the caliber of presentation we create for every listing. Visit our Marketplace to see live examples of how we showcase developments.
              </p>
              
              <button
                className="w-full bg-[#1e88e5] hover:bg-[#1976d2] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center"
                onClick={handleMarketplace}
              >
                View Marketplace Examples
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </motion.div>

            {/* Check OZ Status */}
            <motion.div
              className="group relative bg-white dark:bg-[#0a223a] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#1e88e5]/20 dark:border-[#1e88e5]/40"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8 }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-[#e3f0ff] dark:bg-[#1e88e5]/20 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-8 h-8 text-[#1e88e5] dark:text-[#90caf9]" />
              </div>
              
              <h3 className="text-2xl font-bold text-[#1e88e5] dark:text-[#90caf9] mb-4">
                Check if Your Development is in an OZ
              </h3>
              
              <p className="text-gray-700 dark:text-gray-200 mb-8 leading-relaxed">
                Enter your development address or coordinates to see if it qualifies for Opportunity Zone benefits. Instantly verify eligibility.
              </p>
              
              <button
                className="w-full bg-[#1e88e5] hover:bg-[#1976d2] text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
                onClick={() => navigateWithAuth('/check-oz')}
              >
                Check OZ Eligibility
              </button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
} 