"use client";
import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Menu, Grid, LayoutGrid, Filter as FilterIcon } from "lucide-react";
import FilterSidebar from "./components/FilterSidebar";
import ListingCard from "./components/ListingCard";
import PromotionalCard from "./components/PromotionalCard";
import { FILTER_OPTIONS } from "./mockData";
import { fetchListings } from "./utils/fetchListings";
import { trackUserEvent } from "../../lib/analytics/trackUserEvent";
import { debounce } from "lodash";
import { useAuth } from "../../lib/auth/AuthProvider";
import ExitPopup from "../components/ExitPopup";

function ListingsPageContent() {
  // Mobile filter sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gridSize, setGridSize] = useState("large");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const [showExitPopup, setShowExitPopup] = useState(false);
  const { user, userLoading } = useAuth();
  const router = useRouter();

  const [filters, setFilters] = useState({
    states: [],
    irr: [5, 20],
    minInvestment: [50000, 1000000],
    tenYearMultiple: [1.5, 8],
    assetType: [],
  });

  useEffect(() => {
    // Exit intent detection
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // Helper to show popup only once per session
    const showPopupIfNotShown = () => {
      if (!sessionStorage.getItem("exitPopupShown")) {
        setShowExitPopup(true);
        sessionStorage.setItem("exitPopupShown", "true");
        // Remove dummy state for Back works
        window.history.back();
      }
    };

    if (!userLoading && !user) {
      // Push a dummy state to the history stack to detect Back navigation using navigation guestures, trackpad, keyboard, etc.
      window.history.pushState({ page: "homepage" }, "", window.location.href);
      if (isMobile) {
        // For mobile and navigation gestures (including trackpad/keyboard navigation)
        const handlePopState = (e) => {
          showPopupIfNotShown();
        };
        window.addEventListener("popstate", handlePopState);

        return () => {
          window.removeEventListener("popstate", handlePopState);
        };
      } else {
        // For desktop, use mouseleave event to detect exit intent
        const handleMouseLeave = (e) => {
          if (e.clientY < 0) {
            showPopupIfNotShown();
          }
        };
        document.addEventListener("mouseleave", handleMouseLeave);

        // Also catch navigation gestures (trackpad/keyboard) on desktop
        const handlePopState = (e) => {
          showPopupIfNotShown();
        };
        window.addEventListener("popstate", handlePopState);

        return () => {
          document.removeEventListener("mouseleave", handleMouseLeave);
          window.removeEventListener("popstate", handlePopState);
        };
      }
    }
  }, [loading, user]);

  // Load filters from URL on component mount
  useEffect(() => {
    const urlFilters = {
      states: searchParams.get("states")?.split(",").filter(Boolean) || [],
      irr: searchParams.get("irr")?.split(",").map(Number) || [5, 20],
      minInvestment: searchParams
        .get("minInvestment")
        ?.split(",")
        .map(Number) || [50000, 1000000],
      tenYearMultiple: searchParams
        .get("tenYearMultiple")
        ?.split(",")
        .map(Number) || [1.5, 8],
      assetType:
        searchParams.get("assetType")?.split(",").filter(Boolean) || [],
    };
    setFilters(urlFilters);
  }, []);

  const debouncedUpdateUrl = useCallback(
    debounce((newFilters) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          params.set(key, values.join(","));
        }
      });
      const newUrl = params.toString() ? `?${params.toString()}` : "/listings";
      router.replace(newUrl, { scroll: false });
    }, 300),
    [router],
  );

  useEffect(() => {
    debouncedUpdateUrl(filters);
  }, [filters, debouncedUpdateUrl]);

  const handleFilterChange = (filterType, value, checked) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      const isSlider = ["minInvestment", "tenYearMultiple", "irr"].includes(
        filterType,
      );

      if (isSlider) {
        newFilters[filterType] = value;
      } else {
        // Checkbox logic
        if (checked) {
          newFilters[filterType] = [...prev[filterType], value];
        } else {
          newFilters[filterType] = prev[filterType].filter(
            (item) => item !== value,
          );
        }
      }
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      states: [],
      irr: [5, 20],
      minInvestment: [50000, 1000000],
      tenYearMultiple: [1.5, 8],
      assetType: [],
    });
  };

  // Fetch listings on mount
  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const data = await fetchListings();
        setListings(data);

        // Track page view
        trackUserEvent("viewed_listings", {
          total_listings_shown: data.length,
          timestamp: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to load listings:", err);
        setError("Failed to load listings. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, []);

  // Filter listings based on URL parameters
  const filteredListings = useMemo(() => {
    if (!listings.length) return [];

    return listings.filter((listing) => {
      // State filter
      if (
        filters.states.length > 0 &&
        !filters.states.includes(listing.state)
      ) {
        return false;
      }

      // IRR filter
      if (filters.irr.length === 2) {
        const listingIRR = parseFloat(String(listing.irr).replace("%", ""));
        const [minIRR, maxIRR] = filters.irr;
        if (listingIRR < minIRR || listingIRR > maxIRR) {
          return false;
        }
      }

      // Minimum Investment filter
      if (filters.minInvestment.length === 2) {
        const listingMinInvestment = parseFloat(
          listing.min_investment.replace(/[$,]/g, ""),
        );
        const [minInvestment, maxInvestment] = filters.minInvestment;
        if (
          listingMinInvestment < minInvestment ||
          listingMinInvestment > maxInvestment
        ) {
          return false;
        }
      }

      // Ten Year Multiple filter
      if (filters.tenYearMultiple.length === 2) {
        const listingMultiple = parseFloat(
          listing.ten_year_multiple.replace("x", ""),
        );
        const [minMultiple, maxMultiple] = filters.tenYearMultiple;
        if (listingMultiple < minMultiple || listingMultiple > maxMultiple) {
          return false;
        }
      }

      // Asset Type filter
      if (filters.assetType.length > 0) {
        const matchesAssetType = filters.assetType.includes(listing.asset_type);
        if (!matchesAssetType) return false;
      }

      return true;
    });
  }, [listings, filters]);

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

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 md:pt-24 dark:bg-gradient-to-br dark:from-gray-950 dark:via-black dark:to-gray-900">
      {/* Main Content Layout */}
      <div className="mx-auto max-w-screen-2xl px-4 pb-16 sm:px-6">
        {/* Header Section - Centered */}
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
          {/* Filter Section - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              onClose={() => {}}
              className="sticky top-20 z-30 h-fit max-h-[calc(100vh-8rem)] w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg md:top-28 dark:border-gray-700/50 dark:bg-gradient-to-b dark:from-gray-900/95 dark:to-black/95 dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl"
            />
          </div>

          {/* Cards Section */}
          <div className="flex-1">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-lg dark:border-gray-700/50 dark:bg-gradient-to-b dark:from-gray-900/95 dark:to-black/95 dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] dark:ring-1 dark:ring-white/10 dark:backdrop-blur-xl">
              {/* Results Count Header */}
              <div className="border-b border-gray-100 px-4 py-3 sm:px-6 dark:border-gray-700/50">
                {/* Desktop Layout */}
                <div className="hidden items-center justify-between sm:flex">
                  <div className="flex items-center space-x-0 text-gray-700 dark:text-gray-200">
                    <div className="bg-primary-500 dark:bg-primary-400 dark:shadow-primary-400/50 h-2 w-2 rounded-full shadow-lg"></div>
                    <span className="font-medium">
                      {filteredListings.length} opportunity zone
                      {filteredListings.length !== 1 ? "s" : ""} available
                    </span>
                  </div>

                  {/* Grid Size Controls - Right Side */}
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

                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex min-w-0 flex-1 items-center space-x-0 text-gray-700 dark:text-gray-200">
                      <div className="bg-primary-500 dark:bg-primary-400 dark:shadow-primary-400/50 h-2 w-2 flex-shrink-0 rounded-full shadow-lg"></div>
                      <span className="ml-1 truncate text-sm font-medium">
                        {filteredListings.length} opportunity zone
                        {filteredListings.length !== 1 ? "s" : ""} available
                      </span>
                    </div>

                    {/* Mobile Filter Button */}
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
              <div className="p-4.5 sm:p-6 md:p-8">
                {loading ? (
                  /* Loading State */
                  <div className="py-16 text-center">
                    <div className="border-primary-600 dark:border-primary-400 dark:shadow-primary-400/20 mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent"></div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Loading listings...
                    </p>
                  </div>
                ) : error ? (
                  /* Error State */
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
                    {/* Listing Cards */}
                    {filteredListings.map((listing) => (
                      <ListingCard
                        key={listing.id}
                        listing={listing}
                        gridSize={gridSize}
                      />
                    ))}

                    {/* Promotional Card */}
                    <PromotionalCard />
                  </div>
                ) : (
                  /* Empty State */
                  <div className="py-16 text-center">
                    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:border dark:border-gray-700/50 dark:bg-gray-800/50">
                      <Grid className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                      No listings found
                    </h3>
                    <p className="mx-auto mb-6 max-w-md text-gray-600 dark:text-gray-300">
                      Try adjusting your filters to see more opportunity zone
                      listings, or check back later for new opportunities.
                    </p>
                    <button
                      onClick={() => (window.location.href = "/listings")}
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

      {/* Mobile Filter Sidebar Overlay */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        className="lg:hidden"
      />
      {/* Exit Intent Popup */}
      <ExitPopup open={showExitPopup} onClose={() => setShowExitPopup(false)} />
    </div>
  );
}

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
