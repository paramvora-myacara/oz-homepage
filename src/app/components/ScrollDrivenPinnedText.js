"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Text data to cycle through
const pinnedTextData = [
  {
    title: "Why OZ?",
    subtitle: "Tax Incentives & Growth",
    description: "Unlock powerful tax incentives and access a high-growth real estate market—Opportunity Zones provide unique advantages for qualified investors."
  },
  {
    title: "What OZ?", 
    subtitle: "Special Census Tracts",
    description: "Special census tracts nationwide offering capital gains tax deferral, reduction, and exclusion for eligible investments."
  },
  {
    title: "When OZ?",
    subtitle: "Limited Time Window", 
    description: "There's a window of opportunity—key benefits phase out after 2026. Early movers gain the most."
  },
  {
    title: "How OZ?",
    subtitle: "Simple Process",
    description: "Qualify as an accredited investor, choose your deal, and track progress—all with OZ Listings."
  }
];

export default function ScrollDrivenPinnedText() {
  const containerRef = useRef();
  const textElementsRef = useRef([]);
  const timelineRef = useRef();
  const progressIndicatorsRef = useRef([]);

  // Function to update progress indicators
  const updateProgressIndicators = (currentIndex) => {
    progressIndicatorsRef.current.forEach((indicator, index) => {
      if (indicator) {
        if (index <= currentIndex) {
          indicator.style.background = "rgba(30, 136, 229, 0.8)";
          indicator.style.transform = "scale(1.2)";
        } else {
          indicator.style.background = "rgba(255, 255, 255, 0.3)";
          indicator.style.transform = "scale(1)";
        }
      }
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    const textElements = textElementsRef.current;
    
    if (!container || textElements.length === 0) return;

    // Set initial states - all text elements invisible and blurred
    gsap.set(textElements, {
      opacity: 0,
      filter: "blur(20px)",
      scale: 0.9,
      y: 50
    });

    // Calculate scroll distance - each text element gets window height worth of scroll
    const scrollDistance = window.innerHeight * (pinnedTextData.length + 1);

    // Create main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${scrollDistance}px`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Update progress indicators
          const currentIndex = Math.floor(self.progress * pinnedTextData.length);
          updateProgressIndicators(currentIndex);
        }
      }
    });

    // Phase 1: First text enters and focuses
    tl.to(textElements[0], {
      opacity: 1,
      filter: "blur(0px)",
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: "power2.out"
    }, 0);

    // Phase 2: Cycle through remaining text elements
    for (let i = 1; i < textElements.length; i++) {
      const startTime = (i - 1) * 0.25 + 0.3; // Each transition starts at different timeline positions
      
      // Fade out and blur previous text
      tl.to(textElements[i - 1], {
        opacity: 0,
        filter: "blur(15px)",
        scale: 0.95,
        y: -30,
        duration: 0.2,
        ease: "power2.inOut"
      }, startTime)
      
      // Fade in and focus current text
      .to(textElements[i], {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: "power2.inOut"
      }, startTime + 0.05);
    }

    // Phase 3: Final text stays visible until unpinning
    tl.to({}, { duration: 0.25 }); // Hold final state

    timelineRef.current = tl;

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === container) {
          trigger.kill();
        }
      });
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
    <section 
      ref={containerRef}
      className="relative h-screen w-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden"
    >
      {/* Background pattern/texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e88e5]/10 to-[#42a5f5]/5" />
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(30, 136, 229, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Centered text container */}
      <div className="relative z-10 flex items-center justify-center w-full max-w-4xl mx-auto px-8">
        {pinnedTextData.map((textData, index) => (
          <div
            key={index}
            ref={el => textElementsRef.current[index] = el}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            {/* Main title with gradient */}
            <h2 
              className="text-6xl md:text-8xl lg:text-9xl font-black mb-4 leading-none tracking-tight"
              style={{
                background: "linear-gradient(90deg, #1e88e5 0%, #42a5f5 50%, #64b5f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontFamily: "'Avenir', 'Avenir Next', 'Montserrat', 'Futura', sans-serif",
                fontWeight: 900
              }}
            >
              {textData.title}
            </h2>

            {/* Subtitle */}
            <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white/90 mb-6 tracking-wide">
              {textData.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl lg:text-2xl text-white/70 max-w-3xl leading-relaxed font-light">
              {textData.description}
            </p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm font-medium tracking-wider">SCROLL</div>
          <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </div>

      {/* Progress indicators */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3">
        {pinnedTextData.map((_, index) => (
          <div
            key={index}
            ref={el => progressIndicatorsRef.current[index] = el}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: index === 0 ? "rgba(30, 136, 229, 0.8)" : "rgba(255, 255, 255, 0.3)",
              transform: index === 0 ? "scale(1.2)" : "scale(1)"
            }}
          />
        ))}
      </div>
    </section>
  );
} 