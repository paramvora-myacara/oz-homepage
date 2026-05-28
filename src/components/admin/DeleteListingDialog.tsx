'use client'

import { FormEvent, useEffect, useState } from 'react'
import { X } from 'lucide-react'

interface DeleteListingDialogProps {
  isOpen: boolean
  listingSlug: string
  listingTitle: string
  isLoading: boolean
  error: string | null
  onClose: () => void
  onConfirm: (confirmSlug: string) => void
}

export default function DeleteListingDialog({
  isOpen,
  listingSlug,
  listingTitle,
  isLoading,
  error,
  onClose,
  onConfirm,
}: DeleteListingDialogProps) {
  const [confirmSlug, setConfirmSlug] = useState('')

  useEffect(() => {
    if (isOpen) {
      setConfirmSlug('')
    }
  }, [isOpen, listingSlug])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (confirmSlug.trim() !== listingSlug || isLoading) return
    onConfirm(confirmSlug.trim())
  }

  const handleClose = () => {
    if (isLoading) return
    setConfirmSlug('')
    onClose()
  }

  if (!isOpen) return null

  const canSubmit = confirmSlug.trim() === listingSlug && !isLoading

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800 backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Delete listing permanently?</h3>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-2">
          This will permanently delete <span className="font-medium">{listingTitle}</span> and remove
          its database records, marketplace card, DDV files, and images. This cannot be undone.
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Type <span className="font-mono font-medium text-gray-900">{listingSlug}</span> to confirm.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="confirm-slug" className="sr-only">
            Confirm listing slug
          </label>
          <input
            id="confirm-slug"
            type="text"
            value={confirmSlug}
            onChange={(e) => setConfirmSlug(e.target.value)}
            placeholder={listingSlug}
            disabled={isLoading}
            autoComplete="off"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting…' : 'Delete listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
