import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, User, Link, FileText, Save } from 'lucide-react'
import type { WebinarFormData, Webinar } from '../types/webinar'

interface WebinarFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: WebinarFormData) => Promise<void>
  initialData?: Webinar | null
  loading?: boolean
}

export function WebinarForm({ isOpen, onClose, onSubmit, initialData, loading = false }: WebinarFormProps) {
  const [formData, setFormData] = useState<WebinarFormData>({
    title: '',
    description: '',
    scheduled_at: '',
    duration: 60,
    speaker_name: '',
    embed_url: '',
    access_type: 'public'
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        scheduled_at: new Date(initialData.scheduled_at).toISOString().slice(0, 16),
        duration: initialData.duration,
        speaker_name: initialData.speaker_name,
        embed_url: initialData.embed_url || '',
        access_type: initialData.access_type
      })
    } else {
      setFormData({
        title: '',
        description: '',
        scheduled_at: '',
        duration: 60,
        speaker_name: '',
        embed_url: '',
        access_type: 'public'
      })
    }
  }, [initialData])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (field: keyof WebinarFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Webinar' : 'Create New Webinar'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Webinar Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter webinar title"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your webinar..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date & Time *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => handleChange('scheduled_at', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="duration"
                  type="number"
                  min="15"
                  max="480"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="speaker_name" className="block text-sm font-medium text-gray-700 mb-1">
              Speaker Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="speaker_name"
                type="text"
                value={formData.speaker_name}
                onChange={(e) => handleChange('speaker_name', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter speaker name"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="embed_url" className="block text-sm font-medium text-gray-700 mb-1">
              Video Embed URL
            </label>
            <div className="relative">
              <Link className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="embed_url"
                type="url"
                value={formData.embed_url}
                onChange={(e) => handleChange('embed_url', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://player.vimeo.com/video/... or Zoom embed URL"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter a Vimeo, YouTube, or Zoom embed URL for live streaming
            </p>
          </div>

          <div>
            <label htmlFor="access_type" className="block text-sm font-medium text-gray-700 mb-1">
              Access Type *
            </label>
            <select
              id="access_type"
              value={formData.access_type}
              onChange={(e) => handleChange('access_type', e.target.value as 'public' | 'paid_only')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="public">Public - Anyone can join</option>
              <option value="paid_only">Premium Only - Paid users only</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : initialData ? 'Update Webinar' : 'Create Webinar'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}