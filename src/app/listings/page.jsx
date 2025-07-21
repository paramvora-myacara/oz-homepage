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
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24 dark:bg-gradient-to-br dark:from-gray-950 dark:via-black dark:to-gray-900">
      {/* Main Content Layout */}
      <div className="mx-auto max-w-screen-2xl px-4 pb-16 sm:px-6">
        {/* Header Section */}
        <div className="px-6 pt-4 pb-6 text-center">
          <h1 className="mb-0 text-5xl font-black tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gray-900 dark:text-white dark:drop-shadow-lg">
              Marketplace
            </span>
          </h1>
          <p className="text-lg font-light text-gray-600 md:text-xl dark:text-gray-300">
            Discover premium Opportunity Zone investments
          </p>
        </div>

        <div className="flex gap-4">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              onClose={() => {}}
              className="sticky top-20 z-30 h-fit w-80 rounded-2xl border border-gray-200 bg-white shadow-lg md:top-28 dark:border-gray-700/50 dark:bg-gradient-to-b dark:from-gray-900/95 dark:to-black/95 dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl"
            />
          </div>

          {/* Listings Content */}
          <div className="flex-1">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700/50 dark:bg-gradient-to-b dark:from-gray-900/95 dark:to-black/95 dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl">
              {/* Header with results count and grid controls */}
              <div className="border-b border-gray-100 px-4 py-3 sm:px-6 dark:border-gray-700/50">
                {/* Desktop */}
                <div className="hidden items-center justify-between sm:flex">
                  <div className="flex items-center space-x-0 text-gray-700 dark:text-gray-200">
                    <div className="bg-primary-500 dark:bg-primary-400 dark:shadow-primary-400/50 h-2 w-2 rounded-full shadow-lg"></div>
                    <span className="font-medium">
                      {filteredListings.length} opportunity zone
                      {filteredListings.length !== 1 ? "s" : ""} available
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 rounded-xl border border-gray-200 bg-white p-1.5 dark:border-gray-600/50 dark:bg-gray-800/80 dark:shadow-[0_4px_16px_rgba(255,255,255,0.03)] dark:backdrop-blur-sm">
                    <button
                      onClick={() => setGridSize("medium")}
                      className={`rounded-lg p-2.5 transition-all duration-200 ${
                        gridSize === "medium"
                          ? "bg-primary-200 dark:bg-primary-500 dark:shadow-primary-500/30 scale-105 text-black shadow-md dark:text-white dark:ring-1 dark:ring-white/25"
                          : "hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      }`}
                      aria-label="Three-column grid"
                    >
                      <Grid
                        className={`h-4 w-4 ${gridSize === "medium" ? "text-black dark:text-white" : ""}`}
                      />
                    </button>
                    <button
                      onClick={() => setGridSize("large")}
                      className={`rounded-lg p-2.5 transition-all duration-200 ${
                        gridSize === "large"
                          ? "bg-primary-200 dark:bg-primary-500 dark:shadow-primary-500/30 scale-105 text-black shadow-md dark:text-white dark:ring-1 dark:ring-white/25"
                          : "hover:text-primary-600 dark:hover:text-primary-400 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                      }`}
                      aria-label="Two-column grid"
                    >
                      <LayoutGrid
                        className={`h-4 w-4 ${gridSize === "large" ? "text-black dark:text-white" : ""}`}
                      />
                    </button>
                  </div>
                </div>
                {/* Mobile */}
                <div className="sm:hidden">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex min-w-0 flex-1 items-center space-x-0 text-gray-700 dark:text-gray-200">
                      <div className="bg-primary-500 dark:bg-primary-400 dark:shadow-primary-400/50 h-2 w-2 flex-shrink-0 rounded-full shadow-lg"></div>
                      <span className="ml-1 truncate text-sm font-medium">
                        {filteredListings.length} opportunity zone
                        {filteredListings.length !== 1 ? "s" : ""} available
                      </span>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="dark:bg-primary-500 dark:hover:bg-primary-600 dark:shadow-primary-500/30 dark:focus:ring-primary-400/60 ml-2 inline-flex flex-shrink-0 items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow transition-all hover:bg-blue-700 focus:ring-2 focus:ring-blue-300/60 focus:outline-none"
                      aria-label="Open filters"
                    >
                      <FilterIcon className="mr-1 h-3 w-3" />
                      Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="p-4.5 sm:p-6 md:p-8">
                {loading ? (
                  <div className="py-16 text-center">
                    <div className="border-primary-600 dark:border-primary-400 dark:shadow-primary-400/20 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Loading listings...
                    </p>
                  </div>
                ) : error ? (
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:border dark:border-red-800/50 dark:bg-red-900/30">
                      <svg
                        className="h-12 w-12 text-red-500 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      Error loading listings
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300">
                      {error}
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 dark:shadow-primary-500/30 inline-flex items-center rounded-lg px-6 py-3 font-semibold text-white transition-colors"
                    >
                      Try Again
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
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:border dark:border-gray-700/50 dark:bg-gray-800/50">
                      <Grid className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      No listings found
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300">
                      Try adjusting your filters to find more listings.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 dark:shadow-primary-500/30 inline-flex items-center rounded-lg px-6 py-3 font-semibold text-white transition-colors"
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

      {/* Mobile Filter Sidebar */}
      <div className="lg:hidden">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
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