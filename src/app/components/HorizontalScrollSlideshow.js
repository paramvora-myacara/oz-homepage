"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { slides } from "../data/slideshowData";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const HorizontalScrollSlideshow = () => {
  const containerRef = useRef(null);
  const tracksRef = useRef(null);
  const progressRef = useRef(null);
  const videoRef = useRef(null);
  const podcastVideoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState({});
  const [panelAnimations, setPanelAnimations] = useState({});
  const [isMobile, setIsMobile] = useState(null);
  const countupRef = useRef(null);

  // Helper function to open links in new tab
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to handle video play - opens in new tab without redirecting
  const handleVideoPlay = (videoId) => {
    openInNewTab(`https://www.youtube.com/watch?v=${videoId}`);
  };

  // Handle iframe load
  const handleIframeLoad = (slideIndex) => {
    setVideoLoaded((prev) => ({ ...prev, [slideIndex]: true }));
  };

  // Trigger panel animations when reaching the panel slide
  const triggerPanelAnimations = (slideIndex) => {
    if (slideIndex === 2) {
      // Third slide (index 2) has the panels
      setTimeout(() => {
        setPanelAnimations((prev) => ({ ...prev, panel0: true }));
      }, 200);
      setTimeout(() => {
        setPanelAnimations((prev) => ({ ...prev, panel1: true }));
      }, 400);
      setTimeout(() => {
        setPanelAnimations((prev) => ({ ...prev, panel2: true }));
      }, 600);
      setTimeout(() => {
        setPanelAnimations((prev) => ({ ...prev, panel3: true }));
      }, 800);
    }
  };

  // SSR-safe mobile detection
  useEffect(() => {
    // Only runs on client
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP Logic for desktop only
  useEffect(() => {
    if (isMobile !== false) return; // Skip GSAP logic on mobile

    const container = containerRef.current;
    const track = tracksRef.current;
    const progressBar = progressRef.current;

    if (!container || !track || !progressBar) return;

    // Calculate scroll distance using viewport units instead of pixel measurements
    // Each slide is 100vw, so total distance is (slides.length - 1) * 100vw
    const viewportWidth = window.innerWidth;
    const scrollDistance = (slides.length - 1) * viewportWidth;

    // Create the horizontal scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${scrollDistance * 2}`, // Increase scroll distance
        scrub: 0.5, // Smooth scrubbing
        pin: true, // Pin the container
        // pinType: "transform", // Can be smoother on some devices
        // fastScrollEnd: true, // Catches up immediately after fast scrolls
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (progress) => {
            const n = slides.length;
            const increment = 1 / (n - 1);
            const progressInSlides = progress * (n - 1);
            const lowerSlideIndex = Math.floor(progressInSlides);
            const progressBetweenSlides = progressInSlides - lowerSlideIndex;

            if (progressBetweenSlides > 0.5) {
              return (lowerSlideIndex + 1) / (n - 1);
            }
            return lowerSlideIndex / (n - 1);
          },
          duration: { min: 0.2, max: 0.5 },
          ease: "power2.inOut",
        },
        onEnter: () => {
          // Dispatch event when entering slideshow
          window.dispatchEvent(new CustomEvent("slideshow-enter"));
        },
        onLeave: () => {
          // Dispatch event when leaving slideshow
          window.dispatchEvent(new CustomEvent("slideshow-leave"));
        },
        onEnterBack: () => {
          // Dispatch event when re-entering slideshow from below
          window.dispatchEvent(new CustomEvent("slideshow-enter"));
        },
        onLeaveBack: () => {
          // Dispatch event when leaving slideshow going up
          window.dispatchEvent(new CustomEvent("slideshow-leave"));
        },
        onUpdate: (self) => {
          // Update progress bar
          gsap.set(progressBar, { width: `${self.progress * 100}%` });

          // Calculate current slide (0 to slides.length-1)
          const currentSlide = Math.round(self.progress * (slides.length - 1));

          // Trigger panel animations when reaching the panel slide
          triggerPanelAnimations(currentSlide);

          // Update slide indicators
          const indicators = document.querySelectorAll(".slide-indicator");
          indicators.forEach((indicator, index) => {
            if (index <= currentSlide) {
              indicator.style.width = "100%";
              indicator.style.opacity = "1";
            } else {
              indicator.style.width = "0%";
              indicator.style.opacity = "0.3";
            }
          });
        },
      },
    });

    // Add the horizontal movement using viewport-relative distance
    tl.to(track, {
      x: -scrollDistance,
      ease: "none",
    });

    // Cleanup function
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [isMobile]);

  // Refresh ScrollTrigger on resize with debouncing (desktop only)
  useEffect(() => {
    if (isMobile !== false) return;
    let resizeTimeout;
    const handleResize = () => {
      // Debounce resize events to avoid excessive recalculations
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [isMobile]);

  // Animate count-up for community card when shown
  useEffect(() => {
    if (panelAnimations.panel3 && countupRef.current) {
      let start = 0;
      const end = 1000;
      const duration = 1200;
      const step = Math.ceil(end / (duration / 16));
      let current = start;
      const el = countupRef.current;
      el.textContent = '0';
      const animate = () => {
        current += step;
        if (current >= end) {
          el.textContent = end.toLocaleString();
        } else {
          el.textContent = current.toLocaleString();
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [panelAnimations.panel3]);

  // Prevent hydration mismatch
  if (isMobile === null) return null;

  // -- MOBILE RENDER --
  if (isMobile) {
    return (
      <section ref={containerRef} className="relative">
        <div className="flex flex-col gap-8 py-8">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative min-h-[320px] w-full overflow-hidden rounded-xl bg-black shadow-lg"
            >
              {/* Panel Slide (4-panel grid) */}
              {slide.isPanelSlide ? (
                <div className="relative h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                  {/* Background pattern */}
                  <div className="pointer-events-none absolute inset-0 opacity-10">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #1e88e5 0%, transparent 50%),
                                            radial-gradient(circle at 75% 75%, #42a5f5 0%, transparent 50%)`,
                      }}
                    />
                  </div>
                  {/* 2x2 Panel Grid */}
                  <div className="relative z-10 grid grid-cols-2 grid-rows-2 gap-2 p-2">
                    {slide.panels.map((panel, panelIndex) => (
                      <div
                        key={panelIndex}
                        className="relative flex min-h-[140px] flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-700/20 bg-white/5"
                      >
                        {/* LinkedIn Panel */}
                        {panel.type === "linkedin" && (
                          <>
                            <iframe
                              src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${panel.linkedInPostId}`}
                              className="h-full w-full border-0"
                              title="LinkedIn post"
                              style={{
                                minHeight: 120,
                                background: "#fff",
                              }}
                            />
                            <div className="absolute top-2 left-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
                              {panel.title}
                            </div>
                          </>
                        )}
                        {/* Book Panel */}
                        {panel.type === "book" && (
                          <>
                            <Image
                              src={panel.img}
                              alt={panel.title}
                              fill
                              className="object-cover"
                              sizes="50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                              <h3 className="mb-1 text-base font-bold text-white">
                                {panel.title}
                              </h3>
                              <p className="mb-1 text-xs text-gray-200">
                                #1 Book on Opportunity Zones
                              </p>
                            </div>
                          </>
                        )}
                        {/* Podcast Panel */}
                        {panel.type === "podcast" && (
                          <>
                            <Image
                              src={`https://img.youtube.com/vi/${panel.videoId}/maxresdefault.jpg`}
                              alt={panel.title}
                              fill
                              className="object-cover"
                              sizes="50vw"
                            />
                            <div className="absolute inset-0 bg-black/60" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 opacity-90 shadow-2xl">
                                <div className="ml-1 h-0 w-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white"></div>
                              </div>
                            </div>
                            <div className="absolute right-2 bottom-2 left-2 text-center text-xs text-white">
                              {panel.title}
                            </div>
                          </>
                        )}
                        {/* Community Panel */}
                        {panel.type === "community" && (
                          <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1e88e5] to-[#42a5f5] p-2 text-white">
                            <svg
                              className="mb-2 h-8 w-8"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                            </svg>
                            <div className="mb-1 text-xs font-bold">
                              {panel.title}
                            </div>
                            <div className="mb-1 text-[10px] opacity-80">
                              {panel.description}
                            </div>
                            <div className="rounded bg-white/20 px-2 py-1 text-xs font-semibold">
                              Connect with 1,000+ members
                            </div>
                          </div>
                        )}
                        {/* Click overlay for panel */}
                        <button
                          className="absolute inset-0 z-10"
                          style={{ background: "transparent" }}
                          onClick={async () => {
                            if (panel.type === "podcast" && panel.videoId) {
                              openInNewTab(`https://www.youtube.com/watch?v=${panel.videoId}`);
                            } else if (panel.type === "community") {
                              await trackUserEvent(
                                "community_interest_expressed",
                              );
                              window.location.href = panel.link;
                            } else {
                              openInNewTab(panel.link);
                            }
                          }}
                          aria-label={`Go to ${panel.title}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Regular slide (video or image)
                <>
                  <div className="absolute inset-0">
                    {slide.videoId ? (
                      <Image
                        src={`https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`}
                        alt={slide.title}
                        fill
                        className={`object-cover ${slide.title === "OZ Listings Trailer" ? "opacity-50" : ""}`}
                        priority={index === 0}
                        sizes="100vw"
                      />
                    ) : (
                      <Image
                        src={slide.img}
                        alt={slide.title}
                        fill
                        className={`object-cover ${slide.title === "OZ Listings Trailer" ? "opacity-50" : ""}`}
                        priority={index === 0}
                        sizes="100vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="relative z-10 flex h-full min-h-[320px] flex-col items-center justify-center p-6 text-center text-white">
                    {/* Modern gradient backdrop for OZ Listings Trailer */}
                    {slide.title === "OZ Listings Trailer" && (
                      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-white/60 via-white/25 to-transparent dark:from-black/60 dark:via-black/25"></div>
                    )}
                    
                    <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center">
                      <h2 className={`mb-4 text-2xl font-bold ${
                        slide.title === "OZ Listings Trailer" 
                          ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                          : ""
                      }`}>{slide.title}</h2>
                      <p className={`mb-4 text-base opacity-90 ${
                        slide.title === "OZ Listings Trailer" 
                          ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]" 
                          : ""
                      }`}>
                        {slide.details}
                      </p>
                      <button
                        className="rounded-full bg-[#1e88e5] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1976d2] hover:shadow-xl hover:scale-105"
                        onClick={() => {
                          if (slide.videoId) {
                            openInNewTab(`https://www.youtube.com/watch?v=${slide.videoId}`);
                          } else if (slide.link.startsWith('http')) {
                            openInNewTab(slide.link);
                          } else {
                            window.location.href = slide.link;
                          }
                        }}
                      >
                        {slide.videoId ? "Watch Full Video" : "Learn More"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }
  // -- DESKTOP RENDER (original horizontal scroll) --
  return (
    <section ref={containerRef} className="relative">
      {/* Horizontal Slideshow */}
      <div className="h-screen w-full overflow-hidden bg-black">
        {/* Horizontal track containing all slides */}
        <div
          ref={tracksRef}
          className="flex h-full"
          style={{ width: `${slides.length * 100}vw` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative h-full w-screen flex-shrink-0">
              {/* Handle Panel Slide (asymmetric hero layout) */}
              {slide.isPanelSlide ? (
                <div className="relative h-full w-full bg-white dark:bg-black">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--primary-light) 0%, transparent 50%)`,
                      }}
                    />
                  </div>
                  {/* Asymmetric Grid Layout */}
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-6 p-8 md:p-12 lg:p-16">
                    {/* Podcast Hero Card (spans 2 rows, 2 cols) */}
                    <motion.div
                      className="relative col-span-2 row-span-2 flex flex-col justify-end overflow-hidden rounded-3xl glass-strong shadow-2xl border border-white/20 transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-3xl cursor-pointer"
                      style={{ minHeight: '340px' }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={panelAnimations.panel2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                      transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
                      onClick={() => handleVideoPlay(slide.panels[2].videoId)}
                    >
                      <Image
                        src={`https://img.youtube.com/vi/${slide.panels[2].videoId}/maxresdefault.jpg`}
                        alt={slide.panels[2].title}
                        fill
                        className="object-cover z-0 brightness-90"
                        sizes="50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8 text-center">
                        <div className="flex items-center justify-center mb-6">
                          <motion.div 
                            className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 opacity-90 shadow-2xl"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="ml-2 h-0 w-0 border-t-[12px] border-b-[12px] border-l-[20px] border-t-transparent border-b-transparent border-l-white"></div>
                          </motion.div>
                        </div>
                        <h3 className="mb-3 text-4xl md:text-5xl font-bold text-white drop-shadow-lg font-brand">
                          {slide.panels[2].title}
                        </h3>
                        <p className="text-xl md:text-2xl text-primary-light font-medium mb-4">Real investor experiences & lessons learned</p>
                        <motion.button
                          whileHover={{ scale: 1.05, backgroundColor: 'var(--primary-dark)' }}
                          whileTap={{ scale: 0.97 }}
                          className="mt-4 rounded-full bg-white text-primary px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-xl dark:bg-primary dark:text-white dark:hover:bg-primary-dark"
                          onClick={(e) => { e.stopPropagation(); handleVideoPlay(slide.panels[2].videoId); }}
                        >
                          Listen Now
                        </motion.button>
                      </div>
                    </motion.div>
                    {/* LinkedIn Card */}
                    <motion.div
                      className="relative col-span-2 row-span-1 flex flex-col overflow-hidden rounded-2xl glass-strong shadow-xl border border-white/20 transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={panelAnimations.panel0 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                      onClick={() => openInNewTab(slide.panels[0].link)}
                    >
                      <iframe
                        src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${slide.panels[0].linkedInPostId}`}
                        className="h-full w-full border-0 min-h-[180px] bg-white/95"
                        title="LinkedIn post"
                      />
                      <div className="absolute bottom-3 right-3 rounded-lg bg-primary/90 backdrop-blur-sm px-4 py-2 text-sm font-bold text-white shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                        </svg>
                        {slide.panels[0].title}
                      </div>
                    </motion.div>
                    {/* Book Card */}
                    <motion.div
                      className="relative col-span-1 row-span-1 flex flex-col overflow-hidden rounded-2xl glass-strong shadow-xl border border-white/20 transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={panelAnimations.panel1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
                      onClick={() => openInNewTab(slide.panels[1].link)}
                    >
                      <Image
                        src={slide.panels[1].img}
                        alt={slide.panels[1].title}
                        fill
                        className="object-cover"
                        sizes="25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent backdrop-blur-sm" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                        <h3 className="mb-2 text-xl font-bold text-white font-brand drop-shadow-lg">
                          {slide.panels[1].title}
                        </h3>
                        <p className="text-sm text-primary-light font-medium">#1 Book on Opportunity Zones</p>
                      </div>
                    </motion.div>
                    {/* Community Card with Count-Up */}
                    <motion.div
                      className="relative col-span-1 row-span-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-primary dark:via-primary dark:to-primary-dark rounded-2xl glass-strong shadow-xl border border-gray-200 dark:border-white/20 p-6 text-gray-900 dark:text-white transition-all duration-500 ease-out hover:scale-[1.02] cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={panelAnimations.panel3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                      transition={{ duration: 1, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
                      onClick={async () => { await trackUserEvent('community_interest_expressed'); window.location.href = slide.panels[3].link; }}
                    >
                      <div className="relative w-full h-full flex flex-col items-center justify-center text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 dark:bg-white/30 shadow-inner">
                          <svg className="h-6 w-6 text-primary dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                        </div>
                        <h3 className="mb-2 text-lg font-bold font-brand text-gray-900 dark:text-white">{slide.panels[3].title}</h3>
                        <p className="mb-3 text-sm text-gray-600 dark:text-white/90">{slide.panels[3].description}</p>
                        <div className="rounded-full bg-primary/20 dark:bg-white/30 backdrop-blur px-4 py-2 text-sm font-semibold flex items-center gap-1 shadow-lg">
                          <span ref={countupRef} className="countup text-xl text-primary dark:text-white" data-target="1000">0</span>
                          <span className="text-primary/80 dark:text-white/90">+ members</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              ) : (
                // Regular slide layout (video or image)
                <>
                  {/* Background - Video or Image */}
                  <div className="absolute inset-0">
                    {slide.videoId ? (
                      slide.staticThumbnail ? (
                        // Static YouTube thumbnail only
                        <>
                          <Image
                            src={`https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`}
                            alt={slide.title}
                            fill
                            className={`object-cover ${slide.title === "OZ Listings Trailer" ? "opacity-50" : ""}`}
                            priority={index === 0}
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                          {/* Only show play button if not the OZ Listings Trailer */}
                          {slide.title !== "OZ Listings Trailer" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 opacity-80">
                                <div className="ml-1 h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white"></div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // YouTube embed with thumbnail preload and autoplay
                        <div className="relative h-full w-full">
                          {/* YouTube Thumbnail - shows first, hides when video loads */}
                          <div
                            className={`absolute inset-0 transition-opacity duration-500 ${
                              videoLoaded[index]
                                ? "pointer-events-none opacity-0"
                                : "opacity-100"
                            }`}
                          >
                            <Image
                              src={`https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`}
                              alt={slide.title}
                              fill
                              className={`object-cover ${slide.title === "OZ Listings Trailer" ? "opacity-50" : ""}`}
                              priority={index === 0}
                              sizes="100vw"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            {/* Only show play button if not the OZ Listings Trailer */}
                            {slide.title !== "OZ Listings Trailer" && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 opacity-80">
                                <div className="ml-1 h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white"></div>
                              </div>
                            </div>
                            )}
                          </div>

                          {/* YouTube iframe - loads behind thumbnail */}
                          <iframe
                            ref={
                              index === 0
                                ? videoRef
                                : index === 1
                                  ? podcastVideoRef
                                  : null
                            }
                            src={`https://www.youtube.com/embed/${slide.videoId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${slide.videoId}&rel=0&modestbranding=1&cc_load_policy=1`}
                            title={slide.title}
                            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                              videoLoaded[index] ? "opacity-100" : "opacity-0"
                            }`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            onLoad={() => handleIframeLoad(index)}
                          />
                          <div className="pointer-events-none absolute inset-0 bg-black/40" />
                        </div>
                      )
                    ) : (
                      // Regular image background for non-video slides
                      <>
                        <Image
                          src={slide.img}
                          alt={slide.title}
                          fill
                          className={`object-cover ${slide.title === "OZ Listings Trailer" ? "opacity-50" : ""}`}
                          priority={index === 0}
                          sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-full items-center justify-center">
                    {/* Modern gradient backdrop for OZ Listings Trailer */}
                    {slide.title === "OZ Listings Trailer" && (
                      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-white/60 via-white/25 to-transparent dark:from-black/60 dark:via-black/25"></div>
                    )}
                    
                    <motion.div
                      className="relative z-10 mx-auto max-w-4xl px-6 text-center text-white"
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.4, 0, 0.2, 1],
                        delay: index * 0.1,
                      }}
                      viewport={{ once: true, margin: "-20%" }}
                    >
                      <h2 className={`mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl ${
                        slide.title === "OZ Listings Trailer" 
                          ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" 
                          : ""
                      }`}>
                        {slide.title}
                      </h2>
                      <p className={`mx-auto mb-8 max-w-2xl text-lg leading-relaxed opacity-90 md:text-xl lg:text-2xl ${
                        slide.title === "OZ Listings Trailer" 
                          ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" 
                          : ""
                      }`}>
                        {slide.details}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full bg-[#1e88e5] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1976d2] hover:shadow-xl"
                        onClick={() => {
                          if (slide.videoId) {
                            handleVideoPlay(slide.videoId);
                          } else if (slide.link.startsWith('http')) {
                            openInNewTab(slide.link);
                          } else {
                            window.location.href = slide.link;
                          }
                        }}
                      >
                        {slide.videoId ? "Watch Full Video" : "Learn More"}
                      </motion.button>
                    </motion.div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 right-0 left-0 z-30 h-1 bg-white/20">
          <div
            ref={progressRef}
            className="h-full bg-[#1e88e5] transition-all duration-100"
            style={{ width: "0%" }}
          />
        </div>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 transform space-x-4">
          {slides.map((_, index) => (
            <div key={index} className="relative">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/30">
                <div
                  className="slide-indicator h-full rounded-full bg-[#1e88e5] transition-all duration-500 ease-out"
                  style={{
                    width: index === 0 ? "100%" : "0%",
                    opacity: index === 0 ? "1" : "0.3",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalScrollSlideshow;
