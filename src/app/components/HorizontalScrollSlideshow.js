"use client";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Slide data
const slides = [
  {
    title: "Welcome from Our Founder",
    img: "/images/jimmy-atkinson-founder.jpg",
    details: "2-min intro to the OZ Listings mission",
    link: "/market/st-louis",
  },
  {
    title: "LinkedIn Insights",
    img: "/images/linkedin-cover.jpg",
    details: "Expert commentary & market trends from our team",
    link: "/market/omaha",
  },
  {
    title: "The OZ Investor's Guide",
    img: "/images/brett-jordan-B4-h2B-DRhs-unsplash.jpg",
    details: "#1 Book on Opportunity Zones (Amazon)",
    link: "/market/minneapolis",
  },
  {
    title: "Podcast: OZ Success Stories",
    img: "/images/isaac-quesada-s34TlUTPIf4-unsplash.jpg",
    details: "Real investor experiences & lessons learned",
    link: "/market/denver",
  },
];

const HorizontalScrollSlideshow = () => {
  const containerRef = useRef(null);
  const tracksRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = tracksRef.current;
    const progressBar = progressRef.current;
    
    if (!container || !track || !progressBar) return;

    // Calculate the total width to scroll
    const trackWidth = track.scrollWidth;
    const containerWidth = container.offsetWidth;
    const scrollDistance = trackWidth - containerWidth;

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
        onUpdate: (self) => {
          // Update progress bar
          gsap.set(progressBar, { width: `${self.progress * 100}%` });
        }
      }
    });

    // Add the horizontal movement
    tl.to(track, {
      x: -scrollDistance,
      ease: "none"
    });

    // Cleanup function
    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []);

  // Refresh ScrollTrigger on resize
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
            <div
              key={index}
              className="relative h-full flex-shrink-0 w-screen"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.img}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <motion.div
                  className="text-center text-white max-w-4xl mx-auto px-6"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.4, 0, 0.2, 1],
                    delay: index * 0.1 
                  }}
                  viewport={{ once: true, margin: "-20%" }}
                >
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">
                    {slide.details}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#1e88e5] hover:bg-[#1976d2] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => window.open(slide.link, '_blank')}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3">
          {slides.map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-white/40 transition-all duration-300"
              style={{
                opacity: 0.4,
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/20">
          <div
            ref={progressRef}
            className="h-full bg-[#1e88e5] transition-all duration-100"
            style={{ width: "0%" }}
          />
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 z-20">
          <div className="text-white/80 text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
            <span>1 / {slides.length}</span>
          </div>
        </div>

        {/* Scroll Hint */}
        <motion.div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-white/70 text-sm text-center bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <div className="mb-1">Scroll to navigate slides</div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-4 h-4 mx-auto"
            >
              <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HorizontalScrollSlideshow; 