import { useState, useEffect, useMemo } from "react";
import { fetchListings as fetchListingsApi, fetchListingImages } from "../utils/fetchListings";
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
        
        // Fetch images for each listing
        const listingsWithImages = await Promise.all(
          data.map(async (listing) => {
            if (listing.slug) {
              const images = await fetchListingImages(listing.slug);
              return { ...listing, image_urls: images };
            }
            return listing;
          })
        );
        
        setListings(listingsWithImages);
        trackUserEvent("viewed_listings", {
          total_listings_shown: listingsWithImages.length,
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

  // Memoized filtering and sorting of listings
  const filteredListings = useMemo(() => {
    if (!listings.length) return [];
    
    const filtered = listings.filter((listing) => {
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

      // Property Class filter
      if (filters.propertyClass && filters.propertyClass.length > 0) {
        if (!filters.propertyClass.includes(listing.property_class)) {
          return false;
        }
      }

      return true;
    });
    
    // Sort listings: newest created_at first, NULLs last, with alphabetical tiebreaker
    return filtered.sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at) : null;
      const bDate = b.created_at ? new Date(b.created_at) : null;
      
      // Both have dates: sort by date (newest first)
      if (aDate && bDate) {
        return bDate - aDate;
      }
      
      // Only a has date: a comes first
      if (aDate && !bDate) return -1;
      
      // Only b has date: b comes first
      if (!aDate && bDate) return 1;
      
      // Both are NULL: use tiebreaker (alphabetical by title)
      if (!aDate && !bDate) {
        const titleA = (a.title || '').toLowerCase();
        const titleB = (b.title || '').toLowerCase();
        return titleA.localeCompare(titleB);
      }
      
      return 0;
    });
  }, [listings, filters]);

  return { listings, loading, error, filteredListings };
} 