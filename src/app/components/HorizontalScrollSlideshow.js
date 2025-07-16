"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { slides } from "../data/slideshowData";

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

  // Function to handle video play - now opens in new tab
  const handleVideoPlay = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
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

  useEffect(() => {
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
        end: () => `+=${scrollDistance}`,
        scrub: 1, // Smooth scrubbing
        pin: true, // Pin the container
        anticipatePin: 1,
        invalidateOnRefresh: true,
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
  }, []);

  // Refresh ScrollTrigger on resize with debouncing
  useEffect(() => {
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
  }, []);

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
              {/* Handle Panel Slide (4-panel layout) */}
              {slide.isPanelSlide ? (
                <div className="relative h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, #1e88e5 0%, transparent 50%),
                                          radial-gradient(circle at 75% 75%, #42a5f5 0%, transparent 50%)`,
                      }}
                    />
                  </div>

                  {/* Full-Screen 4-Panel Grid - No Title, No Gaps */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    {slide.panels.map((panel, panelIndex) => (
                      <motion.div
                        key={panelIndex}
                        className="relative overflow-hidden border-2 border-gray-700/20"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={
                          panelAnimations[`panel${panelIndex}`]
                            ? {
                                opacity: 1,
                                scale: 1,
                              }
                            : {
                                opacity: 0,
                                scale: 0.8,
                              }
                        }
                        transition={{
                          duration: 0.8,
                          ease: [0.25, 0.1, 0.25, 1],
                          delay: panelIndex * 0.2,
                        }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {/* Panel Content */}
                        {panel.type === "linkedin" && (
                          <div className="relative h-full w-full bg-white">
                            <iframe
                              src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${panel.linkedInPostId}`}
                              className="h-full w-full border-0"
                              title="LinkedIn post"
                              style={{
                                transform: "scale(1)",
                                transformOrigin: "center center",
                              }}
                            />
                            {/* Panel Title Overlay */}
                            <div className="absolute top-4 left-4 rounded-lg bg-black/80 px-4 py-2 text-white">
                              <h3 className="text-lg font-bold">
                                {panel.title}
                              </h3>
                            </div>
                          </div>
                        )}

                        {panel.type === "book" && (
                          <div className="relative h-full w-full">
                            <Image
                              src={panel.img}
                              alt={panel.title}
                              fill
                              className="object-cover"
                              sizes="50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                              <h3 className="mb-4 text-3xl font-bold text-white">
                                {panel.title}
                              </h3>
                              <p className="mb-6 text-xl text-gray-200">
                                #1 Book on Opportunity Zones
                              </p>
                              <p className="max-w-md text-lg leading-relaxed text-gray-300">
                                The comprehensive guide to maximizing your
                                Opportunity Zone investments
                              </p>
                            </div>
                          </div>
                        )}

                        {panel.type === "podcast" && (
                          <div className="relative h-full w-full">
                            <div className="absolute inset-0">
                              <Image
                                src={`https://img.youtube.com/vi/${panel.videoId}/maxresdefault.jpg`}
                                alt={panel.title}
                                fill
                                className="object-cover"
                                sizes="50vw"
                              />
                              <div className="absolute inset-0 bg-black/60" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 opacity-90 shadow-2xl">
                                  <div className="ml-1 h-0 w-0 border-t-[10px] border-b-[10px] border-l-[16px] border-t-transparent border-b-transparent border-l-white"></div>
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                              <h3 className="mb-4 text-3xl font-bold text-white">
                                {panel.title}
                              </h3>
                              <p className="text-xl text-gray-200">
                                Real investor experiences & lessons learned
                              </p>
                            </div>
                          </div>
                        )}

                        {panel.type === "community" && (
                          <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1e88e5] to-[#42a5f5] p-12 text-white">
                            <div className="text-center">
                              <div className="mx-auto mb-8 flex h-18 w-18 items-center justify-center rounded-full bg-white/20 sm:mb-4 md:mb-8">
                                <svg
                                  className="h-12 w-12"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                </svg>
                              </div>
                              <h3 className="mb-6 text-3xl font-bold sm:mb-3 md:mb-6">
                                {panel.title}
                              </h3>
                              <p className="mb-8 max-w-lg text-lg leading-relaxed opacity-90 sm:mb-4 sm:text-sm md:mb-8 md:text-lg">
                                {panel.description}
                              </p>
                              <div className="rounded-full bg-white/20 px-6 py-3 text-lg font-semibold sm:text-sm md:text-lg">
                                Connect with 1,000+ members
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Click overlay */}
                        <div
                          className="absolute inset-0 z-10 cursor-pointer"
                          onClick={() => {
                            if (panel.type === "podcast" && panel.videoId) {
                              handleVideoPlay(panel.videoId);
                            } else {
                              window.open(panel.link, "_blank");
                            }
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                // Regular slide layout (video or image)
                <>
                  {/* Background - Video or Image */}
                  <div className="absolute inset-0">
                    {slide.videoId ? (
                      // YouTube embed with thumbnail preload
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
                            className="object-cover"
                            priority={index === 0}
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 opacity-80">
                              <div className="ml-1 h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] border-t-transparent border-b-transparent border-l-white"></div>
                            </div>
                          </div>
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
                          style={{
                            transform: "scale(1.1) translateY(-5%)",
                            transformOrigin: "center center",
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-black/40" />
                      </div>
                    ) : (
                      // Regular image background for non-video slides
                      <>
                        <Image
                          src={slide.img}
                          alt={slide.title}
                          fill
                          className="object-cover"
                          priority={index === 0}
                          sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                      </>
                    )}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex h-full items-center justify-center">
                    <motion.div
                      className="mx-auto max-w-4xl px-6 text-center text-white"
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        ease: [0.4, 0, 0.2, 1],
                        delay: index * 0.1,
                      }}
                      viewport={{ once: true, margin: "-20%" }}
                    >
                      <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                        {slide.title}
                      </h2>
                      <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed opacity-90 md:text-xl lg:text-2xl">
                        {slide.details}
                      </p>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-full bg-[#1e88e5] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1976d2] hover:shadow-xl"
                        onClick={() => {
                          if (slide.videoId) {
                            handleVideoPlay(slide.videoId);
                          } else {
                            window.open(slide.link, "_blank");
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
