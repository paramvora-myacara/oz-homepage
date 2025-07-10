"use client";
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaUserCheck,
  FaComments,
  FaPhone,
} from "react-icons/fa";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function DirectActionCards() {
  const containerRef = useRef(null);
  const firstCardRef = useRef(null);
  const middleCardRef = useRef(null);
  const thirdCardRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const firstCard = firstCardRef.current;
    const middleCard = middleCardRef.current;
    const thirdCard = thirdCardRef.current;

    if (!container || !firstCard || !middleCard || !thirdCard) return;

    // Set initial positions - completely out of frame using viewport units
    gsap.set([firstCard, thirdCard], { y: "100vh" }); // Start from completely below viewport
    gsap.set(middleCard, { y: "-100vh" }); // Start from completely above viewport

    // Create scroll-triggered animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",    // Animation starts when top of container enters bottom of viewport (0% visible)
        end: "bottom bottom",   // Animation ends when bottom of container reaches bottom of viewport (100% visible)
        scrub: true, // Direct 1:1 scrubbing with scroll progress
      }
    });

    // Animate cards sliding in - they should reach final position when container is fully visible
    tl.to([firstCard, thirdCard], {
      y: 0,
      ease: "none" // Linear progression for direct correlation with scroll
    }, 0)
    .to(middleCard, {
      y: 0,
      ease: "none"
    }, 0);

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const sections = [
    {
      icon: <FaPhone size={80} className="text-white drop-shadow-lg" />,
      title: "Speak to the Team",
      subtitle: "Connect with OZ experts for personalized support and guidance",
      cta: "Contact Us",
      category: "Support",
      backgroundImage: "/Team-Stock.jpg",
      ref: firstCardRef,
    },
    {
      icon: <FaUserCheck size={80} className="text-white drop-shadow-lg" />,
      title: "Qualify as an Investor",
      subtitle: "Verify your eligibility for exclusive OZ investment opportunities", 
      cta: "Get Started",
      category: "Qualification",
      backgroundImage: "/Investor.jpg",
      ref: middleCardRef,
    },
    {
      icon: <FaComments size={80} className="text-white drop-shadow-lg" />,
      title: "Talk to Ozzie",
      subtitle: "Get instant answers about Opportunity Zone investments",
      cta: "Chat Now",
      category: "AI Assistant",
      backgroundImage: "/AI-Ozzie.jpg",
      ref: thirdCardRef,
    },
  ];

  return (
    <section 
      ref={containerRef}
      className="w-full flex-grow flex relative overflow-hidden bg-[#1a1a1a]"
    >
      {/* Sections Container */}
      <div className="flex h-full w-full">
        {sections.map(({ icon, title, subtitle, cta, category, backgroundImage, ref }, idx) => (
          <div
            key={title}
            ref={ref}
            className="relative flex items-center justify-center cursor-pointer flex-1 h-full"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${backgroundImage})`,
              }}
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto px-6">
              <div>
                {/* Large Icon */}
                <div className="mb-4 relative flex justify-center items-center">
                  {icon}
                </div>
                
                {/* Title */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg font-brand-bold">
                  {title}
                </h3>
                
                {/* Subtitle */}
                <p className="text-sm md:text-base lg:text-lg text-white/90 mb-6 drop-shadow-md font-brand-normal" style={{ lineHeight: '1.6' }}>
                  {subtitle}
                </p>
                
                {/* CTA Button */}
                <button className="rounded-xl bg-[#1e88e5] text-white px-8 py-3 text-sm md:text-base font-semibold font-brand-semibold">
                  {cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 