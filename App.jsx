
import React, { useState, useEffect } from "react";
import SunCalc from "suncalc";

const pubs = [
  {
    name: "The Rising Sun",
    location: { lat: 51.5074, lon: -0.1278 },
    orientation: "south",
    city: "London",
  },
  {
    name: "The Golden Pint",
    location: { lat: 53.4808, lon: -2.2426 },
    orientation: "west",
    city: "Manchester",
  },
];

const isBeerGardenSunny = (orientation, sunAzimuth) => {
  const azimuthDegrees = (sunAzimuth * 180) / Math.PI;
  const directions = {
    north: [315, 45],
    east: [45, 135],
    south: [135, 225],
    west: [225, 315],
  };
  const [min, max] = directions[orientation];
  return orientation === "north"
    ? azimuthDegrees >= min || azimuthDegrees <= max
    : azimuthDegrees >= min && azimuthDegrees <= max;
};

export default function App() {
  const [city, setCity] = useState("");
  const [sunnyPubs, setSunnyPubs] = useState([]);

  useEffect(() => {
    const now = new Date();
    const newSunnyPubs = pubs.filter((pub) => {
      const sunPos = SunCalc.getPosition(now, pub.location.lat, pub.location.lon);
      return isBeerGardenSunny(pub.orientation, sunPos.azimuth);
    });
    setSunnyPubs(newSunnyPubs);
  }, [city]);

  const filteredPubs = city
    ? sunnyPubs.filter((pub) => pub.city.toLowerCase().includes(city.toLowerCase()))
    : sunnyPubs;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>SunnyPint: Pubs in the Sun</h1>
      <input
        type="text"
        placeholder="Enter city (e.g. London)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
      />
      {filteredPubs.map((pub, index) => (
        <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h2>{pub.name}</h2>
          <p>{pub.city}</p>
        </div>
      ))}
      {filteredPubs.length === 0 && <p>No sunny beer gardens found right now.</p>}
    </div>
  );
}
