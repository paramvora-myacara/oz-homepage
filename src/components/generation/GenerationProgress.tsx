'use client'

/**
 * Live listing-generation panel (plan §5).
 *
 * Job row = source of truth (bootstrap + poll fallback); Supabase Realtime
 * Broadcast on `listing_gen:<job_id>` supplies live deltas:
 *   stage / file / agent / section / image / done / error
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  CheckCircle2,
  Circle,
  FileText,
  Image as ImageIcon,
  Loader2,
  Sparkles,
} from 'lucide-react'

const STAGES: Array<{ key: string; label: string }> = [
  { key: 'ingesting', label: 'Reading your documents' },
  { key: 'converting', label: 'Extracting text & imagery' },
  { key: 'classifying_docs', label: 'Organizing materials' },
  { key: 'extracting', label: 'Writing your listing' },
  { key: 'classifying_images', label: 'Curating images' },
  { key: 'publishing', label: 'Assembling the draft' },
]

const AGENT_LABELS: Record<string, string> = {
  overview: 'Overview',
  financial: 'Financial Returns',
  property: 'Property Overview',
  market: 'Market Analysis',
  sponsor: 'Sponsor Profile',
}

interface SectionPayload {
  sectionType: string
  data: Record<string, unknown>
}

interface GenerationProgressProps {
  jobId: string
  initialStatus: string
  slug: string
  /** internal-only extras (regen buttons live in dev-dash, not here) */
  onComplete?: () => void
}

export default function GenerationProgress({
  jobId,
  initialStatus,
  slug,
  onComplete,
}: GenerationProgressProps) {
  const [status, setStatus] = useState(initialStatus)
  const [files, setFiles] = useState<Record<string, { state: string; pages?: number }>>({})
  const [agents, setAgents] = useState<Record<string, string>>({})
  const [sections, setSections] = useState<SectionPayload[]>([])
  const [images, setImages] = useState<Array<{ url?: string; category: string; caption?: string }>>([])
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const completedRef = useRef(false)

  const terminal = status === 'complete' || status === 'failed'

  const handleEvent = useCallback(
    (payload: Record<string, unknown>) => {
      const type = payload.type as string
      if (type === 'stage') {
        setStatus(payload.stage as string)
        setEtaSeconds((payload.eta_s as number) ?? null)
      } else if (type === 'file') {
        const { filename, state, ...rest } = payload as { filename: string; state: string }
        setFiles((prev) => ({ ...prev, [filename]: { state, ...rest } }))
      } else if (type === 'agent') {
        const { name, state } = payload as { name: string; state: string }
        setAgents((prev) => ({ ...prev, [name]: state }))
      } else if (type === 'section') {
        const section = payload as unknown as SectionPayload
        setSections((prev) =>
          prev.some((s) => s.sectionType === section.sectionType)
            ? prev
            : [...prev, section]
        )
      } else if (type === 'image') {
        setImages((prev) => [
          ...prev,
          {
            url: payload.url as string | undefined,
            category: payload.category as string,
            caption: payload.caption as string | undefined,
          },
        ])
      } else if (type === 'done') {
        setStatus('complete')
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
      } else if (type === 'error') {
        // Sponsor-facing policy (§0): failures stay quiet — keep "in process".
        setErrorMsg(null)
        setStatus('failed')
      }
    },
    [onComplete]
  )

  // Realtime subscription
  useEffect(() => {
    if (terminal) return
    const supabase = createClient()
    const channel = supabase.channel(`listing_gen:${jobId}`)
    channel
      .on('broadcast', { event: 'progress' }, ({ payload }) => {
        if (payload) handleEvent(payload as Record<string, unknown>)
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [jobId, terminal, handleEvent])

  // Poll fallback (job row is source of truth; survives missed broadcasts)
  useEffect(() => {
    if (terminal) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/listings/${encodeURIComponent(slug)}/generation-job`)
        if (!res.ok) return
        const body = await res.json()
        if (body?.job?.id === jobId) {
          setStatus(body.job.status)
          const progress = body.job.stage_progress || {}
          if (progress.files) setFiles(progress.files)
          if (progress.agents) setAgents(progress.agents)
        }
      } catch {
        /* ignore */
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [jobId, slug, terminal])

  // ETA countdown
  useEffect(() => {
    if (etaSeconds === null || terminal) return
    const t = setInterval(() => setEtaSeconds((s) => (s !== null && s > 0 ? s - 1 : s)), 1000)
    return () => clearInterval(t)
  }, [etaSeconds !== null, terminal])

  const currentStageIdx = useMemo(
    () => STAGES.findIndex((s) => s.key === status),
    [status]
  )

  if (status === 'failed') {
    // Silent failure UX: sponsors keep seeing "in process" messaging.
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 text-center dark:border-blue-900 dark:bg-blue-950/30">
        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-blue-500" />
        <p className="font-semibold text-gray-900 dark:text-white">
          Your listing is being prepared
        </p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Our team is reviewing your materials. We&apos;ll aim to have your listing
          ready within 24–48 hours.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold">
              {status === 'complete'
                ? 'Your listing draft is ready for review'
                : 'Building your listing…'}
            </span>
          </div>
          {etaSeconds !== null && !terminal && (
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
              ~{formatEta(etaSeconds)} left
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 p-6 lg:grid-cols-[280px_1fr]">
        {/* Stage checklist */}
        <ol className="space-y-3">
          {STAGES.map((stage, idx) => {
            const isDone =
              status === 'complete' || (currentStageIdx >= 0 && idx < currentStageIdx)
            const isCurrent = stage.key === status
            return (
              <li key={stage.key} className="flex items-start gap-3">
                {isDone ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                ) : isCurrent ? (
                  <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-blue-500" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-gray-300 dark:text-gray-600" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isDone || isCurrent
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {stage.label}
                  </p>
                  {isCurrent && stage.key === 'converting' && (
                    <ul className="mt-1 space-y-0.5">
                      {Object.entries(files).map(([name, f]) => (
                        <li
                          key={name}
                          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                        >
                          <FileText className="h-3 w-3 shrink-0" />
                          <span className="max-w-[180px] truncate">{name}</span>
                          {f.state === 'ocr_done' ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : f.state === 'failed' ? (
                            <span className="text-amber-500">skipped</span>
                          ) : (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                  {isCurrent && stage.key === 'extracting' && (
                    <ul className="mt-1 space-y-0.5">
                      {Object.keys(AGENT_LABELS).map((agent) => (
                        <li
                          key={agent}
                          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
                        >
                          {agents[agent] === 'done' ? (
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          ) : agents[agent] === 'running' ? (
                            <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                          ) : (
                            <Circle className="h-3 w-3 text-gray-300" />
                          )}
                          {AGENT_LABELS[agent]}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            )
          })}
        </ol>

        {/* Section reveal + image shelf */}
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.keys(AGENT_LABELS).map((agent) => {
              const sectionType = agentToSectionType(agent)
              const section = sections.find((s) => s.sectionType === sectionType)
              return (
                <SectionCard
                  key={agent}
                  title={AGENT_LABELS[agent]}
                  section={section}
                  running={agents[agent] === 'running'}
                />
              )
            })}
          </div>

          {images.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <ImageIcon className="h-3.5 w-3.5" /> Curated images ({images.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) =>
                  img.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={img.url}
                      alt={img.caption || img.category}
                      title={`${img.category}${img.caption ? ` — ${img.caption}` : ''}`}
                      className="h-16 w-24 shrink-0 animate-[fadeIn_.5s_ease] rounded-lg object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                    />
                  ) : null
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  section,
  running,
}: {
  title: string
  section?: SectionPayload
  running: boolean
}) {
  if (!section) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">{title}</p>
          {running && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
        </div>
        <div className="mt-3 space-y-2">
          <div className={`h-2 rounded bg-gray-100 dark:bg-gray-800 ${running ? 'animate-pulse' : ''}`} />
          <div className={`h-2 w-3/4 rounded bg-gray-100 dark:bg-gray-800 ${running ? 'animate-pulse' : ''}`} />
        </div>
      </div>
    )
  }

  const highlights = extractHighlights(section)
  return (
    <div className="animate-[fadeIn_.6s_ease] rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      </div>
      <ul className="mt-2 space-y-1">
        {highlights.map((h, i) => (
          <li key={i} className="truncate text-xs text-gray-600 dark:text-gray-300">
            {h}
          </li>
        ))}
      </ul>
    </div>
  )
}

function agentToSectionType(agent: string): string {
  switch (agent) {
    case 'overview':
      return 'overview'
    case 'financial':
      return 'financialReturns'
    case 'property':
      return 'propertyOverview'
    case 'market':
      return 'marketAnalysis'
    case 'sponsor':
      return 'sponsorProfile'
    default:
      return agent
  }
}

/** Pull a few human-readable lines out of a section payload for the reveal. */
function extractHighlights(section: SectionPayload): string[] {
  const data = section.data as Record<string, any>
  const out: string[] = []
  try {
    if (section.sectionType === 'overview') {
      const hero = (data.sections || []).find((s: any) => s.type === 'hero')?.data
      if (hero?.listingName) out.push(hero.listingName)
      if (hero?.location) out.push(hero.location)
      const ticker = (data.sections || []).find((s: any) => s.type === 'tickerMetrics')?.data
      for (const m of (ticker?.metrics || ticker || []).slice?.(0, 2) || []) {
        if (m?.label && m?.value) out.push(`${m.label}: ${m.value}`)
      }
    } else if (data.sections) {
      out.push(`${data.sections.length} sections drafted`)
      for (const s of data.sections.slice(0, 3)) {
        if (s?.type) out.push(prettify(s.type))
      }
    }
  } catch {
    /* best-effort */
  }
  return out.length ? out.slice(0, 4) : ['Drafted']
}

function prettify(camel: string): string {
  return camel
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function formatEta(seconds: number): string {
  if (seconds >= 60) return `${Math.ceil(seconds / 60)}m`
  return `${seconds}s`
}
