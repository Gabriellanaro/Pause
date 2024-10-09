/* eslint-disable no-unused-vars */
import { useState } from 'react';
import img from '../assets/img.jpg';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


// Configurazione per i marker della mappa
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const center = [55.6867243, 12.5700724];
const locations = [
  { id: 1, lat: 55.7291550, lng: 12.5706350, name: "Casa Gabriel" },
  { id: 2, lat: 55.7101760, lng: 12.5529000, name: "Casa Ture" },
];


function MapPage() {

  const handleClick = () => {
    console.log('Popup clicked!');
    // Add any other actions you want to perform on click
  };

  return (
    <>
      {/* Mappa */}
      <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: '100vh', width: '100vh'}}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map(location => (
          <Marker
            key={location.id}
            position={[location.lat, location.lng]}
            eventHandlers={{ click: handleClick }}>

            <Popup >
              {location.name}
              <div onClick={handleClick}> click me!</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default MapPage