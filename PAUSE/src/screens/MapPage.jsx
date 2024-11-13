/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import '../App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import PopUpEvent from '../components/PopUpEvent';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CiShop } from "react-icons/ci";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';



// Configuration for the default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  // iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
  // iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
  // shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
});

const center = [55.6867243, 12.5700724]; // Copenhagen coordinates


function MapPage() {
  
  const [events, setEvents] = useState([]);
  const { user } = useUser(); // Access the user information
  const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility

  //function to fetch events from the database
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/events');
      const data = await response.json();
      
      // Get today's date at 00:00:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filteredAndSortedEvents = data.events
      .filter(event => new Date(event.event_date) >= today)  // Filter out past events
      
      setEvents(filteredAndSortedEvents); // Store events in state

    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  //to load the events when the page is loaded
  useEffect(() => {
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
      <Header title='HOT IN COPENHAGEN' navigation={true}/>
      {/* Mappa */}
      
      <div style={{height:'80vh', overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>

        <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: '1000px', width: '80vw' }}>
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
      </div>  
      
    </>
      
  )
}

export default MapPage