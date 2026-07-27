
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()

  const [bookmarkedSpots, setBookmarkedSpots] = useState<any[]>([])
  
  //trying to link to supabase
  const [stats, setStats] = useState({
  bookmarkedCount: 0,
  ratingsGiven: 0,
  avgRating: 0,
  notBusySpots: 0
  })

  useEffect(() => {
  const fetchData = async () => {
    const { data: userData, error: userError} = await supabase.auth.getUser()
    if (userError || !userData?.user) {
      console.error("Auth Error:", userError)
      return
    }

    const userId = userData.user.id

    // 1. Fetch bookmarks
    const { data: bookmarks, error: bookmarksError } = await supabase
      .from('bookmarks')
      .select('studyspot_id')
      .eq('user_id', userId)

    // 2. Fetch ratings
    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('rating')
      .eq('user_id', userId)

    // 3. DIRECT FETCH
    let finalRenderedSpots: any[] = [] // Create a variable to track the actual loaded spots

    if (bookmarks && bookmarks.length > 0) {
      const spotIds = bookmarks.map(b => b.studyspot_id)
      
      const { data: spotData, error: spotsError } = await supabase
        .from('studyspots')
        .select('id, name, location, busyness, ratings(rating)')
        .in('id', spotIds) 

      if (spotsError) {
        console.error("Error fetching spots:", {
        code: spotsError.code,
        message: spotsError.message,
        details: spotsError.details,
        hint: spotsError.hint,
    })
  return
}

      if (spotData) {
        setBookmarkedSpots(spotData) 
        
        // ADD THIS EXACT LINE BELOW:
        finalRenderedSpots = spotData 
      }
    } else {
      setBookmarkedSpots([])
    }

    // 4. Update Stats
    const avg =
      ratings && ratings.length > 0
        ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length
        : 0

    setStats({
      bookmarkedCount: finalRenderedSpots.length, // <-- FIX: Now it only counts valid cards!
      ratingsGiven: ratings?.length || 0,
      avgRating: Number(avg.toFixed(1)),
      notBusySpots: 0 
    })
  }

  fetchData()
}, [])
  

  //hardcoded for now

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

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Bookmarked Spots</h3>
          <p className="mt-3 text-4xl font-bold text-[#065088]">
            {stats.bookmarkedCount}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Ratings Given</h3>
          <p className="mt-3 text-4xl font-bold text-[#065088]">
            {stats.ratingsGiven}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Avg Rating Given</h3>
          <p className="mt-3 text-4xl font-bold text-[#065088]">
            {stats.avgRating}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="text-sm font-medium text-gray-500">Not Busy Spots</h3>
          <p className="mt-3 text-4xl font-bold text-[#065088]">
            {stats.notBusySpots}
          </p>
        </div>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-[#ffb703]">
        Your Bookmarked Spots
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* We map 'spot' directly now! */}
        {bookmarkedSpots.map((spot) => {
          if (!spot) return null

          return (
            <div
              key={spot.id}
              className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg cursor-pointer"
              onClick={() => navigate('/explore', { state: { openSpotId: spot.id } })}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                {spot.name}
              </h3>

              <p className="mt-1 text-gray-600">
                {spot.location}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  <b>Rating:</b> {spot.rating} / 5
                </span>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  {spot.busyness}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Dashboard