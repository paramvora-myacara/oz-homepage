"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Grid, LayoutGrid, Filter as FilterIcon } from "lucide-react";

// Refactored custom hooks
import { useExitPopup } from "./hooks/useExitPopup";
import { useListingsFilters } from "./hooks/useListingsFilters";
import { useFetchListings } from "./hooks/useFetchListings";

// Components
import FilterSidebar from "./components/FilterSidebar";
import ListingCard from "./components/ListingCard";
import PromotionalCard from "./components/PromotionalCard";
import ExitPopup from "../components/ExitPopup";

import Navbar from '../components/landing/Navbar';

function ListingsPageContent() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridSize, setGridSize] = useState("large");

  // Custom hooks
  const { showExitPopup, setShowExitPopup } = useExitPopup();
  const { filters, handleFilterChange, clearAllFilters } =
    useListingsFilters();
  const { loading, error, filteredListings } = useFetchListings(filters);

  // Grid layout configuration
  const getGridClasses = () => {
    switch (gridSize) {
      case "small":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4";
      case "medium":
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3";
      case "large":
        return "grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2";
      default:
        return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4";
    }
  };

  const handleClearFilters = () => {
    clearAllFilters();
    router.push("/listings");
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-navy font-sans antialiased">
      <Navbar />

      {/* Main Content Layout */}
      <div className="mx-auto max-w-[1440px] px-4 md:px-8 pb-16 pt-8">
        {/* Header Section */}
        <div className="mb-8 text-center md:mb-12">
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl text-navy">
            Marketplace
          </h1>
          <p className="text-lg font-medium text-gray-600 md:text-xl max-w-2xl mx-auto">
            Discover premium Opportunity Zone investments
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              onClose={() => { }}
              className="sticky top-24 z-30 h-fit w-80"
            />
          </div>

          {/* Listings Content */}
          <div className="flex-1">
            {/* Mobile Sticky Filter Header */}
            <div className="sticky top-20 z-20 mb-6 lg:hidden">
              <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-2 text-navy">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="font-semibold text-sm">
                    {filteredListings.length} opportunity zone{filteredListings.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="flex items-center space-x-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform active:scale-95"
                  aria-label="Open filters"
                >
                  <FilterIcon className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Desktop Results Count & View Toggle */}
              <div className="hidden sm:flex items-center justify-between bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center space-x-2 text-navy">
                  <div className="bg-primary h-2 w-2 rounded-full shadow-[0_0_10px_rgba(30,136,229,0.5)]"></div>
                  <span className="font-semibold">
                    {filteredListings.length} results found
                  </span>
                </div>

                <div className="flex items-center p-1 bg-white rounded-lg border border-gray-200">
                  <button
                    onClick={() => setGridSize("medium")}
                    className={`rounded-md p-2 transition-all ${gridSize === "medium"
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-400 hover:text-navy hover:bg-gray-50"
                      }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridSize("large")}
                    className={`rounded-md p-2 transition-all ${gridSize === "large"
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-400 hover:text-navy hover:bg-gray-50"
                      }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Listings Grid */}
              <div>
                {loading ? (
                  <div className="py-24 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="font-medium text-gray-500">
                      Loading investments...
                    </p>
                  </div>
                ) : error ? (
                  <div className="py-24 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-navy">Unable to load listings</h3>
                    <p className="mx-auto mb-6 max-w-md text-gray-500">
                      {error}. Please try again later.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center rounded-lg bg-primary px-6 py-2.5 font-semibold text-white shadow-lg shadow-primary/30 transition-transform active:scale-95"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredListings.length > 0 ? (
                  <div className={`grid gap-6 ${getGridClasses()}`}>
                    {filteredListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        gridSize={gridSize}
                      />
                    ))}
                    <PromotionalCard />
                  </div>
                ) : (
                  <div className="py-24 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                      <FilterIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-navy">
                      No matching investments
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-gray-500">
                      We couldn't find any deals matching your criteria. Try adjusting your filters.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center rounded-lg bg-navy px-6 py-2.5 font-semibold text-white shadow-lg transition-transform active:scale-95 hover:bg-navy-800"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Sidebar - Overlay */}
      {sidebarOpen && (
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Exit Intent Popup */}
      <ExitPopup open={showExitPopup} onClose={() => setShowExitPopup(false)} />
    </div>
  );
}

// Suspense boundary for client-side data fetching
export default function ListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
          <div className="text-center">
            <div className="border-primary-600 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading listings...
            </p>
          </div>
        </div>
      }
    >
      <ListingsPageContent />
    </Suspense>
  );
} 