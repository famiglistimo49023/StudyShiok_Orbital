
import { Link, useNavigate } from 'react-router-dom'

const Maps: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="page">

      {/* NAVBAR */}
      <div className="navbar">
        <div className="navbarLinks">
          <Link to="/explore">Explore</Link>
          <Link to="/maps">Maps</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/suggest">Suggest a Spot</Link>
        </div>

        <button
          className="logoutButton"
          onClick={() => navigate('/')}
        >
          Log Out
        </button>
      </div>

      {/* PAGE CONTENT */}
      <h2>google maps pro max</h2>
      <p>Welcome to the Maps! Unfortunately, the maps feature is not yet implemented.</p>


    </div>
  )
}

export default Maps