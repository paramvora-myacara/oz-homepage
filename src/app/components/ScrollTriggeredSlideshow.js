"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";

// Slide data (same as carousel)
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
    details: "Hear from leading OZ developers & investors",
    link: "/market/minneapolis",
  },
];

export default function ScrollTriggeredSlideshow() {
  const containerRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInSlideshow, setIsInSlideshow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Smooth animated values
  const slideProgress = useMotionValue(0);
  const smoothProgress = useSpring(slideProgress, { 
    stiffness: 300, 
    damping: 30 
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulatedScroll = 0;
    const slideThreshold = 100; // pixels to scroll per slide
    
    const handleScroll = (e) => {
      if (!isInSlideshow) return;
      
      e.preventDefault();
      
      const delta = e.deltaY;
      accumulatedScroll += delta;
      
      // Calculate current slide based on accumulated scroll
      const targetSlide = Math.max(0, Math.min(slides.length - 1, 
        Math.floor(accumulatedScroll / slideThreshold)
      ));
      
      // Calculate progress within current slide transition
      const slideOffset = accumulatedScroll % slideThreshold;
      const progress = Math.min(1, Math.max(0, slideOffset / slideThreshold));
      
      setCurrentSlide(targetSlide);
      setScrollProgress(progress);
      slideProgress.set(accumulatedScroll / slideThreshold);
      
      // If trying to scroll past last slide, allow normal scroll
      if (accumulatedScroll > (slides.length - 1) * slideThreshold && delta > 0) {
        setIsInSlideshow(false);
        document.body.style.overflow = 'auto';
        window.scrollTo({
          top: container.offsetTop + container.offsetHeight,
          behavior: 'smooth'
        });
      }
      
      // If trying to scroll before first slide, allow normal scroll up
      if (accumulatedScroll < 0 && delta < 0) {
        setIsInSlideshow(false);
        document.body.style.overflow = 'auto';
        accumulatedScroll = 0;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          setIsInSlideshow(true);
          document.body.style.overflow = 'hidden';
          accumulatedScroll = 0;
        } else if (!entry.isIntersecting && isInSlideshow) {
          setIsInSlideshow(false);
          document.body.style.overflow = 'auto';
        }
      },
      { 
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    observer.observe(container);
    
    if (isInSlideshow) {
      container.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      observer.disconnect();
      container?.removeEventListener('wheel', handleScroll);
      document.body.style.overflow = 'auto';
    };
  }, [isInSlideshow, slideProgress]);

  return (
    <section 
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#f8fafc]"
    >
      {/* Section Header */}
      <motion.div 
        className="absolute top-8 left-1/2 z-50 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl lg:text-4xl font-bold text-[#212C38] text-center mb-2">
          Latest from <span className="text-[#1e88e5]">OZ Listings</span>
        </h2>
        <p className="text-gray-600 text-center">
          Scroll to explore our latest insights and resources
        </p>
      </motion.div>

      {/* Progress Indicator */}
      <div className="absolute top-24 right-8 z-50 flex flex-col space-y-2">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-8 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-[#1e88e5]' 
                : index < currentSlide 
                  ? 'bg-[#1e88e5]/50' 
                  : 'bg-gray-300'
            }`}
            animate={{
              height: index === currentSlide ? 32 : 20,
              opacity: index <= currentSlide ? 1 : 0.5
            }}
          />
        ))}
      </div>

      {/* Slides Container */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => {
          const slideOffset = useTransform(
            smoothProgress,
            [index - 1, index, index + 1],
            ['100%', '0%', '-100%']
          );

          return (
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              style={{ x: slideOffset }}
            >
              <motion.div 
                className="relative w-[90%] max-w-4xl h-[70%] rounded-3xl overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <motion.h3 
                    className="text-4xl lg:text-5xl font-bold mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ 
                      opacity: index === currentSlide ? 1 : 0.7,
                      y: index === currentSlide ? 0 : 20
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {slide.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-xl mb-6 max-w-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: index === currentSlide ? 1 : 0.5,
                      y: index === currentSlide ? 0 : 10
                    }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {slide.details}
                  </motion.p>
                  
                  <motion.a
                    href={slide.link}
                    className="inline-flex items-center px-8 py-3 bg-[#1e88e5] text-white font-semibold rounded-full hover:bg-[#1976d2] transition-all duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: index === currentSlide ? 1 : 0.3,
                      y: index === currentSlide ? 0 : 10
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore
                    <svg 
                      className="w-5 h-5 ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17 8l4 4m0 0l-4 4m4-4H3" 
                      />
                    </svg>
                  </motion.a>
                </div>

                {/* Slide Number */}
                <div className="absolute top-6 right-6 text-white/80 text-lg font-semibold">
                  {String(index + 1).padStart(2, '0')}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Scroll Hint */}
      {currentSlide === 0 && (
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm">Scroll to navigate</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
} 