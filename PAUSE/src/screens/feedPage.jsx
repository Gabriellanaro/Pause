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

    // useEffect() function for test events (not in the database)
    useEffect(() => {
      // To test the code with some event
      setEvents(exampleEvents);
    });
    
    // useEffect() function to fetch events from the database
    // useEffect(() => {
    //   const fetchEvents = async () => {
    //     try {
    //       const response = await fetch('http://localhost:5000/events'); // Fetch events from the database- add the api endpoint
    //       const data = await response.json();
    //       setEvents(data);
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     }
    //   };

    //   fetchEvents();
    // }, []); 

    return (
    <div className="feed-container">
      <button className="add-event-button" onClick={addEvent}>
        <FaPlus className="add-icon" />
      </button>
      {events.map((event, index) => (
        <EventInFeedPage key={index} event={event} />
      ))}
    </div>
    )
}

export default FeedPage;