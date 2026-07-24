'use client'

/**
 * Right-column "output" surface for the two-column theatre (§2).
 *
 * The left column says WHAT is happening; this shows WHAT CAME OUT. It swaps
 * its content to follow the active stage, so the panel always reads as one
 * live workspace rather than a list of collapsed boxes.
 */

import { useEffect, useRef } from 'react'
import { Streamdown } from 'streamdown'
import { FileText, ImageIcon, Sparkles, Star } from 'lucide-react'
import { imageSrc, type RevealedImage, type ImageStats } from './ImageReveal'

export const CATEGORY_LABELS: Record<string, string> = {
  general: 'Hero',
  aerial: 'Aerial',
  floorplan: 'Floor plans',
  sitemap: 'Site plans',
  'property-context': 'Property',
  'market-context': 'Market',
  'sponsor-about': 'Sponsor',
  leadership: 'Team',
  'portfolio-project': 'Portfolio',
}

/* -------------------------------------------------------------- documents */

export function DocumentsPane({
  files,
  docs,
}: {
  files: Record<string, { state: string; pages?: number; slides?: number; error?: string }>
  docs: Record<string, string>
}) {
  const entries = Object.entries(files)
  if (!entries.length) {
    return <Empty icon={<FileText className="h-5 w-5" />} label="Waiting for documents…" />
  }
  return (
    <ul className="space-y-1.5">
      {entries.map(([name, f]) => {
        const category = docs[name]
        const done = f.state === 'ocr_done' || f.state === 'done' || Boolean(category)
        const failed = f.state === 'failed'
        return (
          <li
            key={name}
            className={[
              'rounded-lg px-2.5 py-2 text-xs ring-1',
              failed
                ? 'bg-amber-50/80 ring-amber-200 dark:bg-amber-950/20 dark:ring-amber-900'
                : 'bg-white/60 ring-gray-100 dark:bg-white/5 dark:ring-gray-800',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
            <FileText
              className={`h-3.5 w-3.5 shrink-0 ${
                failed ? 'text-amber-500' : done ? 'text-emerald-500' : 'text-gray-400'
              }`}
            />
            <span className="truncate text-gray-700 dark:text-gray-200">{name}</span>
            <span className="ml-auto flex shrink-0 items-center gap-1.5">
              {(f.pages || f.slides) && (
                <span className="text-[10px] text-gray-400">
                  {f.pages ? `${f.pages}p` : `${f.slides} slides`}
                </span>
              )}
              {f.state === 'failed' && <Badge tone="amber">failed</Badge>}
              {category && <Badge tone="gray">{category}</Badge>}
            </span>
            </div>
            {/* A document that failed to convert contributes NOTHING — no text,
                no images. Say so plainly rather than letting it look like a
                normal run that happened to find no images. */}
            {failed && (
              <p className="mt-1 pl-5 text-[10px] leading-snug text-amber-700 dark:text-amber-300">
                Could not be read{f.error ? `: ${f.error}` : ''}. Nothing from this
                document is in the listing.
              </p>
            )}
          </li>
        )
      })}
    </ul>
  )
}

/* --------------------------------------------------------------- sections */

export function SectionsPane({
  agents,
  partials,
  settled,
  labels,
}: {
  agents: Record<string, string>
  partials: Record<string, { preview: string; fields: number }>
  settled: Record<string, string>
  labels: ReadonlyArray<{ key: string; label: string }>
}) {
  return (
    <div className="space-y-2">
      {labels.map(({ key, label }) => {
        const state = agents[key]
        const running = state === 'running'
        const done = state === 'done'
        const failed = state === 'failed'
        const text = running ? partials[key]?.preview : settled[key]
        return (
          <div
            key={key}
            className={[
              'rounded-lg px-2.5 py-2 ring-1 transition-colors',
              running
                ? 'bg-blue-50/70 ring-blue-200 dark:bg-blue-950/30 dark:ring-blue-900'
                : done
                  ? 'bg-white/60 ring-gray-100 dark:bg-white/5 dark:ring-gray-800'
                  : failed
                    ? 'bg-amber-50/70 ring-amber-200 dark:bg-amber-950/20 dark:ring-amber-900'
                    : 'bg-transparent ring-transparent',
            ].join(' ')}
          >
            <div className="flex items-center gap-2">
              <span
                className={[
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  running
                    ? 'animate-pulse bg-blue-500'
                    : done
                      ? 'bg-emerald-500'
                      : failed
                        ? 'bg-amber-500'
                        : 'bg-gray-300 dark:bg-gray-600',
                ].join(' ')}
              />
              <span
                className={[
                  'text-xs font-medium',
                  running || done
                    ? 'text-gray-800 dark:text-gray-100'
                    : 'text-gray-400 dark:text-gray-500',
                ].join(' ')}
              >
                {label}
              </span>
              {done && partials[key]?.fields ? (
                <span className="ml-auto text-[10px] text-gray-400">
                  {partials[key].fields} fields
                </span>
              ) : null}
            </div>

            {text ? <StreamWindow text={text} live={running} /> : null}
          </div>
        )
      })}
    </div>
  )
}

/** Terminal-style window: ~6 lines, newest pinned to the bottom. */
function StreamWindow({ text, live }: { text: string; live: boolean }) {
  const tail = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    tail.current?.scrollIntoView({ block: 'end' })
  }, [text])
  return (
    <div
      className="mt-1.5 max-h-[7.5rem] overflow-y-auto rounded-md bg-white/70 px-2 py-1.5 font-mono text-[11px] leading-[1.45] text-gray-600 dark:bg-black/40 dark:text-gray-300"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0, black 14px, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 14px, black 100%)',
      }}
    >
      <div className="prose prose-sm max-w-none dark:prose-invert [&_*]:!my-0 [&_*]:!text-[11px] [&_*]:!leading-[1.45]">
        <Streamdown mode={live ? undefined : 'static'}>{text}</Streamdown>
      </div>
      {live && (
        <span className="ml-0.5 inline-block h-3 w-[2px] animate-pulse bg-blue-500 align-middle" />
      )}
      <div ref={tail} />
    </div>
  )
}

/* ----------------------------------------------------------------- images */

export function ImagesPane({
  images,
  stats,
  compact = false,
}: {
  images: RevealedImage[]
  stats?: ImageStats | null
  compact?: boolean
}) {
  const withUrls = images.filter((i) => imageSrc(i))
  const counts = images.reduce<Record<string, number>>((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1
    return acc
  }, {})

  if (!images.length && !stats) {
    return <Empty icon={<ImageIcon className="h-5 w-5" />} label="Waiting for images…" />
  }

  return (
    <div className="space-y-2">
      {stats && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400">
          Scanned <b>{stats.scanned}</b> · removed <b>{stats.deduped}</b> duplicates &amp; logos ·
          curating <b>{stats.kept}</b>
        </p>
      )}

      {Object.keys(counts).length > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(counts).map(([cat, n]) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              {CATEGORY_LABELS[cat] || cat}
              <span className="text-gray-400">{n}</span>
            </span>
          ))}
        </div>
      )}

      {withUrls.length > 0 ? (
        <div
          className={`grid gap-1.5 ${compact ? 'grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'}`}
        >
          {withUrls
            .slice()
            .reverse()
            .map((img, i) => (
              <figure
                key={`${imageSrc(img)}-${i}`}
                className="group relative animate-[popIn_.35s_ease-out] overflow-hidden rounded-md ring-1 ring-gray-200 motion-reduce:animate-none dark:ring-gray-700"
                title={[CATEGORY_LABELS[img.category] || img.category, img.caption, img.reasoning]
                  .filter(Boolean)
                  .join(' — ')}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc(img)}
                  alt={img.caption || img.category}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                />
                {img.hero && (
                  <Star className="absolute right-1 top-1 h-3.5 w-3.5 fill-amber-400 text-amber-500 drop-shadow" />
                )}
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1 pt-3 text-[9px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {CATEGORY_LABELS[img.category] || img.category}
                </figcaption>
              </figure>
            ))}
        </div>
      ) : (
        images.length > 0 && (
          <p className="text-[11px] text-gray-400">
            {images.length} image{images.length === 1 ? '' : 's'} classified.
          </p>
        )
      )}

      <style jsx global>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ misc */

export function DonePane({ imageCount, heroCount }: { imageCount: number; heroCount: number }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-6 text-center">
      <Sparkles className="h-6 w-6 text-blue-500" />
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Draft assembled</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {imageCount} images placed{heroCount ? ` · ${heroCount} heroes` : ''}
      </p>
    </div>
  )
}

function Empty({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-8 text-gray-300 dark:text-gray-600">
      {icon}
      <span className="text-[11px]">{label}</span>
    </div>
  )
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'gray' | 'amber' }) {
  return (
    <span
      className={[
        'rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide',
        tone === 'amber'
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
          : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
      ].join(' ')}
    >
      {children}
    </span>
  )
}
