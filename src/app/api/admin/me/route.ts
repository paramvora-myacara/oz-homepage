import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET() {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()

  // Get user's listings
  const { data: userListings, error: listingsError } = await supabase
    .from('admin_user_listings')
    .select('listing_slug')
    .eq('user_id', user.id)

  if (listingsError) return NextResponse.json({ error: 'Failed to load' }, { status: 500 })

  // Get domain information for these listings
  const listingSlugs = (userListings || []).map((r: any) => r.listing_slug)
  const { data: domainsData, error: domainsError } = await supabase
    .from('domains')
    .select('hostname, listing_slug')
    .in('listing_slug', listingSlugs)

  if (domainsError) return NextResponse.json({ error: 'Failed to load domains' }, { status: 500 })

  // Create a map of listing_slug to hostname
  const domainMap = new Map()
    ; (domainsData || []).forEach((domain: any) => {
      domainMap.set(domain.listing_slug, domain.hostname)
    })

  // Get details (title, current_version_id, has_vault) for these listings
  const { data: listingsData, error: listingsDataError } = await supabase
    .from('listings')
    .select('id, slug, title, current_version_id, has_vault')
    .in('slug', listingSlugs)

  if (listingsDataError) return NextResponse.json({ error: 'Failed to load listing data' }, { status: 500 })

  // Transform the data to include hostname and draft status
  const listings = (listingsData || []).map((l: any) => ({
    listing_slug: l.slug,
    title: l.title,
    hostname: domainMap.get(l.slug),
    is_draft: !l.current_version_id,
    has_vault: l.has_vault
  }))

  return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role }, listings })
} 