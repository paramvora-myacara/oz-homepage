'use client'

/**
 * Shown on any non-live listing whose real content is visible to an authorized
 * viewer (owner or internal_admin). See generation-ux-plan §7.
 *
 * Its job is to make a draft URL impossible to mistake for the live page.
 */

import { Eye } from 'lucide-react'
import type { ListingLifecycleStatus } from '@/types/listing'

export default function DraftPreviewBanner({
  lifecycleStatus,
}: {
  lifecycleStatus?: ListingLifecycleStatus
}) {
  const inReview = lifecycleStatus === 'in_review'

  return (
    <div className="sticky top-0 z-50 border-b border-amber-300 bg-amber-100/95 backdrop-blur dark:border-amber-700 dark:bg-amber-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 text-sm">
        <Eye className="h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden />
        <span className="font-semibold text-amber-900 dark:text-amber-200">
          Draft preview
        </span>
        <span className="text-amber-800 dark:text-amber-300">
          {inReview
            ? 'This listing is being reviewed by the OZ Listings team. Investors cannot see this page yet.'
            : 'This listing is not published. Investors cannot see this page yet.'}
        </span>
      </div>
    </div>
  )
}
