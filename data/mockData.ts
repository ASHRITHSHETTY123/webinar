import type { Webinar, Profile } from '../types/webinar'

// Mock users/profiles
export const mockProfiles: Profile[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'contributor@example.com',
    is_paid_user: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'paid_user@example.com',
    is_paid_user: true,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'public_user@example.com',
    is_paid_user: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

// Mock webinars
export const mockWebinars: Webinar[] = [
  {
    id: 'webinar-1',
    title: 'Introduction to React Development',
    description: 'Learn the basics of React development including components, props, and state management. This comprehensive workshop will cover everything you need to know to get started with React, from setting up your development environment to building your first interactive application.',
    scheduled_at: '2025-02-15T14:00:00Z',
    duration: 90,
    speaker_name: 'Sarah Johnson',
    embed_url: 'https://player.vimeo.com/video/76979871',
    access_type: 'public',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-01-10T00:00:00Z'
  },
  {
    id: 'webinar-2',
    title: 'Advanced TypeScript Patterns',
    description: 'Deep dive into advanced TypeScript patterns and best practices for enterprise applications. Explore generics, conditional types, mapped types, and advanced utility types that will make your code more robust and maintainable.',
    scheduled_at: '2025-02-20T16:00:00Z',
    duration: 120,
    speaker_name: 'Michael Chen',
    embed_url: 'https://player.vimeo.com/video/76979871',
    access_type: 'paid_only',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    created_at: '2025-01-12T00:00:00Z',
    updated_at: '2025-01-12T00:00:00Z'
  },
  {
    id: 'webinar-3',
    title: 'Building Scalable APIs',
    description: 'Learn how to design and build scalable APIs using modern architecture patterns. We\'ll cover REST best practices, GraphQL fundamentals, authentication strategies, and performance optimization techniques.',
    scheduled_at: '2025-01-10T15:00:00Z',
    duration: 75,
    speaker_name: 'Emily Rodriguez',
    embed_url: 'https://player.vimeo.com/video/76979871',
    access_type: 'public',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    created_at: '2025-01-05T00:00:00Z',
    updated_at: '2025-01-05T00:00:00Z'
  },
  {
    id: 'webinar-4',
    title: 'Machine Learning for Web Developers',
    description: 'Discover how to integrate machine learning into your web applications. This premium workshop covers TensorFlow.js, model deployment, and practical ML use cases for modern web development.',
    scheduled_at: '2025-03-01T18:00:00Z',
    duration: 150,
    speaker_name: 'Dr. Alex Kumar',
    embed_url: 'https://player.vimeo.com/video/76979871',
    access_type: 'paid_only',
    created_by: '550e8400-e29b-41d4-a716-446655440001',
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-01-15T00:00:00Z'
  },
  {
    id: 'webinar-5',
    title: 'CSS Grid and Flexbox Mastery',
    description: 'Master modern CSS layout techniques with this hands-on workshop. Learn when to use Grid vs Flexbox, create responsive layouts, and build complex designs with confidence.',
    scheduled_at: '2025-01-25T13:00:00Z',
    duration: 60,
    speaker_name: 'Jessica Park',
    embed_url: 'https://player.vimeo.com/video/76979871',
    access_type: 'public',
    created_by: '550e8400-e29b-41d4-a716-446655440002',
    created_at: '2025-01-08T00:00:00Z',
    updated_at: '2025-01-08T00:00:00Z'
  },
  {
    id: 'webinar-6',
    title: 'DevOps for Frontend Developers',
    description: 'Learn essential DevOps practices tailored for frontend developers. Cover CI/CD pipelines, deployment strategies, monitoring, and performance optimization in production environments.',
    scheduled_at: '2025-01-05T10:00:00Z',
    duration: 105,
    speaker_name: 'Robert Kim',
    embed_url: 'https://player.vimeo.com/video/76979871',
    access_type: 'paid_only',
    created_by: '550e8400-e29b-41d4-a716-446655440002',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
]

// Mock current user - you can change this to test different user types
export const mockCurrentUser = {
  id: '550e8400-e29b-41d4-a716-446655440002', // paid user
  email: 'paid_user@example.com'
}

// Helper functions to simulate API calls
export const getMockWebinars = (filters?: {
  timeFilter?: 'upcoming' | 'past' | 'all'
  createdBy?: string
}): Promise<Webinar[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredWebinars = [...mockWebinars]
      
      if (filters?.createdBy) {
        filteredWebinars = filteredWebinars.filter(w => w.created_by === filters.createdBy)
      }
      
      if (filters?.timeFilter === 'upcoming') {
        filteredWebinars = filteredWebinars.filter(w => new Date(w.scheduled_at) > new Date())
      } else if (filters?.timeFilter === 'past') {
        filteredWebinars = filteredWebinars.filter(w => new Date(w.scheduled_at) < new Date())
      }
      
      // Sort by scheduled date (newest first)
      filteredWebinars.sort((a, b) => new Date(b.scheduled_at).getTime() - new Date(a.scheduled_at).getTime())
      
      resolve(filteredWebinars)
    }, 500) // Simulate network delay
  })
}

export const getMockWebinar = (id: string): Promise<Webinar | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const webinar = mockWebinars.find(w => w.id === id)
      resolve(webinar || null)
    }, 300)
  })
}

export const getMockProfile = (userId: string): Promise<Profile | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const profile = mockProfiles.find(p => p.id === userId)
      resolve(profile || null)
    }, 200)
  })
}
