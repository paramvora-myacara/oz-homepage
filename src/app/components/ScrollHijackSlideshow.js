"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

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

const ScrollHijackSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const isTransitioning = useRef(false);

  // Smooth spring animation for slide transitions
  const slideProgress = useMotionValue(0);
  const smoothSlideProgress = useSpring(slideProgress, {
    stiffness: 300,
    damping: 40,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use Intersection Observer for clean activation/deactivation
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting;
        const intersectionRatio = entry.intersectionRatio;
        
        // Activate only when the slideshow is 100% in view
        if (isIntersecting && intersectionRatio >= 0.99) {
          setIsActive(true);
          document.body.style.overflow = 'hidden';
          scrollAccumulator.current = currentSlide * 100; // Reset accumulator to current slide
        } else if (!isIntersecting || intersectionRatio < 0.99) {
          setIsActive(false);
          document.body.style.overflow = 'auto';
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 0.99, 1.0],
        rootMargin: '0px'
      }
    );

    observer.observe(container);

    // Global scroll listener to prevent bypassing the slideshow with fast scrolling
    const handleGlobalScroll = (e) => {
      if (isActive) return; // Already active, let the wheel handler deal with it
      
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Only intercept if we're close to the slideshow and scrolling fast
      const isFastScroll = Math.abs(e.deltaY) > 150;
      const isNearSlideshow = rect.top < viewportHeight && rect.bottom > 0;
      const isOverlapping = rect.top <= 50 && rect.bottom >= viewportHeight - 50;
      
      if (isFastScroll && isNearSlideshow && isOverlapping) {
        e.preventDefault();
        // Snap to slideshow position
        window.scrollTo({
          top: container.offsetTop,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('wheel', handleGlobalScroll, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener('wheel', handleGlobalScroll);
      document.body.style.overflow = 'auto';
    };
  }, [currentSlide, isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleWheel = (e) => {
      e.preventDefault();
      
      // Prevent rapid scrolling during transitions
      if (isTransitioning.current) return;
      
      const now = Date.now();
      const timeDelta = now - lastScrollTime.current;
      lastScrollTime.current = now;
      
      // Normalize scroll delta and accumulate
      const normalizedDelta = Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 100);
      scrollAccumulator.current += normalizedDelta;
      
      // Calculate target slide based on accumulated scroll
      const slideHeight = 100; // Pixels needed to advance one slide
      const targetSlide = Math.round(scrollAccumulator.current / slideHeight);
      const clampedSlide = Math.max(0, Math.min(slides.length - 1, targetSlide));
      
      // Update slide progress for smooth animations
      slideProgress.set(scrollAccumulator.current / slideHeight);
      
      // Change slide if we've crossed a threshold
      if (clampedSlide !== currentSlide) {
        isTransitioning.current = true;
        setCurrentSlide(clampedSlide);
        
        // Reset transition lock after animation completes
        setTimeout(() => {
          isTransitioning.current = false;
        }, 600);
      }
      
             // Handle exit conditions
       if (targetSlide < 0) {
         // Exit upward - go to previous section
         setIsActive(false);
         document.body.style.overflow = 'auto';
         
         const container = containerRef.current;
         const prevSection = container?.previousElementSibling;
         if (prevSection) {
           window.scrollTo({
             top: prevSection.offsetTop + prevSection.offsetHeight - window.innerHeight,
             behavior: 'smooth'
           });
         } else {
           window.scrollTo({ top: 0, behavior: 'smooth' });
         }
       } else if (targetSlide >= slides.length) {
         // Exit downward - go to next section
         setIsActive(false);
         document.body.style.overflow = 'auto';
         
         const container = containerRef.current;
         const nextSection = container?.nextElementSibling;
         if (nextSection) {
           window.scrollTo({
             top: nextSection.offsetTop,
             behavior: 'smooth'
           });
         } else {
           window.scrollTo({
             top: container.offsetTop + container.offsetHeight,
             behavior: 'smooth'
           });
         }
       }
    };

         const handleKeyDown = (e) => {
       if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
         e.preventDefault();
         if (currentSlide > 0) {
           const newSlide = currentSlide - 1;
           setCurrentSlide(newSlide);
           scrollAccumulator.current = newSlide * 100;
           slideProgress.set(newSlide);
         }
       } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
         e.preventDefault();
         if (currentSlide < slides.length - 1) {
           const newSlide = currentSlide + 1;
           setCurrentSlide(newSlide);
           scrollAccumulator.current = newSlide * 100;
           slideProgress.set(newSlide);
         }
       } else if (e.key === 'Escape') {
         setIsActive(false);
         document.body.style.overflow = 'auto';
       }
     };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, currentSlide]);

  const goToSlide = (index) => {
    if (isTransitioning.current) return;
    
    setCurrentSlide(index);
    scrollAccumulator.current = index * 100;
    slideProgress.set(index);
  };

  return (
    <section 
      ref={containerRef} 
      className="h-screen w-full relative overflow-hidden bg-black"
    >
      {/* Background Images with smooth transitions */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].img}
              alt={slides[currentSlide].title}
              fill
              className="object-cover"
              priority={currentSlide === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ 
              duration: 0.7, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="text-center text-white max-w-4xl mx-auto px-6"
          >
            <motion.h2 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              layoutId="title"
            >
              {slides[currentSlide].title}
            </motion.h2>
            <motion.p 
              className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto"
              layoutId="description"
            >
              {slides[currentSlide].details}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1e88e5] hover:bg-[#1976d2] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => window.open(slides[currentSlide].link, '_blank')}
            >
              Learn More
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/40 hover:bg-white/70 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/20">
        <motion.div
          className="h-full bg-[#1e88e5]"
          animate={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="text-white/80 text-sm font-medium bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full border border-white/20">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Scroll Hint */}
      <AnimatePresence>
        {isActive && currentSlide === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20"
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
        )}
      </AnimatePresence>
    </section>
  );
};

export default ScrollHijackSlideshow; 