"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Text data to cycle through
const pinnedTextData = [
  {
    title: "Why OZ?",
    subtitle: "Tax Incentives & Growth",
    description:
      "Unlock powerful tax incentives and access a high-growth real estate market—Opportunity Zones provide unique advantages for qualified investors.",
  },
  {
    title: "What OZ?",
    subtitle: "Special Census Tracts",
    description:
      "Invest in designated Opportunity Zones to defer federal capital gains now — and eliminate 100% of federal taxes on your upside after 10 years.",
  },
  {
    title: "When OZ?",
    subtitle: "Limited Time Window",
    description:
      "Some benefits phase out after 2026. Strategic tax deferral remains in place for qualifying gains. New legislation has made OZs permanent.",
  },
  {
    title: "How OZ?",
    subtitle: "Simple Process",
    description:
      "Qualify as an accredited investor, choose your deal, and track progress—all with OZ Listings.",
  },
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
          indicator.style.background = "rgba(0, 0, 0, 0.2)";
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
      y: 50,
    });

    // Calculate scroll distance - each text element gets 1.5x window height worth of scroll for more resistance
    const scrollDistance =
      window.innerHeight * (pinnedTextData.length + 1) * 1.5;

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
          const currentIndex = Math.floor(
            self.progress * pinnedTextData.length,
          );
          updateProgressIndicators(currentIndex);
        },
      },
    });

    // Phase 1: First text enters and focuses
    tl.to(
      textElements[0],
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      },
      0,
    );

    // Phase 2: Cycle through remaining text elements
    for (let i = 1; i < textElements.length; i++) {
      const startTime = (i - 1) * 0.25 + 0.3; // Each transition starts at different timeline positions

      // Fade out and blur previous text
      tl.to(
        textElements[i - 1],
        {
          opacity: 0,
          filter: "blur(15px)",
          scale: 0.95,
          y: -30,
          duration: 0.2,
          ease: "power2.inOut",
        },
        startTime,
      )

        // Fade in and focus current text
        .to(
          textElements[i],
          {
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            y: 0,
            duration: 0.2,
            ease: "power2.inOut",
          },
          startTime + 0.05,
        );
    }

    // Phase 3: Final text stays visible until unpinning
    tl.to({}, { duration: 0.25 }); // Hold final state

    timelineRef.current = tl;

    // Add footer detection ScrollTrigger
    const setupFooterTrigger = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        setTimeout(setupFooterTrigger, 100);
        return;
      }

      ScrollTrigger.create({
        trigger: footer,
        start: "top 90%",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            window.dispatchEvent(new CustomEvent("footer-enter"));
          } else {
            window.dispatchEvent(new CustomEvent("footer-leave"));
          }
        },
      });
    };

    setupFooterTrigger();

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((trigger) => {
        if (
          trigger.trigger === container ||
          trigger.trigger === document.querySelector("footer")
        ) {
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-white transition-colors duration-300 dark:bg-black"
    >
      {/* Background pattern/texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e88e5]/10 to-[#42a5f5]/5" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(30, 136, 229, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Centered text container */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-center px-8">
        {pinnedTextData.map((textData, index) => (
          <div
            key={index}
            ref={(el) => (textElementsRef.current[index] = el)}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            {/* Main title with gradient */}
            <h2
              className="font-brand-black mb-4 text-6xl leading-none font-black tracking-tight md:text-8xl lg:text-9xl"
              style={{
                background:
                  "linear-gradient(90deg, #1e88e5 0%, #42a5f5 50%, #64b5f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontWeight: 900,
              }}
            >
              {textData.title}
            </h2>

            {/* Subtitle */}
            <p className="mb-6 text-2xl font-semibold tracking-wide text-gray-800 transition-colors duration-300 md:text-3xl lg:text-4xl dark:text-white">
              {textData.subtitle}
            </p>

            {/* Description */}
            <p className="max-w-3xl text-lg leading-relaxed font-light text-gray-600 transition-colors duration-300 md:text-xl lg:text-2xl dark:text-gray-400">
              {textData.description}
            </p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform text-gray-400 transition-colors duration-300 dark:text-gray-500">
        <div className="flex flex-col items-center space-y-2">
          <div className="text-sm font-medium tracking-wider">SCROLL</div>
          <div className="h-12 w-px bg-gradient-to-b from-gray-400 to-transparent dark:from-gray-500" />
        </div>
      </div>

      {/* Progress indicators */}
      <div className="absolute top-1/2 right-8 flex -translate-y-1/2 transform flex-col space-y-3">
        {pinnedTextData.map((_, index) => (
          <div
            key={index}
            ref={(el) => (progressIndicatorsRef.current[index] = el)}
            className="h-2 w-2 rounded-full transition-all duration-300"
            style={{
              background:
                index === 0 ? "rgba(30, 136, 229, 0.8)" : "rgba(0, 0, 0, 0.2)",
              transform: index === 0 ? "scale(1.2)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
