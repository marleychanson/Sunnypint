import React, { useEffect, useState } from "react";
import SunCalc from "suncalc";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Example pub list
const pubs = [
  {
    name: "The Rising Sun",
    city: "London",
    orientation: "south",
    location: { lat: 51.5074, lon: -0.1278 },
  },
  {
    name: "The Golden Pint",
    city: "Manchester",
    orientation: "west",
    location: { lat: 53.4808, lon: -2.2426 },
  },
];

const isBeerGardenSunny = (orientation, sunAzimuth) => {
  const azimuthDeg = (sunAzimuth * 180) / Math.PI;
  const directions = {
    north: [315, 45],
    east: [45, 135],
    south: [135, 225],
    west: [225, 315],
  };
  const [min, max] = directions[orientation];
  return orientation === "north"
    ? azimuthDeg >= min || azimuthDeg <= max
    : azimuthDeg >= min && azimuthDeg <= max;
};

const CurrentLocation = ({ onFound }) => {
  const map = useMap();
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      map.setView(e.latlng, 13);
      onFound(e.latlng);
    });
  }, []);
  return null;
};

export default function App() {
  const [sunnyPubs, setSunnyPubs] = useState([]);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    const now = new Date();
    const filtered = pubs.filter((pub) => {
      const sun = SunCalc.getPosition(now, pub.location.lat, pub.location.lon);
      return isBeerGardenSunny(pub.orientation, sun.azimuth);
    });
    setSunnyPubs(filtered);
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <MapContainer center={[52.5, -1.5]} zoom={6} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <CurrentLocation onFound={setUserPos} />
        {sunnyPubs.map((pub, i) => (
          <Marker key={i} position={[pub.location.lat, pub.location.lon]}>
            <Popup>
              <strong>{pub.name}</strong>
              <br />
              {pub.city}
            </Popup>
          </Marker>
        ))}
        {userPos && (
          <Marker position={[userPos.lat, userPos.lng]}>
            <Popup>You are here</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}