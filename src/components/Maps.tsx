import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { supabase } from "../supabase" // <-- add this

import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

type StudySpot = {
  id: number
  name: string
  location: string
  x_coord: number
  y_coord: number
}

const Maps: React.FC = () => {
  const navigate = useNavigate()

  //stores all the study spots fetched from supabase
  const [spots, setSpots] = useState<StudySpot[]>([])

  //fetch them study spots when page loads
  useEffect(() => {
    const fetchSpots = async () => {
      const { data, error } = await supabase
        .from("studyspots")
        .select("id, name, location, x_coord, y_coord")

      if (error) {
        console.error("Error fetching study spots:", error)
      } else {
        setSpots(data || [])
      }
    }

    fetchSpots()
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
          onClick={() => navigate("/")}
        >
          Log Out
        </button>
      </div>

      <h1 className="mt-8 text-4xl font-bold tracking-tight text-[#ffb703]">
        Maps
      </h1>

      <div className="mt-8 h-[500px] w-full overflow-hidden rounded-lg border">
        <MapContainer
          center={[1.2986139477272356, 103.77523714948109]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/*create marker for every study spot */}
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={[spot.x_coord, spot.y_coord]}
            >
              <Popup> {/*what do i see after i click */}
                <strong>{spot.name}</strong>
                <br />
                {spot.location}
              </Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>

    </div>
  )
}

export default Maps