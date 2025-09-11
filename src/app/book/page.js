"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from '../contexts/ThemeContext';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import { useState, useEffect } from 'react';

const openInNewTab = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const handleAmazonClick = async (source = "book_landing_page") => {
  await trackUserEvent("book_purchase_click", {
    source,
    destination: "amazon",
    timestamp: new Date().toISOString(),
  });
  openInNewTab("https://a.co/d/4ksFbLU");
};

const handleSecondaryCtaClick = async (cta) => {
  await trackUserEvent("book_secondary_cta_click", {
    cta,
    timestamp: new Date().toISOString(),
  });
};

// Podcast appearances data
const podcastAppearances = [
  {
    title: "OZ Success Stories",
    host: "OZ Listings Podcast",
    videoId: "km-Zw81nJ60",
    img: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
  },
];

// LinkedIn post data
const linkedInPost = {
  title: "LinkedIn Insights",
  linkedInPostId: "7352820582847004672",
  link: "https://www.linkedin.com/posts/ozlistings_oz-listings-opportunity-zone-listings-for-activity-7352820582847004672-OJuC?utm_source=share&utm_medium=member_desktop&rcm=ACoAABdmpjQBBZQAjhFM8ElF7n-6iw6weGH7FzQ",
};

export default function BookLandingPage() {
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const gold = resolvedTheme === 'dark' ? "#FFD700" : "#D4AF37";
  const blue = "#1e88e5";

  useEffect(() => {
    setIsClient(true);
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="relative w-full bg-white text-[#212C38] transition-colors duration-300 dark:bg-black dark:text-white">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden">
        
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
            {[...Array(30)].map((_, i) => {
              // Generate consistent random values based on index
              const seed1 = (i * 9301 + 49297) % 233280;
              const seed2 = (i * 1301 + 9297) % 133280;
              const seed3 = (i * 7301 + 19297) % 183280;
              const seed4 = (i * 5301 + 29297) % 223280;
              
              const rnd1 = seed1 / 233280;
              const rnd2 = seed2 / 133280;
              const rnd3 = seed3 / 183280;
              const rnd4 = seed4 / 223280;
              
              const size = rnd1 * 4 + 2;
              const startX = rnd2 * dimensions.width;
              const startY = rnd3 * dimensions.height;
              const endX = rnd4 * dimensions.width;
              
              return (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{ 
                    width: size,
                    height: size,
                    backgroundColor: gold,
                    filter: 'blur(0.5px)',
                  }}
                  initial={{
                    x: startX,
                    y: startY,
                    opacity: 0,
                  }}
                  animate={{
                    x: endX,
                    y: [
                      startY,
                      startY - 100,
                      startY,
                    ],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 10 + rnd1 * 20,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Book Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: resolvedTheme === 'dark' ? [0.3, 0.2, 0.3] : [0.15, 0.1, 0.15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
                  <Image
                    src="/images/UltimateGuideOZ.jpg"
                    alt="The OZ Investor's Guide"
                    width={400}
                    height={500}
                    className="rounded-lg shadow-lg"
                    priority
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <motion.h1 
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  The{" "}
                  <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
                    OZ Investor's
                  </span>{" "}
                  Guide
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  The #1 comprehensive guide to Opportunity Zone investing. Master the strategies used by top investors to maximize tax savings and build generational wealth.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="space-y-4 mb-8"
                >
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Comprehensive tax strategy guide</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Real-world case studies & examples</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>Step-by-step investment framework</span>
                  </div>
                </motion.div>
              </div>

              <motion.button
                onClick={() => handleAmazonClick("book_landing_page_top_cta")}
                className="group relative bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl overflow-hidden transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Buy on Amazon
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
      </section>

      {/* Content Section - Podcast & LinkedIn */}
      <section className="relative py-16 bg-white dark:bg-gray-900">
        <div className="pointer-events-none absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, #1e88e5 0%, transparent 50%),
                                        radial-gradient(circle at 75% 75%, #42a5f5 0%, transparent 50%)`,
            }}
          />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="px-6 pb-2 lg:pb-6 text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 dark:text-white mb-6">
            Featured Content
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explore our latest insights and expert commentary on Opportunity Zone investing
          </p>
        </motion.div>

        <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          
          {/* LinkedIn Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeInOut" }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-700/20 bg-white/5 min-h-[500px]"
          >
            <iframe
              src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${linkedInPost.linkedInPostId}`}
              className="h-full w-full border-0"
              title="LinkedIn post"
              style={{ minHeight: 500, background: "#fff" }}
            />
            <div className="absolute top-3 left-3 rounded bg-black/80 px-3 py-1 text-sm text-white">
              {linkedInPost.title}
            </div>
          </motion.div>

          {/* Podcast */}
          {podcastAppearances.map((podcast, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeInOut" }}
              className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-700/20 bg-white/5 min-h-[500px] cursor-pointer group"
              onClick={() => openInNewTab(`https://www.youtube.com/watch?v=${podcast.videoId}`)}
            >
              <Image
                src={`https://img.youtube.com/vi/${podcast.videoId}/maxresdefault.jpg`}
                alt={podcast.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 opacity-90 shadow-2xl group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="ml-1 h-0 w-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-white"></div>
                </motion.div>
              </div>
              <div className="absolute bottom-6 left-6 right-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2">{podcast.title}</h3>
                <p className="text-gray-200">{podcast.host}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 40%, ${blue}40 0%, transparent 50%),
                radial-gradient(circle at 70% 60%, ${gold}30 0%, transparent 50%)
              `,
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Start Your{" "}
            <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
              OZ Journey
            </span>{" "}
            Today
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Join thousands of investors who have already transformed their tax strategy with proven OZ investment techniques.
          </motion.p>

          {/* CTA Buttons Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-6 max-w-5xl mx-auto"
          >
            {/* Primary CTA */}
            <motion.button
              onClick={() => handleAmazonClick("book_landing_page_bottom_cta")}
              className="group relative bg-gradient-to-r from-[#1e88e5] to-[#1565c0] text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Get Your Copy Now
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#1565c0] to-[#0d47a1] opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 w-full max-w-md">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3">or explore</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
            </div>

            {/* Secondary CTAs - Unified Design */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              <motion.a
                href="/community"
                onClick={() => handleSecondaryCtaClick("community")}
                className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-5 rounded-2xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                  <svg className="w-5 h-5 text-[#1e88e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Join Community
                </span>
              </motion.a>

              <motion.a
                href="/listings"
                onClick={() => handleSecondaryCtaClick("listings")}
                className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-5 rounded-2xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                  <svg className="w-5 h-5 text-[#1e88e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  View Listings
                </span>
              </motion.a>

              <motion.a
                href="/invest"
                onClick={() => handleSecondaryCtaClick("invest")}
                className="group relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white px-8 py-5 rounded-2xl font-semibold text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center justify-center gap-2 text-lg">
                  <svg className="w-5 h-5 text-[#1e88e5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Start Investing
                </span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 