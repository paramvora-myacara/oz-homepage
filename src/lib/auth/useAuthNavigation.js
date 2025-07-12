'use client'

import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

/**
 * Hook for authentication-protected navigation
 * @returns {Function} navigateWithAuth - Function that checks auth before navigation
 */
export function useAuthNavigation() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const navigateWithAuth = useCallback((destination, useSignup = false) => {
    // If loading, don't navigate yet
    if (loading) return

    // If user is authenticated, navigate directly to destination
    if (user) {
      router.push(destination)
    } else {
      // If not authenticated, redirect to auth with intended destination
      const authPage = useSignup ? '/auth/signup' : '/auth/login'
      const redirectUrl = `${authPage}?redirectTo=${encodeURIComponent(destination)}`
      router.push(redirectUrl)
    }
  }, [user, loading, router])

  return { navigateWithAuth, isAuthenticated: !!user, loading }
} 