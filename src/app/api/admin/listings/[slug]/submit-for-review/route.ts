import { NextResponse } from 'next/server'
import { verifyAdminCanEditSlug } from '@/lib/admin/auth'
import { createAdminClient } from '@/utils/supabase/admin'
import { trackAdminEvent } from '@/lib/admin-events'

const EVENT_TYPE = 'listing_documents_submitted_for_review'

export async function POST(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const user = await verifyAdminCanEditSlug(slug)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const { data: row, error } = await supabase
    .from('listings')
    .select('id, lifecycle_status, title')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !row) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (row.lifecycle_status === 'live') {
    return NextResponse.json({
      success: true,
      lifecycle_status: 'live',
      message: 'Listing is already live.'
    })
  }

  if (row.lifecycle_status === 'in_review') {
    return NextResponse.json({
      success: true,
      lifecycle_status: 'in_review',
      message: 'Already submitted for review.'
    })
  }

  const { data: updated, error: updateErr } = await supabase
    .from('listings')
    .update({
      lifecycle_status: 'in_review',
      updated_at: new Date().toISOString()
    })
    .eq('id', row.id)
    .eq('lifecycle_status', 'draft')
    .select('lifecycle_status')
    .maybeSingle()

  if (updateErr) {
    console.error('[submit-for-review]', updateErr)
    return NextResponse.json({ error: 'Failed to submit for review' }, { status: 500 })
  }

  if (!updated) {
    return NextResponse.json(
      { error: 'Listing state changed; refresh and try again.' },
      { status: 409 }
    )
  }

  await trackAdminEvent(supabase, EVENT_TYPE, {
    slug,
    listing_title: row.title,
    submitter_email: user.email
  })

  return NextResponse.json({
    success: true,
    lifecycle_status: 'in_review'
  })
}
