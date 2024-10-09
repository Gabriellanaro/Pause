import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import veras from '../assets/veras-market.jpg';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const exampleEvents = [
  {
    date: "12-10-2024",
    startingTime: "10",
    endingTime: "15",
    title: "VERAS MARKET",
    location: "Bispeengen 20, 2000 Frederiksberg",
    image: veras
  },
  {
    date: "13-10-2024",
    startingTime: "9",
    endingTime: "15",
    time: "Every Saturday 9h - 15h",
    title: "FREDERIKSBERG FLEA MARKET",
    location: "Frederiksberg Rådhus, Smallegade, 2000 Frederiksberg",
    image: veras
  }
];

const FeedPage = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const addEvent = () => {
      navigate('/event-form'); // Redirect to the EventFormPage
    };

    //function for test events (not in the database)
    // useEffect() 
    // useEffect(() => {
    //   // To test the code with some event
    //   setEvents(exampleEvents);
    // });
    
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

      fetchEvents();
    }, []);


    return (
      <div className="feed-container">
          <h1 className="feed-title">HOT IN COPENHAGEN</h1>
          <button className="add-event-button" onClick={addEvent}>
            <FaPlus className="add-icon" />
          </button>

          <div className="feed-controls">
              <div className="map-view">Map View</div>
              <div className="tags">
                  <span className="tag">Tag 1</span>
                  <span className="tag">Tag 2</span>
                  <span className="tag">Tag 3</span>
              </div>
          </div>

          
          {events.map((event, index) => (
            <EventInFeedPage key={index} event={event} />
          ))}
    </div>
    )
}

export default FeedPage;