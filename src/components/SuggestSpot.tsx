import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents
} from 'react-leaflet'
import { supabase } from '../supabase'

type StarRatingProps = {
  rating: number
  setRating: (val: number) => void
}

const StarRating = ({ rating, setRating }: StarRatingProps) => {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-3xl transition ${
            (hover || rating) >= star
              ? 'text-[#ff9e00]'
              : 'text-gray-300'
          }`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  )
}

type LocationPickerProps = {
  setXCoord: (val: number) => void
  setYCoord: (val: number) => void
}

const LocationPicker = ({ setXCoord, setYCoord }: LocationPickerProps) => {
  useMapEvents({
    click(e) {
      setXCoord(e.latlng.lat)
      setYCoord(e.latlng.lng)
    }
  })

  return null
}

const Suggest: React.FC = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  const [wifiLevel, setWifiLevel] = useState(0)
  const [ambienceLevel, setAmbienceLevel] = useState(0)
  const [foodAvailable, setFoodAvailable] = useState('')

  const [rating, setRating] = useState(0)

  const [xCoord, setXCoord] = useState<number | null>(null)
  const [yCoord, setYCoord] = useState<number | null>(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formComplete =
    name.trim() !== '' &&
    location.trim() !== '' &&
    wifiLevel !== 0 &&
    ambienceLevel !== 0 &&
    foodAvailable !== '' &&
    rating !== 0 &&
    xCoord !== null &&
    yCoord !== null

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!formComplete) {
      setError('Please complete all fields before submitting.')
      return
    }

    setIsSubmitting(true)

    const { data: authData, error: authError } = await supabase.auth.getUser()

    if (authError || !authData.user) {
      setError('You must be logged in to submit a study spot.')
      setIsSubmitting(false)
      return
    }

  const { error : insertError } = await supabase
    .from('studyspots')
    .insert({
      name,
      location,
      rating,
      wifi_level: wifiLevel,
      ambience_level: ambienceLevel,
      food_available: foodAvailable === 'yes',
      x_coord: xCoord,
      y_coord: yCoord,

      //default values here
      busyness: 'Free'
  })

    if (insertError) {
      console.error('Error submitting study spot:', insertError)
      setError('Unable to submit study spot. Please try again.')
      setIsSubmitting(false)
      return
    }

    setSuccess('Study spot suggestion submitted successfully!')

    setTimeout(() => {
      navigate('/explore')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#2D4466] p-8 text-black">
      <div className="flex items-center justify-between border-b border-gray-200 px-8 py-4">
        <div className="flex gap-8 text-lg font-medium text-white">
          <Link to="/explore" className="transition-colors hover:text-[#bfdbf7]">
            Explore
          </Link>

          <Link to="/maps" className="transition-colors hover:text-[#bfdbf7]">
            Maps
          </Link>

          <Link to="/dashboard" className="transition-colors hover:text-[#bfdbf7]">
            Dashboard
          </Link>

          <Link to="/suggest" className="transition-colors hover:text-[#bfdbf7]">
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
        Suggest a Study Spot
      </h1>

      <p className="mt-2 text-gray-200">
        Fill in the study spot details and click the map to select its location.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="space-y-5">
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Name of Study Spot"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                WiFi Level: {wifiLevel || 'Not selected'}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={wifiLevel}
                onChange={(e) => setWifiLevel(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Ambience Level: {ambienceLevel || 'Not selected'}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="1"
                value={ambienceLevel}
                onChange={(e) => setAmbienceLevel(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-800">
                Food Availability
              </label>

              <select
                value={foodAvailable}
                onChange={(e) => setFoodAvailable(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select an option</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            <div>
              <p className="mb-2 font-medium text-gray-800">
                Rating
              </p>
              <StarRating rating={rating} setRating={setRating} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                className="rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                placeholder="X Coordinate"
                value={xCoord ?? ''}
                readOnly
              />

              <input
                className="rounded-xl border border-gray-300 px-4 py-3 shadow-sm"
                placeholder="Y Coordinate"
                value={yCoord ?? ''}
                readOnly
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">
                {success}
              </p>
            )}

            <button
              className={`w-full rounded-lg px-4 py-3 font-medium text-white transition ${
                formComplete && !isSubmitting
                  ? 'bg-[#ff9e00] hover:bg-[#ffb703]'
                  : 'cursor-not-allowed bg-gray-400'
              }`}
              onClick={handleSubmit}
              disabled={!formComplete || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Study Spot'}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Select Location on Map
          </h2>

          <div className="h-[500px] overflow-hidden rounded-lg border">
            <MapContainer
              center={[1.2986139477272356, 103.77523714948109]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <LocationPicker
                setXCoord={setXCoord}
                setYCoord={setYCoord}
              />

              {xCoord !== null && yCoord !== null && (
                <Marker position={[xCoord, yCoord]}>
                  <Popup>Selected study spot location</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>

          <p className="mt-3 text-sm text-gray-600">
            Click on the map to automatically fill in the coordinates.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Suggest