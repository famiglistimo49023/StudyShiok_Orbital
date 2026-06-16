import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from './supabase'

type StudySpot = {
  id: number
  name: string
  location: string
  rating: number
  busyness: string
} //creates object of studyspot

function Explore() {
  const [spots, setSpots] = useState<StudySpot[]>([]) //initialstate should be ntg (??)
  const [search, setSearch] = useState('')
  //without useState, component wont rerender after fetching data, so spots will be empty array and nothing will show up on explore page

    const navigate = useNavigate() //the function that allows me to move between webpages

  useEffect(() => { //useEffect runs when the component appears first
    const fetchSpots = async () => {
      const { data, error } = await supabase
        .from('studyspots')
        .select('*') //sql query

      if (error) {
        console.error('Error fetching spots:', error) //might fail bc network error
      } else {
        setSpots(data) //action to update state var
      }
    }

    fetchSpots()
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
            <p>{spot.location}</p>
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