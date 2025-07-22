"use client";
import { useRouter } from "next/navigation";
import { Plus, Mail } from "lucide-react";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";

export default function PromotionalCard() {
  const router = useRouter();
  const pathname = "ad_your_oz_listing_here";

  const handleCardClick = async () => {
    // Track analytics event
    await trackUserEvent("listing_inquiry_started", {
      source: "promotional_card",
      timestamp: new Date().toISOString(),
    });

    const params = new URLSearchParams({
      userType: "Developer",
      advertise: "true",
    });
    params.append('endpoint', pathname);

    router.push(`/schedule-a-call?${params.toString()}`);
  };

  return (
    <>
      {/* Promotional Card */}
      <div
        className="group relative flex flex-col h-full bg-white dark:bg-gradient-to-br dark:from-gray-900/95 dark:via-gray-900/90 dark:to-black/95 dark:backdrop-blur-xl rounded-2xl overflow-hidden border-2 border-dashed border-primary-300 dark:border-primary-500/70 dark:ring-1 dark:ring-white/10 cursor-pointer transition-all duration-500 hover:shadow-2xl dark:shadow-[0_8px_32px_rgba(255,255,255,0.04)] dark:hover:shadow-[0_16px_48px_rgba(255,255,255,0.08)] card-hover focus-ring"
        onClick={handleCardClick}
        tabIndex={0}
        role="button"
        aria-label="Add your OZ listing here"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick();
          }
        }}
      >
        {/* Placeholder to match image height of other cards */}
        <div className="relative aspect-video w-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:via-primary-800/20 dark:to-primary-900/40 flex items-center justify-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 dark:bg-primary-800/60 dark:backdrop-blur-sm dark:ring-1 dark:ring-primary-500/50 rounded-full group-hover:scale-110 transition-transform duration-300 shadow-lg dark:shadow-primary-500/30">
            <Plus className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 pb-6 px-6 text-center flex flex-col items-center space-y-3 dark:bg-gradient-to-b dark:from-transparent dark:to-black/20">
          <h3 className="text-2xl font-bold text-primary-900 dark:text-primary-100 dark:drop-shadow-sm">
            Your OZ Listing Here
          </h3>
          <p className="text-primary-700 dark:text-primary-300 max-w-sm mx-auto leading-relaxed">
            Showcase your Opportunity Zone investment to qualified investors. Get
            started with our listing platform today.
          </p>
        </div>

        {/* Hover Effect Border - Same as listing cards */}
        <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary-500/20 dark:group-hover:ring-primary-400/30 transition-all duration-300 pointer-events-none" />
      </div>
    </>
  );
} 