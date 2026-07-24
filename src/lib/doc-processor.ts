import 'server-only'
import { createAdminClient } from '@/utils/supabase/admin'

/**
 * Doc-processor integration (ozl-backend/services/doc-processor).
 *
 * Durable-row-first + doorbell pattern: the job row in
 * listing_generation_jobs is the source of truth; the HTTP doorbell to the
 * VM is best-effort (the service's safety-net sweep picks up missed rings).
 *
 * Calls go through the same backend base URL as other API traffic
 * (OZ_BACKEND_URL / NEXT_PUBLIC_OZ_BACKEND_URL), routed by Caddy to
 * /api/v1/doc-processor/*.
 */

const TERMINAL_STATUSES = ['complete', 'failed']

function backendBaseUrl(): string {
  const base =
    process.env.OZ_BACKEND_URL ||
    process.env.NEXT_PUBLIC_OZ_BACKEND_URL ||
    'http://localhost:8001'
  return base.replace(/\/$/, '')
}

export interface GenerationJob {
  id: string
  listing_id: string
  listing_slug: string
  status: string
  stage_progress: Record<string, unknown>
  timings: Record<string, number>
  version_id: string | null
  pointer_updated: boolean | null
  error: string | null
  created_at: string
  updated_at: string
}

/** Insert the durable job row. Returns null on lockout (active job exists). */
export async function createGenerationJob(
  listingId: string,
  listingSlug: string
): Promise<{ jobId: string } | { lockout: true } | null> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('listing_generation_jobs')
    .insert({ listing_id: listingId, listing_slug: listingSlug })
    .select('id')
    .single()

  if (error) {
    // 23505 = unique_violation -> one_active_job_per_listing lockout index
    if ((error as { code?: string }).code === '23505') {
      return { lockout: true }
    }
    console.error('[doc-processor] job insert failed', error)
    return null
  }
  return { jobId: data.id }
}

/** Fire-and-forget doorbell; failure is logged, never surfaced to the sponsor. */
export async function ringDoorbell(jobId: string): Promise<void> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2000)
    await fetch(`${backendBaseUrl()}/api/v1/doc-processor/jobs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ job_id: jobId }),
      signal: controller.signal,
    })
    clearTimeout(timer)
  } catch (err) {
    // The sweep will pick the queued row up within ~90s.
    console.warn('[doc-processor] doorbell failed (sweep will recover)', err)
  }
}

/** Latest job for a listing (active first, else most recent). */
export async function getLatestJob(listingSlug: string): Promise<GenerationJob | null> {
  const supabase = createAdminClient()
  const { data: active } = await supabase
    .from('listing_generation_jobs')
    .select('*')
    .eq('listing_slug', listingSlug)
    .not('status', 'in', `(${TERMINAL_STATUSES.join(',')})`)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (active) return active as GenerationJob

  const { data: latest } = await supabase
    .from('listing_generation_jobs')
    .select('*')
    .eq('listing_slug', listingSlug)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return (latest as GenerationJob) ?? null
}

export function isActiveJob(job: GenerationJob | null): boolean {
  return Boolean(job && !TERMINAL_STATUSES.includes(job.status))
}

/**
 * Sync the marketplace row (`oz_projects`) after a listing goes live (§6.5).
 *
 * Derivation needs Gemini, which lives in the doc-processor service — this is
 * a thin proxy. NEVER fatal: a live listing with a missing marketplace card is
 * repairable (re-run go-live, or scripts/backfill_marketplace.py); a failed
 * go-live is a much worse outcome. Returns true only on a confirmed sync.
 */
export async function syncMarketplaceRow(slug: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    // Generous: this makes a Gemini call. Still bounded so go-live never hangs.
    const timer = setTimeout(() => controller.abort(), 30000)
    const res = await fetch(
      `${backendBaseUrl()}/api/v1/doc-processor/marketplace/${encodeURIComponent(slug)}`,
      { method: 'POST', signal: controller.signal }
    )
    clearTimeout(timer)
    if (!res.ok) {
      console.error('[doc-processor] marketplace sync failed', slug, res.status, await res.text())
      return false
    }
    return true
  } catch (err) {
    console.error('[doc-processor] marketplace sync error (listing is still live)', slug, err)
    return false
  }
}
