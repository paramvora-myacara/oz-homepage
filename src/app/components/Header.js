"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LogOut, Menu } from "lucide-react";
import ThemeLogo from "./ThemeLogo";
import CTAButton from "./CTAButton";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";
import { useAuth } from "../../lib/auth/AuthProvider";

export default function Header() {
  const [isInSlideshow, setIsInSlideshow] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false); // Hamburger menu state
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
    window.addEventListener("slideshow-enter", handleSlideshowEnter);
    window.addEventListener("slideshow-leave", handleSlideshowLeave);
    window.addEventListener("footer-enter", handleFooterEnter);
    window.addEventListener("footer-leave", handleFooterLeave);

    return () => {
      window.removeEventListener("slideshow-enter", handleSlideshowEnter);
      window.removeEventListener("slideshow-leave", handleSlideshowLeave);
      window.removeEventListener("footer-enter", handleFooterEnter);
      window.removeEventListener("footer-leave", handleFooterLeave);
    };
  }, []);

  const handleQualifyAsInvestor = () => {
    window.location.href = process.env.NEXT_PUBLIC_QUALIFY_INVEST_URL;
  };

  const handleSpeakToOzzieAI = () => {
    window.location.href = process.env.NEXT_PUBLIC_DASH_URL;
  };

  const handleSpeakToTeam = () => {
    navigateWithAuth("/contact-team");
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (!isVisible) return null;

  return (
    <motion.header
      className={`fixed top-0 right-0 left-0 z-50 p-2 transition-all duration-500 sm:p-3 md:p-8 ${
        isInSlideshow
          ? "bg-transparent backdrop-blur-none"
          : "bg-white/80 backdrop-blur-md dark:bg-black/80"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <div className="flex w-full items-center justify-between">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <ThemeLogo />
        </div>

        {/* Hamburger icon for mobile */}
        <button
          className="rounded p-2 focus:ring-2 focus:ring-[#1e88e5] focus:outline-none sm:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Open menu"
        >
          <Menu size={28} />
        </button>

        {/* CTA Buttons and Theme Switcher on the extreme right */}
        <div className="hidden flex-row items-center gap-2 sm:flex">
          <CTAButton variant="text" size="sm" onClick={handleQualifyAsInvestor}>
            Qualify as an Investor
          </CTAButton>

          <CTAButton variant="text" size="sm" onClick={handleSpeakToOzzieAI}>
            Speak to Ozzie AI
          </CTAButton>

          <CTAButton variant="filled" size="sm" onClick={handleSpeakToTeam}>
            Schedule a call
          </CTAButton>

          {/* Logout button - only show when user is logged in */}
          {user && (
            <motion.button
              onClick={handleLogout}
              className="rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 focus:outline-none dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900"
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
                  className="text-gray-700 transition-colors duration-300 dark:text-gray-300"
                />
              </motion.div>
            </motion.button>
          )}

          <ThemeSwitcher />
        </div>
      </div>
      {/* Mobile dropdown menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-2 flex flex-col gap-2 rounded-lg bg-white p-4 shadow-lg sm:hidden dark:bg-black"
        >
          <CTAButton
            variant="text"
            size="sm"
            onClick={() => {
              setMenuOpen(false);
              handleQualifyAsInvestor();
            }}
          >
            Qualify as an Investor
          </CTAButton>
          <CTAButton
            variant="text"
            size="sm"
            onClick={() => {
              setMenuOpen(false);
              handleSpeakToOzzieAI();
            }}
          >
            Speak to Ozzie AI
          </CTAButton>
          <CTAButton
            variant="filled"
            size="sm"
            onClick={() => {
              setMenuOpen(false);
              handleSpeakToTeam();
            }}
          >
            Schedule a call
          </CTAButton>
          {user && (
            <button
              onClick={async () => {
                setMenuOpen(false);
                await handleLogout();
              }}
              className="flex items-center gap-2 rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 focus:outline-none dark:hover:bg-gray-800 dark:focus:ring-offset-gray-900"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut
                size={20}
                className="text-gray-700 transition-colors duration-300 dark:text-gray-300"
              />
              <span>Log out</span>
            </button>
          )}
          <ThemeSwitcher />
        </motion.div>
      )}
    </motion.header>
  );
}
