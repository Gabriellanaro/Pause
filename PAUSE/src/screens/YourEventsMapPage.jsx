/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import img from '../assets/img.jpg';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaPlus } from 'react-icons/fa'; // Import FaPlus icon
import { useUser } from '../contexts/UserContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HamburgerMenu from '../components/HamburgerMenu';


// Configuration for the default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const center = [55.6867243, 12.5700724]; // Copenhagen coordinates
// const locations = [
// //example locations, gabriel and ture's houses
//   { id: 1, lat: 55.7291550, lng: 12.5706350, name: "Casa Gabriel" },
//   { id: 2, lat: 55.7101760, lng: 12.5529000, name: "Casa Ture" },
// ];


function YourEventMapPage() {

  const navigate = useNavigate(); // Create navigate function
  const [events, setEvents] = useState([]);
  const { user } = useUser(); // Access the user information

    //FETCH USER EVENTS FROM THE DATABASE
    useEffect(() => {
      const fetchEvents = async () => {
          try {
              console.log(user.user.email);
              const response = await fetch('http://127.0.0.1:5000/events/user/' + user.user.email); // Assicurati che questo corrisponda al tuo endpoint backend
            // console.log(response);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
            }
            const rawText = await response.text(); // Read raw text of response
     
            // If the response body is empty or not JSON, log it
            const data = JSON.parse(rawText || '{}');  // Handle empty or invalid JSON

            setEvents(data.events); 

          } catch (error) {
            console.error('Error fetching data:', error);
          }
      };

      fetchEvents();
    }, [user]);

  const handleAddEventClick = () => {
    console.log(user);
    if (user) {
      navigate('/event-form'); // Navigate to event form if user is logged in
    } else {
      navigate('/login'); // Navigate to login page if user is not logged in
    }
  };

  const handlePinClick = () => {
    console.log('Popup clicked!');
    // Add any other actions you want to perform on click
  };

  return (
    <>
      <div className="feed-container">
        <HamburgerMenu />
          <h1 className="feed-title">YOUR HOT EVENTS</h1>
          <button className="add-event-button" onClick={handleAddEventClick}>
            <FaPlus className="add-icon" />
          </button>

          <div className="feed-controls">
              <div className="tags">
                  <button className="switchview-button" onClick={() => navigate('/your-events-map')}>
                    Map View
                  </button>
                  <button className="switchview-button" onClick={() => navigate('/your-events')}>
                    Feed View
                  </button>
              </div>
              <div className="tags">
                  <span className="tag">Tag 1</span>
                  <span className="tag">Tag 2</span>
                  <span className="tag">Tag 3</span>
              </div>
        </div>
      </div>
      {/* Mappa */}
      <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: '100vh', width: '80%'}}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
          // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {events.map(event => (
          <Marker
            key={event.id}
            position={[event.event_latitude, event.event_longitude]}
            eventHandlers={{ click: handlePinClick }}>

            <Popup >
              <strong>{event.event_name}</strong>
                <p>{event.event_description}</p>
                <p>{`Date: ${event.event_date}`}</p>
                <p>{`Time: ${event.event_start_time} - ${event.event_end_time}`}</p>
              <div onClick={handlePinClick}></div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default YourEventMapPage