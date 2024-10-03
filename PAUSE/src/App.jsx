/* eslint-disable no-unused-vars */
import { useState } from 'react';
import img from './assets/img.jpg';
import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, provider } from "./Firebase/firebase";

import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/AuthDetails';

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // User info is available here
      console.log(result.user);
    })
    .catch((error) => {
      console.error(error);
    });
};


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


function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  const [inputText, setInputText] = useState('')


  const sendHttpRequest = async () => {
    try {

      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClick = () => {
    console.log('Popup clicked!');
    // Add any other actions you want to perform on click
  };

  return (
    <>
      <img src={img} alt="logo" />
      <h1 style={{ color: 'white' }}>PAUSE</h1>
      <h2>Take a break from fast fashion</h2>


      <SignIn />
      <SignUp />
      <AuthDetails />

      {/* Mappa */}
      <MapContainer center={center} zoom={13} style={{ height: '400px', width: '800px', paddingTop: '200px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

export default App