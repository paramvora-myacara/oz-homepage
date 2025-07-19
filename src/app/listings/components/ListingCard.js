"use client";
import { useState } from "react";
import Image from "next/image";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";
import { getSupabaseImageUrl } from "../utils/fetchListings";

export default function ListingCard({ listing, gridSize }) {
  const [showSummary, setShowSummary] = useState(false);
  const [imageError, setImageError] = useState(false);

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
      listing_featured: listing.featured || false,
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    });
    
    // Future: Navigate to listing detail page
    console.log(`Navigate to listing ${listing.id}`);
  };

  return (
    <div 
      className="group relative bg-white dark:bg-gradient-to-br dark:from-gray-800/95 dark:via-gray-900/90 dark:to-black/95 dark:backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:shadow-[0_8px_32px_rgba(255,255,255,0.08)] dark:hover:shadow-[0_16px_48px_rgba(255,255,255,0.12)] border border-gray-400/60 dark:border-gray-400/40 dark:ring-1 dark:ring-white/20 dark:hover:ring-white/30 transition-all duration-500 cursor-pointer card-hover focus-ring focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-900"
      onClick={handleCardClick}
      onMouseEnter={() => setShowSummary(true)}
      onMouseLeave={() => setShowSummary(false)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${listing.title || 'development'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/80">
        {!imageError && listing.image_url ? (
          <Image
            src={getSupabaseImageUrl(listing.image_url) || listing.image_url}
            alt={`${listing.title || 'Development'} in ${listing.state || 'location'}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-900/80">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                {/* Building outline SVG */}
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6H7v-6H5.5L12 5.5z"/>
                  <rect x="9" y="14" width="2" height="2"/>
                  <rect x="13" y="14" width="2" height="2"/>
                  <rect x="9" y="10" width="2" height="2"/>
                  <rect x="13" y="10" width="2" height="2"/>
                </svg>
              </div>
              <p className="text-xs font-medium opacity-75">No image available</p>
            </div>
          </div>
        )}
        
        {/* Summary Overlay */}
        <div className={`absolute inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          showSummary ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="absolute bottom-4 left-4 right-4">
            <p className={`text-white dark:text-gray-100 leading-relaxed line-clamp-3 ${gridSize === 'large' ? 'text-xl' : 'text-base'}`}>
              {listing.summary || 'No description available for this development.'}
            </p>
          </div>
        </div>

        {/* Asset Type and Development Type Pills */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Asset Type pill */}
          {listing.asset_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100/90 text-gray-800 dark:bg-gray-800/90 dark:text-gray-100 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
              {listing.asset_type}
            </span>
          )}

          {/* Development Type pill */}
          {listing.development_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100/90 text-gray-800 dark:bg-gray-800/90 dark:text-gray-100 border-gray-300/50 dark:border-gray-600/50 backdrop-blur-sm dark:shadow-[0_2px_8px_rgba(255,255,255,0.1)]">
              {listing.development_type}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`dark:bg-gradient-to-b dark:from-transparent dark:to-black/20 ${gridSize === 'large' ? 'p-8' : 'p-6'}`}>
        <h3 className={`font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors ${gridSize === 'large' ? 'text-2xl' : 'text-xl'}`}>
          {listing.title || 'Untitled Development'}
        </h3>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              IRR
            </p>
            <p className={`font-bold text-oz-zones dark:text-primary-400 dark:drop-shadow-sm ${gridSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              {listing.irr || '—'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Min Investment
            </p>
            <p className={`font-bold text-gray-900 dark:text-gray-100 ${gridSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              {listing.min_investment || '—'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              10-Year Multiple
            </p>
            <p className={`font-bold text-primary-600 dark:text-primary-400 dark:drop-shadow-sm ${gridSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              {listing.ten_year_multiple || '—'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </p>
            <p className={`font-semibold text-gray-700 dark:text-gray-200 truncate ${gridSize === 'large' ? 'text-lg' : 'text-base'}`}>
              {listing.state || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary-500/20 dark:group-hover:ring-primary-400/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
} 