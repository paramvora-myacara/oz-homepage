import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/utils/supabase/admin'
import { trackAdminEvent } from '@/lib/admin-events'
import { syncMarketplaceRow } from '@/lib/doc-processor'

const EVENT_TYPE = 'listing_access_granted'

/**
 * Publish an in-review listing and notify associated customer(s).
 * internal_admin only.
 */
export async function POST(
  _request: NextRequest,
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

  const supabase = createAdminClient()

  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('id, slug, title, lifecycle_status, current_version_id, developer_contact_email')
    .eq('slug', slug)
    .maybeSingle()

  if (listingErr || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (listing.lifecycle_status === 'live') {
    return NextResponse.json({
      success: true,
      lifecycle_status: 'live',
      message: 'Listing is already live.'
    })
  }

  if (listing.lifecycle_status !== 'in_review') {
    return NextResponse.json(
      { error: 'Only in-process listings can be published from here.' },
      { status: 400 }
    )
  }

  if (!listing.current_version_id) {
    return NextResponse.json(
      {
        error:
          'This listing has no published content yet. Add a listing version (via the editor or SQL) before going live.'
      },
      { status: 400 }
    )
  }

  const { data: accessRows, error: accessErr } = await supabase
    .from('admin_user_listings')
    .select('user_id')
    .eq('listing_slug', slug)

  if (accessErr) {
    console.error('[go-live] access lookup', accessErr)
    return NextResponse.json({ error: 'Failed to load listing access' }, { status: 500 })
  }

  const userIds = [...new Set((accessRows || []).map((r: { user_id: string }) => r.user_id))]
  let customerUserIds: string[] = []

  if (userIds.length > 0) {
    const { data: adminUsers, error: usersErr } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .in('id', userIds)

    if (usersErr) {
      console.error('[go-live] user lookup', usersErr)
      return NextResponse.json({ error: 'Failed to load customer accounts' }, { status: 500 })
    }

    customerUserIds = (adminUsers || [])
      .filter((u: { role: string }) => u.role === 'customer')
      .map((u: { id: string }) => u.id)
  }

  if (customerUserIds.length === 0 && listing.developer_contact_email) {
    const { data: contactUser, error: contactErr } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('email', listing.developer_contact_email)
      .eq('role', 'customer')
      .maybeSingle()

    if (!contactErr && contactUser?.id) {
      customerUserIds = [contactUser.id]
    }
  }

  if (customerUserIds.length === 0) {
    return NextResponse.json(
      {
        error:
          'No customer account found for this listing. Associate a customer before going live.'
      },
      { status: 400 }
    )
  }

  const { data: updated, error: updateErr } = await supabase
    .from('listings')
    .update({
      lifecycle_status: 'live',
      updated_at: new Date().toISOString()
    })
    .eq('id', listing.id)
    .eq('lifecycle_status', 'in_review')
    .select('lifecycle_status')
    .maybeSingle()

  if (updateErr) {
    console.error('[go-live] update', updateErr)
    return NextResponse.json({ error: 'Failed to publish listing' }, { status: 500 })
  }

  if (!updated) {
    return NextResponse.json(
      { error: 'Listing state changed; refresh and try again.' },
      { status: 409 }
    )
  }

  for (const customerUserId of customerUserIds) {
    await trackAdminEvent(supabase, EVENT_TYPE, {
      customer_user_id: customerUserId,
      slug
    })
  }

  // Marketplace row (generation-ux-plan §6): /listings reads oz_projects, a
  // separate table joined on project_slug. Written here — at the single
  // internal-admin gate — because the query is unfiltered and the table has no
  // RLS, so a row existing IS public visibility.
  // Deliberately non-fatal: the listing is already live and correct.
  const marketplaceSynced = await syncMarketplaceRow(slug)
  if (!marketplaceSynced) {
    await trackAdminEvent(supabase, 'listing_marketplace_sync_failed', {
      slug,
      listing_title: listing.title
    })
  }

  return NextResponse.json({
    success: true,
    lifecycle_status: 'live',
    notified_count: customerUserIds.length,
    marketplace_synced: marketplaceSynced,
    message: marketplaceSynced
      ? 'Listing is live. The developer will receive a notification email shortly.'
      : 'Listing is live, but the marketplace card could not be generated. It will not appear on /listings until re-synced.'
  })
}
