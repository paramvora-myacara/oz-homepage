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
import OZListingsCarousel from "./components/OZListingsCarousel";
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
      
      {/* HERO SECTION - Map Only */}
      <motion.section 
        className="relative min-h-screen overflow-hidden pt-[2lh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <FloatingParticles />
        {/* D3 OZ Map */}
        <div className="h-screen w-full">
          <OZMapVisualization />
        </div>
      </motion.section>

      {/* CONTENT CAROUSEL */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        viewport={{ once: true }}
      >
        <OZListingsCarousel />
      </motion.div>

      {/* WHY/WHAT/WHEN/HOW OZ SECTION */}
      <section className="w-full bg-[#f5f7fa] py-20 relative">
        <FloatingParticles />
        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              title: "Why OZ?",
              desc: "Unlock powerful tax incentives and access a high-growth real estate market—Opportunity Zones provide unique advantages for qualified investors.",
            },
            {
              title: "What OZ?",
              desc: "Special census tracts nationwide offering capital gains tax deferral, reduction, and exclusion for eligible investments.",
            },
            {
              title: "When OZ?",
              desc: "There's a window of opportunity—key benefits phase out after 2026. Early movers gain the most.",
            },
            {
              title: "How OZ?",
              desc: "Qualify as an accredited investor, choose your deal, and track progress—all with OZ Listings.",
            },
          ].map(({ title, desc }, idx) => (
            <motion.div
              key={title}
              className="group relative flex flex-col gap-4 rounded-2xl p-8 cursor-pointer"
              style={{ 
                minHeight: "280px",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
              }}
            >
              {/* Gradient overlay on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 136, 229, 0.1) 0%, rgba(66, 165, 245, 0.05) 100%)",
                }}
              />
              
              <div className="relative z-10">
                <div className="mb-2 text-2xl font-bold group-hover:text-[#1e88e5] transition-colors duration-300">
                  {title}
                </div>
                <div className="text-lg font-light leading-relaxed">{desc}</div>
              </div>
              
              {/* Subtle border glow on hover */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: "0 0 0 1px rgba(30, 136, 229, 0.2), 0 8px 32px rgba(30, 136, 229, 0.1)",
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* DIRECT ACTION SECTION */}
      <section className="w-full bg-white py-20 relative">
        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-4 px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {[
            {
              icon: <FaUserCheck size={42} className={primary} />,
              title: "Qualify as an Investor",
              subtitle: "See if you're eligible for exclusive OZ deals.",
              cta: "Get Started",
            },
            {
              icon: <FaMapMarkedAlt size={42} className={primary} />,
              title: "Check Your Development",
              subtitle:
                "See if your project is located in an Opportunity Zone.",
              cta: "Check Now",
            },
            {
              icon: <FaComments size={42} className={primary} />,
              title: "Talk to Ozzie (AI)",
              subtitle: "Ask our smart assistant about OZ investments.",
              cta: "Chat Now",
            },
            {
              icon: <FaPhone size={42} className={primary} />,
              title: "Speak to the Team",
              subtitle: "Connect with OZ experts for personalized support.",
              cta: "Contact Us",
            },
          ].map(({ icon, title, subtitle, cta }, idx) => (
            <motion.div
              key={title}
              className="group relative flex flex-col items-center gap-3 rounded-2xl p-8 text-center cursor-pointer"
              style={{
                background: "rgba(247, 248, 250, 0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              variants={cardVariants}
              whileHover={{ 
                y: -12, 
                scale: 1.03,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
              }}
            >
              {/* Magnetic icon effect */}
              <motion.div 
                className="mb-2 relative"
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  transition: { duration: 0.6, ease: "easeInOut" }
                }}
              >
                {icon}
                {/* Icon glow effect */}
                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle, rgba(30, 136, 229, 0.2) 0%, transparent 70%)",
                    transform: "scale(2)",
                  }}
                />
              </motion.div>
              
              <div className="mb-1 text-xl font-bold group-hover:text-[#1e88e5] transition-colors duration-300">
                {title}
              </div>
              <div className="mb-3 text-base text-gray-700 leading-relaxed">{subtitle}</div>
              
              {/* Enhanced CTA button */}
              <motion.button 
                className="relative overflow-hidden rounded-full border-2 border-[#1e88e5] bg-white px-7 py-2 font-semibold text-[#1e88e5] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1e88e5";
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(30, 136, 229, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.color = "#1e88e5";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Button shimmer effect */}
                <motion.div
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full"
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                <span className="relative z-10">{cta}</span>
              </motion.button>
              
              {/* Card border glow */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: "0 0 0 1px rgba(30, 136, 229, 0.3), 0 12px 40px rgba(30, 136, 229, 0.15)",
                }}
              />
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
