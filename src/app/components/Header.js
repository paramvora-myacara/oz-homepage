"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LogOut } from 'lucide-react';
import ThemeLogo from "./ThemeLogo";
import CTAButton from "./CTAButton";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";
import { useAuth } from "../../lib/auth/AuthProvider";

export default function Header() {
  const [isInSlideshow, setIsInSlideshow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { navigateWithAuth } = useAuthNavigation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleSlideshowEnter = () => {
      setIsInSlideshow(true);
    };

    const handleSlideshowLeave = () => {
      setIsInSlideshow(false);
    };

    const handleFooterEnter = () => {
      setIsVisible(false);
    };

    const handleFooterLeave = () => {
      setIsVisible(true);
    };

    // Listen for slideshow and footer events
    window.addEventListener('slideshow-enter', handleSlideshowEnter);
    window.addEventListener('slideshow-leave', handleSlideshowLeave);
    window.addEventListener('footer-enter', handleFooterEnter);
    window.addEventListener('footer-leave', handleFooterLeave);

    return () => {
      window.removeEventListener('slideshow-enter', handleSlideshowEnter);
      window.removeEventListener('slideshow-leave', handleSlideshowLeave);
      window.removeEventListener('footer-enter', handleFooterEnter);
      window.removeEventListener('footer-leave', handleFooterLeave);
    };
  }, []);

  const handleQualifyAsInvestor = () => {
    window.location.href = process.env.NEXT_PUBLIC_QUALIFY_INVEST_URL;
  };

  const handleSpeakToOzzieAI = () => {
    window.location.href = process.env.NEXT_PUBLIC_DASH_URL;
  };

  const handleSpeakToTeam = () => {
    navigateWithAuth('/contact-team');
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!isVisible) return null;

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 p-8 transition-all duration-500 ${
        isInSlideshow 
          ? 'bg-transparent backdrop-blur-none' 
          : 'bg-white/80 dark:bg-black/80 backdrop-blur-md'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <ThemeLogo />
        </div>
        
        {/* CTA Buttons and Theme Switcher on the extreme right */}
        <div className="flex items-center gap-3">
          <CTAButton 
            variant="text" 
            size="sm"
            onClick={handleQualifyAsInvestor}
          >
            Qualify as an Investor
          </CTAButton>
          
          <CTAButton 
            variant="text" 
            size="sm"
            onClick={handleSpeakToOzzieAI}
          >
            Speak to Ozzie AI
          </CTAButton>

          <CTAButton 
            variant="filled" 
            size="sm"
            onClick={handleSpeakToTeam}
          >
            Speak to the Team
          </CTAButton>

          {/* Logout button - only show when user is logged in */}
          {user && (
            <motion.button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Log out"
              aria-label="Log out"
            >
              <motion.div
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <LogOut 
                  size={20} 
                  className="text-gray-700 dark:text-gray-300 transition-colors duration-300" 
                />
              </motion.div>
            </motion.button>
          )}

          <ThemeSwitcher />
        </div>
      </div>
    </motion.header>
  );
} 