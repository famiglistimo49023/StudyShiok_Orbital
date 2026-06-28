import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Suggest: React.FC = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [campusArea, setCampusArea] = useState('')
  const [description, setDescription] = useState('')

  const [wifiRating, setWifiRating] = useState(0)
  const [comfortRating, setComfortRating] = useState(0)
  const [quietRating, setQuietRating] = useState(0)

  const StarRating = ({
    rating,
    setRating
  }: {
    rating: number
    setRating: (val: number) => void
  }) => {
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

  const handleSubmit = () => {
    console.log({
      name,
      campusArea,
      description,
      wifiRating,
      comfortRating,
      quietRating
    })

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#2D4466] p-8 text-black">

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
        Suggest a Study Spot
      </h1>

      <p className="mt-2 text-gray-200">
        Recommend a study location for other NUS students.
      </p>

      <div className="mt-8 max-w-2xl rounded-xl bg-white p-6 shadow-md">
        <div className="space-y-5">

          <input
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Name of Study Spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Campus Area"
            value={campusArea}
            onChange={(e) => setCampusArea(e.target.value)}
          />

          <textarea
            className="min-h-32 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-2 font-medium text-gray-800">WiFi Quality</p>
            <StarRating rating={wifiRating} setRating={setWifiRating} />
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-2 font-medium text-gray-800">Comfort</p>
            <StarRating rating={comfortRating} setRating={setComfortRating} />
          </div>

          <div className="rounded-lg border border-gray-200 p-4">
            <p className="mb-2 font-medium text-gray-800">Quietness</p>
            <StarRating rating={quietRating} setRating={setQuietRating} />
          </div>

          <button
            className="w-full rounded-lg bg-[#ff9e00] px-4 py-3 font-medium text-white transition hover:bg-[#ffb703]"
            onClick={handleSubmit}
          >
            Submit Study Spot
          </button>

        </div>
      </div>
    </div>
  )
}

export default Suggest