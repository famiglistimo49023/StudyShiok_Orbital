import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { supabase } from '../supabase'

import placeholder from '../assets/placeholder.png' //placeholder image (very obvious)

import ProgressBar from '../assets/ProgressBar' //progress bar component

type StudySpot = { //creates object of studyspot
  id: number
  name: string
  location: string
  rating: number
  busyness: string

  wifi_level: number
  ambience_level: number
  food_available: boolean

  //ambience rating
  quietness: number
  lighting: number
  cleanliness: number
  seatingComfort: number

  //amenities rating
  power_outlets: boolean
  air_conditioning: boolean
  food_nearby: boolean
  group_friendly: boolean
  open_late: boolean

  //then overall is calculated by averaging

  x_coord: number
  y_coord: number

  images: string[] //take note i dont need a images column in my database to have this object, dont get confused!!
} 

function Explore() {
  const [spots, setSpots] = useState<StudySpot[]>([]) //initialstate should be ntg 
  const [search, setSearch] = useState('')
  //without useState, component wont rerender after fetching data, so spots will be empty array and nothing will show up on explore page

  const navigate = useNavigate() //the function that allows me to move between webpages

  const [displayName, setDisplayName] = useState("")


  useEffect(() => { //useEffect runs when the component appears first
    const fetchSpots = async () => {

      const { data, error } = await supabase
        .from("studyspots")
        .select("*") //sql query to get info about studyspots

      const { data: imageRows, error: imgError } = await supabase
        .from("studyspot_images")
        .select("*")
        .order("display_order") //sql query to get info about images (in order)

      if (error || imgError) { //checking for both errors
        console.error(error || imgError)
        return
      }

      const spotsWithImages = (data ?? []).map((spot) => {

        const images = (imageRows ?? [])
          .filter((img) => img.studyspot_id === spot.id)
          .map((img) =>
            supabase.storage
              .from("studyspot-img")
              .getPublicUrl(img.img_path)
              .data.publicUrl
          )

        return {
          ...spot,
          images,
        }

      })

      setSpots(spotsWithImages)

    }

    fetchSpots()


    const fetchUser = async () => {

      const { data: authData } = await supabase.auth.getUser()

      if (!authData.user) return

      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", authData.user.id)
        .single()

      if (data) {
        setDisplayName(data.display_name)
      }
    }

    fetchUser()

    
  }, [])


  //depending on the selected spot, modal can show diff info
  const [selectedSpot, setSelectedSpot] = useState<StudySpot | null>(null)

  //for images (since its a seperate table)
  //const [selectedSpotImages, setSelectedSpotImages] = useState<string[]>([])
  //const [currentImage, setCurrentImage] = useState(0)

  

  const openSpot = (spot: StudySpot) => {
    //when more images are added, this should take the first in stack
      setSelectedSpot(spot)
  }

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

  const wifiStars = (wifi: number) => {
    switch (wifi) {
      case 1:
        return 1     // red
      case 2:
        return 3     // yellow
      case 3:
        return 5     // green
      default:
        return 5
    }
  }

  const ambienceStars = (spot: StudySpot) => {
    return (
      (
        spot.quietness +
        spot.lighting +
        spot.cleanliness +
        spot.seatingComfort
      ) / 4
    )
  }

  const amenitiesStars = (spot: StudySpot) => {
    return [
      spot.power_outlets,
      spot.air_conditioning,
      spot.food_nearby,
      spot.group_friendly,
      spot.open_late,
    ].filter(Boolean).length
  }

  const overallStars = (spot: StudySpot) => {
    const wifi = wifiStars(spot.wifi_level)
    const ambience = ambienceStars(spot)
    const amenities = amenitiesStars(spot)

    return (wifi + ambience + amenities) / 3
  }


  return ( //frontend code on navbar
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
        Welcome, {displayName || 'User'}!  {/* all that code for this one line */}
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
               onClick={() => openSpot(spot)}>
              
            <img
              src={spot.images[0] || placeholder}
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
            {/* 3 is green, 2 is yellow, 1 red */}
              📶
            </div>

            {/* Ambience: green if 3, yellow if 2, red if 1 */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl
              ${spot.ambience_level >= 3 ? 'bg-green-500' : spot.ambience_level === 2 ? 'bg-yellow-400' : 'bg-red-500'}`}
            >
              🔇
            </div>

            {/* Food: green if available, red if no */}
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

            <img
              src={selectedSpot.images[0] || placeholder}
              alt={selectedSpot.name}
              className="w-full h-48 object-cover"
            />

            <h2 className="text-xl font-semibold text-gray-900">{selectedSpot.name}</h2>
            <p className="mt-2 text-gray-600">{selectedSpot.location}</p>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <ProgressBar
                label="Wi-Fi"
                value={wifiStars(selectedSpot.wifi_level)}
              />

              <ProgressBar
                label="Ambience"
                value={ambienceStars(selectedSpot)}
              />

              <ProgressBar
                label="Amenities"
                value={amenitiesStars(selectedSpot)}
              />

              <ProgressBar
                label="Overall"
                value={overallStars(selectedSpot)}
              />

            </div>

            {/* <p className="mt-4 text-gray-600">
              Busyness: {selectedSpot.busyness}
            </p> */}
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
                Minimum Rating
              </label>

              <div className="flex justify-center items-center gap-1">
                {[1,2,3,4,5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star)}
                    className="text-4xl transition hover:scale-110"
                  >
                    <span
                      className={
                        star <= minRating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  </button>
                ))}

                <button
                  onClick={() => setMinRating(0)}
                  className="ml-4 rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                >
                  Clear
                </button>
              </div>
            </div>
            
            {/* Busyness */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Busyness
              </label>

              <div className="flex gap-2 flex-wrap">
                {["Any", "Free", "Moderately Busy", "Busy"].map(
                  (label, index) => (
                    <button
                      key={label}
                      onClick={() => setBusynessFilter(index)}
                      className={`rounded-lg px-4 py-2 transition
                        ${
                          busynessFilter === index
                            ? "bg-[#ff9e00] text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>  


            {/* Wifi */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                WiFi Level
              </label>

              <div className="flex gap-2">
                {[
                  { icon: "Any", value: 0 },
                  { icon: "📶", value: 1 },
                  { icon: "📶📶", value: 2 },
                  { icon: "📶📶📶", value: 3 },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setWifiLevelFilter(option.value)}
                    className={`rounded-lg px-4 py-2 transition
                      ${
                        wifiLevelFilter === option.value
                          ? "bg-[#ff9e00] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {option.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambience */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Ambience Level
              </label>

              <div className="flex gap-2">
                {[
                  { label: "Any", value: 0 },
                  { label: "🔇", value: 1 },
                  { label: "🔉", value: 2 },
                  { label: "🔊", value: 3 },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAmbienceLevelFilter(option.value)}
                    className={`rounded-lg px-4 py-2 transition
                      ${
                        ambienceLevelFilter === option.value
                          ? "bg-[#ff9e00] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Food */}
            <div className="mb-6">
              <label className="mb-2 block font-medium">
                Food Options
              </label>

              <div className="flex gap-2">
                {["Any", "Has Food", "No Food"].map((label, index) => (
                  <button
                    key={label}
                    onClick={() => setFoodFilter(index)}
                    className={`rounded-lg px-4 py-2 transition
                      ${
                        foodFilter === index
                          ? "bg-[#ff9e00] text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
