import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

// 1. Mock the Supabase Client specifically for Login Auth methods
vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    }
  }
}))

import Login from '../components/Login' 
import { supabase } from '../supabase'

describe('Login Component Tests', () => {
  
  test('I can see the login form and all input fields', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    // Verify header/title presence
    expect(screen.getByText('Welcome!')).toBeInTheDocument()
    expect(screen.getByText('Log in to your account')).toBeInTheDocument()

    // Verify input fields exist by their placeholder texts
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    
    // Verify action button exists
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  test('I am able to input credentials into the email and password fields', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('Email')
    const passwordInput = screen.getByPlaceholderText('Password')

    // Simulate typing interactions
    await userEvent.type(emailInput, 'student@u.nus.edu')
    await userEvent.type(passwordInput, 'validPassword123')

    // Confirm local state matches typing input
    expect(emailInput).toHaveValue('student@u.nus.edu')
    expect(passwordInput).toHaveValue('validPassword123')
  })

  test('I see a clear error message when Supabase authentication fails', async () => {
    const user = userEvent.setup()

    // Typecast the mocked function to attach vitest mock values
    const mockSignIn = supabase.auth.signInWithPassword as unknown as ReturnType<typeof vi.fn>
    mockSignIn.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" }
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Email'), 'wrong@u.nus.edu')
    await user.type(screen.getByPlaceholderText('Password'), 'wrongPassword')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    // Await async rendering of the error alert message
    expect(
      await screen.findByText(/Invalid login credentials/i)
    ).toBeInTheDocument()
  })

  test('I correctly fire the Supabase signIn method upon valid submission', async () => {
    const user = userEvent.setup()

    const mockSignIn = supabase.auth.signInWithPassword as unknown as ReturnType<typeof vi.fn>
    mockSignIn.mockResolvedValue({
      data: { user: { id: 'nus-user-999' }, session: {} },
      error: null
    })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    await user.type(screen.getByPlaceholderText('Email'), 'orbital@u.nus.edu')
    await user.type(screen.getByPlaceholderText('Password'), 'perfectScore123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    // Check if the mock function was triggered with your payload parameters
    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'orbital@u.nus.edu',
      password: 'perfectScore123'
    })
  })
})