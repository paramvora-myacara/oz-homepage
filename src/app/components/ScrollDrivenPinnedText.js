"use client";
import { useEffect, useState } from "react";
import { MotionCTAButton } from "./CTAButton";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

// Text data to cycle through
const pinnedTextData = [
  {
    title: "Why OZ?",
    subtitle: "Tax Incentives & Growth",
    description:
      "Unlock powerful tax incentives and access a high-growth real estate market-Opportunity Zones provide unique advantages for qualified investors.",
  },
  {
    title: "What OZ?",
    subtitle: "Special Census Tracts",
    description:
      "Invest in designated Opportunity Zones to defer federal capital gains now - and eliminate 100% of federal taxes on your upside after 10 years.",
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
      "Qualify as an accredited investor, choose your deal, and track progress-all with OZ Listings™.",
  },
  {
    title: "Next Steps",
    subtitle: "Your Path Forward",
    description:
      "Learn about OZs, explore deals, consult our experts, and take action with OZ Listings™.",
  },
];

export default function ScrollDrivenPinnedText() {
  const [isMobile, setIsMobile] = useState(null);

  // Action handlers
  const { navigateWithAuth } = useAuthNavigation();
  const pathname = usePathname();

  const handleQualifyAsInvestor = () => {
    navigateWithAuth("/tax-calculator");
  };

  const handleSpeakToTeam = () => {
    navigateWithAuth(`/schedule-a-call?endpoint=${pathname}`);
  };

  const handleSeeOZListings = async () => {
    await trackUserEvent("viewed_listings");
    navigateWithAuth("/listings");
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent hydration mismatch
  if (isMobile === null) return null;

  // Render as static slides for both mobile and desktop
  return (
    <section className="relative w-full bg-white transition-colors duration-300 dark:bg-black py-12 md:py-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-8 md:gap-12 lg:gap-16 px-4">
        {/* Background pattern/texture */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1e88e5]/10 to-[#42a5f5]/5" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(30, 136, 229, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(66, 165, 245, 0.1) 0%, transparent 50%)`,
            }}
          />
        </div>

        {pinnedTextData.map((textData, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative z-10 flex w-full max-w-4xl flex-col items-center justify-center border-b border-gray-200 py-8 md:py-12 text-center last:border-b-0 dark:border-gray-700"
          >
            <h2
              className="font-brand-black mb-2 md:mb-4 text-4xl md:text-6xl lg:text-7xl leading-none font-black tracking-tight"
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
            <p className="mb-2 md:mb-4 text-xl md:text-2xl lg:text-3xl font-semibold tracking-wide text-gray-800 transition-colors duration-300 dark:text-white">
              {textData.subtitle}
            </p>
            <p className="max-w-3xl text-base md:text-lg lg:text-xl leading-relaxed font-light text-gray-600 transition-colors duration-300 dark:text-gray-400">
              {textData.description}
            </p>

            {/* Action buttons for "Next Steps" slide */}
            {textData.title === "Next Steps" && (
              <div className="mt-8 md:mt-10 flex flex-col items-center gap-4 md:gap-6">
                {/* First row of buttons */}
                <div className="flex flex-row flex-wrap justify-center gap-3 md:gap-4">
                  <Link href="/invest">
                    <MotionCTAButton
                      variant="blueOutline"
                      tooltip="Opens the invest page where you can explore OZ data and investment opportunities."
                    >
                      For Investors
                    </MotionCTAButton>
                  </Link>
                  <MotionCTAButton
                    variant="blueOutline"
                    onClick={handleQualifyAsInvestor}
                    tooltip="Calculate your potential tax savings from OZ investments."
                  >
                    Check Tax Savings
                  </MotionCTAButton>
                  <MotionCTAButton
                    variant="filled"
                    onClick={handleSeeOZListings}
                    tooltip="Jumps straight to the marketplace of live Opportunity-Zone investment listings."
                  >
                    {isMobile ? "See OZ Listings" : "See OZ Listings™"}
                  </MotionCTAButton>
                  <Link href="/community">
                    <MotionCTAButton
                      variant="blueOutline"
                      tooltip="Join our exclusive community of investors and developers."
                    >
                      Join the Community
                    </MotionCTAButton>
                  </Link>
                  <MotionCTAButton
                    variant="blueOutline"
                    onClick={handleSpeakToTeam}
                    tooltip="Lets you book a one-on-one call with the OZ Listings team for tailored help."
                  >
                    Speak to the Team
                  </MotionCTAButton>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
