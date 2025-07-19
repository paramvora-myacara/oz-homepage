"use client";
import { MotionCTAButton } from "./CTAButton";
import { useAuthNavigation } from "../../lib/auth/useAuthNavigation";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";

export default function CTASection() {
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
  return (
    <section className="my-12 flex items-center justify-center border-t border-gray-200 pt-12 sm:my-16 lg:my-20 dark:border-gray-700">
      <div className="flex w-full flex-col items-center bg-white py-12 dark:bg-black">
        <h1 className="mb-12 text-center text-4xl font-bold text-[#1e293b] dark:text-white">
          Ready to take the next step?
        </h1>
        <div className="flex w-full max-w-md flex-col items-center gap-4 px-4 sm:max-w-none sm:flex-row sm:justify-center sm:gap-6">
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
      </div>
    </section>
  );
}
