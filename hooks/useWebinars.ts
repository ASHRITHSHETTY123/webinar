import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Webinar } from '../types/webinar'

export function useWebinars() {
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(false)

  const loadWebinars = async (filters?: {
    timeFilter?: 'upcoming' | 'past' | 'all'
    createdBy?: string
  }) => {
    setLoading(true)
    
    let query = supabase
      .from('webinars')
      .select('*')
      .order('scheduled_at', { ascending: false })

    if (filters?.createdBy) {
      query = query.eq('created_by', filters.createdBy)
    }

    if (filters?.timeFilter === 'upcoming') {
      query = query.gte('scheduled_at', new Date().toISOString())
    } else if (filters?.timeFilter === 'past') {
      query = query.lt('scheduled_at', new Date().toISOString())
    }

    const { data, error } = await query

    if (!error && data) {
      setWebinars(data)
    }
    
    setLoading(false)
  }

  const createWebinar = async (webinar: Omit<Webinar, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('webinars')
      .insert([webinar])
      .select()
      .single()

    return { data, error }
  }

  const updateWebinar = async (id: string, updates: Partial<Webinar>) => {
    const { data, error } = await supabase
      .from('webinars')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  }

  const deleteWebinar = async (id: string) => {
    const { error } = await supabase
      .from('webinars')
      .delete()
      .eq('id', id)

    return { error }
  }

  const getWebinar = async (id: string) => {
    const { data, error } = await supabase
      .from('webinars')
      .select('*')
      .eq('id', id)
      .single()

    return { data, error }
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