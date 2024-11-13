/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import PopUpEvent from '../components/PopUpEvent';
import Header from '../components/Header';
import Footer from '../components/Footer';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../App.css';


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
  const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

    //FETCH USER EVENTS FROM THE DATABASE
    useEffect(() => {
      const fetchEvents = async () => {
          try {
              console.log(user.email);
              const response = await fetch('http://127.0.0.1:5000/events/user/' + user.email); // Assicurati che questo corrisponda al tuo endpoint backend
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

  const handlePinClick = () => {
    console.log('Popup clicked!');
    console.log('event:', event.event_date);
    // Add any other actions you want to perform on click
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    console.log(event.event_date);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };
  return (
    <>
      <Header title='YOUR HOT EVENTS' navigation={false}/>
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
                <div onClick={() => handleEventClick(event)}>
                  <strong >{event.event_name}</strong>
                    <p>{event.event_description}</p>
                    <p>{`Date: ${new Date(event.event_date).toDateString()}`}</p>
                    <p>{`Time: ${event.event_start_time} - ${event.event_end_time}`}</p>
                  <div onClick={handlePinClick}></div>
                  </div>
              </Popup>
            </Marker>
        ))}
      </MapContainer>
      {showPopup && selectedEvent && (
            <PopUpEvent event={selectedEvent} onClose={handleClosePopup} />
      )}
      <Footer/>
    </>
  )
}

export default YourEventMapPage