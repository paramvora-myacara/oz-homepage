"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FaUserCheck,
  FaMapMarkedAlt,
  FaComments,
  FaPhone,
} from "react-icons/fa";
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.1, 0.25, 1],
      type: "spring",
      stiffness: 100
    } 
  },
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
    <div className="min-h-screen w-full bg-white text-[#212C38] relative overflow-x-hidden">
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
          className="w-[30%] flex flex-col justify-center px-8 lg:px-12 bg-white relative z-10"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-lg">
            <motion.h1 
              className="text-3xl lg:text-4xl xl:text-5xl font-black text-[#212C38] mb-6 leading-tight tracking-tight"
              style={{ fontFamily: "'Avenir', 'Avenir Next', 'Montserrat', 'Futura', sans-serif", fontWeight: 800 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Premier marketplace for<br />
              <span className="text-[#1e88e5]" style={{ fontFamily: "'Avenir', 'Avenir Next', 'Montserrat', 'Futura', sans-serif", fontWeight: 800 }}>OZ</span> investments in the US
            </motion.h1>
            
            <motion.p 
              className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed"
              style={{ fontFamily: "'Avenir', 'Avenir Next', 'Montserrat', 'Futura', sans-serif", fontWeight: 400 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Save on capital gains taxes while being part of eradicating America's housing crisis through strategic Opportunity Zone investments.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button className="px-8 py-4 bg-[#1e88e5] text-white font-semibold rounded-full hover:bg-[#1976d2] transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Explore Opportunities
              </button>
              <button className="px-8 py-4 border-2 border-[#1e88e5] text-[#1e88e5] font-semibold rounded-full hover:bg-[#1e88e5] hover:text-white transition-all duration-300 hover:scale-105">
                Learn More
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

      {/* NEXT STEPS SECTION */}
      <section className="w-full bg-[#1a1a2e] py-20 relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#16213e]/50 to-[#1a1a2e] pointer-events-none" />
        
        {/* Section Header */}
        <div className="text-center mb-16 relative z-10">
          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight text-white"
            style={{
              fontFamily: "'Avenir', 'Avenir Next', 'Montserrat', 'Futura', sans-serif"
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, margin: "-50px" }}
          >
            Next Steps
          </motion.h2>
        </div>

        <motion.div
          className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              icon: <FaPhone size={80} className="text-[#1e88e5]" />,
              title: "Speak to the Team",
              subtitle: "Connect with OZ experts for personalized support and guidance",
              cta: "Contact Us",
              category: "Support",
            },
            {
              icon: <FaUserCheck size={80} className="text-[#1e88e5]" />,
              title: "Qualify as an Investor",
              subtitle: "Verify your eligibility for exclusive OZ investment opportunities", 
              cta: "Get Started",
              category: "Qualification",
            },
            {
              icon: <FaComments size={80} className="text-[#1e88e5]" />,
              title: "Talk to Ozzie",
              subtitle: "Get instant answers about Opportunity Zone investments",
              cta: "Chat Now",
              category: "AI Assistant",
            },
          ].map(({ icon, title, subtitle, cta, category }, idx) => (
                         <motion.div
              key={title}
              className="group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #252545 0%, #1e1e3f 100%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              }}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
              }}
            >
              {/* Icon Header Section */}
              <div className="relative p-8 pb-4 flex flex-col items-center text-center">
                {/* Large Icon */}
                <motion.div 
                  className="mb-6 relative"
                  whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }}
                >
                  {icon}
                </motion.div>
                
                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#64b5f6] transition-colors duration-300">
                  {title}
                </h3>
                
                {/* Subtitle */}
                <p className="text-lg text-white/80 mb-4" style={{ lineHeight: '2.2' }}>
                  {subtitle}
                </p>
              </div>
              
              {/* Card Content */}
              <div className="p-8 pt-0 flex-grow flex flex-col">
                {/* CTA Button */}
                <motion.button 
                  className="rounded-xl bg-[#1e88e5] text-white px-6 py-3 font-semibold transition-all duration-300 hover:bg-[#1976d2] hover:shadow-lg hover:shadow-[#1e88e5]/25"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {cta}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

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
