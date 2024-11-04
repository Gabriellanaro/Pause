/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaPlus } from 'react-icons/fa'; // Import FaPlus icon
import { useUser } from '../contexts/UserContext';
import HamburgerMenu from '../components/HamburgerMenu';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';



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


function MapPage() {

  const navigate = useNavigate(); // Create navigate function
  const [events, setEvents] = useState([]);
  const { user } = useUser(); // Access the user information

  //function to fetch events from the database
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/events');
      const data = await response.json();
      setEvents(data.events); // Store events in state
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  //to load the events when the page is loaded
  useEffect(() => {
    fetchEvents();
  }, []);

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
          <h1 className="feed-title">HOT IN COPENHAGEN</h1>
          <button className="add-event-button" onClick={handleAddEventClick}>
            <FaPlus className="add-icon" />
          </button>

          <div className="feed-controls">
              <div className="tags">
                  <button className="switchview-button" onClick={() => navigate('/map')}>
                    Map View
                  </button>
                  <button className="switchview-button" onClick={() => navigate('/')}>
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
      <div className="feed-container">
        <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: '1000px', width: '80vw'}}>
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
      </div>
    </>
      
  )
}

export default MapPage