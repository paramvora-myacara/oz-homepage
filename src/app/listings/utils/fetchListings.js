import { createClient } from '../../../lib/supabase/client';

export async function fetchListings() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('developments')
      .select(`
        id,
        title,
        state,
        irr,
        min_investment,
        ten_year_multiple,
        asset_type,
        development_type,
        image_url,
        summary,
        featured
      `)
      .eq('is_active', true)
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Transform the data to match your existing format
    const formattedListings = data.map(listing => ({
      id: listing.id,
      title: listing.title,
      state: listing.state,
      irr: `${listing.irr}%`,
      min_investment: `$${listing.min_investment.toLocaleString()}`,
      ten_year_multiple: `${listing.ten_year_multiple}x`,
      asset_type: listing.asset_type,
      development_type: listing.development_type,
      image_url: listing.image_url,
      summary: listing.summary,
      featured: listing.featured
    }));

    return formattedListings;
  } catch (error) {
    console.error('Error in fetchListings:', error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

export function getSupabaseImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If it's already a full URL (starts with http), return as-is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a local path (starts with /), return as-is for local images
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, treat it as a Supabase storage path
  const supabase = createClient();
  const { data } = supabase.storage
    .from('development-images')
    .getPublicUrl(imagePath);
  
  return data.publicUrl;
}

/**
 * Fetch a single listing by ID
 * Future implementation for listing detail pages
 */
export async function fetchListingById(id) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase
  //   .from('oz_listings')
  //   .select('*')
  //   .eq('id', id)
  //   .single();
  
  // if (error) {
  //   throw new Error(`Failed to fetch listing: ${error.message}`);
  // }
  
  // return data;
  
  return mockListings.find(listing => listing.id === id);
} 