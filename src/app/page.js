"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import OZMapVisualization from "./components/OZMapVisualization";
import ScrollDrivenPinnedText from "./components/ScrollDrivenPinnedText";
import InvestmentComparisonChart from "./components/InvestmentComparisonChart"; // Import the new component
import OZListingsFooter from "./components/OZListingsFooter";
import { useAuthNavigation } from "../lib/auth/useAuthNavigation";
import { useAuth } from "../lib/auth/AuthProvider";
import { trackUserEvent } from "../lib/analytics/trackUserEvent";
import ExitPopup from "./components/ExitPopup"; // Adjust path as needed
import CTASection from "./components/CTASection";
import ClickableScrollIndicator from "./components/ClickableScrollIndicator";
import Link from "next/link";
import LegalModal from "./components/LegalModal";

const primary = "text-[#1e88e5]"; // Blue from OZ Listings logo

// Enhanced animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
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
      className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-[#1e88e5] to-[#42a5f5]"
      style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
    />
  );
};

export default function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { navigateWithAuth } = useAuthNavigation();
  const { user, loading } = useAuth();
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [legalModal, setLegalModal] = useState({ open: false, type: null });

  // Cleanup any orphaned manual tooltips on component unmount or navigation
  useEffect(() => {
    const cleanupTooltips = () => {
      const existingTooltips = document.querySelectorAll(
        '[style*="position: fixed"][style*="z-index: 9999"]',
      );
      existingTooltips.forEach((tooltip) => tooltip.remove());
    };

    const handleBeforeUnload = () => cleanupTooltips();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanupTooltips();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cleanupTooltips();
    };
  }, []);

  // Section refs
  const heroRef = useRef(null);
  const slideshowRef = useRef(null);
  const pinnedTextRef = useRef(null);
  const ctaSectionRef = useRef(null);
  const footerRef = useRef(null);
  const investmentComparisonChartRef = useRef(null);
  const scrollDrivenPinnedTextRef = useRef(null);

  // Ensure page stays at top on refresh
  useEffect(() => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    // Exit intent detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Helper to show popup only once per session
    const showPopupIfNotShown = (popstate) => {
      if (!sessionStorage.getItem("exitPopupShown")) {
        setShowExitPopup(true);
        sessionStorage.setItem("exitPopupShown", "true");
        if (!popstate) {
          // Remove dummy state for Back button to work as expected after popup
          window.history.back();
        }
      }
    };

    if (!loading && !user) {
      // Push a dummy state to the history stack to detect Back navigation using navigation guestures, trackpad, keyboard, etc.
      window.history.pushState({ page: "homepage" }, "", window.location.href);
      if (isMobile) {
        // For mobile and navigation gestures (including trackpad/keyboard navigation)
        const handlePopState = (e) => {
          showPopupIfNotShown(true);
        };
        window.addEventListener("popstate", handlePopState);

        return () => {
          window.removeEventListener("popstate", handlePopState);
        };
      } else {
        // For desktop, use mouseleave event to detect exit intent
        const handleMouseLeave = (e) => {
          if (e.clientY < 0) {
            showPopupIfNotShown(false);
          }
        };
        document.addEventListener("mouseleave", handleMouseLeave);

        // Also catch navigation gestures (trackpad/keyboard) on desktop
        const handlePopState = (e) => {
          showPopupIfNotShown(true);
        };
        window.addEventListener("popstate", handlePopState);

        return () => {
          document.removeEventListener("mouseleave", handleMouseLeave);
          window.removeEventListener("popstate", handlePopState);
        };
      }
    }
  }, [loading, user]);



  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const handleSeeOZListings = async () => {
    await trackUserEvent("viewed_listings");
    navigateWithAuth("/listings");
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-white text-[#212C38] transition-colors duration-300 dark:bg-black dark:text-white">
      <ScrollProgress />

      {/* HERO SECTION - Responsive Two Panel Layout */}
      <motion.section
        ref={heroRef}
        className="relative flex min-h-screen flex-col overflow-hidden pt-8 sm:pt-12 md:flex-row md:pt-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <FloatingParticles />

        {/* Left Panel - Tagline and Copy - Responsive widths */}
        <motion.div
          className="relative z-10 flex w-full min-w-[220px] flex-col justify-center bg-white px-4 py-8 transition-colors duration-300 sm:px-6 md:w-[45%] md:px-8 lg:w-[35%] lg:px-12 xl:w-[30%] dark:bg-black"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-lg">
            <motion.h1
              className="font-brand-black mb-6 text-2xl leading-tight font-black tracking-tight text-[#212C38] transition-colors duration-300 sm:text-3xl md:text-3xl lg:text-4xl dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              The Premier{" "}
              <span className="font-brand-black text-[#1e88e5]">
                Marketplace
              </span>{" "}
              for
              <br />
              <span className="font-brand-black text-[#1e88e5]">Opportunity Zone</span>{" "}
              Investments
            </motion.h1>

            <motion.ul
              className="font-brand-normal mb-8 list-inside list-disc space-y-2 text-base leading-relaxed text-gray-600 transition-colors duration-300 sm:text-lg dark:text-gray-400"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.6 },
                },
              }}
            >
              <motion.li
                variants={fadeInUp}
                className="transition-colors duration-300"
              >
                Save on federal capital gains taxes.
              </motion.li>
              <motion.li
                variants={fadeInUp}
                className="transition-colors duration-300"
              >
                Be part of eradicating America&apos;s housing crisis.
              </motion.li>
              <motion.li
                variants={fadeInUp}
                className="transition-colors duration-300"
              >
                Make strategic Opportunity Zone investments.
              </motion.li>
            </motion.ul>

            <motion.div
              className="flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="relative w-full">
                <button
                  onClick={(e) => {
                    // Clean up any existing tooltip before navigation
                    if (e.currentTarget._tooltip) {
                      e.currentTarget._tooltip.remove();
                      e.currentTarget._tooltip = null;
                    }
                    // Also clean up any orphaned tooltips
                    const existingTooltips = document.querySelectorAll(
                      '[style*="position: fixed"][style*="z-index: 9999"]',
                    );
                    existingTooltips.forEach((tooltip) => tooltip.remove());

                    handleSeeOZListings();
                  }}
                  className="w-full rounded-lg bg-[#1e88e5] px-8 py-4 text-center text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-[#1976d2] hover:shadow-lg dark:bg-[#3b82f6] dark:hover:bg-[#2563eb]"
                  onMouseEnter={(e) => {
                    const tooltip = document.createElement("div");
                    tooltip.className =
                      "fixed px-4 py-3 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs";
                    tooltip.innerHTML =
                      '<div class="whitespace-normal leading-relaxed">Jumps straight to the marketplace of live Opportunity-Zone investment listings.</div>';
                    tooltip.style.position = "fixed";
                    tooltip.style.left = e.clientX + 10 + "px";
                    tooltip.style.top = e.clientY + 25 + "px";
                    tooltip.style.backgroundColor = "rgba(17, 24, 39, 0.8)";
                    tooltip.style.backdropFilter = "blur(8px)";
                    tooltip.style.webkitBackdropFilter = "blur(8px)";
                    tooltip.style.zIndex = "9999";
                    document.body.appendChild(tooltip);
                    e.currentTarget._tooltip = tooltip;
                  }}
                  onMouseMove={(e) => {
                    if (e.currentTarget._tooltip) {
                      let x = e.clientX + 10;
                      let y = e.clientY + 25;

                      // Prevent tooltip from going off-screen
                      const tooltipRect =
                        e.currentTarget._tooltip.getBoundingClientRect();

                      // Center tooltip horizontally with respect to cursor
                      x = e.clientX - tooltipRect.width / 2;

                      if (x + tooltipRect.width > window.innerWidth) {
                        x = e.clientX - tooltipRect.width - 10;
                      }
                      if (y + tooltipRect.height > window.innerHeight) {
                        y = e.clientY - tooltipRect.height - 10;
                      }
                      if (x < 0) x = 10;
                      if (y < 0) y = 10;

                      e.currentTarget._tooltip.style.left = x + "px";
                      e.currentTarget._tooltip.style.top = y + "px";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (e.currentTarget._tooltip) {
                      e.currentTarget._tooltip.remove();
                      e.currentTarget._tooltip = null;
                    }
                  }}
                >
                  See OZ <i>Listings</i>™
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - OZ Map - Responsive widths - Hide on Mobile*/}
        <motion.div
          className="relative flex w-full items-center justify-center px-2 sm:px-4 md:w-[55%] md:px-6 lg:w-[65%] xl:w-[70%]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="h-[60vh] min-h-[320px] w-full overflow-hidden px-2 sm:h-[50vh] sm:min-h-[400px] sm:px-4 md:h-[calc(100vh-3rem)] md:min-h-0 md:px-6">
            <OZMapVisualization />
          </div>
        </motion.div>

      </motion.section>

      {/* INVESTMENT COMPARISON CHART */}
      <div ref={investmentComparisonChartRef} className="relative pb-16">
        <InvestmentComparisonChart />
      </div>


      {/* SCROLL DRIVEN PINNED TEXT ANIMATION */}
      <div ref={pinnedTextRef} className="relative">
        <ScrollDrivenPinnedText />
      </div>



      {/* CTA SECTION */}
      <div ref={ctaSectionRef}>
        <CTASection />
      </div>

      {/* FOOTER */}
      <motion.div
        ref={footerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <OZListingsFooter
          openLegalModal={(type) => setLegalModal({ open: true, type })}
        />
        <LegalModal
          open={legalModal.open}
          onClose={() => setLegalModal({ open: false, type: null })}
          type={legalModal.type}
        />
      </motion.div>
      
      {/* Fixed Scroll Indicator */}
      <ClickableScrollIndicator />
      
      <ExitPopup open={showExitPopup} onClose={() => setShowExitPopup(false)} />
    </div>
  );
}
