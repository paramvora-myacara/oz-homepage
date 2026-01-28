'use client'

import { useState, FormEvent } from 'react'
import { X } from 'lucide-react'

interface AddListingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (slug: string, title: string, sectionsJson: string) => void
  isLoading: boolean
  error: string | null
  isSimplified?: boolean
}

export default function AddListingModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  isSimplified = false
}: AddListingModalProps) {
  const [slug, setSlug] = useState('')
  const [title, setTitle] = useState('')
  const [sectionsJson, setSectionsJson] = useState('')
  const [selectedState, setSelectedState] = useState('')

  const US_STATES = [
    { code: 'al', name: 'Alabama' }, { code: 'ak', name: 'Alaska' }, { code: 'az', name: 'Arizona' },
    { code: 'ar', name: 'Arkansas' }, { code: 'ca', name: 'California' }, { code: 'co', name: 'Colorado' },
    { code: 'ct', name: 'Connecticut' }, { code: 'de', name: 'Delaware' }, { code: 'fl', name: 'Florida' },
    { code: 'ga', name: 'Georgia' }, { code: 'hi', name: 'Hawaii' }, { code: 'id', name: 'Idaho' },
    { code: 'il', name: 'Illinois' }, { code: 'in', name: 'Indiana' }, { code: 'ia', name: 'Iowa' },
    { code: 'ks', name: 'Kansas' }, { code: 'ky', name: 'Kentucky' }, { code: 'la', name: 'Louisiana' },
    { code: 'me', name: 'Maine' }, { code: 'md', name: 'Maryland' }, { code: 'ma', name: 'Massachusetts' },
    { code: 'mi', name: 'Michigan' }, { code: 'mn', name: 'Minnesota' }, { code: 'ms', name: 'Mississippi' },
    { code: 'mo', name: 'Missouri' }, { code: 'mt', name: 'Montana' }, { code: 'ne', name: 'Nebraska' },
    { code: 'nv', name: 'Nevada' }, { code: 'nh', name: 'New Hampshire' }, { code: 'nj', name: 'New Jersey' },
    { code: 'nm', name: 'New Mexico' }, { code: 'ny', name: 'New York' }, { code: 'nc', name: 'North Carolina' },
    { code: 'nd', name: 'North Dakota' }, { code: 'oh', name: 'Ohio' }, { code: 'ok', name: 'Oklahoma' },
    { code: 'or', name: 'Oregon' }, { code: 'pa', name: 'Pennsylvania' }, { code: 'ri', name: 'Rhode Island' },
    { code: 'sc', name: 'South Carolina' }, { code: 'sd', name: 'South Dakota' }, { code: 'tn', name: 'Tennessee' },
    { code: 'tx', name: 'Texas' }, { code: 'ut', name: 'Utah' }, { code: 'vt', name: 'Vermont' },
    { code: 'va', name: 'Virginia' }, { code: 'wa', name: 'Washington' }, { code: 'wv', name: 'West Virginia' },
    { code: 'wi', name: 'Wisconsin' }, { code: 'wy', name: 'Wyoming' }
  ]

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const finalTitle = title.trim()
    let finalSlug = slug.trim()

    if (isSimplified) {
      finalSlug = generateSlug(finalTitle)
      if (selectedState) {
        finalSlug = `${finalSlug}-${selectedState}`
      }
    }

    const finalSections = isSimplified ? '' : sectionsJson.trim()

    // Basic validation
    if (!finalSlug) {
      return
    }
    if (!finalTitle) {
      return
    }

    // Slug validation - only lowercase letters, numbers, and hyphens
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(finalSlug)) {
      return
    }

    // JSON validation (only if not simplified)
    if (!isSimplified) {
      if (!finalSections) {
        return
      }
      try {
        JSON.parse(finalSections)
      } catch (e) {
        return // Invalid JSON
      }
    }

    onSubmit(finalSlug, finalTitle, finalSections)
  }

  const handleClose = () => {
    setSlug('')
    setTitle('')
    setSectionsJson('')
    setSelectedState('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isSimplified ? 'Start New Listing' : 'Add New Listing'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Downtown Apartments"
              required
            />
          </div>

          {isSimplified && (
            <div className="mb-4">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a state</option>
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!isSimplified && (
            <>
              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., downtown-apartments"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only lowercase letters, numbers, and hyphens allowed
                </p>
              </div>

              <div className="mb-4">
                <label htmlFor="sectionsJson" className="block text-sm font-medium text-gray-700 mb-1">
                  Sections JSON *
                </label>
                <textarea
                  id="sectionsJson"
                  value={sectionsJson}
                  onChange={(e) => setSectionsJson(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                  placeholder='e.g., {"sections": [{"type": "hero", "data": {...}}]}'
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the JSON data for the listing sections (see listing insertion guide)
                </p>
              </div>
            </>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              disabled={isLoading || !title.trim() || (isSimplified && !selectedState) || (!isSimplified && (!slug.trim() || !sectionsJson.trim()))}
            >
              {isLoading ? 'Creating...' : isSimplified ? 'Start Listing' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
