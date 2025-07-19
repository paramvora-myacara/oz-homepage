'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '../supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthModal } from '../../app/contexts/AuthModalContext'

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { openModal, closeModal } = useAuthModal()

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
          closeModal();
          const redirectTo = searchParams.get('redirectTo') || sessionStorage.getItem('redirectTo');
          if (redirectTo) {
            sessionStorage.removeItem('redirectTo');
            router.replace(redirectTo);
          } else {
            router.replace('/');
          }
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router, searchParams, closeModal])

  useEffect(() => {
    if (!loading && !user && searchParams.get('auth') === 'required') {
      const redirectTo = searchParams.get('redirectTo') || '/';
      sessionStorage.setItem('redirectTo', redirectTo);
      
      let title = "Gain Exclusive Access";
      let description = "Sign in or create an account to view this page and other exclusive content.";
      
      if (redirectTo.includes('schedule-a-call')) {
        title = "Schedule a Consultation";
        description = "Please sign in to book a time with our team of OZ experts.";
      } else if (redirectTo.includes('listings')) {
        title = "Access a Curated Marketplace";
        description = "Join our platform to view detailed information on investment opportunities.";
      }
      
      openModal({ title, description, redirectTo });
    }
  }, [loading, user, searchParams, openModal]);


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