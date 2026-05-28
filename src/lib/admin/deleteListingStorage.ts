import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { OZ_PROJECTS_IMAGES_BUCKET } from '@/utils/supabaseImages'

const DDV_BUCKET = 'ddv-vault'

async function removeStoragePrefix(
  supabase: SupabaseClient,
  bucket: string,
  prefix: string
): Promise<void> {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 })

  if (error) {
    console.error(`[delete-listing] failed to list ${bucket}/${prefix}:`, error.message)
    return
  }

  if (!data?.length) return

  const filePaths: string[] = []

  for (const item of data) {
    const path = prefix ? `${prefix}/${item.name}` : item.name
    // Supabase folders have null id; files have a uuid id
    if (item.id === null) {
      await removeStoragePrefix(supabase, bucket, path)
    } else {
      filePaths.push(path)
    }
  }

  if (filePaths.length === 0) return

  const { error: removeError } = await supabase.storage.from(bucket).remove(filePaths)
  if (removeError) {
    console.error(`[delete-listing] failed to remove ${bucket}/${prefix}:`, removeError.message)
  }
}

/**
 * Best-effort cleanup of listing storage. Logs failures but does not throw.
 */
export async function deleteListingStorage(
  supabase: SupabaseClient,
  slug: string,
  listingId: string
): Promise<void> {
  const projectId = `${slug}-001`

  await Promise.all([
    removeStoragePrefix(supabase, DDV_BUCKET, listingId),
    removeStoragePrefix(supabase, OZ_PROJECTS_IMAGES_BUCKET, projectId),
  ])
}
