"use client";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
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
        className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 cursor-pointer transition-all duration-500 hover:shadow-xl hover:border-primary/50 card-hover focus-ring"
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
        <div className="relative aspect-video w-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors duration-500">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full group-hover:scale-110 transition-transform duration-300 shadow-sm border border-gray-100">
            <Plus className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 text-center flex flex-col items-center justify-center space-y-3">
          <h3 className="text-xl font-bold text-navy font-brand">
            List Your Project
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            Showcase your Opportunity Zone investment to our network of qualified investors.
          </p>
          <span className="mt-4 text-sm font-bold text-primary inline-flex items-center group-hover:underline">
            Get Started <span className="ml-1">&rarr;</span>
          </span>
        </div>
      </div>
    </>
  );
} 