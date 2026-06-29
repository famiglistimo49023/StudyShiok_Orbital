
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  useEffect(() => {
  const fetchData = async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return

    const userId = userData.user.id

    // bookmarks
    const { data: bookmarks } = await supabase
      .from('bookmarks')
      .select('studyspot_id')
      .eq('user_id', userId)

    // ratings
    const { data: ratings } = await supabase
      .from('ratings')
      .select('rating')
      .eq('user_id', userId)
    
    const { data: spots } = await supabase
      .from('bookmarks')
      .select(`
    studyspot_id,
    studyspots (
      id,
      name,
      campusArea,
      rating,
      busyness
    )
  `)
  .eq('user_id', userId)

setBookmarkedSpots(spots || [])
    const avg =
      ratings && ratings.length > 0
        ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
        : 0

    setStats({
      bookmarkedCount: bookmarks?.length || 0,
      ratingsGiven: ratings?.length || 0,
      avgRating: Number(avg.toFixed(1)),
      notBusySpots: 0 // keep placeholder for now
    })
  }

  fetchData()
}, [])
  //trying to link to supabase
  const [stats, setStats] = useState({
  bookmarkedCount: 0,
  ratingsGiven: 0,
  avgRating: 0,
  notBusySpots: 0
  })

  //hardcoded for now
  const [bookmarkedSpots, setBookmarkedSpots] = useState<any[]>([])

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



      <h1 className="mt-8 mb-4 text-4xl font-bold tracking-tight text-[#ffb703]">
        Dashboard
      </h1>

      <div className="statsGrid">

        <div className="statCard">
          <h3>Bookmarked Spots</h3>
          <p>{stats.bookmarkedCount}</p>
        </div>

        <div className="statCard">
          <h3>Ratings Given</h3>
          <p>{stats.ratingsGiven}</p>
        </div>

        <div className="statCard">
          <h3>Avg Rating Given</h3>
          <p>{stats.avgRating}</p>
        </div>

        <div className="statCard">
          <h3>Not Busy Spots</h3>
          <p>{stats.notBusySpots}</p>
        </div>

      </div>



      <h2 className="sectionTitle">Your Bookmarked Spots</h2>

      <div className="cardGrid">
        {bookmarkedSpots.map((spot) => (
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

export default Dashboard