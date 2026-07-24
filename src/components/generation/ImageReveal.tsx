/**
 * Shared types for the generation live view (generation-ux-plan §4).
 *
 * The rendering lives in LiveStage.tsx (`ImagesPane`); this module is the
 * single place the image event shape is declared, imported by both the panel
 * and the pane.
 */

export interface RevealedImage {
  /** Absolute URL as built by the backend. May be unusable if the backend's
      Supabase origin differs from the browser's (e.g. host.docker.internal in
      local dev) — prefer `storagePathToUrl(storage_path)` when present. */
  url?: string
  /** Path inside the oz-projects-images bucket. */
  storage_path?: string
  category: string
  caption?: string
  reasoning?: string
  hero?: boolean
}

/**
 * Build a browser-resolvable image URL from a storage path using the FRONTEND's
 * own Supabase origin. The backend may reach Supabase over a hostname the
 * browser cannot resolve, so when we have a path we always prefer this.
 */
export function storagePathToUrl(storagePath?: string): string | undefined {
  if (!storagePath) return undefined
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!base) return undefined
  return `${base.replace(/\/$/, '')}/storage/v1/object/public/oz-projects-images/${storagePath}`
}

/** Best available src: our own origin first, backend-provided URL as fallback. */
export function imageSrc(img: RevealedImage): string | undefined {
  return storagePathToUrl(img.storage_path) ?? img.url
}

export interface ImageStats {
  /** Candidate crops found across all documents, before filtering. */
  scanned: number
  /** Removed by perceptual-hash dedupe + size/aspect filtering. */
  deduped: number
  /** Sent to the vision classifier. */
  kept: number
}
