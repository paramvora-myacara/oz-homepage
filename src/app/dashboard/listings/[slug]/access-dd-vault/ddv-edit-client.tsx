'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Listing, ListingLifecycleStatus } from '@/types/listing'
import { DDVFile } from '@/lib/supabase/ddv'
import { formatFileSize, formatDate, sanitizeFileName } from '@/utils/helpers'
import { DDVEditToolbar } from '@/components/editor/DDVEditToolbar'
import { useResumableUpload } from '@/hooks/useResumableUpload'
import {
  CheckCircle2,
  Clock,
  FileStack,
  Sparkles,
  X,
  Upload,
} from 'lucide-react'

interface DDVEditClientProps {
  listing: Listing
  files: DDVFile[]
  slug: string
  listingId: string
}

export default function DDVEditClient({ listing, files, slug, listingId }: DDVEditClientProps) {
  const router = useRouter()
  const [lifecycleStatus, setLifecycleStatus] = useState<ListingLifecycleStatus>(
    () => listing.lifecycle_status ?? 'draft'
  )
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [currentFiles, setCurrentFiles] = useState<DDVFile[]>(files)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadQueue, setUploadQueue] = useState<Array<{
    file: File
    status: 'queued' | 'uploading' | 'completed' | 'failed'
    progress?: number
    error?: string
  }>>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use the resumable upload hook
  const { uploadFile, isUploading, progress, error, success, resetUpload } = useResumableUpload()

  useEffect(() => {
    setLifecycleStatus(listing.lifecycle_status ?? 'draft')
  }, [listing.lifecycle_status])

  const handleConfirmSubmitForReview = async () => {
    setSubmitLoading(true)
    try {
      const res = await fetch(
        `/api/admin/listings/${encodeURIComponent(slug)}/submit-for-review`,
        { method: 'POST' }
      )
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(typeof body.error === 'string' ? body.error : 'Submit failed. Please try again.')
        return
      }
      setLifecycleStatus('in_review')
      setConfirmSubmitOpen(false)
      router.refresh()
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploadModalOpen(false)

    // Initialize upload queue
    const fileArray = Array.from(files)
    const initialQueue = fileArray.map(file => ({
      file,
      status: 'queued' as const,
      progress: 0
    }))
    setUploadQueue(initialQueue)

    // Process files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]

      try {
        // Update status to uploading
        setUploadQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'uploading' } : item
        ))

        // Use the resumable upload hook
        // Use single bucket with listing ID folder structure
        // Sanitize filename to prevent storage API errors with special characters
        const sanitizedName = sanitizeFileName(file.name)
        const bucketName = 'ddv-vault'
        const filePath = `${listingId}/${sanitizedName}`
        const result = await uploadFile(file, bucketName, filePath)

        // If upload is successful, add the file to the list with real data
        if (result.success && result.fileData) {
          const newFile: DDVFile = {
            name: sanitizedName, // Use sanitized name to match what's stored
            id: crypto.randomUUID(), // Generate a proper UUID
            updated_at: result.fileData.updated_at,
            size: result.fileData.size,
            metadata: {
              mimetype: result.fileData.mimetype
            }
          }
          setCurrentFiles(prev => [...prev, newFile])

          // Update queue status to completed
          setUploadQueue(prev => prev.map((item, idx) =>
            idx === i ? { ...item, status: 'completed', progress: 100 } : item
          ))
        } else {
          // Update queue status to failed
          setUploadQueue(prev => prev.map((item, idx) =>
            idx === i ? { ...item, status: 'failed', error: 'Upload failed' } : item
          ))
        }
      } catch (error: any) {
        console.error('Error uploading file:', error)
        // Update queue status to failed
        setUploadQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'failed', error: error.message || 'Unknown error' } : item
        ))
      }
    }

    // Reset upload state after all files are processed
    resetUpload()

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // Clear upload queue after a delay to show completion status
    setTimeout(() => {
      setUploadQueue([])
    }, 3000)
  }

  const handleFileDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return

    setDeletingFile(fileName)

    try {
      const response = await fetch('/api/ddv/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileName,
          listingSlug: slug
        })
      })

      if (response.ok) {
        setCurrentFiles(prev => prev.filter(file => file.name !== fileName))
      } else {
        console.error('Failed to delete file')
        alert('Failed to delete file. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Error deleting file. Please try again.')
    } finally {
      setDeletingFile(null)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'xls':
      case 'xlsx':
        return '📊'
      case 'ppt':
      case 'pptx':
        return '📈'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️'
      case 'zip':
      case 'rar':
        return '📦'
      default:
        return '📎'
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <DDVEditToolbar slug={slug} />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Due Diligence Vault - Edit Mode
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Manage confidential documents and materials for {listing.listingName}.
          </p>
        </div>

        {/* Add files + submit for review (same row when files exist) */}
        {currentFiles.length > 0 && (
          <div className="mb-8 flex flex-row flex-wrap gap-4 justify-center items-center">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:bg-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add More Files
            </button>
            {lifecycleStatus === 'draft' && (
              <button
                type="button"
                onClick={() => setConfirmSubmitOpen(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md"
              >
                Submit for Review
              </button>
            )}
            {lifecycleStatus === 'in_review' && (
              <span
                title="You can still add more files."
                className="inline-block cursor-default rounded-lg"
              >
                <button
                  type="button"
                  disabled
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md cursor-not-allowed opacity-95 pointer-events-none"
                >
                  Submitted
                </button>
              </span>
            )}
          </div>
        )}


        {/* Upload Queue */}
        {uploadQueue.length > 0 && (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upload Queue ({uploadQueue.filter(item => item.status === 'completed').length}/{uploadQueue.length} completed)
              </h3>
              <div className="space-y-3">
                {uploadQueue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.file.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {item.status === 'queued' && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">Queued</span>
                      )}
                      {item.status === 'uploading' && (
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress?.percentage || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-blue-600 dark:text-blue-400">
                            {progress?.percentage || 0}%
                          </span>
                        </div>
                      )}
                      {item.status === 'completed' && (
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                          ✓ Completed
                        </span>
                      )}
                      {item.status === 'failed' && (
                        <span className="text-xs text-red-600 dark:text-red-400 flex items-center">
                          ✗ Failed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {uploadQueue.some(item => item.status === 'failed') && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Some files failed to upload. Please try again.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Upload Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="text-red-500">⚠️</div>
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium">Upload Error</p>
                <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              </div>
              <button
                onClick={() => {
                  resetUpload()
                }}
                className="ml-auto text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Upload Success */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="text-green-500">✅</div>
              <div>
                <p className="text-green-800 dark:text-green-200 font-medium">Upload Successful!</p>
                <p className="text-green-600 dark:text-green-300 text-sm">File has been uploaded to the vault.</p>
              </div>
              <button
                onClick={() => {
                  resetUpload()
                }}
                className="ml-auto text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar"
        />

        {/* Files Grid */}
        {currentFiles.length === 0 ? (
          <div className="space-y-8">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-black"
              >
                <Upload className="h-5 w-5 shrink-0" aria-hidden />
                Start Uploading Materials
              </button>
            </div>

            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center dark:border-gray-800 dark:bg-gray-900/50 sm:px-10">
              <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Upload Your Project Documents
              </h3>
              <div className="mx-auto mb-8 max-w-2xl space-y-6 text-left">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  To help us build your premium listing page, please upload all relevant project materials here.
                  This includes:
                </p>
                <ul className="grid grid-cols-1 gap-3 text-sm font-medium text-gray-700 dark:text-gray-200 md:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span> Pitch Decks, Flyers & OMs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span> Site Plans & Maps
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span> Renderings & Images
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span> Financial Projections
                  </li>
                  <li className="flex items-center gap-2 md:col-span-2">
                    <span className="text-blue-500">✓</span> Confidential Due Diligence Documents
                  </li>
                </ul>

                <div className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-800">
                  <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                    Why? Our team uses these documents to craft your high-converting listing page and populate all
                    technical details for you.
                  </p>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                    <p className="flex gap-2 text-sm text-amber-800 dark:text-amber-200">
                      <span className="flex-shrink-0">🔒</span>
                      <span>
                        <span className="font-bold">Confidentiality Note:</span> Any Due Diligence documents uploaded
                        here will only be visible to investors <span className="italic underline">after</span> they have
                        signed a Confidentiality Agreement (CA).
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFiles.map((file) => (
              <div
                key={file.name}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{getFileIcon(file.name)}</div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatFileSize(file.size)}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        {formatDate(file.updated_at)}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {file.name}
                  </h3>

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => {
                        // Download functionality
                        const link = document.createElement('a')
                        link.href = `/api/ddv/${slug}/download?file=${encodeURIComponent(file.name)}`
                        link.download = file.name
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                      }}
                      className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-sm"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleFileDelete(file.name)}
                      disabled={deletingFile === file.name}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingFile === file.name ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                      ) : (
                        'Delete'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Submit for review confirmation */}
      {confirmSubmitOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-all duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submit-review-title"
          onClick={() => !submitLoading && setConfirmSubmitOpen(false)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled={submitLoading}
              onClick={() => setConfirmSubmitOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative bg-blue-600 px-8 pb-10 pt-12 text-center text-white">
              <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-2 ring-white/30">
                <Sparkles className="h-8 w-8 text-white" aria-hidden />
              </div>
              <h3 id="submit-review-title" className="text-2xl font-bold tracking-tight">
                Ready to submit for review?
              </h3>
              <p className="mt-2 text-sm font-medium text-blue-100">
                Our team will build your listing from the materials you&apos;ve uploaded.
              </p>
            </div>

            <div className="space-y-6 px-8 py-8">
              <p className="text-center text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Once you confirm, we&apos;ll move <span className="font-semibold text-gray-900 dark:text-white">{listing.listingName}</span>{' '}
                into review and aim to have it live on the site within{' '}
                <span className="font-semibold text-blue-600 dark:text-blue-400">24–48 hours</span>.
              </p>

              <ul className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <FileStack className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">Documents received</span>
                    <span className="block text-gray-500 dark:text-gray-400">We use your vault files to draft the listing.</span>
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                    <Clock className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">Review &amp; build</span>
                    <span className="block text-gray-500 dark:text-gray-400">Our team polishes copy, layout, and technical details.</span>
                  </span>
                </li>
                <li className="flex gap-3 text-sm text-gray-700 dark:text-gray-200">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="font-semibold text-gray-900 dark:text-white">Go live</span>
                    <span className="block text-gray-500 dark:text-gray-400">You&apos;ll be notified when the listing is published.</span>
                  </span>
                </li>
              </ul>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={() => setConfirmSubmitOpen(false)}
                  className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Not yet
                </button>
                <button
                  type="button"
                  disabled={submitLoading}
                  onClick={handleConfirmSubmitForReview}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitLoading ? (
                    <>
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
                      Submit for review
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 transition-all duration-300"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 transform scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Upload New File
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Click the button below to select one or more files to upload to the due diligence vault.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Choose Files
              </button>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 