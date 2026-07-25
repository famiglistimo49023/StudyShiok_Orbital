//imports
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

import redwifi from '../assets/images/dog_redwifi.png'
import yellowwifi from '../assets/images/dog_yellowwifi.png'
import greenwifi from '../assets/images/dog_greenwifi.png' //img for wifi strength indicator

import { useLocation } from "react-router-dom"

type StarRatingProps = {
  rating: number
  setRating: (val: number) => void
}

const StarRating = ({ rating, setRating }: StarRatingProps) => { //auto generate stars selection for rating
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


type ToggleProps = { //for toggle switches
  label: string
  checked: boolean
  setChecked: (value: boolean) => void
}

const Toggle = ({
  label,
  checked,
  setChecked,
}: ToggleProps) => (
  <div className="flex items-center justify-between rounded-lg border p-3">
    <span>{label}</span>

    <button
      type="button"
      onClick={() => setChecked(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked
          ? 'bg-[#ff9e00]'
          : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  </div>
)

const Review: React.FC = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  //overall rating
  const [rating, setRating] = useState(0)

  //for ambience
  const [quietness, setQuietness] = useState(0)
  const [cleanliness, setCleanliness] = useState(0)
  const [lighting, setLighting] = useState(0)
  const [seatingComfort, setSeatingComfort] = useState(0)

  //for wifi
  const [wifiLevel, setWifiLevel] = useState(5)
  //since wifi is compulsory, setting default as good wifi

  //amenities
  const [powerOutlets, setPowerOutlets] = useState(false)
  const [airConditioning, setAirConditioning] = useState(false)
  const [foodNearby, setFoodNearby] = useState(false)
  const [groupFriendly, setGroupFriendly] = useState(false)
  const [openLate, setOpenLate] = useState(false)

  const [error, setError] = useState('') 
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const routerLocation = useLocation()
  const { studySpotId } = routerLocation.state



  const formComplete = //what is required for the form to submit?
    rating !== 0 &&
    quietness !== 0 &&
    cleanliness !== 0 &&
    lighting !== 0 &&
    seatingComfort !== 0 &&
    wifiLevel !== 0
    //amenities are ambiguous to indicate, a bit of a concern for me

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
      setError('You must be logged in to submit a review.')
      setIsSubmitting(false)
      return
    }

    const { error: ratingError } = await supabase
      .from("ratings")
      .insert({
        studyspot_id: studySpotId,
        user_id: authData.user.id,

        rating,

        wifi_level: wifiLevel,

        quietness,
        cleanliness,
        lighting,
        seating_comfort: seatingComfort,

        power_outlets: powerOutlets,
        air_conditioning: airConditioning,
        food_nearby: foodNearby,
        group_friendly: groupFriendly,
        open_late: openLate,
      })

    if (ratingError) {
    console.error('Error submitting rating:', ratingError)

    if (ratingError.code === "23505") { //unique constraint violation (user has submitted a review before)
        setError("You have already submitted a review for this study spot.")
    } else {
        setError("Unable to submit your review. Please try again.")
    }

    setIsSubmitting(false)
    return
    }

    setSuccess("Review submitted successfully!")

    setTimeout(() => {
      navigate('/explore')
    }, 1500)
  }

  useEffect(() => {
    const fetchSpot = async () => {
        const { data } = await supabase
            .from("studyspots")
            .select("name, location")
            .eq("id", studySpotId)
            .single()

        console.log("studySpotId:", studySpotId)
        console.log("data:", data)
        console.log("error:", error)

        if (data) {
            setName(data.name)
            setLocation(data.location)
        }
    }

    fetchSpot()
    }, [])

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
        Review a Study Spot
      </h1>

      <p className="mt-2 text-gray-200">
        Show others how you feel about this study spot by rating its amenities and overall experience. Your feedback helps the community find the best places to study!
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <div className="space-y-5">
            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder=""
              value={name}
              readOnly
            />

            <input
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder=""
              value={location}
              readOnly
            />

            <div>
              <label className="mb-4 block text-center font-medium text-gray-800">
                WiFi Strength
              </label>

              <div className="flex items-center justify-center">

                {/* Dog Image */}
                <img
                  src={
                    wifiLevel === 1
                      ? redwifi
                      : wifiLevel === 3
                      ? yellowwifi
                      : greenwifi
                  }
                  alt="WiFi Strength"
                  className="h-56 w-auto select-none"
                  draggable={false}
                />

                {/* Vertical Slider */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="2"
                  value={wifiLevel}
                  onChange={(e) => setWifiLevel(Number(e.target.value))}
                  className="
                    h-56
                    cursor-pointer
                    appearance-none
                    bg-transparent
                    [writing-mode:bt-lr]
                    [-webkit-appearance:slider-vertical]
                  "
                />

              </div>
            </div>

            <h3 className="mb-4 text-lg font-semibold">
              Study Environment
            </h3>

            <div className="grid grid-cols-2 gap-8">

              <div>
                <label className="mb-2 block font-medium">
                  Quietness
                </label>

                <StarRating
                  rating={quietness}
                  setRating={setQuietness}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Lighting
                </label>

                <StarRating
                  rating={lighting}
                  setRating={setLighting}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Cleanliness
                </label>

                <StarRating
                  rating={cleanliness}
                  setRating={setCleanliness}
                />
              </div>

              <div>
                <label className="mb-2 block font-medium">
                  Seating Comfort
                </label>

                <StarRating
                  rating={seatingComfort}
                  setRating={setSeatingComfort}
                />
              </div>

            </div>


            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Amenities
              </h3>

              <div className="space-y-3">

                <Toggle
                  label="🔌 Power Outlets"
                  checked={powerOutlets}
                  setChecked={setPowerOutlets}
                />

                <Toggle
                  label="❄️ Air Conditioning"
                  checked={airConditioning}
                  setChecked={setAirConditioning}
                />

                <Toggle
                  label="🍴 Food Nearby"
                  checked={foodNearby}
                  setChecked={setFoodNearby}
                />

                <Toggle
                  label="👥 Group Friendly"
                  checked={groupFriendly}
                  setChecked={setGroupFriendly}
                />

                <Toggle
                  label="🌙 Open Late"
                  checked={openLate}
                  setChecked={setOpenLate}
                />

              </div>
            </div>

            <div>
              <p className="mb-2 font-medium text-gray-800">
                Rating
              </p>
              <StarRating rating={rating} setRating={setRating} />
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
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Review