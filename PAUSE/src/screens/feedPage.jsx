/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const FeedPage = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const addEvent = () => {
      navigate('/event-form'); // Redirect to the EventFormPage
    };
  
    // const userProfile = () => {
    //   navigate('/'); // Redirect to the UserProfilePage
    // };
    
    //FETCH EVENTS FROM THE DATABASE
    useEffect(() => {
      const fetchEvents = async () => {
          try {
            const response = await fetch('http://127.0.0.1:5000/events'); // Assicurati che questo corrisponda al tuo endpoint backend
            console.log(response);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
            }
            const rawText = await response.text(); // Read raw text of response
            console.log('Raw response:', rawText);
     
            // If the response body is empty or not JSON, log it
            const data = JSON.parse(rawText || '{}');  // Handle empty or invalid JSON
            console.log('Fetched data:', data);

            // const data = await response.json();
            // console.log(data);
              setEvents(data.events); 
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchEvents();
    }, []);


    return (
      <div className="feed-container">
        <button className="add-event-button" onClick={addEvent}>
          <FaPlus className="add-icon" />
        </button>
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

export default FeedPage;