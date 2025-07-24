import { useState, useEffect } from 'react'
import { mockCurrentUser, getMockProfile } from '../data/mockData'
import type { Profile } from '../types/webinar'

// Mock user type to simulate Supabase user
type MockUser = {
  id: string
  email: string
}

export function useMockAuth() {
  const [user, setUser] = useState<MockUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading user session
    setTimeout(() => {
      setUser(mockCurrentUser)
      loadProfile(mockCurrentUser.id)
      setLoading(false)
    }, 1000)
  }, [])

  const loadProfile = async (userId: string) => {
    const profileData = await getMockProfile(userId)
    setProfile(profileData)
  }

  const signIn = async (email: string, password: string) => {
    // Mock sign in - always succeeds for demo
    setUser({ id: mockCurrentUser.id, email })
    await loadProfile(mockCurrentUser.id)
    return { error: null }
  }

  const signUp = async (email: string, password: string) => {
    // Mock sign up - always succeeds for demo
    setUser({ id: mockCurrentUser.id, email })
    await loadProfile(mockCurrentUser.id)
    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    return { error: null }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut
  }
}