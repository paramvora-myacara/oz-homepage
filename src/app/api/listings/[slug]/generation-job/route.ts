import { NextResponse } from 'next/server'
import { verifyAdminCanEditSlug } from '@/lib/admin/auth'
import { getLatestJob, isActiveJob } from '@/lib/doc-processor'

/**
 * Latest generation job for a listing.
 * Used by the DDV page for the upload/submit lockout and to bootstrap the
 * live generation panel (job row = source of truth; Realtime broadcast on
 * listing_gen:<job_id> supplies live deltas).
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const user = await verifyAdminCanEditSlug(slug)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const job = await getLatestJob(slug)
  return NextResponse.json({
    job,
    active: isActiveJob(job)
  })
}
