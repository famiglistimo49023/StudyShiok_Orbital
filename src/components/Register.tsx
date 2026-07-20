import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { supabase } from '../supabase'
import logo from '../assets/images/logo_blank.png'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: username
        }
      }
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2D4466] px-6">
      <div className="w-full max-w-sm rounded-lg bg-[#03233b] p-6 ring-2 ring-[#ff9e00] shadow-lg shadow-[#ff9e00]/50">

        <img
          src={logo}
          className="mx-auto h-20 w-auto"
          alt="StudyShiok Logo"
        />

        <h2 className="mt-2 text-center text-2xl font-bold text-[#ff9e00]">
          Create Account
        </h2>

        <p className="text-center text-sm text-gray-400">
          Join StudyShiok today!
        </p>

        {error && (
          <p className="mt-4 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleRegister} className="mt-6 space-y-4">

          <input
            className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#447cd1]"
            type="email"
            placeholder="NUS Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#447cd1]"
            type="text"
            placeholder="Display Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#447cd1]"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full rounded-md bg-[#065088] py-2 font-semibold text-white transition hover:bg-[#2a6f97]"
            type="submit"
          >
            Register
          </button>
        </form>

        <Link
          to="/"
          className="mt-4 block text-center text-sm text-[#ff9e00] hover:text-[#ffb703]"
        >
          Already have an account? Login
        </Link>

      </div>
    </div>
  )
}

export default Register