import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const pubs = [
  { name: "The Sunny Inn", lat: 51.5074, lng: -0.1278 },
  { name: "Golden Alehouse", lat: 53.4808, lng: -2.2426 },
];

export default function App() {
  const [location, setLocation] = useState(null);
  const [time, setTime] = useState(new Date().getHours());

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  }, []);

  const isSunny = time >= 12 && time <= 18;

  return (
    <div>
      <h1>SunnyPint</h1>
      <p>{isSunny ? "Pub gardens should be sunny now!" : "Not sunny hours"}</p>

      {location && (
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={6}
          style={{ height: "80vh", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {pubs.map((pub, i) => (
            <Marker key={i} position={[pub.lat, pub.lng]}>
              <Popup>{pub.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}