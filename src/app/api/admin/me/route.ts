import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET() {
  const user = await verifyAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createAdminClient()

  let listingSlugs: string[]

  if (user.role === 'internal_admin') {
    // Internal admins see all listings from the listings table
    const { data: allListings, error: listingsError } = await supabase
      .from('listings')
      .select('slug')

    if (listingsError) return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
    listingSlugs = (allListings || []).map((r: { slug: string }) => r.slug)
  } else {
    // Customers see only listings they're associated with
    const { data: userListings, error: listingsError } = await supabase
      .from('admin_user_listings')
      .select('listing_slug')
      .eq('user_id', user.id)

    if (listingsError) return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
    listingSlugs = (userListings || []).map((r: { listing_slug: string }) => r.listing_slug)
  }

  if (listingSlugs.length === 0) {
    return NextResponse.json(
      { user: { id: user.id, email: user.email, role: user.role }, listings: [] }
    )
  }

  // Get details (title, current_version_id, has_vault) for these listings
  const { data: listingsData, error: listingsDataError } = await supabase
    .from('listings')
    .select('id, slug, title, current_version_id, has_vault')
    .in('slug', listingSlugs)

  if (listingsDataError) return NextResponse.json({ error: 'Failed to load listing data' }, { status: 500 })

  type ListingRow = {
    listing_slug: string
    title: string | null
    is_draft: boolean
    has_vault: boolean
    access_emails?: string[]
  }
  const listings: ListingRow[] = (listingsData || []).map((l: { slug: string; title: string | null; current_version_id: string | null; has_vault: boolean }) => ({
    listing_slug: l.slug,
    title: l.title,
    is_draft: !l.current_version_id,
    has_vault: l.has_vault
  }))

  // For internal_admin, attach access emails per listing (excluding other internal_admins)
  if (user.role === 'internal_admin') {
    const { data: accessRows, error: accessError } = await supabase
      .from('admin_user_listings')
      .select('user_id, listing_slug')
      .in('listing_slug', listingSlugs)

    if (!accessError && accessRows?.length) {
      const userIds = [...new Set(accessRows.map((r: { user_id: string }) => r.user_id))]
      const { data: adminUsers, error: usersError } = await supabase
        .from('admin_users')
        .select('id, email, role')
        .in('id', userIds)

      if (!usersError && adminUsers?.length) {
        const nonInternalById = new Map(
          adminUsers
            .filter((u: { role: string }) => u.role !== 'internal_admin')
            .map((u: { id: string; email: string }) => [u.id, u.email])
        )
        const slugToEmails = new Map<string, string[]>()
        for (const slug of listingSlugs) slugToEmails.set(slug, [])
        for (const row of accessRows as { user_id: string; listing_slug: string }[]) {
          const email = nonInternalById.get(row.user_id)
          if (email) {
            const arr = slugToEmails.get(row.listing_slug)!
            if (!arr.includes(email)) arr.push(email)
          }
        }
        for (const listing of listings) {
          listing.access_emails = slugToEmails.get(listing.listing_slug) ?? []
        }
      } else {
        for (const listing of listings) {
          listing.access_emails = []
        }
      }
    } else {
      for (const listing of listings) {
        listing.access_emails = []
      }
    }
  }

  return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role }, listings })
}
