'use client'

/**
 * Live listing-generation panel (generation-ux-plan §2–§5).
 *
 * TWO-COLUMN THEATRE:
 *   LEFT  — the stage checklist: what is happening, in order, with ETA.
 *   RIGHT — the live output surface: what actually came out. It follows the
 *           active stage (documents -> sections streaming -> images landing),
 *           and after completion becomes a tabbed record of the whole run.
 *
 * Architecture:
 *   - The JOB ROW is source of truth. Bootstrap + poll fallback come from it,
 *     so a mid-generation refresh reconstructs state and a Realtime outage
 *     degrades to polling rather than breaking.
 *   - Supabase Realtime Broadcast on `listing_gen:<job_id>` supplies deltas.
 *     The channel is PUBLIC (`private: false`, the library default) because
 *     the browser has no Supabase Auth session (§10.2).
 *   - The panel is PERMANENT: after completion it stays as an audit trail (§5).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Loader2,
  Sparkles,
} from 'lucide-react'
import type { ImageStats, RevealedImage } from './ImageReveal'
import { DocumentsPane, DonePane, ImagesPane, SectionsPane } from './LiveStage'

const STAGES = [
  { key: 'ingesting', label: 'Reading your documents', pane: 'docs' },
  { key: 'converting', label: 'Extracting text & imagery', pane: 'docs' },
  { key: 'classifying_docs', label: 'Organizing materials', pane: 'docs' },
  { key: 'extracting', label: 'Writing your listing', pane: 'sections' },
  { key: 'classifying_images', label: 'Curating images', pane: 'images' },
  { key: 'publishing', label: 'Assembling the draft', pane: 'done' },
] as const

const AGENTS = [
  { key: 'overview', label: 'Overview' },
  { key: 'financial', label: 'Financial Returns' },
  { key: 'property', label: 'Property Overview' },
  { key: 'market', label: 'Market Analysis' },
  { key: 'sponsor', label: 'Sponsor Profile' },
] as const

const TERMINAL = ['complete', 'failed']
type PaneKey = 'docs' | 'sections' | 'images' | 'done'

interface FileState {
  state: string
  pages?: number
  slides?: number
  /** Populated when a document fails to convert — surfaced in the UI so a
      failed OCR never masquerades as "no images found". */
  error?: string
}

interface JobRow {
  id: string
  status: string
  queue_position?: number
  stage_progress?: {
    files?: Record<string, FileState>
    agents?: Record<string, string>
    docs?: Record<string, string>
    images?: Array<RevealedImage | string>
    image_stats?: ImageStats
  }
  timings?: Record<string, number>
  summary?: {
    sections?: Record<string, { sectionType?: string; preview?: string }>
    categories?: Record<string, number>
    image_count?: number
  }
  version_id?: string | null
  error?: string | null
  created_at?: string
}

interface GenerationProgressProps {
  jobId: string
  initialStatus: string
  slug: string
  showPreviewCta?: boolean
  onComplete?: () => void
}

function formatEta(seconds: number | null): string {
  if (seconds == null || seconds <= 0) return ''
  if (seconds < 60) return `~${Math.round(seconds)}s left`
  return `~${Math.round(seconds / 60)}m left`
}

function formatElapsed(seconds?: number): string {
  if (!seconds || seconds <= 0) return ''
  if (seconds < 60) return `${Math.round(seconds)}s`
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return s ? `${m}m ${s}s` : `${m}m`
}

function sectionTypeFor(agent: string): string {
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

export default function GenerationProgress({
  jobId,
  initialStatus,
  slug,
  showPreviewCta = true,
  onComplete,
}: GenerationProgressProps) {
  const [status, setStatus] = useState(initialStatus)
  const [queuePosition, setQueuePosition] = useState<number | null>(null)
  const [files, setFiles] = useState<Record<string, FileState>>({})
  const [docs, setDocs] = useState<Record<string, string>>({})
  const [agents, setAgents] = useState<Record<string, string>>({})
  const [partials, setPartials] = useState<Record<string, { preview: string; fields: number }>>({})
  const [settled, setSettled] = useState<Record<string, string>>({})
  const [images, setImages] = useState<RevealedImage[]>([])
  const [imageStats, setImageStats] = useState<ImageStats | null>(null)
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null)
  const [timings, setTimings] = useState<Record<string, number>>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  /** null = follow the active stage; set = user pinned a pane. */
  const [pinnedPane, setPinnedPane] = useState<PaneKey | null>(null)
  const completedRef = useRef(false)
  const partialsRef = useRef(partials)

  useEffect(() => {
    partialsRef.current = partials
  }, [partials])

  const terminal = TERMINAL.includes(status)

  /* ---------------------------------------------------------------- events */

  const handleEvent = useCallback((payload: Record<string, unknown>) => {
    const type = payload.type as string

    if (type === 'stage') {
      setStatus(payload.stage as string)
      setQueuePosition(null)
      setEtaSeconds((payload.eta_s as number) ?? null)
    } else if (type === 'file') {
      const { filename, state, ...rest } = payload as unknown as FileState & {
        filename: string
        state: string
      }
      setFiles((prev) => ({ ...prev, [filename]: { state, ...rest } }))
    } else if (type === 'doc') {
      const { filename, category } = payload as unknown as { filename: string; category: string }
      setDocs((prev) => ({ ...prev, [filename]: category }))
    } else if (type === 'agent') {
      const { name, state } = payload as unknown as { name: string; state: string }
      setAgents((prev) => ({ ...prev, [name]: state }))
    } else if (type === 'section_partial') {
      const { agent, preview, fields } = payload as unknown as {
        agent: string
        preview: string
        fields: number
      }
      setPartials((prev) => ({ ...prev, [agent]: { preview, fields } }))
    } else if (type === 'section') {
      const sectionType = payload.sectionType as string
      const agent = AGENTS.find((a) => sectionTypeFor(a.key) === sectionType)?.key
      if (agent) {
        setSettled((prev) => ({
          ...prev,
          [agent]: partialsRef.current[agent]?.preview || prev[agent] || '',
        }))
      }
    } else if (type === 'image_stats') {
      setImageStats({
        scanned: payload.scanned as number,
        deduped: payload.deduped as number,
        kept: payload.kept as number,
      })
    } else if (type === 'image') {
      setImages((prev) => [
        ...prev,
        {
          url: payload.url as string | undefined,
          storage_path: payload.storage_path as string | undefined,
          category: (payload.category as string) || 'unknown',
          caption: payload.caption as string | undefined,
          reasoning: payload.reasoning as string | undefined,
          hero: Boolean(payload.hero),
        },
      ])
    } else if (type === 'done') {
      setStatus('complete')
      setEtaSeconds(null)
    } else if (type === 'error') {
      setStatus('failed')
      setErrorMsg((payload.message as string) || 'Generation failed')
    }
  }, [])

  /* ------------------------------------------------------- bootstrap/poll */

  const hydrate = useCallback((job: JobRow) => {
    setStatus(job.status)
    setQueuePosition(job.queue_position ?? null)
    setTimings(job.timings || {})
    if (job.stage_progress?.files) setFiles(job.stage_progress.files)
    if (job.stage_progress?.docs) setDocs(job.stage_progress.docs)
    if (job.stage_progress?.agents) setAgents(job.stage_progress.agents)
    if (job.stage_progress?.image_stats) setImageStats(job.stage_progress.image_stats)
    if (job.error) setErrorMsg(job.error)

    if (job.summary?.sections) {
      const next: Record<string, string> = {}
      Object.entries(job.summary.sections).forEach(([agent, s]) => {
        if (s?.preview) next[agent] = s.preview
      })
      if (Object.keys(next).length) setSettled((prev) => ({ ...next, ...prev }))
    }

    // Persisted images carry urls, so a reload still SHOWS them (§4).
    const persisted = job.stage_progress?.images
    if (Array.isArray(persisted) && persisted.length) {
      setImages((prev) => {
        if (prev.length >= persisted.length) return prev
        return persisted.map((img) =>
          typeof img === 'string'
            ? { category: img }
            : {
                url: img.url,
                storage_path: img.storage_path,
                category: img.category || 'unknown',
                caption: img.caption,
                reasoning: img.reasoning,
                hero: img.hero,
              }
        )
      })
    }
  }, [])

  const fetchJob = useCallback(async () => {
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(slug)}/generation`)
      if (!res.ok) return
      const body = await res.json()
      if (body?.job) hydrate(body.job as JobRow)
    } catch {
      /* poll is best-effort */
    }
  }, [slug, hydrate])

  useEffect(() => {
    fetchJob()
  }, [fetchJob])

  useEffect(() => {
    if (terminal) return
    const t = setInterval(fetchJob, 15000)
    return () => clearInterval(t)
  }, [terminal, fetchJob])

  /* ---------------------------------------------------------- realtime */

  useEffect(() => {
    if (!jobId || terminal) return
    const supabase = createClient()
    const channel = supabase.channel(`listing_gen:${jobId}`, {
      config: { private: false },
    })
    channel
      .on('broadcast', { event: 'progress' }, (msg: { payload?: Record<string, unknown> }) => {
        if (msg?.payload) handleEvent(msg.payload)
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [jobId, terminal, handleEvent])

  /* ------------------------------------------------------------- ticking */

  const hasEta = etaSeconds != null
  useEffect(() => {
    if (!hasEta || terminal) return
    const t = setInterval(
      () => setEtaSeconds((s) => (s == null ? null : Math.max(0, s - 1))),
      1000
    )
    return () => clearInterval(t)
  }, [hasEta, terminal])

  useEffect(() => {
    if (status === 'complete' && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [status, onComplete])

  /* -------------------------------------------------------------- derived */

  const stageIndex = useMemo(() => STAGES.findIndex((s) => s.key === status), [status])

  const stageState = useCallback(
    (index: number): 'pending' | 'active' | 'complete' | 'failed' => {
      if (status === 'complete') return 'complete'
      if (status === 'failed') {
        if (stageIndex < 0) return 'pending'
        return index === stageIndex ? 'failed' : index < stageIndex ? 'complete' : 'pending'
      }
      if (stageIndex < 0) return 'pending'
      if (index < stageIndex) return 'complete'
      if (index === stageIndex) return 'active'
      return 'pending'
    },
    [status, stageIndex]
  )

  const fileEntries = Object.entries(files)
  const totalPages = fileEntries.reduce((n, [, f]) => n + (f.pages || f.slides || 0), 0)
  const agentsDone = AGENTS.filter((a) => agents[a.key] === 'done').length
  const heroCount = images.filter((i) => i.hero).length

  // Right column follows the active stage unless the user pinned a pane.
  const activePane: PaneKey = useMemo(() => {
    if (pinnedPane) return pinnedPane
    if (terminal) return images.length ? 'images' : 'sections'
    const s = STAGES[stageIndex]
    return (s?.pane as PaneKey) ?? 'docs'
  }, [pinnedPane, terminal, stageIndex, images.length])

  const summaryFor = (key: string): string => {
    switch (key) {
      case 'ingesting':
        return fileEntries.length ? `${fileEntries.length} files` : ''
      case 'converting':
        return totalPages ? `${totalPages} pages` : ''
      case 'classifying_docs':
        return Object.keys(docs).length ? `${Object.keys(docs).length} sorted` : ''
      case 'extracting':
        return agentsDone ? `${agentsDone}/${AGENTS.length} sections` : ''
      case 'classifying_images':
        return images.length ? `${images.length} images` : ''
      default:
        return ''
    }
  }

  const TABS: Array<{ key: PaneKey; label: string; count?: number }> = [
    { key: 'docs', label: 'Documents', count: fileEntries.length || undefined },
    { key: 'sections', label: 'Sections', count: agentsDone || undefined },
    { key: 'images', label: 'Images', count: images.length || undefined },
  ]

  /* ---------------------------------------------------------------- render */

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
          <Sparkles className="h-4 w-4 text-blue-500" />
          {terminal
            ? status === 'complete'
              ? 'Listing generated'
              : 'Generation stopped'
            : 'Building your listing'}
        </h3>
        {!terminal && etaSeconds != null && (
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {formatEta(etaSeconds)}
          </span>
        )}
      </div>

      {status === 'queued' && (
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300">
          <Clock className="h-4 w-4 shrink-0 animate-pulse" />
          {queuePosition && queuePosition > 1
            ? `Waiting for an earlier listing to finish — you're #${queuePosition} in line.`
            : "Waiting for an earlier listing to finish — you're next in line."}
        </div>
      )}

      {/* two columns */}
      <div className="grid gap-0 md:grid-cols-[minmax(200px,260px)_1fr]">
        {/* LEFT: the checklist */}
        <ol className="space-y-0.5 border-b border-gray-100 p-3 dark:border-gray-800 md:max-h-[30rem] md:overflow-y-auto md:border-b-0 md:border-r">
          {STAGES.map((stage, i) => {
            const st = stageState(i)
            const elapsed = timings[stage.key]
            const detail = summaryFor(stage.key)
            return (
              <li key={stage.key}>
                <button
                  type="button"
                  onClick={() => setPinnedPane(stage.pane as PaneKey)}
                  className={[
                    'flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                    activePane === stage.pane
                      ? 'bg-blue-50 dark:bg-blue-950/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                  ].join(' ')}
                >
                  <span className="mt-0.5 shrink-0">
                    {st === 'complete' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : st === 'active' ? (
                      <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                    ) : st === 'failed' ? (
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={[
                        'block text-xs font-medium leading-tight',
                        st === 'pending'
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-900 dark:text-gray-100',
                      ].join(' ')}
                    >
                      {stage.label}
                    </span>
                    {(detail || elapsed) && (
                      <span className="mt-0.5 block text-[10px] text-gray-400">
                        {stage.key === 'extracting' && st === 'active'
                          ? `${agentsDone} of ${AGENTS.length}`
                          : detail}
                        {elapsed ? ` · ${formatElapsed(elapsed)}` : ''}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        {/* RIGHT: the live output */}
        <div className="min-w-0 bg-gray-50/60 p-3 dark:bg-black/20">
          {/* tabs — always available so nothing is ever unreachable */}
          <div className="mb-2 flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setPinnedPane(tab.key)}
                className={[
                  'rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                  activePane === tab.key
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700'
                    : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
                ].join(' ')}
              >
                {tab.label}
                {tab.count ? <span className="ml-1 text-gray-400">{tab.count}</span> : null}
              </button>
            ))}
            {pinnedPane && !terminal && (
              <button
                type="button"
                onClick={() => setPinnedPane(null)}
                className="ml-auto text-[10px] text-blue-600 hover:underline dark:text-blue-400"
              >
                follow live
              </button>
            )}
          </div>

          {/* Bounded + scrollable: the image grid can run to dozens of items,
              and an unbounded column pushes the completion CTA off-screen. */}
          <div className="max-h-[26rem] min-h-[220px] overflow-y-auto overscroll-contain pr-1">
            {activePane === 'docs' && <DocumentsPane files={files} docs={docs} />}
            {activePane === 'sections' && (
              <SectionsPane
                agents={agents}
                partials={partials}
                settled={settled}
                labels={AGENTS}
              />
            )}
            {activePane === 'images' && <ImagesPane images={images} stats={imageStats} />}
            {activePane === 'done' && (
              <DonePane imageCount={images.length} heroCount={heroCount} />
            )}
          </div>
        </div>
      </div>

      {status === 'failed' && (
        <div className="border-t border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          {errorMsg || 'Generation stopped. The team has been notified and will take a look.'}
        </div>
      )}

      {status === 'complete' && showPreviewCta && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900 dark:bg-blue-950/30">
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
              ✨ Your listing is ready
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              We&apos;re reviewing it now — typically 24–48 hours.
            </p>
          </div>
          <Link
            href={`/listings/${encodeURIComponent(slug)}`}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Preview your draft listing
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
