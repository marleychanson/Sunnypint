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

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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