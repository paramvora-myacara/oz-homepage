"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";
import { useRouter } from "next/navigation";
import { getSupabaseImageUrl } from "../utils/fetchListings";
import { useAuth } from "../../../lib/auth/AuthProvider";

const formatAssetType = (assetType) => {
  if (!assetType) return "";
  return assetType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function ListingCard({ listing, gridSize }) {
  const [showSummary, setShowSummary] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Determine if the device is a touch device
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleCardClick = async () => {
    // Track listing click event with comprehensive metadata
    await trackUserEvent("listing_clicked", {
      listing_id: listing.id,
      listing_title: listing.title,
      listing_state: listing.state,
      listing_irr: listing.irr,
      listing_min_investment: listing.min_investment,
      listing_ten_year_multiple: listing.ten_year_multiple,
      listing_asset_type: listing.asset_type,
      listing_development_type: listing.development_type,
      listing_fund_type: listing.fund_type,
      listing_featured: listing.featured || false,
      dev_dash_url: listing.dev_dash_url || null,
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString(),
    });

    // Check if dev dashboard URL exists, if so, open it in a new tab
    if (listing.dev_dash_url) {
      let url = listing.dev_dash_url;
      if (user) {
        const urlObject = new URL(url);
        urlObject.searchParams.append("uid", user.id);
        url = urlObject.toString();
      }
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      // Fallback to internal navigation if no dev dashboard URL
      const targetSlug = listing.slug || listing.id;
      router.push(`/listings/${targetSlug}`);
    }
  };

  // Cycle through images every 5 seconds
  useEffect(() => {
    if (!listing.image_urls || listing.image_urls.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % listing.image_urls.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [listing.image_urls]);

  // Reset the loaded state whenever the image source changes
  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageIndex]);

  return (
    <div
      className="group card-hover focus-ring focus:ring-primary-500 dark:focus:ring-primary-400 relative cursor-pointer overflow-hidden rounded-2xl border border-gray-400/60 bg-white shadow-lg transition-all duration-500 hover:shadow-2xl focus:ring-2 focus:ring-offset-2 focus:outline-none dark:border-gray-400/40 dark:bg-gradient-to-br dark:from-gray-800/95 dark:via-gray-900/90 dark:to-black/95 dark:shadow-[0_8px_32px_rgba(255,255,255,0.08)] dark:ring-1 dark:ring-white/20 dark:backdrop-blur-xl dark:hover:shadow-[0_16px_48px_rgba(255,255,255,0.12)] dark:hover:ring-white/30 dark:focus:ring-offset-gray-900"
      onClick={handleCardClick}
      onMouseEnter={() => !isTouchDevice && setShowSummary(true)}
      onMouseLeave={() => !isTouchDevice && setShowSummary(false)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${listing.title || "development"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/80">
        {(() => {
          // Determine the current image source (array or single fallback)
          const imageSrcArray =
            listing.image_urls && listing.image_urls.length > 0
              ? listing.image_urls
              : listing.image_url
                ? [listing.image_url]
                : [];

          const imageSrc =
            imageSrcArray.length > 0 ? imageSrcArray[currentImageIndex] : null;

                      return !imageError && imageSrc ? (
              <Image
                key={imageSrc}
                src={getSupabaseImageUrl(imageSrc) || imageSrc}
                alt={`${listing.title || "Development"} in ${listing.state || "location"}`}
                fill
                className={`object-cover transition-opacity duration-1000 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onError={() => setImageError(true)}
                onLoadingComplete={() => setImageLoaded(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized
              />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-900/80">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                  {/* Building outline SVG */}
                  <svg
                    className="h-16 w-16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6H7v-6H5.5L12 5.5z" />
                    <rect x="9" y="14" width="2" height="2" />
                    <rect x="13" y="14" width="2" height="2" />
                    <rect x="9" y="10" width="2" height="2" />
                    <rect x="13" y="10" width="2" height="2" />
                  </svg>
                </div>
                <p className="text-xs font-medium opacity-75">
                  No image available
                </p>
              </div>
            </div>
          );
        })()}

        {/* Summary Overlay */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/80 ${
            !isTouchDevice && showSummary
              ? "opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <div className="absolute right-4 bottom-4 left-4">
            <p
              className={`line-clamp-3 leading-relaxed text-white dark:text-gray-100 ${gridSize === "large" ? "text-xl" : "text-base"}`}
            >
              {listing.summary ||
                "No description available for this development."}
            </p>
          </div>
        </div>

        {/* Asset Type and Fund Type Pills */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
          {/* Asset Type pill */}
          {listing.asset_type && (
            <span className="inline-flex items-center rounded-full border border-gray-300/50 bg-gray-100/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-100 dark:shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
              {formatAssetType(listing.asset_type)}
            </span>
          )}
          {/* Fund Type pill */}
          {listing.fund_type && (
            <span className="inline-flex items-center rounded-full border border-gray-300/50 bg-gray-100/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-100 dark:shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
              {listing.fund_type}
            </span>
          )}
          {/* Property Class pill */}
          {listing.property_class && (
            <span className="inline-flex items-center rounded-full border border-gray-300/50 bg-gray-100/90 px-3 py-1 text-xs font-semibold text-gray-800 backdrop-blur-sm dark:border-gray-600/50 dark:bg-gray-800/90 dark:text-gray-100 dark:shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
              {listing.property_class.replace('class-', 'Class ').replace(/\b([a-zA-Z])/g, c => c.toUpperCase())}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={`dark:bg-gradient-to-b dark:from-transparent dark:to-black/20 ${gridSize === "large" ? "p-8" : "p-6"}`}
      >
        <h3
          className={`group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-4 line-clamp-2 font-bold text-gray-900 transition-colors dark:text-white ${gridSize === "large" ? "text-2xl" : "text-xl"}`}
        >
          {listing.title || "Untitled Development"}
        </h3>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              IRR
            </p>
            <p
              className={`text-oz-zones dark:text-primary-400 font-bold dark:drop-shadow-sm ${gridSize === "large" ? "text-xl" : "text-lg"}`}
            >
              {listing.irr || "—"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Min Investment
            </p>
            <p
              className={`font-bold text-gray-900 dark:text-gray-100 ${gridSize === "large" ? "text-xl" : "text-lg"}`}
            >
              {listing.min_investment || "—"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              10-Year Multiple
            </p>
            <p
              className={`text-primary-600 dark:text-primary-400 font-bold dark:drop-shadow-sm ${gridSize === "large" ? "text-xl" : "text-lg"}`}
            >
              {listing.ten_year_multiple || "—"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Location
            </p>
            <p
              className={`truncate font-semibold text-gray-700 dark:text-gray-200 ${gridSize === "large" ? "text-lg" : "text-base"}`}
            >
              {listing.state || "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="group-hover:ring-primary-500/20 dark:group-hover:ring-primary-400/30 pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-transparent transition-all duration-300" />
    </div>
  );
}
