'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '../supabase/client'
import { useAuthModal } from '../../app/contexts/AuthModalContext'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
  redirectTo: null,
  setRedirectTo: () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [redirectTo, setRedirectTo] = useState(null);
  const supabase = createClient()
  const { closeModal } = useAuthModal()
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
      } else {
        setSession(session)
        setUser(session?.user ?? null)
      }
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (event === 'SIGNED_IN') {
          const channel = new BroadcastChannel('auth-channel');
          channel.postMessage('auth-complete');
          channel.close();

          closeModal();
          const finalRedirectTo = redirectTo || sessionStorage.getItem('redirectTo');
          // Clear any persisted redirect path as soon as we read it
          setRedirectTo(null);
          sessionStorage.removeItem('redirectTo');

          // Only redirect if we actually have a path AND it's different from the current one
          if (finalRedirectTo && finalRedirectTo !== window.location.pathname) {
            window.location.href = finalRedirectTo;
          }
        } else if (event === 'SIGNED_OUT') {
          // If the user signs out, always redirect to the homepage.
          router.push('/');
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, closeModal, redirectTo])


  const value = {
    user,
    loading,
    setRedirectTo,
    signIn: (options) => supabase.auth.signInWithOAuth(options),
    signOut: async () => {
      await supabase.auth.signOut();
      setUser(null);
      // After signing out, redirect to the homepage to ensure a clean state
      router.push('/');
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 