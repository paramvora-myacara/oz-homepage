"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";
import { useRouter } from "next/navigation";
import { getSupabaseImageUrl } from "../utils/fetchListings";
import { MapPin } from "lucide-react";

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

  // Determine if the device is a touch device
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleCardClick = async () => {
    // Track listing click event
    await trackUserEvent("listing_clicked", {
      listing_id: listing.id,
      listing_title: listing.title,
    });

    const targetSlug = listing.slug || listing.id;
    router.push(`/listings/${targetSlug}`);
  };

  // Cycle through images
  useEffect(() => {
    if (!listing.image_urls || listing.image_urls.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % listing.image_urls.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [listing.image_urls]);

  // Reset loaded state
  useEffect(() => {
    setImageLoaded(false);
  }, [currentImageIndex]);

  return (
    <div
      className="group card-hover relative flex flex-col cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-gray-200"
      onClick={handleCardClick}
      onMouseEnter={() => !isTouchDevice && setShowSummary(true)}
      onMouseLeave={() => !isTouchDevice && setShowSummary(false)}
      tabIndex={0}
      role="button"
    >
      {/* Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {(() => {
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
              alt={listing.title || "Investment Opportunity"}
              fill
              className={`object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              onError={() => setImageError(true)}
              onLoadingComplete={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <svg className="h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          );
        })()}

        {/* Summary Overlay */}
        <div
          className={`absolute inset-0 bg-navy/80 backdrop-blur-sm transition-opacity duration-300 flex items-center justify-center p-6 text-center ${!isTouchDevice && showSummary ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          <p className="text-white font-medium leading-relaxed font-sans text-sm md:text-base line-clamp-4">
            {listing.summary || "No description available for this investment opportunity."}
          </p>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {listing.asset_type && (
            <span className="px-2.5 py-1 text-xs font-bold text-navy bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-white/20">
              {formatAssetType(listing.asset_type)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 md:p-6 flex flex-col">
        <h3 className="mb-4 text-xl font-bold text-navy font-brand line-clamp-1 group-hover:text-primary transition-colors">
          {listing.title || "Untitled Opportunity"}
        </h3>

        {/* Start Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4">
          {/* IRR */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">IRR</p>
            <p className="text-lg font-bold text-primary">{listing.irr || "-"}</p>
          </div>

          {/* Min Investment */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Min Inv</p>
            <p className="text-lg font-bold text-navy">{listing.min_investment || "-"}</p>
          </div>

          {/* Multiple */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Multiple</p>
            <p className="text-lg font-bold text-navy">{listing.ten_year_multiple || "-"}</p>
          </div>

          {/* Location */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Location</p>
            <div className="flex items-center text-navy font-semibold text-sm">
              <MapPin className="w-3.5 h-3.5 mr-1 text-primary shrink-0" />
              <span className="truncate">{listing.state || "-"}</span>
            </div>
          </div>
        </div>

        {/* Action / View Details (Optional, adds visual cue) */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">{listing.fund_type}</span>
          <span className="text-sm font-bold text-primary group-hover:translate-x-1 transition-transform inline-flex items-center">
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}
