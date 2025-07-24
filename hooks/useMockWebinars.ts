import { useState } from 'react'
import { getMockWebinars, getMockWebinar, mockWebinars } from '../data/mockData'
import type { Webinar } from '../types/webinar'

export function useMockWebinars() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(false)

  const loadWebinars = async (filters?: {
    timeFilter?: 'upcoming' | 'past' | 'all'
    createdBy?: string
  }) => {
    setLoading(true)
    const data = await getMockWebinars(filters)
    setWebinars(data)
    setLoading(false)
  }

  const createWebinar = async (webinar: Omit<Webinar, 'id' | 'created_at' | 'updated_at'>) => {
    // Mock create - simulate success
    const newWebinar: Webinar = {
      ...webinar,
      id: `webinar-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Add to mock data (in real app this would be handled by the backend)
    mockWebinars.unshift(newWebinar)
    
    return { data: newWebinar, error: null }
  }

  const updateWebinar = async (id: string, updates: Partial<Webinar>) => {
    // Mock update - simulate success
    const webinarIndex = mockWebinars.findIndex(w => w.id === id)
    if (webinarIndex !== -1) {
      mockWebinars[webinarIndex] = {
        ...mockWebinars[webinarIndex],
        ...updates,
        updated_at: new Date().toISOString()
      }
      return { data: mockWebinars[webinarIndex], error: null }
    }
    return { data: null, error: { message: 'Webinar not found' } }
  }

  const deleteWebinar = async (id: string) => {
    // Mock delete - simulate success
    const webinarIndex = mockWebinars.findIndex(w => w.id === id)
    if (webinarIndex !== -1) {
      mockWebinars.splice(webinarIndex, 1)
      return { error: null }
    }
    return { error: { message: 'Webinar not found' } }
  }

  const getWebinar = async (id: string) => {
    const data = await getMockWebinar(id)
    return { data, error: data ? null : { message: 'Webinar not found' } }
  }

  return {
    webinars,
    loading,
    loadWebinars,
    createWebinar,
    updateWebinar,
    deleteWebinar,
    getWebinar
  }
}