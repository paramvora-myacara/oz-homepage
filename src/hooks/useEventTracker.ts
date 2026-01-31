'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect, useCallback } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export type EventType = 'request_vault_access' | 'page_view' | 'contact_developer'

export interface EventMetadata {
  propertyId?: string
  developerContactEmail?: string | null
  [key: string]: any
}

export function useEventTracker() {
  const supabase = createClient()
  const pathname = usePathname()

  const getPropertyIdFromPath = useCallback(() => {
    const parts = pathname.split('/').filter(Boolean)
    // New path structure: /listings/[slug]
    if (parts.length === 2 && parts[0] === 'listings') {
      return parts[1]
    }
    // Fallback for old structure or whitelabel if any still exist
    if (parts.length === 1 && !['dashboard', 'api', 'profile', 'settings'].includes(parts[0])) {
      return parts[0]
    }
    return null
  }, [pathname])

  const trackEvent = useCallback(
    async (userId: string, eventType: EventType, metadata: EventMetadata = {}) => {
      // Only track on listing pages as per user request
      if (!pathname.startsWith('/listings')) {
        console.log('Skipping event tracking: Not a listing page')
        return
      }

      const propertyId = getPropertyIdFromPath()
      const eventData = {
        user_id: userId,
        event_type: eventType,
        endpoint: pathname,
        metadata: {
          ...metadata,
          propertyId: metadata.propertyId || propertyId,
          url: window.location.href,
        },
      }

      console.log('Tracking event:', eventData)
      const { error } = await supabase.from('user_events').insert([eventData])

      if (error) {
        console.error('Error tracking event:', error)
      }
    },
    [supabase, pathname, getPropertyIdFromPath]
  )

  return { trackEvent }
} 