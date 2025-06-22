'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, AuthState } from '@/types'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: any, success?: boolean }>
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
      console.log('Initial session check:', session?.user?.email)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchUserProfile(userId: string) {
    try {
      console.log('Fetching profile for user ID:', userId)
      
      // First, check if profiles table exists
      const { data: tableCheck, error: tableError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (tableError) {
        console.error('Profiles table error:', tableError)
        console.log('This might mean the profiles table does not exist or RLS is blocking access')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        console.log('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        })
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116') {
          console.log('Profile not found, attempting to create it...')
          await createMissingProfile(userId)
        }
        return
      }

      console.log('User profile fetched successfully:', data)
      setUser(data)
    } catch (error) {
      console.error('Unexpected error in fetchUserProfile:', error)
    }
  }

  async function createMissingProfile(userId: string) {
    try {
      console.log('Creating missing profile for user ID:', userId)
      
      // Get user data from auth.users
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Error getting user data:', authError)
        return
      }

      // Create profile manually
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
        console.error('Error creating profile:', error)
        return
      }

      console.log('Profile created successfully:', data)
      setUser(data)
    } catch (error) {
      console.error('Unexpected error creating profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        return { error }
      }
      
      console.log('Sign in successful:', data.user?.email)
      
      // If sign in successful but no session, user might need email confirmation
      if (!data.session) {
        return { error: { message: 'Please check your email to confirm your account before signing in.' } }
      }
      
      return { error: null }
    } catch (error) {
      console.error('Unexpected sign in error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('Attempting sign up for:', email, name)
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
        console.error('Sign up error:', error)
        return { error }
      }

      console.log('Sign up successful:', data.user?.email)
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { 
          error: null, 
          success: true,
          message: 'Please check your email to confirm your account before signing in.'
        }
      }

      return { error: null, success: true }
    } catch (error) {
      console.error('Unexpected sign up error:', error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
      setUser(null)
    } catch (error) {
      console.error('Unexpected sign out error:', error)
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