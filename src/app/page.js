"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import OZMapVisualization from "./components/OZMapVisualization";
import HorizontalScrollSlideshow from "./components/HorizontalScrollSlideshow";
import ScrollDrivenPinnedText from "./components/ScrollDrivenPinnedText";
import OZListingsFooter from "./components/OZListingsFooter";
import { useAuthNavigation } from "../lib/auth/useAuthNavigation";
import { trackUserEvent } from "../lib/analytics/trackUserEvent";

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
  const { scrollY } = useScroll();
  const { navigateWithAuth } = useAuthNavigation();

  // Section refs
  const heroRef = useRef(null);
  const slideshowRef = useRef(null);
  const pinnedTextRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    let timeout;
    const sectionRefs = [heroRef, slideshowRef, pinnedTextRef, footerRef];

    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const threshold = 500;

        for (let ref of sectionRefs) {
          if (!ref.current) continue;
          const sectionTop = ref.current.offsetTop;
          if (Math.abs(scrollY - sectionTop) < threshold) {
            ref.current.scrollIntoView({ behavior: "smooth" });
            //console.log("Snapped to section:", ref.current); // Debugging
            break;
          }
        }
      }, 100); // debounce time
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  const handleSeeDashboard = async () => {
    await trackUserEvent("dashboard_accessed");
    window.location.href = process.env.NEXT_PUBLIC_DASH_URL;
  };

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
        className="relative flex flex-col min-h-screen overflow-hidden pt-16 md:flex-row"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <FloatingParticles />

        {/* Left Panel - Tagline and Copy - Responsive widths */}
        <motion.div
          className="relative z-10 flex w-full min-w-[260px] flex-col justify-center bg-white px-6 py-8 transition-colors duration-300 md:w-[45%] md:px-8 lg:w-[35%] lg:px-12 xl:w-[30%] dark:bg-black"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="max-w-lg">
            <motion.h1
              className="font-brand-black mb-6 text-2xl leading-tight font-black tracking-tight text-[#212C38] transition-colors duration-300 lg:text-3xl xl:text-4xl dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Premier{" "}
              <span className="font-brand-black text-[#1e88e5]">
                Marketplace
              </span>{" "}
              for
              <br />
              <span className="font-brand-black text-[#1e88e5]">OZ</span>{" "}
              Investments
            </motion.h1>

            <motion.ul
              className="font-brand-normal mb-8 list-disc list-inside space-y-2 text-base leading-relaxed text-gray-600 transition-colors duration-300 lg:text-lg dark:text-gray-400"
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
              className="flex flex-col justify-start gap-4 xl:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button
                onClick={handleSeeDashboard}
                className="w-full rounded-lg border-2 border-[#1e88e5] px-6 py-2 text-sm font-semibold text-center text-[#1e88e5] transition-all duration-300 hover:scale-105 hover:bg-[#1e88e5] hover:text-white xl:w-auto xl:whitespace-nowrap xl:px-8 xl:text-base dark:border-[#3b82f6] dark:text-[#3b82f6] dark:hover:bg-[#3b82f6]"
              >
                See Dashboard
              </button>
              <button
                onClick={handleSeeOZListings}
                className="w-full rounded-lg bg-[#1e88e5] px-6 py-2 text-sm font-semibold text-center text-white transition-all duration-300 hover:scale-105 hover:bg-[#1976d2] hover:shadow-lg xl:w-auto xl:whitespace-nowrap xl:px-8 xl:text-base dark:bg-[#3b82f6] dark:hover:bg-[#2563eb]"
              >
                See OZ Listings
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - OZ Map - Responsive widths */}
        <motion.div
          className="relative w-full overflow-hidden md:w-[55%] lg:w-[65%] xl:w-[70%]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="h-[50vh] w-full overflow-hidden px-2 sm:px-4 md:px-6 md:h-[calc(100vh-3rem)]">
            <OZMapVisualization />
          </div>
        </motion.div>
      </motion.section>

      {/* HORIZONTAL SCROLL SLIDESHOW */}
      <div ref={slideshowRef}>
        <HorizontalScrollSlideshow />
      </div>

      {/* SCROLL DRIVEN PINNED TEXT ANIMATION */}
      <div ref={pinnedTextRef}>
        <ScrollDrivenPinnedText />
      </div>

      {/* FOOTER */}
      <motion.div
        ref={footerRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <OZListingsFooter />
      </motion.div>
    </div>
  );
}
