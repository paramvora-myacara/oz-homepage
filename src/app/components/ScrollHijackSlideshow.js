"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isInSlideshow, setIsInSlideshow] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const accumulatedDelta = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const lastScrollY = useRef(0);
  const isForceScrolling = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkSlideshowPosition = () => {
      if (isForceScrolling.current) return;
      
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      
      // Calculate scroll velocity to detect fast scrolling
      const timeDelta = currentTime - lastScrollTime.current;
      const scrollDelta = currentScrollY - lastScrollY.current;
      const scrollVelocity = timeDelta > 0 ? Math.abs(scrollDelta) / timeDelta : 0;
      
      lastScrollTime.current = currentTime;
      lastScrollY.current = currentScrollY;
      
      // Calculate how much of the slideshow is visible
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const slideVisibility = visibleHeight / viewportHeight;
      
      // Wider detection zone - activate when slideshow starts to be significantly visible
      const isApproaching = slideVisibility >= 0.3 && rect.top <= viewportHeight * 0.7;
      const isFullyVisible = slideVisibility >= 0.95 && rect.top <= 2;
      const isBeyondSlideshow = rect.bottom < 0;
      
      // Detect fast scrolling that might bypass the slideshow
      const isFastScrolling = scrollVelocity > 2; // pixels per millisecond
      
      // If we're fast scrolling and approaching/passing the slideshow, force stop
      if (isFastScrolling && (isApproaching || isBeyondSlideshow)) {
        const slideshowTop = container.offsetTop;
        
        // Force scroll to slideshow position
        isForceScrolling.current = true;
        window.scrollTo({
          top: slideshowTop,
          behavior: 'instant'
        });
        
        // Reset force scrolling flag after a brief delay
        setTimeout(() => {
          isForceScrolling.current = false;
          setIsInSlideshow(true);
        }, 100);
        
        return;
      }
      
      // Normal activation when fully visible
      const shouldActivate = isFullyVisible;
      
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Slideshow position check:', {
          top: rect.top,
          bottom: rect.bottom,
          windowHeight: viewportHeight,
          visibleHeight,
          slideVisibility: Math.round(slideVisibility * 100) + '%',
          scrollVelocity: scrollVelocity.toFixed(2),
          isFastScrolling,
          isApproaching,
          isFullyVisible,
          shouldActivate,
          currentScrollY
        });
      }
      
      setIsInSlideshow(shouldActivate);
    };

    // Initial check
    checkSlideshowPosition();

    // Listen for scroll events to continuously check position
    const handleScroll = () => {
      checkSlideshowPosition();
    };

    // Global wheel listener to catch fast scrolling attempts
    const handleGlobalWheel = (e) => {
      if (isInSlideshow || isForceScrolling.current) return;
      
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
      const slideVisibility = visibleHeight / viewportHeight;
      
      // If we're approaching the slideshow and scrolling fast, intercept
      const isApproaching = slideVisibility >= 0.2 && rect.top <= viewportHeight * 0.8;
      const isFastWheel = Math.abs(e.deltaY) > 100;
      
      if (isApproaching && isFastWheel) {
        e.preventDefault();
        const slideshowTop = container.offsetTop;
        
        isForceScrolling.current = true;
        window.scrollTo({
          top: slideshowTop,
          behavior: 'smooth'
        });
        
        setTimeout(() => {
          isForceScrolling.current = false;
          setIsInSlideshow(true);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    window.addEventListener('wheel', handleGlobalWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('wheel', handleGlobalWheel);
    };
  }, []);

  useEffect(() => {
    if (!isInSlideshow) return;

    const handleWheel = (e) => {
      e.preventDefault();
      
      if (isScrollingRef.current) return;
      
      // Accumulate scroll delta for smoother transitions
      accumulatedDelta.current += e.deltaY;
      
      // Threshold for slide change (adjust for sensitivity)
      const threshold = 50;
      
      if (Math.abs(accumulatedDelta.current) > threshold) {
        const direction = accumulatedDelta.current > 0 ? 1 : -1;
        accumulatedDelta.current = 0;
        
        setCurrentSlide(prev => {
          const nextSlide = prev + direction;
          
          // If we're at the bounds, allow normal scrolling
          if (nextSlide < 0) {
            isForceScrolling.current = true;
            setIsInSlideshow(false);
            
            // Scroll to previous section or top of page
            const prevSection = containerRef.current?.previousElementSibling;
            if (prevSection) {
              prevSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            setTimeout(() => {
              isForceScrolling.current = false;
            }, 500);
            
            return 0;
          }
          
          if (nextSlide >= slides.length) {
            isForceScrolling.current = true;
            setIsInSlideshow(false);
            
            // Scroll to next section or continue down the page
            const nextSection = containerRef.current?.nextElementSibling;
            const slideshowBottom = containerRef.current?.offsetTop + containerRef.current?.offsetHeight;
            
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.scrollTo({ top: slideshowBottom, behavior: 'smooth' });
            }
            
            setTimeout(() => {
              isForceScrolling.current = false;
            }, 500);
            
            return slides.length - 1;
          }
          
          return nextSlide;
        });
        
        // Prevent rapid scrolling
        isScrollingRef.current = true;
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 600);
      }
    };

    const handleKeyDown = (e) => {
      if (!isInSlideshow) return;
      
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
      }
    };

    if (isInSlideshow) {
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isInSlideshow]);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section ref={containerRef} className="min-h-screen h-screen relative overflow-hidden bg-black" style={{ height: '100vh', width: '100vw' }}>
      {/* Background Images */}
      <AnimatePresence mode="wait">
                 <motion.div
           key={currentSlide}
           initial={{ opacity: 0, scale: 1.1 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.9 }}
           transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
           className="absolute inset-0 z-0"
           style={{ 
             width: '100vw', 
             height: '100vh',
             top: 0,
             left: 0,
             right: 0,
             bottom: 0
           }}
         >
           <Image
             src={slides[currentSlide].img}
             alt={slides[currentSlide].title}
             fill
             className="object-cover object-center"
             style={{ 
               width: '100%', 
               height: '100%',
               minWidth: '100vw',
               minHeight: '100vh'
             }}
             sizes="100vw"
             priority={currentSlide === 0}
           />
           <div className="absolute inset-0 bg-black/50" style={{ width: '100%', height: '100%' }} />
         </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center text-white max-w-4xl mx-auto px-6"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
              {slides[currentSlide].details}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
              onClick={() => window.open(slides[currentSlide].link, '_blank')}
            >
              Learn More
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-8 transform -translate-y-1/2 z-20 space-y-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-200 ${
            currentSlide > 0
              ? "text-white hover:bg-white/30"
              : "text-white/30 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-200 ${
            currentSlide < slides.length - 1
              ? "text-white hover:bg-white/30"
              : "text-white/30 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Page Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1 bg-white/20">
        <motion.div
          className="h-full bg-orange-500"
          animate={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20">
        <div className="text-white/70 text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Scroll Hint */}
      {currentSlide === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 text-white/60 text-sm text-center"
        >
          <div className="mb-2">
            {isInSlideshow ? "Scroll to navigate slides" : "Scroll down to enter slideshow"}
          </div>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-6 mx-auto"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Debug indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-16 right-4 z-30 bg-black/80 text-white p-2 rounded text-xs">
          Hijack Active: {isInSlideshow ? 'YES' : 'NO'}
        </div>
      )}
    </section>
  );
};

export default ScrollHijackSlideshow; 