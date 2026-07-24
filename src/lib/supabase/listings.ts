import 'server-only'
import { createAdminClient } from '@/utils/supabase/admin'
import { Listing, ListingLifecycleStatus, NewsCardMetadata } from '@/types/listing'

export async function getPublishedListingBySlug(slug: string): Promise<Listing | null> {
  const supabase = createAdminClient()

  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select(
      'id, current_version_id, developer_website, is_verified_oz_project, title, lifecycle_status'
    )
    .eq('slug', slug)
    .single()

  if (listingError || !listing) {
    return null
  }

  const lifecycleStatus = listing.lifecycle_status as ListingLifecycleStatus

  if (lifecycleStatus !== 'live') {
    return {
      listingName: listing.title || slug,
      sections: [],
      details: {} as Listing['details'],
      lifecycle_status: lifecycleStatus
    }
  }

  if (!listing.current_version_id) {
    console.error(
      '[getPublishedListingBySlug] Invariant broken: lifecycle_status is live but current_version_id is null',
      slug
    )
    return null
  }

  const { data: version, error: versionError } = await supabase
    .from('listing_versions')
    .select('data, news_links')
    .eq('id', listing.current_version_id)
    .single()

  if (versionError || !version) {
    console.error('getPublishedListingBySlug version error', versionError)
    return null
  }

  return {
    ...(version.data as Listing),
    newsLinks: (version.news_links as NewsCardMetadata[]) || [],
    developer_website: listing.developer_website || null,
    is_verified_oz_project: listing.is_verified_oz_project || false,
    lifecycle_status: 'live'
  }
}

/**
 * Draft preview (generation-ux-plan §7).
 *
 * `getPublishedListingBySlug` intentionally returns an empty shell for any
 * non-live listing, which is correct for the public but means NOBODY — not
 * even the internal admin who has to approve it — can see generated content
 * while a listing sits in `in_review`.
 *
 * This authorizes the *viewer* rather than only checking the status:
 *   - live listing            -> unchanged, public content
 *   - non-live + owner/admin  -> full draft content, flagged is_draft_preview
 *   - non-live + anyone else  -> unchanged placeholder shell
 */
export async function getListingForViewer(slug: string): Promise<Listing | null> {
  const live = await getPublishedListingBySlug(slug)

  // Live (or missing) listings need no special handling.
  if (!live || live.lifecycle_status === 'live') return live

  // Lazy import: verifyAdminCanEditSlug reads cookies, so it must not be
  // pulled into module scope of anything used at build time.
  const { verifyAdminCanEditSlug } = await import('@/lib/admin/auth')
  const viewer = await verifyAdminCanEditSlug(slug)
  if (!viewer) return live // public visitor -> placeholder, unchanged

  const supabase = createAdminClient()
  const { data: listing } = await supabase
    .from('listings')
    .select(
      'id, current_version_id, developer_website, is_verified_oz_project, title, lifecycle_status'
    )
    .eq('slug', slug)
    .single()

  if (!listing) return live

  // Prefer the current version pointer; fall back to the newest version so a
  // freshly generated draft (pointer not yet repointed) is still previewable.
  let versionQuery = supabase
    .from('listing_versions')
    .select('data, news_links')

  const { data: version } = listing.current_version_id
    ? await versionQuery.eq('id', listing.current_version_id).maybeSingle()
    : await versionQuery
        .eq('listing_id', listing.id)
        .order('version_number', { ascending: false })
        .limit(1)
        .maybeSingle()

  if (!version?.data) return live // nothing generated yet -> placeholder

  return {
    ...(version.data as Listing),
    newsLinks: (version.news_links as NewsCardMetadata[]) || [],
    developer_website: listing.developer_website || null,
    is_verified_oz_project: listing.is_verified_oz_project || false,
    lifecycle_status: listing.lifecycle_status as ListingLifecycleStatus,
    is_draft_preview: true,
  }
}

export interface ListingVersionMeta {
  id: string
  version_number: number
  created_at: string
  published_at: string
  is_current?: boolean
}

export async function listVersionsBySlug(slug: string): Promise<ListingVersionMeta[]> {
  const supabase = createAdminClient()
  const { data: listingRow, error: listingError } = await supabase
    .from('listings')
    .select('id, current_version_id')
    .eq('slug', slug)
    .single()
  if (listingError || !listingRow) return []

  const { data, error } = await supabase
    .from('listing_versions')
    .select('id, version_number, created_at, published_at')
    .eq('listing_id', listingRow.id)
    .order('version_number', { ascending: false })
  if (error || !data) return []

  // Mark the current version
  return (data as ListingVersionMeta[]).map(version => ({
    ...version,
    is_current: version.id === listingRow.current_version_id
  }))
}

export async function getListingIdBySlug(slug: string): Promise<string | null> {
  const supabase = createAdminClient()
  const { data: listingRow, error } = await supabase
    .from('listings')
    .select('id')
    .eq('slug', slug)
    .single()
  if (error || !listingRow) return null
  return listingRow.id
}

export async function getVersionData(slug: string, versionId: string): Promise<Listing | null> {
  const supabase = createAdminClient()
  const { data: listingRow } = await supabase
    .from('listings')
    .select('id')
    .eq('slug', slug)
    .single()
  if (!listingRow) return null

  const { data, error } = await supabase
    .from('listing_versions')
    .select('data')
    .eq('id', versionId)
    .eq('listing_id', listingRow.id)
    .single()
  if (error) return null
  return (data?.data as Listing) ?? null
} 