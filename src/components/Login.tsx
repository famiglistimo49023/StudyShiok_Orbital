import { useState } from 'react'
import { supabase } from '../supabase'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import logo from '../assets/logo_blank.png'

import '../App.css'

function Login() {
  const [email, setEmail] = useState('') //easier to rerender component after error message
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')


  const navigate = useNavigate()

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    })

    if (error) {
      console.error('Error logging in:', error)
      setError(error.message) 
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2D4466] px-6">
      <div className="w-full max-w-sm rounded-lg bg-[#03233b] p-6 ring-2 ring-[#ff9e00] shadow-lg shadow-[#ff9e00]/50">
      
        <img src={logo} className="mx-auto h-20 w-auto" alt="logo" />

        <h2 className="mt-2 text-center text-2xl font-bold text-[#ff9e00]">
          Welcome!
        </h2>

        <p className="text-center text-sm text-gray-400">
          Log in to your account
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <input
            className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#447cd1]"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#447cd1]"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="mt-6 w-full rounded-md bg-[#065088] py-2 font-semibold text-white hover:bg-[#2a6f97]"
          onClick={handleLogin}
        >
          Login
        </button>

        <Link
          to="/register"
          className="mt-4 block text-center text-sm text-[#ff9e00] hover:text-[#ffb703]"
        >
          New Here? Register Now!
        </Link>
      </div>
    </div>
  )
}

export default Login