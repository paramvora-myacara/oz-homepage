'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Target, ArrowRight, Sparkles, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase/client';
import { useAuthNavigation } from '../../../lib/auth/useAuthNavigation';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useAuthModal } from '../../contexts/AuthModalContext';

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
    if (!loading && !user) {
      openModal({
        title: 'Authentication Required',
        description: 'Please sign in to raise capital for your Opportunity Zone development.\n\n🔐 Password-free login\n✨ One-time signup, lifetime access',
        redirectTo: '/raise',
      });
    }
  }, [user, loading, openModal]);

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
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-[#1e293b] dark:text-white overflow-hidden relative">
      {/* Hero Section */}
      <motion.section 
        className="relative h-screen flex items-center justify-center"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {/* Animated Background Particles */}
        {hasMounted && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#1e88e5] dark:bg-[#42a5f5] rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{
                  x: mousePosition.x + (Math.random() - 0.5) * 200,
                  y: mousePosition.y + (Math.random() - 0.5) * 200,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
        {/* Bouncing Arrow Scroll Indicator */}
        <motion.div
          className="absolute left-1/2 bottom-8 -translate-x-1/2 z-30 flex flex-col items-center"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 16L20 24L28 16"
              stroke="#1e293b"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* 3D Building Wireframe Animation */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2 }}
        >
          <svg viewBox="0 0 400 400" className="w-96 h-96">
            <motion.path
              d="M100,300 L100,100 L200,50 L300,100 L300,300 L100,300 M200,50 L200,250 M100,100 L300,100 M100,200 L300,200"
              stroke="#1e88e5"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Vision Into{' '}
            <span className="text-[#1e88e5] dark:text-[#42a5f5]">Reality</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Access capital for your Opportunity Zone development
          </motion.p>
          
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] text-white rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group border-2 border-[#fbbf24]"
            onClick={handleScheduleCall}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Your Journey</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
            {/* Smart Capital Access */}
            <motion.div 
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -8, rotateY: 5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e88e5]/10 to-transparent dark:from-[#42a5f5]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                className="w-16 h-16 mb-6 bg-[#1e88e5] dark:bg-[#42a5f5] rounded-full flex items-center justify-center border-4 border-[#fbbf24]"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 text-[#1e88e5] dark:text-[#42a5f5]">Smart Capital Access</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your development will be presented to the most sophisticated investors in the country - from institutional funds to every major family office seeking Opportunity Zone investments. We ensure your project gets in front of decision-makers who understand and value OZ development.
              </p>
            </motion.div>

            {/* See Our Work */}
            <motion.div 
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={handleMarketplace}
              whileHover={{ y: -8, rotateY: -5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e88e5]/10 to-transparent dark:from-[#42a5f5]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                className="w-16 h-16 mb-6 bg-[#1e88e5] dark:bg-[#42a5f5] rounded-full flex items-center justify-center border-4 border-[#fbbf24]"
                whileHover={{ rotate: -360 }}
                transition={{ duration: 0.8 }}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 text-[#1e88e5] dark:text-[#42a5f5]">See What We Build For You</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Experience the caliber of presentation we create for every listing. Visit our Marketplace to see live examples of how we showcase developments - from interactive maps to detailed financial models. This is the standard every investor will see when discovering your project.
              </p>
              <div className="flex items-center text-[#1e88e5] dark:text-[#42a5f5] font-semibold group-hover:gap-4 gap-2 transition-all duration-300">
                View Marketplace Examples <ArrowRight className="w-5 h-5 text-[#fbbf24]" />
              </div>
            </motion.div>

            {/* Expert Guidance */}
            <motion.div 
              className="group relative p-8 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -8, rotateY: 5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e88e5]/10 to-transparent dark:from-[#42a5f5]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div 
                className="w-16 h-16 mb-6 bg-[#1e88e5] dark:bg-[#42a5f5] rounded-full flex items-center justify-center border-4 border-[#fbbf24]"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Target className="w-8 h-8 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold mb-4 text-[#1e88e5] dark:text-[#42a5f5]">Expert OZ Guidance</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Navigate Opportunity Zone regulations with confidence. Our team of OZ experts helps structure your deal for maximum investor appeal while ensuring full compliance. From QOF requirements to substantial improvement tests, we've guided hundreds of successful raises.
              </p>
              <motion.button
                className="text-[#1e88e5] dark:text-[#42a5f5] font-semibold hover:gap-4 gap-2 transition-all duration-300 flex items-center"
                onClick={handleScheduleCall}
                whileHover={{ x: 5 }}
              >
                Schedule Expert Consultation <ArrowRight className="w-5 h-5 text-[#fbbf24]" />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#e3f0fb] to-[#f5fafd] dark:from-gray-900 dark:to-black">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Fund Your{' '}
            <span className="text-[#1e88e5] dark:text-[#42a5f5]">Vision</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join developers who've raised millions through OZ Listings
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-[#1e88e5] to-[#42a5f5] text-white rounded-lg font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group border-2 border-[#fbbf24]"
            onClick={handleScheduleCall}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">Start Your Capital Raise</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fbbf24]/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
} 