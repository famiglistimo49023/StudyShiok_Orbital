import { useState } from 'react'

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

import logo from './assets/logo.png'
import './App.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const navigate = useNavigate()

  const handleLogin = () => {
    console.log(username, password)
    navigate('/explore') 
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <img src={logo} className="logo" alt="logo" />

        <h2>Welcome!</h2>
        <p>Login to your account</p>

        <input
          className="inputField"
          type="text"
          placeholder="Username"
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

        <button className="loginButton" onClick={handleLogin}>
          Login
        </button>

        <Link to="/register" className="registerLink">
          New Here? Register Now!
        </Link>
      </div>
    </div>
  )
}

export default Login