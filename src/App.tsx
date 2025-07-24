import React, { useState, useEffect } from 'react'
import { Calendar, Plus, Filter, AlertCircle, User } from 'lucide-react'
import { Layout } from './components/Layout'
import { AuthModal } from './components/AuthModal'
import { WebinarCard } from './components/WebinarCard'
import { WebinarForm } from './components/WebinarForm'
import { WebinarDetail } from './components/WebinarDetail'
import { useMockAuth } from './hooks/useMockAuth'
import { useMockWebinars } from './hooks/useMockWebinars'
import type { Webinar, WebinarFormData } from './types/webinar'

type View = 'public' | 'dashboard' | 'detail'
type TimeFilter = 'all' | 'upcoming' | 'past'

function App() {
  const [currentView, setCurrentView] = useState<View>('public')
  const [selectedWebinarId, setSelectedWebinarId] = useState<string | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showWebinarForm, setShowWebinarForm] = useState(false)
  const [editingWebinar, setEditingWebinar] = useState<Webinar | null>(null)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('upcoming')
  const [loading, setLoading] = useState(false)

  const { user, profile, loading: authLoading } = useMockAuth()
  const { webinars, loading: webinarsLoading, loadWebinars, createWebinar, updateWebinar, deleteWebinar } = useMockWebinars()

  useEffect(() => {
    if (currentView === 'public') {
      loadWebinars({ timeFilter })
    } else if (currentView === 'dashboard' && user) {
      loadWebinars({ timeFilter, createdBy: user.id })
    }
  }, [currentView, timeFilter, user])

  const handleViewChange = (view: 'dashboard' | 'public') => {
    if (view === 'dashboard' && !user) {
      setShowAuthModal(true)
      return
    }
    setCurrentView(view)
    setSelectedWebinarId(null)
  }

  const handleWebinarClick = (webinar: Webinar) => {
    const canAccess = webinar.access_type === 'public' || profile?.is_paid_user || user?.id === webinar.created_by
    
    if (!canAccess) {
      setShowAuthModal(true)
      return
    }

    setSelectedWebinarId(webinar.id)
    setCurrentView('detail')
  }

  const handleCreateWebinar = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setEditingWebinar(null)
    setShowWebinarForm(true)
  }

  const handleEditWebinar = (webinar: Webinar) => {
    setEditingWebinar(webinar)
    setShowWebinarForm(true)
  }

  const handleDeleteWebinar = async (webinar: Webinar) => {
    if (confirm(`Are you sure you want to delete "${webinar.title}"?`)) {
      const { error } = await deleteWebinar(webinar.id)
      if (!error) {
        loadWebinars({ timeFilter, createdBy: user?.id })
      }
    }
  }

  const handleWebinarFormSubmit = async (data: WebinarFormData) => {
    if (!user) return

    setLoading(true)
    try {
      if (editingWebinar) {
        await updateWebinar(editingWebinar.id, data)
      } else {
        await createWebinar({
          ...data,
          created_by: user.id
        })
      }
      setShowWebinarForm(false)
      setEditingWebinar(null)
      
      if (currentView === 'dashboard') {
        loadWebinars({ timeFilter, createdBy: user.id })
      } else {
        loadWebinars({ timeFilter })
      }
    } finally {
      setLoading(false)
    }
  }

  const getFilteredWebinars = () => {
    const userCanAccessPaid = profile?.is_paid_user || false
    
    return webinars.filter(webinar => {
      // If it's public webinars view and user is not authenticated or not paid, filter out paid-only webinars
      if (currentView === 'public' && webinar.access_type === 'paid_only' && !userCanAccessPaid && user?.id !== webinar.created_by) {
        return false
      }
      return true
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Layout currentView={currentView} onViewChange={handleViewChange}>
      {currentView === 'detail' && selectedWebinarId ? (
        <WebinarDetail
          webinarId={selectedWebinarId}
          onBack={() => setCurrentView('public')}
        />
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'dashboard' ? 'My Dashboard' : 'Browse Webinars'}
              </h1>
              <p className="text-gray-600 mt-1">
                {currentView === 'dashboard' 
                  ? 'Manage your webinars and track engagement'
                  : 'Discover upcoming and past webinars from industry experts'
                }
              </p>
            </div>

            {currentView === 'dashboard' && (
              <button
                onClick={handleCreateWebinar}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Create Webinar</span>
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
            </div>
            <div className="flex space-x-2">
              {(['all', 'upcoming', 'past'] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    timeFilter === filter
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {webinarsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : getFilteredWebinars().length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {currentView === 'dashboard' ? 'No webinars created yet' : 'No webinars found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {currentView === 'dashboard' 
                  ? "Get started by creating your first webinar"
                  : `No ${timeFilter === 'all' ? '' : timeFilter + ' '}webinars available right now`
                }
              </p>
              {currentView === 'dashboard' && (
                <button
                  onClick={handleCreateWebinar}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Webinar</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredWebinars().map((webinar) => (
                <WebinarCard
                  key={webinar.id}
                  webinar={webinar}
                  onClick={() => handleWebinarClick(webinar)}
                  showActions={currentView === 'dashboard'}
                  onEdit={() => handleEditWebinar(webinar)}
                  onDelete={() => handleDeleteWebinar(webinar)}
                  userCanAccess={webinar.access_type === 'public' || profile?.is_paid_user || user?.id === webinar.created_by}
                />
              ))}
            </div>
          )}

          {/* Premium Upgrade Notice */}
          {currentView === 'public' && user && !profile?.is_paid_user && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Unlock Premium Content
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get access to exclusive webinars and advanced content with a premium subscription.
                  </p>
                  <div className="text-sm text-purple-600 font-medium">
                    Premium features include access to paid-only webinars and priority support.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <WebinarForm
        isOpen={showWebinarForm}
        onClose={() => {
          setShowWebinarForm(false)
          setEditingWebinar(null)
        }}
        onSubmit={handleWebinarFormSubmit}
        initialData={editingWebinar}
        loading={loading}
      />
    </Layout>
  )
}

export default App