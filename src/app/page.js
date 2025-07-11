"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import OZMapVisualization from "./components/OZMapVisualization";
import HorizontalScrollSlideshow from "./components/HorizontalScrollSlideshow";
import ScrollDrivenPinnedText from "./components/ScrollDrivenPinnedText";
import OZListingsFooter from "./components/OZListingsFooter";

const primary = "text-[#1e88e5]"; // Blue from OZ Listings logo

// Enhanced animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#1e88e5]/10"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.5,
          }}
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + i * 8}%`,
          }}
        />
      ))}
    </div>
  );
};

// Scroll progress indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-1 bg-gradient-to-r from-[#1e88e5] to-[#42a5f5]"
      style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
    />
  );
};

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-[#212C38] dark:text-white relative overflow-x-hidden transition-colors duration-300">
      <ScrollProgress />
      
      {/* HERO SECTION - Two Panel Layout */}
      <motion.section 
        className="relative min-h-screen overflow-hidden flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <FloatingParticles />
        
        {/* Left Panel - Tagline and Copy (30%) */}
        <motion.div 
          className="w-[30%] flex flex-col justify-center px-8 lg:px-12 bg-white dark:bg-black relative z-10 transition-colors duration-300"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-lg">
            <motion.h1 
              className="text-3xl lg:text-4xl xl:text-5xl font-black text-[#212C38] dark:text-white mb-6 leading-tight tracking-tight font-brand-black transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Premier marketplace for<br />
              <span className="text-[#1e88e5] font-brand-black">OZ</span> investments in the US
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed font-brand-normal transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Save on capital gains taxes while being part of eradicating America's housing crisis through strategic Opportunity Zone investments.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button 
                className="px-8 py-2 text-[#1e88e5] dark:text-[#3b82f6] font-semibold rounded-lg transition-all duration-300 hover:scale-105 whitespace-nowrap text-base border-2 border-[#1e88e5] dark:border-[#3b82f6] hover:bg-[#1e88e5] dark:hover:bg-[#3b82f6] hover:text-white"
                style={{ width: '70%' }}
              >
                See Dashboard
              </button>
              <button 
                className="px-8 py-2 bg-[#1e88e5] dark:bg-[#3b82f6] text-white font-semibold rounded-lg hover:bg-[#1976d2] dark:hover:bg-[#2563eb] transition-all duration-300 hover:scale-105 hover:shadow-lg whitespace-nowrap text-base"
                style={{ width: '70%' }}
              >
                See OZ Listings
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - OZ Map (70%) */}
        <motion.div 
          className="w-[70%] relative pt-16"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="h-[calc(100vh-3rem)] w-full">
            <OZMapVisualization />
          </div>
        </motion.div>
      </motion.section>

      {/* HORIZONTAL SCROLL SLIDESHOW */}
      <HorizontalScrollSlideshow />

      {/* SCROLL DRIVEN PINNED TEXT ANIMATION */}
      <ScrollDrivenPinnedText />

      {/* FOOTER */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <OZListingsFooter />
      </motion.div>
    </div>
  );
}
