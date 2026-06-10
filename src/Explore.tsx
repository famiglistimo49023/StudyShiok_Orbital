import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from './supabase'

type StudySpot = {
  id: number
  name: string
  campusArea: string
  rating: number
  busyness: string
}

function Explore() {
  const [spots, setSpots] = useState<StudySpot[]>([])
  const [search, setSearch] = useState('')

    const navigate = useNavigate()

  useEffect(() => {
    //hardcoded for now
    setSpots([
      { id: 1, name: 'ERC Level 2', campusArea: 'UTown', rating: 4.6, busyness: 'Moderately Busy' },
      { id: 2, name: 'Benches outside Central Library', campusArea: 'CLB', rating: 4.4, busyness: 'Free' },
      { id: 3, name: 'Benches beside Frontier', campusArea: 'Science', rating: 4.2, busyness: 'Busy' }
    ])
  }, [])

  const filteredSpots = spots.filter((spot) =>
    spot.name.toLowerCase().includes(search.toLowerCase())
  ) //search filter, no need to press enter to search

  const [username, setUsername] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        setUsername(data.user.user_metadata.username)
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="page">

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

      <h1 className="pageTitle">Welcome, {username}!</h1>

      <div className="searchBar">
        <input
          type="text"
          placeholder="Search study spots..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h4><i>Pictures for each spot to be added soon!</i></h4>

      {/* bc i want card layout */}
      <div className="cardGrid">
        {filteredSpots.map((spot) => (
          <div key={spot.id} className="card">
            <h3>{spot.name}</h3>
            <p>{spot.campusArea}</p>
            <div className="cardInfoRow">
                <span><b>Rating:</b> {spot.rating} / 5</span>
                <span><b>{spot.busyness}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Explore