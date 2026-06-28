import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '../supabase'

import placeholder from '../assets/placeholder.png'

type StudySpot = {
  id: number
  name: string
  location: string
  rating: number
  busyness: string
  wifi_level: number
  ambience_level: number
  food_available: boolean

  x_coord: number
  y_coord: number
} //creates object of studyspot

function Explore() {
  const [spots, setSpots] = useState<StudySpot[]>([]) //initialstate should be ntg 
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
        setSpots(data ?? []) //action to update state var
      }
    }

    fetchSpots()
  }, [])

  // const searchedSpots = spots.filter((spot) =>
  //   spot.name.toLowerCase().includes(search.toLowerCase())
  // ) //search filter, no need to press enter to search

  //depending on the selected spot, modal can show diff info
  const [selectedSpot, setSelectedSpot] = useState<StudySpot | null>(null)

  const [showFilters, setShowFilters] = useState(false)

  const [minRating, setMinRating] = useState(0)
  const [busynessFilter, setBusynessFilter] = useState(0)
  const [wifiLevelFilter, setWifiLevelFilter] = useState(0)
  const [ambienceLevelFilter, setAmbienceLevelFilter] = useState(0)
  const [foodFilter, setFoodFilter] = useState(0)

  const filteredSpots = spots.filter((spot) => {

    const matchesRating =
      spot.rating >= minRating

    const matchesBusyness =
      busynessFilter === 0 ||
      (busynessFilter === 1 &&
        spot.busyness === 'Free') ||
      (busynessFilter === 2 &&
        spot.busyness === 'Moderately Busy') ||
      (busynessFilter === 3 &&
        spot.busyness === 'Busy')

    const matchesWifi =
      wifiLevelFilter === 0 ||
      spot.wifi_level >= wifiLevelFilter

    const matchesAmbience =
      ambienceLevelFilter === 0 ||
      spot.ambience_level >= ambienceLevelFilter

    const matchesFood =
      foodFilter === 0 ||
      (foodFilter === 1 &&
        spot.food_available) ||
      (foodFilter === 2 &&
        !spot.food_available)

    const matchesSearch =
      spot.name.toLowerCase().includes(
        search.toLowerCase()
    )

    return (matchesSearch && matchesRating && matchesBusyness && matchesWifi && matchesAmbience && matchesFood)
  })

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
        Welcome to Explore
      </h1>

      <p className="mt-2 text-gray-200">
        Study spots near you, for you.
      </p>

      <div className="mt-8 max-w-lg flex gap-2 items-start">
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

          {/* <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg 
            bg-[#ff9e00] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#ffb703]"
          >
            Search
          </button> */}

        </div>

        <button
          onClick={() => setShowFilters(true)}
          className="right-2 top-1/2
          rounded-lg bg-[#ff9e00] px-5 py-3 text-white hover:bg-[#ffb703]"
        >
          Filter
        </button>

      </div>

      <p className="mt-2 text-sm text-gray-400">
        {filteredSpots.length} study spots found
      </p>

      {/*card layout */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filteredSpots.map((spot) => (

          <div key={spot.id} 
               className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg cursor-pointer" 
               onClick={() => setSelectedSpot(spot)}>
              
            <img
              src={placeholder}
              alt={spot.name}
              className="w-full h-48 object-cover"
            />


            {/* <div className="p-4"> */}

              {/* Name + Rating row */}
              <div className="flex items-center justify-between">
                <h3 className="mt-2 text-lg font-semibold text-gray-900">{spot.name}</h3>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`text-xl ${star <= Math.round(spot.rating) ? 'text-yellow-600' : 'text-gray-200'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>

            <p className="text-md text-gray-600">{spot.location}</p>

   {/* Icons + Busyness row */}
        <div className="mt-3 flex items-center justify-between">

          {/* WiFi, Ambience, Food icons */}
          <div className="flex gap-2">

            {/* wifi icon */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl
              ${spot.wifi_level >= 3 ? 'bg-green-500' 
                : spot.wifi_level === 2 ? 'bg-yellow-400' 
                : 'bg-red-500'}`}> 
            {/* 3 -> green, 2 -> yellow, 1 -> red */}
              📶
            </div>

            {/* Ambience — green if >= 3, yellow if 2, red if <= 1 */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl
              ${spot.ambience_level >= 3 ? 'bg-green-500' : spot.ambience_level === 2 ? 'bg-yellow-400' : 'bg-red-500'}`}
            >
              🔇
            </div>

            {/* Food — green if available, red if not */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl
              ${spot.food_available ? 'bg-green-500' : 'bg-red-500'}`}
            >
              🍴
            </div>

          </div>

          {/* Busyness */}
          <span className="rounded-full bg-blue-100 px-3 py-1 font-small text-blue-800">{spot.busyness}</span>

        </div>
          </div>
        ))}
      </div>

    
      {selectedSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900">{selectedSpot.name}</h2>
            <p className="mt-2 text-gray-600">{selectedSpot.location}</p>
            <p className="mt-2 text-gray-600">Rating: {selectedSpot.rating}</p>
            <p className="mt-2 text-gray-600">Busyness: {selectedSpot.busyness}</p>
            <p className="mt-2 text-gray-600">WiFi Level: {selectedSpot.wifi_level}</p>
            <p className="mt-2 text-gray-600">Ambience Level: {selectedSpot.ambience_level}</p>
            <p className="mt-2 text-gray-600">Food Available: {selectedSpot.food_available ? 'Yes' : 'No'}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="rounded-lg bg-[#ff9e00] px-4 py-2 font-medium text-white transition hover:bg-[#ffb703]"
                onClick={() => setSelectedSpot(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-[500px] rounded-xl bg-white p-6 shadow-xl">

            <h2 className="mb-6 text-2xl font-bold">
              Filters
            </h2>

            {/* Rating */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Minimum Rating: {minRating}
              </label>

              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={minRating}
                onChange={(e) =>
                  setMinRating(Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            {/* Busyness */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Busyness:
                {' '}
                {
                  ['Any', 'Free', 'Moderately Busy', 'Busy']
                    [busynessFilter]
                }
              </label>

              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={busynessFilter}
                onChange={(e) =>
                  setBusynessFilter(Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            {/* Wifi */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Minimum Wifi Level:
                {' '}
                {wifiLevelFilter}
              </label>

              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={wifiLevelFilter}
                onChange={(e) =>
                  setWifiLevelFilter(Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            {/* Ambience */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Minimum Ambience Level:
                {' '}
                {ambienceLevelFilter}
              </label>

              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={ambienceLevelFilter}
                onChange={(e) =>
                  setAmbienceLevelFilter(
                    Number(e.target.value)
                  )
                }
                className="w-full"
              />
            </div>

            {/* Food */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Food Available:
                {' '}
                {
                  ['Any', 'Yes', 'No']
                    [foodFilter]
                }
              </label>

              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={foodFilter}
                onChange={(e) =>
                  setFoodFilter(Number(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowFilters(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowFilters(false)}
                className="rounded-lg bg-[#ff9e00] px-4 py-2 text-white hover:bg-[#ffb703]"
              >
                Apply
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  )
}

export default Explore
