import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

// 1. Mock React-Leaflet to avoid JSDOM engine positioning issues
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="mock-map-container">{children}</div>,
  TileLayer: () => <div data-testid="mock-tile-layer" />,
  Marker: ({ children, position }: any) => (
    <div data-testid="mock-marker" data-position={JSON.stringify(position)}>
      {children}
    </div>
  ),
  Popup: ({ children }: any) => <div data-testid="mock-popup">{children}</div>,
}))

// 2. Self-contained hoisting-safe mock wrapper for your Supabase map spots query
vi.mock('../supabase', () => {
  const chainable = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
  }
  return {
    supabase: chainable
  }
})

import Maps from '../components/Maps'
import { supabase } from '../supabase'

describe('Maps Component Geospatial Integrity Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('I can see the map wrapper load and render study spot layout marker coordinates', async () => {
    const mockedSupabase = supabase as any

    // Mock the coordinate rows payload returning from your studyspots table definition
    mockedSupabase.select.mockResolvedValueOnce({
      data: [
        { id: 401, name: 'UTown Stephen Riady Centre', location: 'University Town', x_coord: 1.303, y_coord: 103.774 },
        { id: 402, name: 'Science Library', location: 'S10 Block', x_coord: 1.296, y_coord: 103.780 }
      ],
      error: null
    })

    render(
      <MemoryRouter>
        <Maps />
      </MemoryRouter>
    )

    // Confirm core header elements render correctly
    expect(screen.getByRole('heading', { level: 1, name: 'Maps' })).toBeInTheDocument()

    // Verify the base leaf container element attaches cleanly onto the DOM tree
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument()

    // Wait for async state hook array translation mapping logic to execute markers
    await waitFor(() => {
      const markers = screen.getAllByTestId('mock-marker')
      expect(markers).toHaveLength(2)
    })

    // Assert that text tags within the markers successfully append information onto the page
    expect(screen.getByText('UTown Stephen Riady Centre')).toBeInTheDocument()
    expect(screen.getByText('Science Library')).toBeInTheDocument()
    
    expect(screen.getByText('University Town')).toBeInTheDocument()
    expect(screen.getByText('S10 Block')).toBeInTheDocument()
  })
})