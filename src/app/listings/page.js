"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Menu, Grid, LayoutGrid, Filter as FilterIcon } from "lucide-react";
import FilterSidebar from "./components/FilterSidebar";
import ListingCard from "./components/ListingCard";
import PromotionalCard from "./components/PromotionalCard";
import { mockListings, FILTER_OPTIONS } from "./mockData";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";

function ListingsPageContent() {
  // Mobile filter sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridSize, setGridSize] = useState('medium');
  const searchParams = useSearchParams();

  // Track page view on mount
  useEffect(() => {
    trackUserEvent("viewed_listings", {
      total_listings_shown: mockListings.length,
      timestamp: new Date().toISOString()
    });
  }, []);

  // Filter listings based on URL parameters
  const filteredListings = useMemo(() => {
    const filters = {
      states: searchParams.get('states')?.split(',').filter(Boolean) || [],
      irr: searchParams.get('irr')?.split(',').filter(Boolean) || [],
      minInvestment: searchParams.get('minInvestment')?.split(',').filter(Boolean) || [],
      tenYearMultiple: searchParams.get('tenYearMultiple')?.split(',').filter(Boolean) || [],
      assetType: searchParams.get('assetType')?.split(',').filter(Boolean) || []
    };

    return mockListings.filter(listing => {
      // State filter
      if (filters.states.length > 0 && !filters.states.includes(listing.state)) {
        return false;
      }

      // IRR filter
      if (filters.irr.length > 0) {
        const listingIRR = parseFloat(listing.irr.replace('%', ''));
        const matchesIRR = filters.irr.some(irrRange => {
          const option = FILTER_OPTIONS.irr.find(opt => opt.label === irrRange);
          return option && listingIRR >= option.min && listingIRR < option.max;
        });
        if (!matchesIRR) return false;
      }

      // Minimum Investment filter
      if (filters.minInvestment.length > 0) {
        const listingMinInvestment = parseFloat(listing.min_investment.replace(/[$,]/g, ''));
        const matchesMinInvestment = filters.minInvestment.some(investRange => {
          const option = FILTER_OPTIONS.minInvestment.find(opt => opt.label === investRange);
          return option && listingMinInvestment >= option.min && 
                 (option.max === Infinity || listingMinInvestment < option.max);
        });
        if (!matchesMinInvestment) return false;
      }

      // Ten Year Multiple filter
      if (filters.tenYearMultiple.length > 0) {
        const listingMultiple = parseFloat(listing.ten_year_multiple.replace('x', ''));
        const matchesMultiple = filters.tenYearMultiple.some(multipleRange => {
          const option = FILTER_OPTIONS.tenYearMultiple.find(opt => opt.label === multipleRange);
          return option && listingMultiple >= option.min && listingMultiple < option.max;
        });
        if (!matchesMultiple) return false;
      }

      // Asset Type filter
      if (filters.assetType.length > 0) {
        const matchesAssetType = filters.assetType.includes(listing.asset_type);
        if (!matchesAssetType) return false;
      }

      return true;
    });
  }, [searchParams]);

  const getGridClasses = () => {
    switch (gridSize) {
      case 'small':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4';
      case 'medium':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3';
      case 'large':
        return 'grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2';
      default:
        return 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4';
    }
  };

    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-16 sm:pt-20 md:pt-24">
      {/* Header Section */}
      <div className="relative px-6 pt-4 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-0 tracking-tight">
              <span className="text-gray-900 dark:text-white">Marketplace</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light">
              Discover premium Opportunity Zone investments
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 pb-12">
        <div className="flex gap-4">
          {/* Filter Section - Desktop */}
          <div className="hidden lg:block w-80">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <FilterSidebar 
                isOpen={false}
                onClose={() => {}}
                className="relative h-auto border-none shadow-none bg-transparent"
              />
            </div>
          </div>

          {/* Cards Section */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600">
              {/* Results Count Header */}
              <div className="px-4 sm:px-6 py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-0 text-gray-700 dark:text-gray-300">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="font-medium">
                      {filteredListings.length} opportunity zone{filteredListings.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                  
                  {/* Mobile Filter Button */}
                  <div className="sm:hidden">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition-all focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                      aria-label="Open filters"
                    >
                      <FilterIcon className="w-4 h-4 mr-2" />
                      Filters
                    </button>
                  </div>

                  {/* Grid Size Controls - Right Side */}
                  <div className="hidden sm:flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1.5 border border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setGridSize('medium')}
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        gridSize === 'medium' 
                          ? 'bg-primary-200 text-black dark:bg-primary-500 dark:text-white shadow-md scale-105' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-label="Three-column grid"
                    >
                      <Grid className={`w-4 h-4 ${gridSize==='medium'?'text-black dark:text-white':''}`} />
                    </button>
                    <button
                      onClick={() => setGridSize('large')}
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        gridSize === 'large' 
                          ? 'bg-primary-200 text-black dark:bg-primary-500 dark:text-white shadow-md scale-105' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-label="Two-column grid"
                    >
                      <LayoutGrid className={`w-4 h-4 ${gridSize==='large'?'text-black dark:text-white':''}`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4.5 sm:p-6 md:p-8">
                {filteredListings.length > 0 ? (
                  <div className={`grid gap-6 ${getGridClasses()}`}>
                    {/* Listing Cards */}
                    {filteredListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                    
                    {/* Promotional Card */}
                    <PromotionalCard />
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Grid className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No listings found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Try adjusting your filters to see more opportunity zone listings, or check back later for new opportunities.
                    </p>
                    <button
                      onClick={() => window.location.href = '/listings'}
                      className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar Overlay */}
      <FilterSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="lg:hidden"
      />
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading listings...</p>
        </div>
      </div>
    }>
      <ListingsPageContent />
    </Suspense>
  );
} 