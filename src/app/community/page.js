"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { 
  KeyIcon, 
  StarIcon, 
  ChartBarIcon, 
  BoltIcon 
} from "@heroicons/react/24/outline";
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useAuthModal } from '../contexts/AuthModalContext';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import SectionContent from "../components/HorizontalScrollSlideshow";
import {
  UpcomingEvents,
  CommunityResources,
} from "../components/HorizontalScrollSlideshow";

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

const blue = "#1e88e5";

export default function CommunityPage() {
  const containerRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const [useGridLayout, setUseGridLayout] = useState(false);
  const [hasJoinedCommunity, setHasJoinedCommunity] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const { resolvedTheme } = useTheme();
  const { user, loading } = useAuth();
  const { openModal } = useAuthModal();
  
  // Theme-aware gold color
  const gold = resolvedTheme === 'dark' ? "#FFD700" : "#D4AF37";

  useEffect(() => {
    setIsClient(true);
    
    // Track community page view event
    const trackCommunityView = async () => {
      await trackUserEvent("community_interest_expressed", {
        source: "community_page_visit",
        timestamp: new Date().toISOString(),
      });
    };
    
    trackCommunityView();
    
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      
      setDimensions({ width, height });
      setAspectRatio(ratio);
      
      // Check if we need to switch to grid layout to prevent overlap
      // Calculate minimum space needed for circular layout with card spacing
      const minCircularSpace = 900; // Minimum width needed for circular layout (increased)
      const minCircularHeight = 700; // Minimum height needed for circular layout (increased)
      const hasExtremeRatio = ratio > 2.8 || ratio < 0.8; // Very wide or very tall screens
      const isMediumScreen = width >= 1024 && width < 1200; // lg breakpoint range
      
      const shouldUseGrid = width < minCircularSpace || 
                           height < minCircularHeight || 
                           hasExtremeRatio ||
                           (isMediumScreen && height < 800);
      setUseGridLayout(shouldUseGrid);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    // If user just authenticated and we're on this page, they joined the community
    if (user && !loading && !hasJoinedCommunity) {
      // Check if this was a redirect from auth flow
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('joined') === 'true' || window.location.pathname === '/community') {
        setHasJoinedCommunity(true);
        // Clean up URL
        window.history.replaceState(null, '', '/community');
      }
    }
  }, [user, loading, hasJoinedCommunity]);

  const handleJoinCommunity = async () => {
    if (hasJoinedCommunity) {
      // User has already joined, do nothing or show a message
      return;
    }

    if (loading) {
      // Still loading auth state, wait
      return;
    }

    // Track community join button click
    await trackUserEvent("community_interest_expressed", {
      source: "join_community_button",
      timestamp: new Date().toISOString(),
    });

    if (user) {
      // User is logged in, show welcome popup
      setShowWelcomePopup(true);
    } else {
      // User not logged in, show auth modal
      openModal({
        title: 'Join Our Exclusive Community',
                        description: 'Sign in to join the OZ Marketplace and get access to exclusive deals and insights.\n\n🔐 Password-free login\n✨ One-time signup, lifetime access',
        redirectTo: '/community',
        onClose: () => {
          // Check if user signed in after auth modal closes
          if (user) {
            setHasJoinedCommunity(true);
          }
        }
      });
    }
  };

  const handleWelcomeConfirm = () => {
    setShowWelcomePopup(false);
    setHasJoinedCommunity(true);
  };

  const handleWelcomeClose = () => {
    setShowWelcomePopup(false);
  };

  // Determine if we need more vertical space based on aspect ratio
  const needsMoreVerticalSpace = aspectRatio > 2.0;
  const isUltraWide = aspectRatio > 2.5;

  // Dynamic card positioning based on aspect ratio and screen size
  const getCardPositions = () => {
    if (!isClient || useGridLayout) return [];
    
    const { width, height } = dimensions;
    
    // Calculate optimal distances based on available space and aspect ratio
    let baseDistance = Math.min(width * 0.2, height * 0.25, 300);
    
    // Dynamic spacing based on screen size and aspect ratio
    if (isUltraWide) {
      baseDistance = Math.min(width * 0.22, height * 0.28, 340);
    } else if (needsMoreVerticalSpace) {
      baseDistance = Math.min(width * 0.21, height * 0.26, 320);
    }
    
    // Dynamic minimum distances based on viewport
    const minDistance = Math.max(180, Math.min(width * 0.15, height * 0.2));
    const maxDistance = isUltraWide ? 320 : needsMoreVerticalSpace ? 280 : 240;
    const finalDistance = Math.min(Math.max(baseDistance, minDistance), maxDistance);
    
    // More balanced vertical spacing
    const verticalSpacing = isUltraWide ? 0.65 : needsMoreVerticalSpace ? 0.6 : 0.55;
    
    return [
      { x: -finalDistance, y: -finalDistance * verticalSpacing, angle: -90 },    // top-left
      { x: finalDistance, y: -finalDistance * verticalSpacing, angle: 0 },       // top-right
      { x: finalDistance, y: finalDistance * verticalSpacing, angle: 90 },       // bottom-right
      { x: -finalDistance, y: finalDistance * verticalSpacing, angle: 180 },     // bottom-left
    ];
  };

  const cardPositions = getCardPositions();
  
  // Container sizing
  const containerHeight = 'min-h-screen';
  const contentHeight = 'h-auto min-h-screen';
  const cardsContainerHeight = needsMoreVerticalSpace ? (isUltraWide ? 'h-[600px]' : 'h-[500px]') : 'h-[400px]';
  
  // Responsive spacing based on screen size and layout type
  const headingMarginBottom = useGridLayout
    ? 'mb-12 lg:mb-16'
    : (needsMoreVerticalSpace ? (isUltraWide ? 'mb-16' : 'mb-12') : 'mb-8 lg:mb-10');
  const cardsMarginBottom = useGridLayout
    ? 'mb-12 lg:mb-16'
    : (needsMoreVerticalSpace ? (isUltraWide ? 'mb-12' : 'mb-10') : 'mb-8 lg:mb-12');
  const verticalPadding = 'py-8';

  return (
    <div className="relative w-full bg-white text-[#212C38] transition-colors duration-300 dark:bg-black dark:text-white">
      <SectionContent />

      {/* JOIN THE COMMUNITY SECTION */}
      <div ref={containerRef} className={`relative ${containerHeight} flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-[#212C38] dark:text-white`}>

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
                  x: Math.random() * dimensions.width,
                  y: Math.random() * dimensions.height,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * dimensions.width,
                  y: [
                    Math.random() * dimensions.height,
                    Math.random() * dimensions.height - 100,
                    Math.random() * dimensions.height,
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

        {/* Main Content - Dynamic height and spacing */}
        <div className={`relative z-10 w-full ${contentHeight} flex flex-col items-center justify-start pt-32 lg:pt-40 px-4 ${verticalPadding}`}>
          
          {/* Heading Section - Responsive spacing */}
          <motion.div 
            className={`w-full max-w-4xl text-center ${headingMarginBottom}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className={`${needsMoreVerticalSpace ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-5xl'} font-bold leading-tight mb-6`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {user ? (
                <>
                  Welcome to the{" "}
                  <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
                    OZ Marketplace
                  </span>{" "}
                  Community!
                </>
              ) : (
                <>
                  Join the{" "}
                  <span className="bg-gradient-to-r from-[#1e88e5] to-[#1565c0] bg-clip-text text-transparent">
                    OZ Marketplace
                  </span>{" "}
                  of the Future!
                </>
              )}
            </motion.h1>
            <motion.p 
              className={`${needsMoreVerticalSpace ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg lg:text-xl'} font-light text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {user ? (
                "You're part of an exclusive community of visionary investors and developers shaping the future of OZ investments."
              ) : (
                "Step into an exclusive community of visionary investors and developers shaping the future of OZ investments."
              )}
            </motion.p>
          </motion.div>

          {/* Cards Section - Desktop - Dynamic Layout */}
          <div className={`hidden lg:block w-full max-w-7xl mx-auto ${cardsMarginBottom}`}>
            
            {useGridLayout ? (
              // Grid Layout - 2x2 Cards (1 column on very small screens)
              <div className={`grid ${dimensions.width < 640 ? 'grid-cols-1' : 'grid-cols-2'} gap-8 max-w-4xl mx-auto`}>
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={benefit.title}
                    className="rounded-xl p-6 bg-white dark:bg-gray-800 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className="mb-3 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                        <benefit.Icon className="h-10 w-10 text-[#1e88e5]" />
                      </div>
                      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Circular Layout
              <div className={`relative ${cardsContainerHeight}`}>
                {/* Center Logo - Responsive sizing */}
                <motion.div 
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
                  style={{
                    top: `calc(50% + ${needsMoreVerticalSpace ? '40px' : '20px'})`,
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring", stiffness: 100 }}
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: resolvedTheme === 'dark' ? [0.2, 0.1, 0.2] : [0.08, 0.04, 0.08],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className={`rounded-full ${isUltraWide ? 'p-16' : needsMoreVerticalSpace ? 'p-14' : 'p-12'} bg-white dark:bg-gray-900 shadow-2xl relative overflow-hidden border-2 border-gray-200 dark:border-gray-600`}>
                      <img 
                        src={resolvedTheme === 'dark' ? "/oz-listings-horizontal2-logo-white.webp" : "/OZListings-Light.jpeg"} 
                        alt="OZ Listings Logo" 
                        className={`${isUltraWide ? 'w-36 h-36' : needsMoreVerticalSpace ? 'w-32 h-32' : 'w-28 h-28'} object-contain`}
                        onError={(e) => {
                          // Fallback to text logo if image fails
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className={`${isUltraWide ? 'w-36 h-36' : needsMoreVerticalSpace ? 'w-32 h-32' : 'w-28 h-28'} bg-gradient-to-br from-[#1e88e5] to-[#1565c0] rounded-full items-center justify-center hidden`}>
                        <span className={`text-white font-bold ${isUltraWide ? 'text-4xl' : 'text-3xl'}`}>OZ</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Connection Lines - Dynamic positioning */}
                {isClient && (
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
                        y1={`calc(50% + ${needsMoreVerticalSpace ? '40px' : '20px'})`}
                        x2={`calc(50% + ${pos.x * 0.7}px)`}
                        y2={`calc(50% + ${pos.y * 0.7}px + ${needsMoreVerticalSpace ? '40px' : '20px'})`}
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
                )}

                {/* Desktop Cards - Dynamic positioning and sizing */}
                {benefits.map((benefit, idx) => (
                  <motion.div
                    key={benefit.title}
                    className={`absolute ${isUltraWide ? 'w-56 h-48' : needsMoreVerticalSpace ? 'w-52 h-48' : 'w-48 h-44'} rounded-xl ${isUltraWide ? 'p-5' : needsMoreVerticalSpace ? 'p-4' : 'p-4'} bg-white dark:bg-gray-800 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group`}
                    style={{
                      left: `calc(50% + ${cardPositions[idx]?.x || 0}px - ${isUltraWide ? '112px' : needsMoreVerticalSpace ? '104px' : '96px'})`,
                      top: `calc(50% + ${cardPositions[idx]?.y || 0}px - ${isUltraWide ? '96px' : needsMoreVerticalSpace ? '96px' : '88px'} + ${needsMoreVerticalSpace ? '40px' : '20px'})`,
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
                        className={`mb-3 ${isUltraWide ? 'p-4' : needsMoreVerticalSpace ? 'p-3' : 'p-2'} rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-800/30 dark:group-hover:to-blue-700/30 transition-colors duration-300`}
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
                        <benefit.Icon className={`${isUltraWide ? 'h-10 w-10' : needsMoreVerticalSpace ? 'h-9 w-9' : 'h-8 w-8'} text-[#1e88e5]`} />
                      </motion.div>
                      <h3 className={`${isUltraWide ? 'text-lg' : needsMoreVerticalSpace ? 'text-base' : 'text-base'} font-bold mb-2 text-gray-800 dark:text-white text-center`}>{benefit.title}</h3>
                      <p className={`${isUltraWide ? 'text-sm' : needsMoreVerticalSpace ? 'text-sm' : 'text-sm'} text-gray-600 dark:text-gray-400 leading-relaxed text-center`}>{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Mobile/Tablet Cards - Responsive Grid Layout */}
          <div className={`lg:hidden w-full max-w-2xl mx-auto grid ${dimensions.width < 500 ? 'grid-cols-1' : 'grid-cols-2'} gap-6 ${cardsMarginBottom}`}>
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

          {/* CTA Section - Responsive sizing */}
          <motion.div
            className="text-center mt-8 lg:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          >
            <motion.button
              className={`relative rounded-full ${hasJoinedCommunity 
                ? 'bg-gradient-to-r from-green-600 to-green-700 cursor-default' 
                : 'bg-gradient-to-r from-[#1e88e5] to-[#1565c0]'
              } ${needsMoreVerticalSpace ? 'px-14 py-6 text-xl' : 'px-10 sm:px-12 py-4 sm:py-5 text-base sm:text-lg'} font-bold text-white shadow-xl overflow-hidden group`}
              onClick={handleJoinCommunity}
              whileHover={hasJoinedCommunity ? {} : { scale: 1.05 }}
              whileTap={hasJoinedCommunity ? {} : { scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {hasJoinedCommunity ? "You're In! Welcome to the Community!" : 'Join the Community Now'}
                {!hasJoinedCommunity && (
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                )}
                {hasJoinedCommunity && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    ✓
                  </motion.span>
                )}
              </span>
              {!hasJoinedCommunity && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#1565c0] to-[#0d47a1]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Welcome Popup */}
        <AnimatePresence>
          {showWelcomePopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md"
              onClick={handleWelcomeClose}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative w-full max-w-md rounded-xl bg-white dark:bg-gray-900 p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
                      className="text-3xl text-green-600 dark:text-green-400"
                    >
                      ✓
                    </motion.span>
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Welcome to the Community!
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                  >
                    Hello, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Investor'}! 
                    <br />
                    You're now part of our exclusive OZ community.
                  </motion.p>

                  <div className="flex gap-3">
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      onClick={handleWelcomeConfirm}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Continue
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      onClick={handleWelcomeClose}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Close
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CommunityResources />
    </div>
  );
} 