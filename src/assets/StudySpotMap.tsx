import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"

delete (L.Icon.Default.prototype as any)._getIconUrl

var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});



type StudySpot = {
  id: number
  name: string
  location: string
  x_coord: number
  y_coord: number
}

type Props = {
  spots: StudySpot[]
  selectedSpot?: StudySpot
}



export default function StudySpotMap({
  spots,
  selectedSpot,

  

}: Props) {
  return (
    <MapContainer
      center={selectedSpot ? [selectedSpot.x_coord, selectedSpot.y_coord] : [1.2986139477272356, 103.77523714948109]}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {spots.map((spot) => {
        const isSelected = selectedSpot?.id === spot.id

        console.log({
          spotId: spot.id,
          selectedSpotId: selectedSpot?.id,
          isSelected,
        })

        return (
          <Marker
            key={spot.id}
            position={[spot.x_coord, spot.y_coord]}
            icon={isSelected ? redIcon : blueIcon}
          >
            <Popup>
              <strong>{spot.name}</strong>
              <br />
              {spot.location}
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}