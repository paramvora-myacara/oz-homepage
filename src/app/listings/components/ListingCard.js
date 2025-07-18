"use client";
import { useState } from "react";
import Image from "next/image";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";

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
      className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200 dark:border-gray-600 transition-all duration-500 cursor-pointer card-hover focus-ring"
      onClick={handleCardClick}
      onMouseEnter={() => setShowSummary(true)}
      onMouseLeave={() => setShowSummary(false)}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${listing.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {!imageError ? (
          <Image
            src={listing.image_url}
            alt={`${listing.title} in ${listing.state}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm font-medium">{listing.title}</p>
            </div>
          </div>
        )}
        
        {/* Summary Overlay */}
        <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          showSummary ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm leading-relaxed line-clamp-3">
              {listing.summary}
            </p>
          </div>
        </div>

        {/* Asset Type and Development Type Pills */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            listing.asset_type === 'Single Asset' 
              ? 'bg-blue-500/90 text-white' 
              : 'bg-green-500/90 text-white'
          }`}>
            {listing.asset_type}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white backdrop-blur-sm">
            {listing.development_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {listing.title}
        </h3>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              IRR
            </p>
            <p className="text-lg font-bold text-oz-zones">
              {listing.irr}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Min Investment
            </p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {listing.min_investment}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              10-Year Multiple
            </p>
            <p className="text-lg font-bold text-oz-gold">
              {listing.ten_year_multiple}
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Location
            </p>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">
              {listing.state}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-primary-500/20 transition-all duration-300 pointer-events-none" />
    </div>
  );
} 