'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, AuthState } from '@/types'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: unknown }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: unknown, success?: boolean }>
  signOut: () => Promise<void>
  switchToAdmin: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [fetchUserProfile])

  async function fetchUserProfile(userId: string) {
    try {
      const { error: tableError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      if (tableError) {
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        if (error.code === 'PGRST116') {
          await createMissingProfile()
        }
        return
      }
      setUser(data)
    } catch {
      // Tidak perlu log error di produksi
    }
  }

  async function createMissingProfile() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || 'User',
          role: 'user'
        })
        .select()
        .single()
      if (error) {
        return
      }
      setUser(data)
    } catch {
      // Tidak perlu log error di produksi
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        return { error }
      }
      if (!data.session) {
        return { error: { message: 'Please check your email to confirm your account before signing in.' } }
      }
      return { error: null }
    } catch {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      if (error) {
        return { error }
      }
      if (data.user && !data.session) {
        return { 
          error: null, 
          success: true,
          message: 'Please check your email to confirm your account before signing in.'
        }
      }
      return { error: null, success: true }
    } catch {
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        // Tidak perlu log error di produksi
      }
      setUser(null)
    } catch {
      // Tidak perlu log error di produksi
    }
  }

  const switchToAdmin = () => {
    // This will be implemented to switch to admin login
    signOut()
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    switchToAdmin,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 