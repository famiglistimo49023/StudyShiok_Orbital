import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// 1. Stub the crypto module cleanly for JSDOM
vi.stubGlobal('crypto', {
  randomUUID: () => 'mock-uuid-1234'
})

// 2. Mock React-Leaflet safely using microtasks to avoid render loops
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="mock-map-container">{children}</div>,
  TileLayer: () => <div data-testid="mock-tile-layer" />,
  useMapEvents: (events: any) => {
    // Push the state update to the microtask queue so it doesn't leak or block renders
    Promise.resolve().then(() => {
      events.click({ latlng: { lat: 1.303, lng: 103.774 } })
    })
    return null
  },
  Marker: ({ children }: any) => <div data-testid="mock-marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="mock-popup">{children}</div>,
}))

// 3. Build a chainable mock factory
vi.mock('../supabase', () => {
  const chainable = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    insert: vi.fn() // We leave insert blank here to dynamically sequence it below
  }

  return {
    supabase: {
      ...chainable,
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'nus-suggest-tester' } },
          error: null
        })
      },
      storage: {
        from: vi.fn().mockReturnThis(),
        upload: vi.fn().mockResolvedValue({ data: {}, error: null })
      }
    }
  }
})

import Suggest from '../components/SuggestSpot'
import { supabase } from '../supabase'

describe('SuggestSpot Form Submission Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('I am unable to submit the form if any field validation is incomplete', () => {
    render(
      <MemoryRouter>
        <Suggest />
      </MemoryRouter>
    )
    const submitBtn = screen.getByRole('button', { name: /Submit Study Spot/i })
    expect(submitBtn).toBeDisabled()
  })

  test('I can input details, upload a file, and successfully submit a study spot to Supabase', async () => {
    const user = userEvent.setup()
    // --- SEQUENTIAL DATABASE MOCKING ---
    const mockedSupabase = supabase as any

    // 1st Database Call: studyspots
    // We explicitly return a mock object containing .select() -> .single() so it cannot get lost
    mockedSupabase.insert.mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        single: vi.fn().mockResolvedValueOnce({ 
          data: { id: 9999 }, 
          error: null 
        })
      })
    })
    
    // 2nd Database Call: studyspot_images
    // This call has no chain in your component, so we resolve the Promise directly!
    mockedSupabase.insert.mockResolvedValueOnce({ error: null })

    render(
      <MemoryRouter>
        <Suggest />
      </MemoryRouter>
    )

    // Populate text fields
    await user.type(screen.getByPlaceholderText('Name of Study Spot'), 'Utown Study Room 3')
    await user.type(screen.getByPlaceholderText('Location'), 'Utown Education Resource Centre')

    // Simulate clicking star ratings
    const stars = screen.getAllByText('★')
    await user.click(stars[0])  // Quietness
    await user.click(stars[5])  // Lighting
    await user.click(stars[10]) // Cleanliness
    await user.click(stars[15]) // Seating Comfort
    await user.click(stars[20]) // Overall Rating

    // Add an image attachment
    const fakeFile = new File(['mock-image-data'], 'sample-spot.jpg', { type: 'image/jpeg' })
    const fileInputElement = screen.getByLabelText(/Click to upload a photo/i)
    await user.upload(fileInputElement, fakeFile)

    const submitBtn = screen.getByRole('button', { name: /Submit Study Spot/i })
    await user.click(submitBtn)

    // Verify success banner appears
    expect(await screen.findByText('Study spot suggestion submitted successfully!')).toBeInTheDocument()

    // 🛑 CRITICAL LEAK FIX: Wait 1 second before ending the test so the component's 
    // internal `setTimeout` navigation finishes firing cleanly!
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })
})