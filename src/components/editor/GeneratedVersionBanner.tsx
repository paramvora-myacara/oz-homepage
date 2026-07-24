'use client'

/**
 * Editor banner for doc-processor state (plan §2.5):
 *
 * 1. Conflict "Upgrade to generated version" button — shown ONLY when the
 *    pipeline wrote a newer version but did not repoint current_version_id
 *    because a human-edited version is current. Clicking repoints via the
 *    EXISTING rollback endpoint.
 * 2. Per-section regenerate buttons (internal_admin only, when no job is
 *    running) — proxied to the doc-processor retry API.
 */

import { useCallback, useEffect, useState } from 'react'
import { ArrowUpCircle, Loader2, RefreshCw, Sparkles } from 'lucide-react'

const AGENTS: Array<{ key: string; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'financial', label: 'Financial' },
  { key: 'property', label: 'Property' },
  { key: 'market', label: 'Market' },
  { key: 'sponsor', label: 'Sponsor' },
]

interface GenerationState {
  job: { id: string; status: string } | null
  active: boolean
  upgrade: { versionId: string; versionNumber: number } | null
  isInternalAdmin: boolean
}

export function GeneratedVersionBanner({ slug }: { slug: string }) {
  const [state, setState] = useState<GenerationState | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [showRegen, setShowRegen] = useState(false)

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(slug)}/generation`)
      if (res.ok) setState(await res.json())
    } catch {
      /* banner is best-effort */
    }
  }, [slug])

  useEffect(() => {
    load()
  }, [load])

  // While a job is active, poll so the banner reflects completion.
  useEffect(() => {
    if (!state?.active) return
    const t = setInterval(load, 15000)
    return () => clearInterval(t)
  }, [state?.active, load])

  if (!state) return null

  const handleUpgrade = async () => {
    if (!state.upgrade) return
    setBusy('upgrade')
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(slug)}/rollback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ versionId: state.upgrade.versionId }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Upgrade failed')
      }
    } finally {
      setBusy(null)
    }
  }

  const handleRegen = async (agent?: string) => {
    setBusy(agent || 'all')
    try {
      const res = await fetch(`/api/listings/${encodeURIComponent(slug)}/generation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent ? { agent } : {}),
      })
      const body = await res.json().catch(() => ({}))
      if (res.ok) {
        setShowRegen(false)
        await load()
      } else {
        alert(body.error || body.detail || 'Regeneration failed')
      }
    } finally {
      setBusy(null)
    }
  }

  const showUpgrade = Boolean(state.upgrade)
  const showRegenControls = state.isInternalAdmin && !state.active && state.job

  if (!showUpgrade && !showRegenControls && !state.active) return null

  return (
    <div className="fixed top-14 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        {state.active && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800 shadow-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Listing generation in progress — the draft will update when it completes.
          </div>
        )}

        {showUpgrade && !state.active && (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-amber-900">
              <Sparkles className="h-4 w-4 text-amber-500" />
              A newer generated version (v{state.upgrade!.versionNumber}) is available,
              but this listing has manual edits.
            </div>
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={busy !== null}
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-50"
            >
              {busy === 'upgrade' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowUpCircle className="h-4 w-4" />
              )}
              Upgrade to generated version
            </button>
          </div>
        )}

        {showRegenControls && (
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <button
              type="button"
              onClick={() => setShowRegen(!showRegen)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate…
            </button>
            {showRegen && (
              <div className="flex flex-wrap items-center gap-1.5">
                {AGENTS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    disabled={busy !== null}
                    onClick={() => handleRegen(a.key)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:border-blue-400 hover:text-blue-700 disabled:opacity-50"
                  >
                    {busy === a.key && <Loader2 className="h-3 w-3 animate-spin" />}
                    {a.label}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={busy !== null}
                  onClick={() => handleRegen()}
                  className="inline-flex items-center gap-1 rounded-full border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50"
                >
                  {busy === 'all' && <Loader2 className="h-3 w-3 animate-spin" />}
                  Full listing
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
