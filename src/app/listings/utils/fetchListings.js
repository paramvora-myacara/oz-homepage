import { createClient } from '../../../lib/supabase/client';

export async function fetchListings() {
  const supabase = createClient();

  try {
    // Fetch data from oz_projects with column aliases so that downstream mapping is straightforward
    const { data, error } = await supabase
      .from('oz_projects')
      .select(`
        id:project_id,
        title:project_name,
        state,
        irr:projected_irr_10yr,
        min_investment:minimum_investment,
        ten_year_multiple:equity_multiple_10yr,
        asset_type:property_type,
        development_type:construction_type,
        image_urls,
        summary:executive_summary,
        slug:project_slug,
        status
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching listings:', error);
      throw new Error(`Failed to fetch listings: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Transform the data to match the listing card expectations
    const formattedListings = data.map((listing) => ({
      id: listing.id,
      title: listing.title,
      state: listing.state,
      irr: listing.irr !== null && listing.irr !== undefined ? `${listing.irr}%` : '—',
      min_investment:
        listing.min_investment !== null && listing.min_investment !== undefined
          ? `$${Number(listing.min_investment).toLocaleString()}`
          : '—',
      ten_year_multiple:
        listing.ten_year_multiple !== null && listing.ten_year_multiple !== undefined
          ? `${listing.ten_year_multiple}x`
          : '—',
      asset_type: listing.asset_type,
      development_type: listing.development_type || listing.status, // fallback to status when development type is not present
      image_urls: listing.image_urls || [],
      summary: listing.summary,
      featured: false, // No featured column in oz_projects yet
      slug: listing.slug
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
    .from('oz-projects-images')
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

export async function fetchListingBySlug(slug) {
  const supabase = createClient();
  try {
    const { data, error } = await supabase
      .from('oz_projects')
      .select(`
        id:project_id,
        title:project_name,
        state,
        irr:projected_irr_10yr,
        min_investment:minimum_investment,
        ten_year_multiple:equity_multiple_10yr,
        asset_type:property_type,
        development_type:construction_type,
        image_urls,
        summary:executive_summary,
        slug:project_slug,
        status
      `)
      .eq('project_slug', slug)
      .single();

    if (error) {
      console.error('Error fetching listing by slug:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      state: data.state,
      irr: data.irr !== null && data.irr !== undefined ? `${data.irr}%` : '—',
      min_investment:
        data.min_investment !== null && data.min_investment !== undefined
          ? `$${Number(data.min_investment).toLocaleString()}`
          : '—',
      ten_year_multiple:
        data.ten_year_multiple !== null && data.ten_year_multiple !== undefined
          ? `${data.ten_year_multiple}x`
          : '—',
      asset_type: data.asset_type,
      development_type: data.development_type || data.status,
      image_url: data.image_urls && data.image_urls.length > 0 ? data.image_urls[0] : null,
      summary: data.summary,
      featured: false,
      slug: data.slug,
      image_urls: data.image_urls || [],
    };
  } catch (error) {
    console.error('Error in fetchListingBySlug:', error);
    return null;
  }
} 