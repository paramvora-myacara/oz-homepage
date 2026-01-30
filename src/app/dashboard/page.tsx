'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AddListingModal from '@/components/admin/AddListingModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SubscriptionPanel from '@/components/admin/SubscriptionPanel'

interface AdminUser {
  id: string
  email: string
  role: string
}

interface Listing {
  listing_slug: string
  hostname?: string
  is_draft?: boolean
  title?: string
  listing_id?: string
}

interface AdminData {
  user: AdminUser
  listings: Listing[]
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/me')
        if (response.ok) {
          const adminData = await response.json()
          console.log('Admin data:', adminData) // Debug logging
          setData(adminData)
        } else {
          console.log('Admin API error:', response.status, response.statusText) // Debug logging
          if (response.status === 401) {
            router.push('/dashboard/login')
            return
          }
          setError('Failed to load admin data')
        }
      } catch (err) {
        setError('Network error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/dashboard/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const handleCreateListing = async (slug: string, title: string, sectionsJson: string) => {
    setIsCreating(true)
    setCreateError('')

    try {
      const response = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, title, sections: sectionsJson }),
      })

      const responseData = await response.json()

      if (response.ok) {
        // If the API provided a redirect URL (e.g. for draft creation), follow it
        if (responseData.redirectTo) {
          router.push(responseData.redirectTo)
          return
        }

        // Otherwise, refresh the data to show the new listing
        const refreshResponse = await fetch('/api/admin/me')
        if (refreshResponse.ok) {
          const adminData = await refreshResponse.json()
          setData(adminData)
        }
        setShowAddModal(false)
      } else {
        setCreateError(responseData.error || 'Failed to create listing')
      }
    } catch (err) {
      setCreateError('Network error occurred')
    } finally {
      setIsCreating(false)
    }
  }

  const getViewUrl = (listing: Listing) => {
    if (listing.hostname) {
      return `https://${listing.hostname}/`
    }
    return `/listings/${listing.listing_slug}`
  }

  const getEditUrl = (listing: Listing) => {
    const base = process.env.NEXT_PUBLIC_PLATFORM_BASE_URL?.replace(/\/$/, '')
    if (base) return `${base}/dashboard/listings/${listing.listing_slug}`
    return `/dashboard/listings/${listing.listing_slug}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  const isInternalAdmin = data?.user.role === 'internal_admin';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-12 lg:pt-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome, {data?.user.email} (Role: {data?.user.role})
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <div className="px-4 sm:px-0 mb-6">
            <TabsList>
              <TabsTrigger value="listings">My Listings</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="listings" className="space-y-6">
            {/* Create Listing Button (moved inside tab) */}
            <div className="px-4 sm:px-0 flex justify-end">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isInternalAdmin ? 'Add New Listing' : 'Start New Listing'}
              </button>
            </div>

            {/* Listings Grid */}
            <div className="px-4 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {data?.listings.map((listing) => (
                    <li key={listing.listing_slug}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-medium">
                                  {listing.listing_slug.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="flex items-center gap-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {listing.title || listing.listing_slug}
                                </div>
                                {listing.is_draft && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Draft
                                  </span>
                                )}
                              </div>
                              {listing.hostname && (
                                <div className="text-sm text-gray-500">
                                  {listing.hostname}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {!listing.is_draft && (
                              <a
                                href={getViewUrl(listing)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                View
                              </a>
                            )}
                            <a
                              href={getEditUrl(listing)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Edit
                            </a>
                            <a
                              href={`/dashboard/listings/${listing.listing_slug}/access-dd-vault`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              Edit DDV
                            </a>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {data?.listings.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-500">
                    No listings assigned to your account.
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="px-4 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg p-6">
              {isInternalAdmin ? (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Subscription Management
                  </h3>
                  <p className="text-sm text-gray-500">
                    Subscription management is not applicable for internal admins.
                  </p>
                </div>
              ) : (
                <SubscriptionPanel userEmail={data!.user.email} />
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Listing Modal */}
        <AddListingModal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false)
            setCreateError('')
          }}
          onSubmit={handleCreateListing}
          isLoading={isCreating}
          error={createError}
          isSimplified={!isInternalAdmin}
        />
      </div>
    </div>
  )
}
