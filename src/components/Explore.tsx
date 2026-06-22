import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '../supabase'

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
    const fetchProfile = async () => {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', authData.user.id)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else {
        setUsername(data.display_name)
      }
    }

    fetchProfile()
  }, [])

  return (
    <div className="bg-[#2D4466] min-h-screen p-8 text-black">

      <div className="flex items-center justify-between border-b border-gray-200 px-8 py-4">
        <div className="flex gap-8 text-lg font-medium text-white">
          <Link
            to="/explore"
            className="transition-colors hover:text-[#bfdbf7]"
          >
          Explore
          </Link>

          <Link
            to="/maps"
            className="transition-colors hover:text-[#bfdbf7]"
          >
            Maps
          </Link>

          <Link
            to="/dashboard"
            className="transition-colors hover:text-[#bfdbf7]"
          >
            Dashboard
          </Link>

          <Link
            to="/suggest"
            className="transition-colors hover:text-[#bfdbf7]"
          >
            Suggest a Spot
          </Link>
        </div>

        

        <button
          className="rounded-lg bg-[#ff9e00] px-4 py-2 font-medium text-white transition hover:bg-[#ffb703]"
          onClick={() => navigate('/')}
        >
          Log Out
        </button>
      </div>

      <h1 className="mt-8 text-4xl font-bold tracking-tight text-[#ffb703]">
        Welcome, {username}!
      </h1>

      <p className="mt-2 text-gray-200">
        Study spots near you, for you.
      </p>

      <div className="mt-8 max-w-lg">
        <div className="relative">
          
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Search study spots..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-24 
            shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg 
            bg-[#ff9e00] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#ffb703]"
          >
            Search
          </button>

        </div>
      </div>

      <h4 className="text-gray-200">
        <i>Pictures for each spot to be added soon!</i>
      </h4>

      {/* bc i want card layout */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSpots.map((spot) => (
          <div key={spot.id} className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900">{spot.name}</h3>
            <p className="text-gray-600">{spot.location}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                <span><b>Rating:</b> {spot.rating} / 5</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800"><b>{spot.busyness}</b></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Explore