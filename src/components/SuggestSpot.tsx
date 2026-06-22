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
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${(hover || rating) >= star ? 'filled' : ''}`}
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

    //update to backend later
    navigate('/dashboard')
  }

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


      <h1>Suggest a Study Spot</h1>

      <div className="formCard">

        <input
          className="inputField"
          placeholder="Name of Study Spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="inputField"
          placeholder="Campus Area"
          value={campusArea}
          onChange={(e) => setCampusArea(e.target.value)}
        />

        <textarea
          className="inputField"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="ratingBlock">
          <p>WiFi Quality</p>
          <StarRating rating={wifiRating} setRating={setWifiRating} />
        </div>

        <div className="ratingBlock">
          <p>Comfort</p>
          <StarRating rating={comfortRating} setRating={setComfortRating} />
        </div>

        <div className="ratingBlock">
          <p>Quietness</p>
          <StarRating rating={quietRating} setRating={setQuietRating} />
        </div>

        <button className="submitButton" onClick={handleSubmit}>
          Submit Study Spot
        </button>

      </div>
    </div>
  )
}

export default Suggest