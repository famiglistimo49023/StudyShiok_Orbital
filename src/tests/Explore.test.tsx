import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

// 1. Fully inline all chainable methods within the factory to bypass hoisting traps
vi.mock('../supabase', () => {
  const chainable = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }

  return {
    supabase: {
      ...chainable,
      storage: {
        from: vi.fn().mockReturnThis(),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'mock-img-url.png' } })
      },
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'nus-student-123' } },
          error: null
        })
      }
    }
  }
})

// 2. Safely import components and the mocked client instance
import Explore from '../components/Explore'
import { supabase } from '../supabase'

describe('Explore Component Granular Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    const mockedSupabase = supabase as any
    // Set up the exact same mock data sequence for each test run
    mockedSupabase.select.mockResolvedValueOnce({
      data: [
        { id: 101, name: 'UTown Mac Commons', location: 'UTown', rating: 4, busyness: 'Busy', wifi_level: 3, ambience_level: 2, food_available: true },
        { id: 102, name: 'Central Library', location: 'Kent Ridge', rating: 5, busyness: 'Free', wifi_level: 2, ambience_level: 3, food_available: false }
      ],
      error: null
    })
    mockedSupabase.order.mockResolvedValueOnce({
      data: [
        { studyspot_id: 101, img_path: 'mac-commons.jpg', display_order: 1 },
        { studyspot_id: 102, img_path: 'cl.jpg', display_order: 1 }
      ],
      error: null
    })
    mockedSupabase.single.mockResolvedValueOnce({
      data: { display_name: 'Alex' }
    })
  })

  test('I can see the customized user welcome banner', async () => {
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    )
    expect(await screen.findByText('Welcome, Alex!')).toBeInTheDocument()
    expect(screen.getByText('Study spots near you, for you.')).toBeInTheDocument()
  })

  test('I can see the search input field interface element', async () => {
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    )
    expect(screen.getByPlaceholderText('Search study spots...')).toBeInTheDocument()
  })

  test('I can see all study spot info cards fetched from the database', async () => {
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    )
    expect(await screen.findByText('UTown Mac Commons')).toBeInTheDocument()
    expect(await screen.findByText('Central Library')).toBeInTheDocument()
    expect(screen.getByText('UTown')).toBeInTheDocument()
    expect(screen.getByText('Kent Ridge')).toBeInTheDocument()
  })
})