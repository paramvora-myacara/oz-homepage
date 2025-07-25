"use client";

// src/app/dashboard/page.js

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import SlideContainer from "../../components/SlideContainer";
import ModernKpiDashboard from "../../components/ModernKpiDashboard";
import ClientOZMapLoader from "../../components/ClientOZMapLoader";
import OZInvestmentReasons from "../../components/OZInvestmentReasons";
import SourcesModal from "../../components/SourcesModal";
import ExitPopup from "../../components/ExitPopup";
import { useAuth } from "../../../lib/auth/AuthProvider";

function DashboardContent() {
  const [isSourcesModalOpen, setIsSourcesModalOpen] = useState(false);
  const [cameFromSlide, setCameFromSlide] = useState(null);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  // Refs for each scrollable section on mobile
  const mapSectionRef = useRef(null);
  const reasonsSectionRef = useRef(null);
  const kpiSectionRef = useRef(null);
  const { user, loading } = useAuth();
  const searchParams = useSearchParams();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track which section is currently visible on mobile using viewport midpoint
  useEffect(() => {
    if (!isMobile) return;

    const sections = [mapSectionRef, reasonsSectionRef, kpiSectionRef];

    const handleScroll = () => {
      const midPoint = window.scrollY + window.innerHeight / 2;
      let activeIndex = 0;

      sections.forEach((ref, idx) => {
        const el = ref.current;
        if (!el) return;
        const { offsetTop, offsetHeight } = el;
        if (midPoint >= offsetTop && midPoint < offsetTop + offsetHeight) {
          activeIndex = idx;
        }
      });

      setCurrentSection(activeIndex);
    };

    // Run once to set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // Check if user came from a "Speak to Ozzie" button
  useEffect(() => {
    const shouldOpenChat = searchParams.get('chat') === 'true';
    const isMobile = window.innerWidth < 768;
    
    if (shouldOpenChat && isMobile) {
      // Dispatch a custom event to open the mobile chat
      window.dispatchEvent(new CustomEvent('openMobileChat'));
      
      // Clean up the URL parameter without triggering a page reload
      const url = new URL(window.location);
      url.searchParams.delete('chat');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);

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
          console.log("Mouse leave detected:", e.clientY);
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

  // Callback from SlideContainer
  const handleSlideChange = useCallback((from, to) => {
    setCameFromSlide(from);
  }, []);

  const openSourcesModal = () => setIsSourcesModalOpen(true);
  const closeSourcesModal = () => setIsSourcesModalOpen(false);

  // Local component to ensure slide 2 opens scrolled to bottom
  const InvestmentReasonsSlide = ({ navigateToSlide, cameFrom }) => {
    const containerRef = useRef(null);

    // Set initial scroll position BEFORE first paint to avoid visible jump
    useLayoutEffect(() => {
      if (!containerRef.current) return;
      if (cameFrom === 2) {
        // Coming from slide 3 → scroll bottom
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      } else {
        // Ensure at top
        containerRef.current.scrollTop = 0;
      }
    }, [cameFrom]);

    return (
      <div
        ref={containerRef}
        data-scroll="true"
        className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-black"
      >
        <div className="flex-1">
          <OZInvestmentReasons />
        </div>
        {/* Navigation hints positioned in bottom right */}
        <div className="fixed right-8 bottom-20 z-50 flex gap-4 text-center md:right-[calc(35%+2rem)] md:bottom-8 lg:right-[calc(30%+2rem)] xl:right-[calc(25%+2rem)]">
          <div
            className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-xs text-black/60 backdrop-blur-sm transition-all duration-300 hover:bg-black/20 md:px-4 md:py-2 md:text-sm dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
            onClick={() => navigateToSlide(0)}
          >
            <svg
              className="mt-1 h-4 w-4 flex-shrink-0 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ animationDuration: "1.5s" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7 7 7"
              />
            </svg>
            <span className="leading-none">Back to map</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-2 rounded-full bg-black/10 px-3 py-1.5 text-xs text-black/60 backdrop-blur-sm transition-all duration-300 hover:bg-black/20 md:px-4 md:py-2 md:text-sm dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
            onClick={() => navigateToSlide(2)}
          >
            <span>Market overview</span>
            <svg
              className="h-4 w-4 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ animationDuration: "1.5s" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // Define slides for the slide deck with navigation callbacks
  const createSlides = (navigateToSlide) => [
    {
      id: "map",
      title: "Opportunity Zone Map",
      component: (
        <div
          className="scroll-container h-full w-full overflow-y-auto bg-white dark:bg-black"
          data-scroll="true"
        >
          <ClientOZMapLoader onNavigate={navigateToSlide} />
        </div>
      ),
    },
    {
      id: "investment-reasons",
      title: "Why Invest in OZs",
      component: (
        <InvestmentReasonsSlide
          navigateToSlide={navigateToSlide}
          cameFrom={cameFromSlide}
        />
      ),
    },
    {
      id: "overview",
      title: "Market Overview",
      component: (
        <div
          className="flex h-full w-full flex-col overflow-y-auto bg-white dark:bg-black"
          data-scroll="true"
        >
          {/* Market overview content */}
          <div className="flex-1">
            <ModernKpiDashboard />
          </div>
          {/* Navigation hints positioned in bottom right of overview */}
          <div className="fixed right-8 bottom-20 z-50 flex gap-4 text-center md:right-[calc(35%+2rem)] md:bottom-8 lg:right-[calc(30%+2rem)] xl:right-[calc(25%+2rem)]">
            <div
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/60 backdrop-blur-sm transition-all duration-300 hover:bg-black/10 md:bg-black/10 md:px-4 md:py-2 md:text-sm md:hover:bg-black/20 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
              onClick={openSourcesModal}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>Sources</span>
            </div>
            <div
              className="flex cursor-pointer items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 text-xs text-black/60 backdrop-blur-sm transition-all duration-300 hover:bg-black/10 md:bg-black/10 md:px-4 md:py-2 md:text-sm md:hover:bg-black/20 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
              onClick={() => navigateToSlide(1)}
            >
              <span>Back to investment reasons</span>
              <svg
                className="h-4 w-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ animationDuration: "1.5s" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7 7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Mobile scrollable layout
  if (isMobile) {
    return (
      <>
        <div className="min-h-screen w-full bg-white dark:bg-black overflow-y-auto">
          {/* Map Section */}
          <div ref={mapSectionRef} className="w-full">
            <ClientOZMapLoader />
          </div>
          
          {/* Section Divider 1 */}
          <div className="relative py-8 mt-4 mb-6 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center space-x-6">
                <div className="h-px w-24 bg-black/20 dark:bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30"></div>
                <div className="h-px w-24 bg-black/20 dark:bg-white/20"></div>
              </div>
            </div>
          </div>
          
          {/* Investment Reasons Section */}
          <div ref={reasonsSectionRef} className="w-full">
            <OZInvestmentReasons />
          </div>
          
          {/* Section Divider 2 */}
          <div className="relative py-8 mt-4 mb-6 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex items-center space-x-6">
                <div className="h-px w-24 bg-black/20 dark:bg-white/20"></div>
                <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30"></div>
                <div className="h-px w-24 bg-black/20 dark:bg-white/20"></div>
              </div>
            </div>
          </div>
          
          {/* KPI Dashboard Section */}
          <div ref={kpiSectionRef} className="min-h-screen w-full">
            <ModernKpiDashboard />
          </div>
          
          {/* Progress indicators - Fixed position on right side */}
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col space-y-3">
            <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
              currentSection === 0 ? 'bg-primary opacity-100' : 'bg-black/20 dark:bg-white/20 opacity-60'
            }`}></div>
            <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
              currentSection === 1 ? 'bg-primary opacity-100' : 'bg-black/20 dark:bg-white/20 opacity-60'
            }`}></div>
            <div className={`w-2 h-8 rounded-full transition-all duration-300 ${
              currentSection === 2 ? 'bg-primary opacity-100' : 'bg-black/20 dark:bg-white/20 opacity-60'
            }`}></div>
          </div>
        </div>
        
        {/* Sources button - Fixed position for mobile */}
        <div className="fixed bottom-20 right-8 z-50">
          <div
            className="bg-black/10 dark:bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-black/60 dark:text-white/60 flex items-center gap-2 cursor-pointer hover:bg-black/20 dark:hover:bg-white/20 transition-all duration-300"
            onClick={openSourcesModal}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Sources</span>
          </div>
        </div>
        
        <SourcesModal isOpen={isSourcesModalOpen} onClose={closeSourcesModal} />
        <ExitPopup open={showExitPopup} onClose={() => setShowExitPopup(false)} />
      </>
    );
  }

  // Desktop slide layout (unchanged)
  return (
    <>
      <SlideContainer slides={createSlides} onSlideChange={handleSlideChange} />
      <SourcesModal isOpen={isSourcesModalOpen} onClose={closeSourcesModal} />
      <ExitPopup open={showExitPopup} onClose={() => setShowExitPopup(false)} />
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
