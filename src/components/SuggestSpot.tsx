//imports

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

import redwifi from '../assets/images/dog_redwifi.png'
import yellowwifi from '../assets/images/dog_yellowwifi.png'
import greenwifi from '../assets/images/dog_greenwifi.png' //img for wifi strength indicator

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

type LocationPickerProps = { //for map click
  setXCoord: (val: number) => void
  setYCoord: (val: number) => void
}

const LocationPicker = ({ setXCoord, setYCoord }: LocationPickerProps) => {
  useMapEvents({ click(point) { //update lat and lang when clicked
      setXCoord(point.latlng.lat)
      setYCoord(point.latlng.lng)
    }})
  return null
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

const Suggest: React.FC = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  // const [wifiLevel, setWifiLevel] = useState(0)
  // const [ambienceLevel, setAmbienceLevel] = useState(0)
  // const [foodAvailable, setFoodAvailable] = useState('')

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

  //gps using openstreetmap 
  const [xCoord, setXCoord] = useState<number | null>(null)
  const [yCoord, setYCoord] = useState<number | null>(null)

  //image saving
  const [image, setImage] = useState<File | null>(null)

  const [error, setError] = useState('') 
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)



  const formComplete = //what is required for the form to submit?
    name.trim() !== '' &&
    location.trim() !== '' &&
    rating !== 0 &&
    quietness !== 0 &&
    cleanliness !== 0 &&
    lighting !== 0 &&
    seatingComfort !== 0 &&
    wifiLevel !== 0 &&
    xCoord !== null &&
    yCoord !== null
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
      setError('You must be logged in to submit a study spot.')
      setIsSubmitting(false)
      return
    }

    const { data: studySpot, error : formError } = await supabase //saving data as studySpot to save studySpot.id
      .from('studyspots')
      .insert({
        name, location, 
        // quietness,
        // cleanliness,
        // lighting,
        // seatingComfort,
        // wifi_level: wifiLevel,

        // power_outlets: powerOutlets,
        // air_conditioning: airConditioning,
        // food_nearby: foodNearby,
        // group_friendly: groupFriendly,
        // open_late: openLate,
        x_coord: xCoord,
        y_coord: yCoord,

        //busyness default for now
        busyness: 'Free'
      }).select().single() //only saves studySpot.id, faster

    if (formError) {
      console.error('Error submitting study spot:', formError)
      setError('Unable to submit study spot. Please try again.')
      setIsSubmitting(false)
      return
    }

    const { error: ratingError } = await supabase
      .from("ratings")
      .insert({
        studyspot_id: studySpot.id,
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
      setError('Unable to submit rating. Please try again.')
      setIsSubmitting(false)
      return
    }

    if (image) {
      const extension = image.name.split('.').pop()

      const filePath =
        `${studySpot.id}/${crypto.randomUUID()}.${extension}` //creates folder for new spot and adds image with random uuid

      const { error: uploadError } = await supabase.storage
        .from('studyspot-img') //uses supabase storage bucket
        .upload(filePath, image)

      if (uploadError) {
          console.error('Error uploading image:', uploadError)
          setError("Failed to upload image.")
          setIsSubmitting(false)
          return
      }

      const { error: imageError } = await supabase
        .from('studyspot_images') //not to be confused with storage, this is the db
        .insert({
          studyspot_id: studySpot.id,
          img_path: filePath,
          display_order: 1,
        })
      
      if (imageError) {
        console.error('Error saving image path:', imageError)
        setError('Unable to save image path. Please try again.')
        setIsSubmitting(false)
        return
      }

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

          <div className="mt-4 grid grid-cols-2 gap-4">
            <input
              className="rounded-xl border border-gray-300 px-4 py-3 shadow-sm text-gray-800"
              placeholder="X Coordinate"
              value={xCoord ?? ''}
              readOnly
            />

            <input
              className="rounded-xl border border-gray-300 px-4 py-3 shadow-sm text-gray-800"
              placeholder="Y Coordinate"
              value={yCoord ?? ''}
              readOnly
            />
          </div>


          <div className="mt-4">
            <label className="mb-2 block font-medium text-gray-800">
              Study Spot Photo
            </label>

            <label
              htmlFor="spot-image"
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition hover:border-[#ff9e00] hover:bg-orange-50"
            >
              <span className="text-3xl">📷</span>
              <span className="text-sm font-medium text-gray-700">
                {image ? image.name : 'Click to upload a photo'}
              </span>
              <span className="text-xs text-gray-400">.png or .jpeg</span>
            </label>

            <input
              id="spot-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (!e.target.files || e.target.files.length === 0) return
                setImage(e.target.files[0])
              }}
            />

            {image && (
              <div className="relative mt-4"> 
                <p className="mb-2 font-medium text-gray-800">Image Preview:</p>

                <img
                  src={URL.createObjectURL(image)}
                  alt="Study Spot Preview"
                  className="h-72 w-full rounded-lg border object-cover shadow"
                />

                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute right-2 top-8 rounded-full bg-black/60 px-2 py-1 text-xs text-white transition hover:bg-black/80"
                >
                  ✕  Remove
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Suggest