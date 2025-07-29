"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { slides } from "../data/slideshowData";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";

const HorizontalScrollSlideshow = () => {
  const [isMobile, setIsMobile] = useState(null);

  // Helper function to open links in new tab
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // SSR-safe mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent hydration mismatch
  if (isMobile === null) return null;

  return (
    <section className="relative">
      <div className="mx-4 md:mx-8 lg:mx-12 xl:mx-16 flex flex-col py-8 pt-24 md:pt-32">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative w-full overflow-hidden rounded-xl shadow-lg mb-8"
            style={{
              minHeight: '100vh',
              height: '100vh'
            }}
          >
            {/* Panel Slide (4-panel grid) */}
            {slide.isPanelSlide ? (
              <div className="relative h-full w-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Background pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-5">
                  <div
                    className="h-full w-full"
                    style={{
                      backgroundImage: `radial-gradient(circle at 25% 25%, #1e88e5 0%, transparent 50%),
                                          radial-gradient(circle at 75% 75%, #42a5f5 0%, transparent 50%)`,
                    }}
                  />
                </div>
                {/* Panel Grid Layout */}
                <div className="relative z-10 grid h-full grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6 lg:p-8">
                  {slide.panels.map((panel, panelIndex) => (
                    <div
                      key={panelIndex}
                      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-lg border border-gray-700/20 bg-white/5 ${
                        panelIndex === 0 ? 'lg:col-start-1 lg:row-start-1' : 
                        panelIndex === 1 ? 'lg:col-start-1 lg:row-start-2' : 
                        panelIndex === 2 ? 'lg:col-start-2 lg:row-span-2' : ''
                      }`}
                    >
                      {/* LinkedIn Panel */}
                      {panel.type === "linkedin" && (
                        <>
                          <iframe
                            src={`https://www.linkedin.com/embed/feed/update/urn:li:activity:${panel.linkedInPostId}`}
                            className="h-full w-full border-0"
                            title="LinkedIn post"
                            style={{
                              minHeight: 200,
                              background: "#fff",
                            }}
                          />
                          <div className="absolute top-3 left-3 rounded bg-black/80 px-3 py-1 text-sm text-white">
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
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                            <h3 className="mb-2 text-lg md:text-xl font-bold text-white">
                              {panel.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-200">
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
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-black/60" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-red-600 opacity-90 shadow-2xl">
                              <div className="ml-1 h-0 w-0 border-t-[8px] border-b-[8px] border-l-[12px] md:border-t-[10px] md:border-b-[10px] md:border-l-[16px] border-t-transparent border-b-transparent border-l-white"></div>
                            </div>
                          </div>
                          <div className="absolute right-3 bottom-3 left-3 text-center text-sm md:text-base text-white">
                            {panel.title}
                          </div>
                        </>
                      )}
                      {/* Community Panel */}
                      {panel.type === "community" && (
                        <div className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#1e88e5] to-[#42a5f5] p-4 text-white">
                          <svg
                            className="mb-3 h-10 w-10 md:h-12 md:w-12"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                          </svg>
                          <div className="mb-2 text-sm md:text-base font-bold">
                            {panel.title}
                          </div>
                          <div className="mb-2 text-xs md:text-sm opacity-80 text-center">
                            {panel.description}
                          </div>
                          <div className="rounded bg-white/20 px-3 py-2 text-sm md:text-base font-semibold">
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
                <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 md:p-8 text-center text-white">
                  {/* Modern gradient backdrop for OZ Listings Trailer */}
                  {slide.title === "OZ Listings Trailer" && (
                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-white/60 via-white/25 to-transparent dark:from-black/60 dark:via-black/25"></div>
                  )}
                  
                  <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center max-w-4xl mx-auto">
                    <h2 className={`mb-4 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold ${
                      slide.title === "OZ Listings Trailer" 
                        ? "text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000] dark:[text-shadow:none] text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl" 
                        : ""
                    }`}>{slide.title}</h2>
                    <p className={`mb-6 text-base md:text-lg lg:text-xl opacity-90 max-w-3xl ${
                      slide.title === "OZ Listings Trailer" 
                        ? "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000] dark:[text-shadow:none] text-lg md:text-xl lg:text-2xl xl:text-3xl" 
                        : ""
                    }`}>
                      {slide.details}
                    </p>
                    <button
                      className="rounded-full bg-[#1e88e5] px-6 py-3 text-base md:text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#1976d2] hover:shadow-xl hover:scale-105"
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
};

export default HorizontalScrollSlideshow;
