'use client';

import { Suspense, useState, useEffect, useRef, useLayoutEffect } from 'react';
import LandingNavbar from '../components/landing/Navbar';
import ChatbotPanel from "../components/ChatbotPanel";
import ThemeLogo from "../components/ThemeLogo";
import ThemeSwitcher from "../components/ThemeSwitcher";
import CTAButton from "../components/CTAButton";
import { Menu, MessageSquare, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function InvestLayout({ children }) {
  // Track viewport to toggle between mobile / desktop layout
  const [isMobile, setIsMobile] = useState(false);
  // Show / hide mobile specific panels
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const { navigateWithAuth } = useAuthNavigation();
  const router = useRouter();

  const handleNavigation = (path) => {
    const protectedClientRoutes = [
      '/listings',
      '/check-oz',
      '/tax-calculator',
      '/schedule-a-call',
    ];

    if (protectedClientRoutes.includes(path)) {
      navigateWithAuth(path);
    } else {
      router.push(path);
    }
    setIsMobileMenuOpen(false);
  };

  const handleMarketplace = () => {
    navigateWithAuth("/listings");
  };

  const navLinks = [
    { name: 'OZ Map', path: '/#oz-map' },
    { name: 'Listings', path: '/listings' },
    { name: 'Contact', path: '/#contact' }
  ];

  const toolLinks = [
    { name: 'Check OZ Status', path: '/check-oz' },
    { name: 'Estimate Tax Savings', path: '/tax-calculator' }
  ];

  // --------------------------
  // Dynamic bottom padding
  // --------------------------
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  // Measure nav height (incl. safe-area) on mount & resize
  useLayoutEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for custom event to open mobile chat
  useEffect(() => {
    const handleOpenMobileChat = () => {
      if (isMobile) {
        setShowMobileChat(true);
      }
    };

    window.addEventListener('openMobileChat', handleOpenMobileChat);
    return () => window.removeEventListener('openMobileChat', handleOpenMobileChat);
  }, [isMobile]);

  // Keyboard detection for mobile
  useEffect(() => {
    if (!isMobile) return;

    let initialViewportHeight = window.innerHeight;
    let timeoutId;

    const handleResize = () => {
      const currentViewportHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentViewportHeight;
      
      // If viewport height decreased significantly (keyboard appeared)
      if (heightDifference > 150) {
        setIsKeyboardActive(true);
      } else {
        // If viewport height increased (keyboard disappeared)
        if (currentViewportHeight > initialViewportHeight - 50) {
          setIsKeyboardActive(false);
        }
      }
    };

    const handleFocus = () => {
      // Reset initial height when input is focused
      initialViewportHeight = window.innerHeight;
    };

    const handleBlur = () => {
      // Delay hiding nav to allow for keyboard dismissal animation
      timeoutId = setTimeout(() => {
        setIsKeyboardActive(false);
      }, 300);
    };

    // Listen for input focus/blur events
    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
      window.removeEventListener('resize', handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isMobile]);

  // ----------------------
  // Mobile Layout
  // ----------------------
  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen">
        <LandingNavbar />
        {/* Main content with top padding for fixed header */}
        <main
          className="flex-1 pt-16 overflow-y-auto scroll-container"
        >
          {children}
        </main>

        {/* Slide-in Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 z-40 pt-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, info) => {
                if (info.offset.x > 100) {
                  setShowMobileMenu(false);
                }
              }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 200,
                duration: 0.3 
              }}
              className="absolute right-0 top-16 w-64 h-full bg-white dark:bg-black border-l border-black/10 dark:border-white/10 cursor-grab active:cursor-grabbing"
            >
              <div className="p-6">
                <nav className="space-y-4">
                  <div className="pt-2 pb-3 space-y-1">
                    {navLinks.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => handleNavigation(link.path)}
                        className="block w-full text-left py-2 pl-3 pr-4 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        {link.name}
                      </button>
                    ))}
                    <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="pl-3 text-sm font-semibold text-gray-500 dark:text-gray-400">Tools</p>
                      {toolLinks.map((link) => (
                        <button
                          key={link.name}
                          onClick={() => handleNavigation(link.path)}
                          className="block w-full text-left py-2 pl-3 pr-4 text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {link.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mobile Chatbot – slides up from bottom */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: showMobileChat ? 0 : '100%' }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            if (info.offset.y > 100) {
              setShowMobileChat(false);
            }
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 200,
            duration: 0.3 
          }}
          className="fixed inset-x-0 bottom-0 z-50 cursor-grab active:cursor-grabbing"
        >
          <div className="h-[80vh] bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-black dark:to-blue-950/30 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-700/50 rounded-t-3xl shadow-2xl shadow-blue-500/10 relative">
            {/* Close button */}
            <button
              onClick={() => setShowMobileChat(false)}
              className="absolute top-6 right-4 z-20 p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
              aria-label="Close chat panel"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors" />
            </button>
            <div className="h-[80vh]">
              <Suspense fallback={
                <div className="h-full flex items-center justify-center bg-gradient-to-b from-transparent to-blue-50/20 dark:to-blue-950/20">
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading chat...</p>
                  </div>
                </div>
              }>
                <ChatbotPanel isMobile={true} />
              </Suspense>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ----------------------
  // Desktop Layout – Custom for invest page
  // ----------------------
  return (
    <div className="flex flex-col min-h-screen w-full relative">
      <LandingNavbar />
      
      <div className="flex-1 flex max-w-[1440px] w-full mx-auto px-4 sm:px-8 relative mb-24 gap-8">
        {/* Main Content - with top padding for mobile fixed header */}
        <div className="flex-1 min-w-0 pt-[90px] md:pt-0">
          <main className="w-full">{children}</main>
        </div>

        {/* Sticky Chatbot - positioned below header */}
        <div className="w-[40%] lg:w-[30%] flex-shrink-0 hidden md:block">
          {/* Adjusted top offset to account for floating navbar (approx 90px) */}
          <div className="sticky top-28 h-[calc(100vh-9rem)] z-30">
            <Suspense
              fallback={
                <div className="h-full flex flex-col bg-gradient-to-br from-slate-50/90 via-white/80 to-blue-50/50 dark:from-slate-900/90 dark:via-black/80 dark:to-blue-950/50 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl">
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">Loading chat...</p>
                    </div>
                  </div>
                </div>
              }
            >
              <ChatbotPanel />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
} 