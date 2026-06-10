import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from './supabase'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  
  const [error, setError] = useState('')

  const navigate = useNavigate() //can change pages without reloading

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username
        }
      }
    })

    if (error) {
      console.error('Error registering:', error)
      setError(error.message)
    } else {
      navigate('/explore')
    }
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2>Create Account</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleRegister}>

          <input
            className="inputField"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="inputField"
            type="text"
            placeholder="Display Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="inputField"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* username password fields, add validation checks later */}

          <button className="loginButton" type="submit">
            Register
          </button> {/* register button, need to add API calls later */}
        </form>
      </div>
    </div>
  )
}

export default Register