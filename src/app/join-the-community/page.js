'use client'

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { 
  KeyIcon, 
  StarIcon, 
  ChartBarIcon, 
  BoltIcon 
} from "@heroicons/react/24/outline";
import { useTheme } from '../contexts/ThemeContext';

const benefits = [
  {
    title: "Exclusive Access",
    description: "Be first to discover premium off-market Opportunity Zone deals.",
    Icon: KeyIcon,
  },
  {
    title: "AI-First Platform",
    description: "Leverage advanced AI to discover, analyze, and match with the best OZ opportunities.",
    Icon: BoltIcon,
  },
  {
    title: "White-Glove Service",
    description: "Get concierge-level support from dedicated OZ experts.",
    Icon: StarIcon,
  },
  {
    title: "Insider Insights",
    description: "Access expert analysis and detailed market reports.",
    Icon: ChartBarIcon,
  },
];

const gold = "#FFD700";
const blue = "#1e88e5";

export default function JoinCommunityPage() {
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleJoinCommunity = () => {
    // Navigate to join community
    console.log("Join community clicked");
  };

  // Adjusted card positions for rectangle corners with better spacing
  const cardPositions = [
    { x: -275, y: -135, angle: -90 },    // top-left
    { x: 275, y: -135, angle: 0 },       // top-right
    { x: 275, y: 135, angle: 90 },       // bottom-right
    { x: -275, y: 135, angle: 180 },     // bottom-left
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-[#212C38] dark:text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, ${blue}40 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, ${gold}30 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, ${blue}20 0%, transparent 50%)
            `,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Gold Floating Particles */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{ 
                width: Math.random() * 6 + 2,
                height: Math.random() * 6 + 2,
                backgroundColor: gold,
                filter: 'blur(0.5px)',
              }}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight - 100,
                  Math.random() * window.innerHeight,
                ],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 10 + Math.random() * 20,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content - More spacing */}
      <div className="relative z-10 w-full h-screen flex flex-col items-center justify-center px-4 py-12">
        
        {/* Heading Section - More spacing */}
        <motion.div 
          className="w-full max-w-4xl text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1 
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join the{" "}
            <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
              OZ Marketplace
            </span>{" "}
            of the Future!
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg lg:text-xl font-light text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Step into an exclusive community of visionary investors and developers shaping the future of OZ investments.
          </motion.p>
        </motion.div>

        {/* Cards Section - Desktop - More height and spacing */}
        <div className="hidden lg:block relative w-full max-w-6xl mx-auto h-[450px] mb-12">
          
          {/* Center Logo - Bigger and more prominent */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.2, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="rounded-full p-12 bg-white dark:bg-gray-900 shadow-2xl relative overflow-hidden">
                <img 
                  src={resolvedTheme === 'dark' ? "/oz-listings-horizontal2-logo-white.webp" : "/OZListings-Light.jpeg"} 
                  alt="OZ Listings Logo" 
                  className="w-28 h-28 object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-28 h-28 bg-gradient-to-br from-[#1e88e5] to-[#1565c0] rounded-full items-center justify-center hidden">
                  <span className="text-white font-bold text-3xl">OZ</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gold} stopOpacity="0.2" />
                <stop offset="50%" stopColor={gold} stopOpacity="0.6" />
                <stop offset="100%" stopColor={gold} stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {cardPositions.map((pos, idx) => (
              <motion.line
                key={idx}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${pos.x * 0.7}px)`}
                y2={`calc(50% + ${pos.y * 0.7}px)`}
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ 
                  duration: 1.5, 
                  delay: 0.8 + idx * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>

          {/* Desktop Cards - Bigger with more spacing */}
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              className="absolute w-52 h-48 rounded-xl p-5 bg-white dark:bg-gray-800 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{
                left: `calc(50% + ${cardPositions[idx].x}px - 104px)`,
                top: `calc(50% + ${cardPositions[idx].y}px - 96px)`,
              }}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: 1 + 0.15 * idx, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-3">
                <motion.div
                  className="mb-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-800/30 dark:group-hover:to-blue-700/30 transition-colors duration-300"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: idx * 0.3,
                    ease: "easeInOut"
                  }}
                >
                  <benefit.Icon className="h-8 w-8 text-[#1e88e5]" />
                </motion.div>
                <h3 className="text-base font-bold mb-2 text-gray-800 dark:text-white text-center">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet Cards - Grid Layout with more spacing */}
        <div className="lg:hidden w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              className="rounded-xl p-6 bg-white dark:bg-gray-800 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="mb-3 p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                  <benefit.Icon className="h-10 w-10 text-[#1e88e5]" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">{benefit.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section - Bigger button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.button
            className="relative rounded-full bg-gradient-to-r from-[#1e88e5] to-[#1565c0] px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-xl overflow-hidden group"
            onClick={handleJoinCommunity}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-3">
              Join the Community Now
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#1565c0] to-[#0d47a1]"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}