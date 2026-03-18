'use client'

import { useCallback, useEffect, useState, FormEvent } from 'react'
import { X } from 'lucide-react'

export interface PublishedListingOption {
  listing_slug: string
  title?: string | null
}

interface CustomerRow {
  id: string
  email: string
}

interface GrantListingAccessModalProps {
  isOpen: boolean
  onClose: () => void
  publishedListings: PublishedListingOption[]
  onGranted: () => void
}

export default function GrantListingAccessModal({
  isOpen,
  onClose,
  publishedListings,
  onGranted
}: GrantListingAccessModalProps) {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [selectedSlug, setSelectedSlug] = useState('')
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadCustomers = useCallback(async () => {
    setLoadingCustomers(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/customers')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to load customers')
        setCustomers([])
        return
      }
      setCustomers(data.customers || [])
    } catch {
      setError('Network error loading customers')
      setCustomers([])
    } finally {
      setLoadingCustomers(false)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    loadCustomers()
    setSelectedSlug('')
    setSelectedCustomerId('')
    setError(null)
  }, [isOpen, loadCustomers])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedSlug || !selectedCustomerId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/listings/${encodeURIComponent(selectedSlug)}/grant-access`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerUserId: selectedCustomerId })
        }
      )
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Request failed')
        return
      }
      onGranted()
      onClose()
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-6 shadow-2xl rounded-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 dark:border-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Give access to customer
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="grant-listing" className="block text-sm font-medium text-gray-700 mb-1">
              Published listing *
            </label>
            <select
              id="grant-listing"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select listing</option>
              {publishedListings.map((l) => (
                <option key={l.listing_slug} value={l.listing_slug}>
                  {l.title?.trim() || l.listing_slug}
                </option>
              ))}
            </select>
            {publishedListings.length === 0 && (
              <p className="text-sm text-amber-600 mt-1">No published listings available.</p>
            )}
          </div>

          <div>
            <label htmlFor="grant-customer" className="block text-sm font-medium text-gray-700 mb-1">
              Customer *
            </label>
            <select
              id="grant-customer"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={loadingCustomers}
            >
              <option value="">
                {loadingCustomers ? 'Loading…' : 'Select customer'}
              </option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.email}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                submitting ||
                !selectedSlug ||
                !selectedCustomerId ||
                publishedListings.length === 0
              }
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Granting…' : 'Grant access & notify'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
