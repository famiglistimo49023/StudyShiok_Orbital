import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

// 1. Structure a self-contained, hoisting-safe mock implementation
vi.mock('../supabase', () => {
  const chainable = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
  }

  return {
    supabase: {
      ...chainable,
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'dashboard-tester-nus' } },
          error: null
        })
      }
    }
  }
})

import Dashboard from '../components/Dashboard'
import { supabase } from '../supabase'

describe('Dashboard Component Metric & Sync Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('I can see the metrics calculate and bookmarked spot cards render accurately', async () => {
    const mockedSupabase = supabase as any

    // Query 1: bookmarks count mock data payload
    mockedSupabase.eq.mockResolvedValueOnce({
        data: [{ studyspot_id: 10 }, { studyspot_id: 20 }, { studyspot_id: 30 }],
        error: null
    })
    // Query 2: ratings list mock payload for average calculation
    // Individual numbers 5, 4, 4 yield an expected average value of: 4.3
    mockedSupabase.eq.mockResolvedValueOnce({
        data: [{ rating: 5 }, { rating: 4 }, { rating: 4 }],
        error: null
    })

    // Query 3: relational join payload matching your exact card schema layout
    mockedSupabase.eq.mockResolvedValueOnce({
  data: [
    {
      studyspot_id: 10,
      studyspots: {
        id: 10,
        name: 'Central Library Level 4',
        location: 'Kent Ridge Campus',
        rating: 4.2,
        busyness: 'Free'
      }
    }
  ],
  error: null
})

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )

    // --- Part A: Verify Static Headings & Grid Layout Elements ---
    expect(screen.getByText('Bookmarked Spots')).toBeInTheDocument()
    expect(screen.getByText('Ratings Given')).toBeInTheDocument()
    expect(screen.getByText('Avg Rating Given')).toBeInTheDocument()
    expect(screen.getByText('Your Bookmarked Spots')).toBeInTheDocument()

    // --- Part B: Verify State Updates Bind and Render to Counter Metrics ---
    
    // Isolate the Bookmarked Spots Card container
    const bookmarkCard = screen.getByText('Bookmarked Spots').closest('div')
    // Added await and findByText so it waits for the state to sync from Supabase
    expect(await within(bookmarkCard!).findByText('3')).toBeInTheDocument()
    
    // Isolate the Avg Rating Given Card container
    const ratingCard = screen.getByText('Avg Rating Given').closest('div')
    expect(await within(ratingCard!).findByText('4.3')).toBeInTheDocument()

    // --- Part C: Verify Custom Study Spot Details Populate Individual Cards ---
    expect(await screen.findByText('Central Library Level 4')).toBeInTheDocument()
    expect(screen.getByText('Kent Ridge Campus')).toBeInTheDocument()
    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText(/4.2 \/ 5/i)).toBeInTheDocument()
  })
})