"use client";
import { useRef, useEffect, useState } from "react";
import { MotionCTAButton } from "./CTAButton";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";
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
  {
    title: "Next Steps",
    subtitle: "Your Path Forward",
    description:
      "Learn about OZs, explore deals, consult our experts, and take action with OZ Listings.",
  },
];

export default function ScrollDrivenPinnedText() {
  const containerRef = useRef();
  const textElementsRef = useRef([]);
  const timelineRef = useRef();
  const [isMobile, setIsMobile] = useState(null);

  // Action handlers (moved from CTASection)
  const { navigateWithAuth } = useAuthNavigation();

  const handleSeeDashboard = async () => {
    await trackUserEvent("dashboard_accessed");
    window.location.href = process.env.NEXT_PUBLIC_DASH_URL;
  };

  const handleQualifyAsInvestor = () => {
    window.location.href = process.env.NEXT_PUBLIC_QUALIFY_INVEST_URL;
  };

  const handleSpeakToTeam = () => {
    navigateWithAuth("/schedule-a-call");
  };

  const handleSpeakToOzzieAI = () => {
    window.location.href = process.env.NEXT_PUBLIC_DASH_URL;
  };

  const handleSeeOZListings = async () => {
    await trackUserEvent("viewed_listings");
    navigateWithAuth("/listings");
  };

  const progressIndicatorsRef = useRef([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  // GSAP ScrollTrigger logic for desktop only
  useEffect(() => {
    if (isMobile !== false) return; // Only run on desktop

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

    // Calculate scroll distance - each text element gets 0.6x window height worth of scroll.
    // A lower value here means less scrolling is required to cycle through the text.
    const scrollDistance =
      window.innerHeight * (pinnedTextData.length + 1) * 0.6;

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
  }, [isMobile]);

  // Refresh ScrollTrigger on resize (desktop only)
  useEffect(() => {
    if (isMobile !== false) return;
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  // Prevent hydration mismatch
  if (isMobile === null) return null;

  // MOBILE: Render as a regular vertical section
  if (isMobile) {
    return (
      <section className="relative w-full bg-white px-4 py-12 transition-colors duration-300 dark:bg-black">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-12">
          {pinnedTextData.map((textData, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center border-b border-gray-200 py-8 text-center last:border-b-0 dark:border-gray-700"
            >
              <h2
                className="font-brand-black mb-2 text-4xl leading-none font-black tracking-tight md:text-5xl"
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
              <p className="mb-2 text-xl font-semibold tracking-wide text-gray-800 transition-colors duration-300 dark:text-white">
                {textData.subtitle}
              </p>
              <p className="max-w-xl text-base leading-relaxed font-light text-gray-600 transition-colors duration-300 md:text-lg dark:text-gray-400">
                {textData.description}
              </p>

              {/* Action buttons for mobile on the "Next Steps" slide */}
              {textData.title === "Next Steps" && (
                <div className="mt-8 flex flex-row flex-wrap justify-center gap-4">
                  <MotionCTAButton variant="filled" onClick={handleSeeDashboard}>
                    See Dashboard
                  </MotionCTAButton>
                  <MotionCTAButton variant="filled" onClick={handleQualifyAsInvestor}>
                    Qualify as Investor
                  </MotionCTAButton>
                  <MotionCTAButton variant="filled" onClick={handleSpeakToTeam}>
                    Speak to the Team
                  </MotionCTAButton>
                  <MotionCTAButton variant="filled" onClick={handleSpeakToOzzieAI}>
                    Speak to Ozzie AI
                  </MotionCTAButton>
                  <MotionCTAButton variant="filled" onClick={handleSeeOZListings}>
                    See OZ Listings
                  </MotionCTAButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // DESKTOP: Render pinned scroll-driven section
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

            {/* Show action buttons only on the "Next Steps" slide */}
            {textData.title === "Next Steps" && (
              <div className="mt-10 flex flex-row flex-wrap justify-center gap-4">
                <MotionCTAButton variant="filled" onClick={handleSeeDashboard}>
                  See Dashboard
                </MotionCTAButton>
                <MotionCTAButton variant="filled" onClick={handleQualifyAsInvestor}>
                  Qualify as Investor
                </MotionCTAButton>
                <MotionCTAButton variant="filled" onClick={handleSpeakToTeam}>
                  Speak to the Team
                </MotionCTAButton>
                <MotionCTAButton variant="filled" onClick={handleSpeakToOzzieAI}>
                  Speak to Ozzie AI
                </MotionCTAButton>
                <MotionCTAButton variant="filled" onClick={handleSeeOZListings}>
                  See OZ Listings
                </MotionCTAButton>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Removed scroll indicator */}

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
