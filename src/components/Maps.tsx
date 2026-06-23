
import { Link, useNavigate } from 'react-router-dom'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'

const Maps: React.FC = () => {
  const navigate = useNavigate()

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

      <div className="h-[500px] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={[1.2966, 103.7764]}
          zoom={15}
          style={{ height: '600px' }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={[1.2966, 103.7764]}>
            <Popup>
              famous hill of nus
            </Popup>
          </Marker>
        </MapContainer>
      </div>


      {/* PAGE CONTENT */}
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-[#ffb703]">
        Maps
        </h1>
      <p className="mt-2 text-gray-200">
        Welcome to the Maps! Unfortunately, the maps feature is not yet implemented.
        </p>


    </div>
    
  )
}

export default Maps