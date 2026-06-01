import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate() //can change pages without reloading

  const handleRegister = () => {
    console.log('Register:', username, password)
    navigate('/explore')
  }

  return (
    <div className="loginPage">
      <div className="loginCard">
        <h2>Create Account</h2>

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
        {/* username password fields, add validation checks later */}

        <button className="loginButton" onClick={handleRegister}>
          Register
        </button> {/* register button, add API call later */}
      </div>
    </div>
  )
}

export default Register