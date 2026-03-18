import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin/auth'
import { createAdminClient } from '@/utils/supabase/admin'
import { trackAdminEvent } from '@/lib/admin-events'

const EVENT_TYPE = 'listing_access_granted'

/**
 * Grant a customer access to a published listing and enqueue welcome email (user-event-processor).
 * internal_admin only.
 */
export async function POST(request: NextRequest, context: { params: Promise<{ slug: string }> }) {
  const admin = await verifyAdmin()
  if (!admin || admin.role !== 'internal_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug: rawSlug } = await context.params
  const slug = decodeURIComponent(rawSlug || '').trim()
  if (!slug) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  let body: { customerUserId?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const customerUserId = body.customerUserId?.trim()
  if (!customerUserId) {
    return NextResponse.json({ error: 'customerUserId is required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: listing, error: listingErr } = await supabase
    .from('listings')
    .select('slug, current_version_id')
    .eq('slug', slug)
    .maybeSingle()

  if (listingErr || !listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }
  if (!listing.current_version_id) {
    return NextResponse.json(
      { error: 'Only published listings can be shared. This listing is still a draft.' },
      { status: 400 }
    )
  }

  const { data: target, error: targetErr } = await supabase
    .from('admin_users')
    .select('id, role')
    .eq('id', customerUserId)
    .maybeSingle()

  if (targetErr || !target) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  if (target.role !== 'customer') {
    return NextResponse.json(
      { error: 'Only customer accounts can receive listing access through this action.' },
      { status: 400 }
    )
  }

  const { data: existing } = await supabase
    .from('admin_user_listings')
    .select('id')
    .eq('user_id', customerUserId)
    .eq('listing_slug', slug)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'Customer already has access to this listing.' },
      { status: 409 }
    )
  }

  const { error: insertErr } = await supabase.from('admin_user_listings').insert({
    user_id: customerUserId,
    listing_slug: slug
  })

  if (insertErr) {
    console.error('[grant-access] insert', insertErr)
    return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 })
  }

  await trackAdminEvent(supabase, EVENT_TYPE, {
    customer_user_id: customerUserId,
    slug
  })

  return NextResponse.json({
    success: true,
    message: 'Access granted. The customer will receive a welcome email shortly.'
  })
}
