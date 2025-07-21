import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { debounce } from "lodash";

const INITIAL_FILTERS = {
  states: [],
  irr: [5, 30],
  minInvestment: [50000, 1000000],
  tenYearMultiple: [1.5, 5],
  assetType: [],
  fundType: [],
};

export function useListingsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // Load filters from URL on component mount
  useEffect(() => {
    const urlFilters = {
      states: searchParams.get("states")?.split(",").filter(Boolean) || [],
      irr: searchParams.get("irr")?.split(",").map(Number) || [5, 30],
      minInvestment:
        searchParams.get("minInvestment")?.split(",").map(Number) || [
          50000, 1000000,
        ],
      tenYearMultiple:
        searchParams.get("tenYearMultiple")?.split(",").map(Number) || [1.5, 5],
      assetType:
        searchParams.get("assetType")?.split(",").filter(Boolean) || [],
      fundType:
        searchParams.get("fundType")?.split(",").filter(Boolean) || [],
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Debounced URL update
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

  // Handle filter changes from the UI
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
    setFilters(INITIAL_FILTERS);
  };

  return {
    filters,
    handleFilterChange,
    clearAllFilters,
  };
} 