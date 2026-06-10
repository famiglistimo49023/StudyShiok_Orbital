import { useState } from 'react'
import { supabase } from './supabase'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import logo from './assets/logo.png'
import './App.css'

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
    <div className="loginPage">
      <div className="loginCard">
        <img src={logo} className="logo" alt="logo" />

        <h2>Welcome!</h2>
        <p>Login to your account</p>

        {error && <p className="error">{error}</p>} 

        <div className="inputContainer">
          <input
            className="inputField"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="inputField"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="loginButton" onClick={handleLogin}>
          Login
        </button>

        <Link to="/register" className="registerButton">
          New Here? Register Now!
        </Link>
      </div>
    </div>
  )
}

export default Login