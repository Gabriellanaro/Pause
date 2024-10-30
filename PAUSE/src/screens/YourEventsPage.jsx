/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import { FaPlus } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';

const YourEventsPage = () => {
  const [events, setEvents] = useState([]);
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
    // console.log(user.user);
    if (user.user) {
      navigate('/event-form'); // Navigate to event form if user is logged in
    } else {
      navigate('/login'); // Navigate to login page if user is not logged in
    }
  };
    
    //FETCH USER EVENTS FROM THE DATABASE
    useEffect(() => {
      const fetchEvents = async () => {
          try {
              console.log(user.user.email);
              const response = await fetch('http://127.0.0.1:5000/events/user/' + user.user.email); // Assicurati che questo corrisponda al tuo endpoint backend
              if (!response.ok) {
                  throw new Error('Network response was not ok');
            }
            const rawText = await response.text(); // Read raw text of response
     
            // If the response body is empty or not JSON, log it
            const data = JSON.parse(rawText || '{}');  // Handle empty or invalid JSON

            setEvents(data.events); 
            setLoading(false); // Set loading to false after events are fetched

          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); // Set loading to false even if there is an error
          }
      };

      fetchEvents();
    }, [user]);


    return (
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
        
        {events && events.length > 0 ? (
          events.map((event, index) => (
          <EventInFeedPage key={index} event={event} />
          ))
        ) : (
          <p>No events found</p>
        )}
    </div>
    )
}

export default YourEventsPage;