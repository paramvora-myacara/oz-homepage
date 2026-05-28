import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/auth'
import { deleteListingStorage } from '@/lib/admin/deleteListingStorage'
import { trackAdminEvent } from '@/lib/admin-events'
import { createAdminClient } from '@/utils/supabase/admin'

const DELETABLE_STATUSES = new Set(['draft', 'in_review'])

/**
 * Permanently delete a draft or in-process listing.
 * internal_admin only.
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const admin = await verifyAdmin()
  if (!admin || admin.role !== 'internal_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug: rawSlug } = await context.params
  const slug = decodeURIComponent(rawSlug || '').trim()
  if (!slug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  let confirmSlug: string | undefined
  try {
    const body = await request.json()
    confirmSlug = typeof body?.confirmSlug === 'string' ? body.confirmSlug.trim() : undefined
  } catch {
    return NextResponse.json({ error: 'Request body must be JSON' }, { status: 400 })
  }

  if (confirmSlug !== slug) {
    return NextResponse.json({ error: 'Slug confirmation required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('id, slug, title, lifecycle_status')
    .eq('slug', slug)
    .maybeSingle()

  if (listingErr || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (listing.lifecycle_status === 'live') {
    return NextResponse.json(
      { error: 'Live listings cannot be deleted. Unpublish or contact engineering.' },
      { status: 403 }
    )
  }

  if (!DELETABLE_STATUSES.has(listing.lifecycle_status)) {
    return NextResponse.json(
      { error: 'Only draft or in-process listings can be deleted.' },
      { status: 400 }
    )
  }

  const { error: ozProjectsErr } = await supabase
    .from('oz_projects')
    .delete()
    .eq('project_slug', slug)

  if (ozProjectsErr) {
    console.error('[delete-listing] oz_projects', ozProjectsErr)
    return NextResponse.json({ error: 'Failed to delete marketplace data' }, { status: 500 })
  }

  const { error: domainsErr } = await supabase.from('domains').delete().eq('listing_slug', slug)

  if (domainsErr) {
    console.error('[delete-listing] domains', domainsErr)
    return NextResponse.json({ error: 'Failed to delete domain mappings' }, { status: 500 })
  }

  await deleteListingStorage(supabase, slug, listing.id)

  const { error: clearVersionErr } = await supabase
    .from('listings')
    .update({ current_version_id: null })
    .eq('id', listing.id)

  if (clearVersionErr) {
    console.error('[delete-listing] clear current_version_id', clearVersionErr)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }

  const { error: deleteErr } = await supabase.from('listings').delete().eq('id', listing.id)

  if (deleteErr) {
    console.error('[delete-listing] listings', deleteErr)
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 })
  }

  await trackAdminEvent(supabase, 'listing_deleted', {
    slug,
    listing_id: listing.id,
    title: listing.title,
    lifecycle_status: listing.lifecycle_status,
    deleted_by: admin.email,
  })

  return NextResponse.json({
    success: true,
    message: `"${listing.title || slug}" was permanently deleted.`,
  })
}
