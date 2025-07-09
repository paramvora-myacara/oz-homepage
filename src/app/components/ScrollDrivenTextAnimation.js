"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ScrollDrivenTextAnimation = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  // Text strings to cycle through
  const textStrings = ["300_Clients", "3M_ADS", "2M_USERS"];

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    
    if (!container || !textElement) return;

    // Create data object to animate
    const data = { index: 0 };

    // Create GSAP timeline
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true, // Link directly to scrollbar
        pin: textElement, // Pin the text element
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Animate the index from 0 to textStrings.length - 1
    timeline.to(data, {
      index: textStrings.length - 1,
      duration: 1,
      ease: "none",
      roundProps: "index", // Snap to whole numbers
      onUpdate: () => {
        // Update text content based on current index
        const currentIndex = Math.floor(data.index);
        if (textElement && textStrings[currentIndex]) {
          textElement.textContent = textStrings[currentIndex];
        }
      }
    });

    // Cleanup function
    return () => {
      if (timeline.scrollTrigger) {
        timeline.scrollTrigger.kill();
      }
      timeline.kill();
    };
  }, []);

  // Refresh ScrollTrigger on resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section ref={containerRef} style={{ height: '200vh' }} className="relative bg-[#f5f7fa]">
      <h1 
        ref={textRef}
        style={{ 
          position: 'sticky', 
          top: '50%',
          transform: 'translateY(-50%)',
          textAlign: 'center',
          zIndex: 10
        }}
        className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#212C38] tracking-tight"
      >
        300_Clients
      </h1>
    </section>
  );
};

export default ScrollDrivenTextAnimation; 