import { useState, useEffect, useMemo } from "react";
import { fetchListings as fetchListingsApi } from "../utils/fetchListings";
import { trackUserEvent } from "../../../lib/analytics/trackUserEvent";

export function useFetchListings(filters) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch listings from the API
  useEffect(() => {
    async function loadListings() {
      try {
        setLoading(true);
        const data = await fetchListingsApi();
        setListings(data);
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

  // Memoized filtering of listings
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
        const matchesAssetType = filters.assetType.includes(
          listing.asset_type,
        );
        if (!matchesAssetType) return false;
      }

      // Fund Type filter
      if (filters.fundType.length > 0) {
        const matchesFundType = filters.fundType.includes(
          listing.fund_type,
        );
        if (!matchesFundType) return false;
      }

      return true;
    });
  }, [listings, filters]);

  return { listings, loading, error, filteredListings };
} 