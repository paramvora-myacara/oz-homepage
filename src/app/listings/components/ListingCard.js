"use client";
import { useState } from "react";
import Image from "next/image";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";
import { getSupabaseImageUrl } from "../utils/fetchListings";

export default function ListingCard({ listing }) {
  const [showSummary, setShowSummary] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = async () => {
    // Track listing click event
    await trackUserEvent("listing_clicked", {
      listing_id: listing.id,
      listing_title: listing.title,
      listing_state: listing.state,
      timestamp: new Date().toISOString()
    });
    
    // Future: Navigate to listing detail page
    console.log(`Navigate to listing ${listing.id}`);
  };

  return (
    <div 
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:shadow-none dark:hover:shadow-none dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.15)] dark:hover:shadow-[0_10px_15px_-3px_rgba(255,255,255,0.25)] border border-gray-200 dark:border-gray-700 dark:ring-1 dark:ring-white/10 transition-all duration-500 cursor-pointer card-hover focus-ring focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-primary-400 dark:focus:ring-offset-gray-900"
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
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
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
        <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          showSummary ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm leading-relaxed line-clamp-3">
              {listing.summary || 'No description available for this development.'}
            </p>
          </div>
        </div>

        {/* Asset Type and Development Type Pills */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Asset Type pill */}
          {listing.asset_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              {listing.asset_type}
            </span>
          )}

          {/* Development Type pill */}
          {listing.development_type && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              {listing.development_type}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {listing.title || 'Untitled Development'}
        </h3>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              IRR
            </p>
            <p className="text-lg font-bold text-oz-zones">
              {listing.irr || '—'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Min Investment
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {listing.min_investment || '—'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              10-Year Multiple
            </p>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
              {listing.ten_year_multiple || '—'}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
              {listing.state || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all duration-300 pointer-events-none" />
    </div>
  );
} 