import { mockListings } from "../mockData";

/**
 * Fetch listings from data source
 * Currently returns mock data, but can be easily replaced with Supabase calls
 * when the schema is finalized
 */
export async function fetchListings() {
  // Simulate API delay for realistic loading behavior
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Replace with Supabase query when schema is ready
  // Example future implementation:
  // const { data, error } = await supabase
  //   .from('oz_listings')
  //   .select('id, title, state, irr, min_investment, ten_year_multiple, image_url, summary')
  //   .eq('status', 'active')
  //   .order('created_at', { ascending: false });
  
  // if (error) {
  //   throw new Error(`Failed to fetch listings: ${error.message}`);
  // }
  
  // return data;
  
  return mockListings;
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