/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import { FaPlus } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';
import PopUpEvent from '../components/PopUpEvent'; // Import the PopUpEvent component

const FeedPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const navigate = useNavigate();
  const user = useUser();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Simulate fetching or setting loading state
    if (user.user) {
      setLoading(false);
    }
  }, [user.user]); // Update loading state when user information changes

  const handleAddEventClick = () => {
    console.log(user);
    if (user.user) {
      navigate('/event-form'); // Navigate to event form if user is logged in
    } else {
      navigate('/login'); // Navigate to login page if user is not logged in
    }
  };

  // Fetch events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/events'); // Ensure this matches your backend endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rawText = await response.text(); // Read raw text of response
        const data = JSON.parse(rawText || '{}'); // Handle empty or invalid JSON
        setEvents(data.events);
        setLoading(false); // Set loading to false after events are fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false); // Set loading to false even if there is an error
      }
    };
<<<<<<< Updated upstream
    
    //FETCH EVENTS FROM THE DATABASE
    useEffect(() => {
      const fetchEvents = async () => {
          try {
              const response = await fetch('http://localhost:5000/events'); // Assicurati che questo corrisponda al tuo endpoint backend
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              const data = await response.json();
              setEvents(data.events); 
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };
=======

    fetchEvents();
  }, []);
>>>>>>> Stashed changes

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedEvent(null);
  };

<<<<<<< Updated upstream
    return (
      <div className="feed-container">
          <h1 className="feed-title">HOT IN COPENHAGEN</h1>
          <button className="add-event-button" onClick={addEvent}>
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

          
          {events.map((event, index) => (
            <EventInFeedPage key={index} event={event} />
          ))}
=======
  return (
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
      
      {events && events.length > 0 ? (
        events.map((event, index) => (
          <div key={index} onClick={() => handleEventClick(event)}>
            <EventInFeedPage event={event} />
          </div>
        ))
      ) : (
        <p>No events found</p>
      )}
      {showPopup && selectedEvent && (
        <PopUpEvent event={selectedEvent} onClose={handleClosePopup} />
      )}
>>>>>>> Stashed changes
    </div>
  );
};

export default FeedPage;