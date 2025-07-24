import React from 'react'
import { User, LogOut, Calendar, Plus, Users } from 'lucide-react'
import { useMockAuth } from '../hooks/useMockAuth'

interface LayoutProps {
  children: React.ReactNode
  currentView: 'dashboard' | 'public' | 'detail'
  onViewChange: (view: 'dashboard' | 'public') => void
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user, profile, signOut } = useMockAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">WebinarHub</h1>
              </div>
              
              <div className="hidden md:flex space-x-6">
                <button
                  onClick={() => onViewChange('public')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentView === 'public'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Browse Webinars</span>
                </button>
                
                {user && (
                  <button
                    onClick={() => onViewChange('dashboard')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentView === 'dashboard'
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                    <span>My Dashboard</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                    {profile?.is_paid_user && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Premium
                      </span>
                    )}
                  </div>
                  <button
                    onClick={signOut}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Guest User
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
