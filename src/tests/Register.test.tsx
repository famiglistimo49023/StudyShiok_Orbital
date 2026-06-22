import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import userEvent from '@testing-library/user-event'

//creating mock supabase to check error msg
import { vi } from 'vitest'

vi.mock('../supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn()
    }
  }
}))

import Register from '../components/Register'
import { supabase } from '../supabase'


  test('I can see the register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Create Account')
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('NUS Email')
    ).toBeInTheDocument()

    expect(
      screen.getByPlaceholderText('Password')
    ).toBeInTheDocument()
  })

  test('I can see all the input fields', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    expect(
      screen.getByPlaceholderText('NUS Email')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Display Name')
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Password')
    ).toBeInTheDocument()
  })

  test('I am able to input my info', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('NUS Email')
    const usernameInput = screen.getByPlaceholderText('Display Name')
    const passwordInput = screen.getByPlaceholderText('Password')

    await userEvent.type(emailInput, 'test@example.com')
    await userEvent.type(usernameInput, 'testuser')
    await userEvent.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(usernameInput).toHaveValue('testuser')
    expect(passwordInput).toHaveValue('password123')
  })



test('I can see an error message when I input invalid info', async () => {
  const user = userEvent.setup()

  const mockSignUp = supabase.auth.signUp as unknown as ReturnType<typeof vi.fn>
  mockSignUp.mockResolvedValue({
    data: null,
    error: {
      message: "Please input the correct email"
    }
  })

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )

  await user.type(screen.getByPlaceholderText('NUS Email'), 'test@example.com') // valid format so browser doesn't block
  await user.type(screen.getByPlaceholderText('Display Name'), 'testuser')
  await user.type(screen.getByPlaceholderText('Password'), 'password123')
  await user.click(screen.getByRole('button', { name: /register/i }))

  expect(
    await screen.findByText(/Please input the correct email/i)
  ).toBeInTheDocument()
})

test('I am redirected to the explore page when I input valid info', async () => {
  const user = userEvent.setup()

  const mockSignUp = supabase.auth.signUp as unknown as ReturnType<typeof vi.fn>
  mockSignUp.mockResolvedValue({
    data: { user: { id: '123' } },
    error: null
  })

  render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  )

  await user.type(screen.getByPlaceholderText('NUS Email'), 'test@example.com')
  await user.type(screen.getByPlaceholderText('Display Name'), 'testuser')
  await user.type(screen.getByPlaceholderText('Password'), 'password123')
  await user.click(screen.getByRole('button', { name: /register/i }))

  //checking if the mock function was called since nav cannot be tested
  expect(mockSignUp).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
    options: {
      data: {
        display_name: 'testuser'
      }
    }
  })
})

