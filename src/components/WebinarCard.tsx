import React from 'react'
import { Calendar, Clock, User, Lock, Eye } from 'lucide-react'
import type { Webinar } from '../types/webinar'

interface WebinarCardProps {
  webinar: Webinar
  onClick: () => void
  showActions?: boolean
  onEdit?: () => void
  onDelete?: () => void
  userCanAccess?: boolean
}

export function WebinarCard({ 
  webinar, 
  onClick, 
  showActions = false, 
  onEdit, 
  onDelete,
  userCanAccess = true 
}: WebinarCardProps) {
  const scheduledDate = new Date(webinar.scheduled_at)
  const isPast = scheduledDate < new Date()
  const isAccessRestricted = webinar.access_type === 'paid_only' && !userCanAccess

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-3">
            {webinar.title}
          </h3>
          <div className="flex items-center space-x-2 flex-shrink-0">
            {webinar.access_type === 'paid_only' && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                <Lock className="h-3 w-3" />
                <span>Premium</span>
              </div>
            )}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              isPast ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'
            }`}>
              {isPast ? 'Past' : 'Upcoming'}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {webinar.description || 'No description available'}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>Speaker: {webinar.speaker_name}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{webinar.duration} minutes</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onClick}
            disabled={isAccessRestricted}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAccessRestricted
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>{isAccessRestricted ? 'Premium Required' : 'View Details'}</span>
          </button>

          {showActions && onEdit && onDelete && (
            <div className="flex space-x-2">
              <button
                onClick={onEdit}
                className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-md transition-colors"
              >
                Edit
              </button>
              <button
                onClick={onDelete}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}