import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, verifyAdminCanEditSlug } from '@/lib/admin/auth'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Doc-processor integration for the editor.
 *
 * GET  -> latest generation job + "upgrade to generated version" conflict info
 *         (plan §2.5: pipeline wrote a version but did not repoint because a
 *         human-edited version is current)
 * POST -> { agent? } regenerate the listing (or one section) via the
 *         doc-processor retry API (internal_admin only)
 */

const TERMINAL = ['complete', 'failed']

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const user = await verifyAdminCanEditSlug(slug)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  const { data: listing } = await supabase
    .from('listings')
    .select('id, current_version_id')
    .eq('slug', slug)
    .maybeSingle()
  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  const { data: jobs } = await supabase
    .from('listing_generation_jobs')
    .select('id, status, version_id, pointer_updated, error, created_at, stage_progress, timings, summary')
    .eq('listing_slug', slug)
    .order('created_at', { ascending: false })
    .limit(1)

  const latestJob = jobs?.[0] ?? null

  // Queue position (§10.4): concurrency is bounded, so a job can sit queued
  // behind another listing. Without this the panel shows no active stage.
  if (latestJob?.status === 'queued') {
    const { count } = await supabase
      .from('listing_generation_jobs')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'queued')
      .lt('created_at', latestJob.created_at)
    ;(latestJob as Record<string, unknown>).queue_position = (count ?? 0) + 1
  }

  // Conflict: the newest pipeline-produced version exists, is NOT current,
  // and is newer than the current version.
  let upgrade: { versionId: string; versionNumber: number } | null = null
  const { data: generated } = await supabase
    .from('listing_generation_jobs')
    .select('version_id')
    .eq('listing_slug', slug)
    .not('version_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)

  const generatedVersionId = generated?.[0]?.version_id as string | undefined
  if (generatedVersionId && generatedVersionId !== listing.current_version_id) {
    const { data: versionRows } = await supabase
      .from('listing_versions')
      .select('id, version_number')
      .in('id', [generatedVersionId, listing.current_version_id].filter(Boolean) as string[])
    const genV = versionRows?.find(v => v.id === generatedVersionId)
    const curV = versionRows?.find(v => v.id === listing.current_version_id)
    if (genV && (!curV || genV.version_number > curV.version_number)) {
      upgrade = { versionId: genV.id, versionNumber: genV.version_number }
    }
  }

  return NextResponse.json({
    job: latestJob,
    active: Boolean(latestJob && !TERMINAL.includes(latestJob.status)),
    upgrade,
    isInternalAdmin: user.role === 'internal_admin',
  })
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params
  const user = await verifyAdmin()
  if (!user || user.role !== 'internal_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const base =
    process.env.OZ_BACKEND_URL ||
    process.env.NEXT_PUBLIC_OZ_BACKEND_URL ||
    'http://localhost:8001'

  const body = await request.json().catch(() => ({}))
  const agent = body?.agent as string | undefined

  const supabase = createAdminClient()
  const { data: jobs } = await supabase
    .from('listing_generation_jobs')
    .select('id, status')
    .eq('listing_slug', slug)
    .in('status', TERMINAL)
    .order('created_at', { ascending: false })
    .limit(1)
  const lastJob = jobs?.[0]
  if (!lastJob) {
    return NextResponse.json({ error: 'No completed generation job to retry' }, { status: 404 })
  }

  const qs = agent ? `?agent=${encodeURIComponent(agent)}` : ''
  const res = await fetch(
    `${base.replace(/\/$/, '')}/api/v1/doc-processor/jobs/${lastJob.id}/retry${qs}`,
    { method: 'POST' }
  )
  const payload = await res.json().catch(() => ({}))
  return NextResponse.json(payload, { status: res.status })
}
