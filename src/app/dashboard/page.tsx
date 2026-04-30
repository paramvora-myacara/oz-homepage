'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AddListingModal from '@/components/admin/AddListingModal'
import GrantListingAccessModal from '@/components/admin/GrantListingAccessModal'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import SubscriptionPanel from '@/components/admin/SubscriptionPanel'
import { Building2, Plus } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  role: string
}

interface Listing {
  listing_slug: string
  lifecycle_status: string
  title?: string
  listing_id?: string
  access_emails?: string[]
}

interface AdminData {
  user: AdminUser
  listings: Listing[]
}

function AddListingStrip({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="px-4 pb-4 pt-4 sm:px-6 sm:pb-4">
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-white px-4 py-4 text-sm font-medium text-gray-500 transition-colors hover:border-blue-400 hover:bg-gray-50 hover:text-blue-600 sm:py-5"
      >
        <Plus className="h-5 w-5 shrink-0" aria-hidden />
        Add listing
      </button>
    </div>
  )
}

function EmptyListingsState({ onStart }: { onStart: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center shadow-sm sm:px-10">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
        <Building2 className="h-8 w-8 text-indigo-500" aria-hidden />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">No listings yet</h3>
      <p className="mx-auto mb-8 max-w-md text-base text-gray-500">
        You don&apos;t have any listings assigned to this account. Create your first listing to get
        started on OZListings.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
      >
        <Plus className="h-4 w-4 mr-2 shrink-0" aria-hidden />
        Start a new one
      </button>
    </div>
  )
}

function LifecycleStatusBadge({ status }: { status: string }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-green-100 text-green-800">
        Live
      </span>
    )
  }
  if (status === 'in_review') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-blue-100 text-blue-800">
        In Process
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-medium bg-yellow-100 text-yellow-800">
      Draft
    </span>
  )
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showGrantAccessModal, setShowGrantAccessModal] = useState(false)
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

  const handleCreateListing = async (slug: string, title: string, sectionsJson: string, contactEmail: string) => {
    setIsCreating(true)
    setCreateError('')

    try {
      const response = await fetch('/api/admin/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          title,
          sections: sectionsJson,
          listingContactEmail: contactEmail
        }),
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

  const getViewUrl = (listing: Listing) => `/listings/${listing.listing_slug}`

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

  const isInternalAdmin = data?.user.role === 'internal_admin'
  const publishedListings =
    data?.listings.filter((l) => l.lifecycle_status === 'live').map((l) => ({
      listing_slug: l.listing_slug,
      title: l.title
    })) ?? []

  const refreshAdminData = async () => {
    const refreshResponse = await fetch('/api/admin/me')
    if (refreshResponse.ok) {
      const adminData = await refreshResponse.json()
      setData(adminData)
    }
  }

  const listings = data?.listings ?? []
  const hasListings = listings.length > 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto pt-12 lg:pt-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-base text-gray-500">
                Welcome, <span className="font-bold">{data?.user.email}</span>
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
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
            {isInternalAdmin && (
              <div className="flex flex-wrap justify-end gap-3 px-4 sm:px-0">
                <button
                  type="button"
                  onClick={() => setShowGrantAccessModal(true)}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Give access to customer
                </button>
              </div>
            )}

            {/* Listings Grid */}
            <div className="px-4 sm:px-0">
              {hasListings ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {listings.map((listing) => (
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
                                  <div className="text-base font-medium text-gray-900">
                                    {listing.title || listing.listing_slug}
                                  </div>
                                  <LifecycleStatusBadge status={listing.lifecycle_status} />
                                </div>
                                {isInternalAdmin && listing.access_emails !== undefined && (
                                  <div className="text-sm text-gray-500 mt-0.5">
                                    Access: {listing.access_emails.length > 0 ? listing.access_emails.join(', ') : 'None'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {listing.lifecycle_status === 'live' && (
                                <a
                                  href={getViewUrl(listing)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-base leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  View
                                </a>
                              )}
                              {listing.lifecycle_status === 'live' && (
                                <a
                                  href={getEditUrl(listing)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-base leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Edit
                                </a>
                              )}
                              <a
                                href={`/dashboard/listings/${listing.listing_slug}/access-dd-vault`}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-base leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              >
                                Edit DDV
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <AddListingStrip onAdd={() => setShowAddModal(true)} />
                </div>
              ) : (
                <EmptyListingsState onStart={() => setShowAddModal(true)} />
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="px-4 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg p-6">
              {isInternalAdmin ? (
                <div>
                  <h3 className="text-xl leading-6 font-medium text-gray-900 mb-4">
                    Subscription Management
                  </h3>
                  <p className="text-base text-gray-500">
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

        {isInternalAdmin && (
          <GrantListingAccessModal
            isOpen={showGrantAccessModal}
            onClose={() => setShowGrantAccessModal(false)}
            publishedListings={publishedListings}
            onGranted={refreshAdminData}
          />
        )}
      </div>
    </div>
  )
}
