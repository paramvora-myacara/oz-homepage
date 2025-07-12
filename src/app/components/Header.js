"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ThemeLogo from "./ThemeLogo";
import CTAButton from "./CTAButton";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";

export default function Header() {
  const [isInSlideshow, setIsInSlideshow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const { navigateWithAuth } = useAuthNavigation();

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
    navigateWithAuth('/qualify-investor');
  };

  const handleSpeakToOzzieAI = () => {
    navigateWithAuth('/ozzie-ai');
  };

  const handleSpeakToTeam = () => {
    navigateWithAuth('/contact-team');
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

          <ThemeSwitcher />
        </div>
      </div>
    </motion.header>
  );
} 