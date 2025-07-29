'use client';

import { Suspense, useState, useEffect, useRef, useLayoutEffect } from 'react';
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
        {/* Mobile Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between p-4">
            <ThemeLogo />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMobileChat((prev) => !prev)}
                className="p-2.5 bg-[#1e88e5] hover:bg-[#1976d2] rounded-xl text-white transition-all duration-200 shadow-lg shadow-[#1e88e5]/25 hover:shadow-[#1e88e5]/40 hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              <ThemeSwitcher />
              <button
                onClick={() => setShowMobileMenu((prev) => !prev)}
                className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main content with top padding for fixed header and dynamic bottom padding for nav & device safe-area */}
        <main
          className="flex-1 pt-16 overflow-y-auto scroll-container"
          /* Reserve exactly the height of the bottom navigation (incl. safe-area) */
          style={{ paddingBottom: navHeight }}
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

        {/* Bottom Navigation */}
        <nav
          ref={navRef}
          className={`fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-black/10 dark:border-white/10 z-40 transition-transform duration-300 ${
            isKeyboardActive ? 'translate-y-full' : 'translate-y-0'
          }`}
          /* Keep nav buttons above device safe-area */
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="grid grid-cols-3 gap-1 p-1">
            <button
              onClick={() => handleNavigation('/')}
              className="flex flex-col items-center justify-center py-1 px-1 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              {/* Home icon */}
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-xs font-medium">Home</span>
            </button>
            <button
              onClick={() => handleNavigation('/check-oz')}
              className="flex flex-col items-center justify-center py-1 px-1 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              {/* MapPin icon */}
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs font-medium">Check OZ</span>
            </button>
            <button
              onClick={() => handleNavigation('/tax-calculator')}
              className="flex flex-col items-center justify-center py-1 px-1 text-xs text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              {/* Calculator icon */}
              <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs font-medium">Tax Calculator</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // ----------------------
  // Desktop Layout – Custom for invest page
  // ----------------------
  return (
    <div className="flex min-h-screen">
      {/* Custom Header for Desktop - spans only until chat panel */}
      <div className="fixed top-0 left-0 right-[35%] lg:right-[25%] z-40 bg-white/10 dark:bg-black/10 backdrop-blur-2xl">
                  <div className="flex items-center justify-between p-4 md:pl-8">
            <ThemeLogo />
            <div className="flex items-center gap-4">
              <CTAButton
                variant="text"
                size="lg"
                onClick={handleMarketplace}
                tooltip="Browse our listings of OZ deals."
                className="w-32 text-center px-3 py-2"
              >
                Listings
              </CTAButton>
              <ThemeSwitcher />
            </div>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mr-[35%] lg:mr-[25%] px-2 sm:px-3 lg:px-0 overflow-y-auto scroll-container">
        <main>{children}</main>
      </div>

      {/* Fixed Chatbot */}
      <div className="fixed right-0 top-0 h-screen w-[35%] lg:w-[25%] z-30">
        <Suspense
          fallback={
            <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-slate-900 dark:via-black dark:to-blue-950/50 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50">
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
  );
} 