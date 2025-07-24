import React, { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Clock, User, Lock, Play, AlertCircle, ExternalLink } from 'lucide-react'
import { useMockAuth } from '../hooks/useMockAuth'
import { useMockWebinars } from '../hooks/useMockWebinars'
import type { Webinar } from '../types/webinar'

interface WebinarDetailProps {
  webinarId: string
  onBack: () => void
}

export function WebinarDetail({ webinarId, onBack }: WebinarDetailProps) {
  const [webinar, setWebinar] = useState<Webinar | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, profile } = useMockAuth()
  const { getWebinar } = useMockWebinars()

  useEffect(() => {
    loadWebinar()
  }, [webinarId])

  const loadWebinar = async () => {
    setLoading(true)
    setError(null)
    
    const { data, error: fetchError } = await getWebinar(webinarId)
    
    if (fetchError) {
      setError('Failed to load webinar details')
    } else {
      setWebinar(data)
    }
    
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !webinar) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load Webinar</h3>
        <p className="text-gray-600 mb-4">{error || 'Webinar not found'}</p>
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Webinars</span>
        </button>
      </div>
    )
  }

  const scheduledDate = new Date(webinar.scheduled_at)
  const isPast = scheduledDate < new Date()
  const isAccessRestricted = webinar.access_type === 'paid_only' && !profile?.is_paid_user
  const canAccess = !isAccessRestricted || user?.id === webinar.created_by

  const getEmbedUrl = (url: string) => {
    // Handle Vimeo URLs
    if (url.includes('vimeo.com')) {
      return url
    }
    
    // Handle YouTube URLs
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    
    // Return as-is for other embed URLs (Zoom, etc.)
    return url
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Webinars</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Video Section */}
        {webinar.embed_url && canAccess ? (
          <div className="relative aspect-video bg-black">
            <iframe
              src={getEmbedUrl(webinar.embed_url)}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={webinar.title}
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            {isAccessRestricted ? (
              <div className="text-center p-8">
                <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Premium Content</h3>
                <p className="text-gray-600 mb-4">
                  This webinar is only available to premium subscribers
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <Lock className="h-4 w-4 mr-2" />
                  Premium Required
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Video will be available here</p>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Badges */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-bold text-gray-900 flex-1 mr-4">
                {webinar.title}
              </h1>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {webinar.access_type === 'paid_only' && (
                  <div className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    <Lock className="h-3 w-3" />
                    <span>Premium</span>
                  </div>
                )}
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
                }`}>
                  {isPast ? 'Past Event' : 'Upcoming'}
                </div>
              </div>
            </div>

            {webinar.description && (
              <p className="text-gray-700 leading-relaxed">
                {webinar.description}
              </p>
            )}
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Speaker</p>
                <p className="font-medium text-gray-900">{webinar.speaker_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Date & Time</p>
                <p className="font-medium text-gray-900">
                  {scheduledDate.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {scheduledDate.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    timeZoneName: 'short'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-900">{webinar.duration} minutes</p>
              </div>
            </div>
          </div>

          {/* External Link */}
          {webinar.embed_url && canAccess && (
            <div className="border-t border-gray-200 pt-6">
              <a
                href={webinar.embed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in new tab</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}