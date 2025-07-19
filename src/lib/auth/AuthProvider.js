'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '../supabase/client'
import { useAuthModal } from '../../app/contexts/AuthModalContext'

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
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, closeModal, redirectTo])


  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
        setUser(null);
        setSession(null);
        window.location.assign('/'); // Use assign to force a reload and clear state
    } else {
        console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    redirectTo,
    setRedirectTo,
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