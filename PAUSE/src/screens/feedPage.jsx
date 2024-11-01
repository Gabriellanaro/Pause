/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import { FaPlus } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import HamburgerMenu from '../components/HamburgerMenu';

const FeedPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const user = useUser();
  const [loading, setLoading] = React.useState(true);

  // events in local to test in case we don't have access to the database
  const mockEvents = [
  {
    id: 1,
    event_date: '11-17-2024',
    event_description: 'There will be a lot of clothes and accessories for sale. Come and join us!',
    event_start_time: '10:00:00',
    event_end_time: '15:00:00',
    event_name: 'VERAS MARKET',
    event_location: 'Bispeengen 20, 2000 Frederiksberg',
    event_latitud: 55.6786,
    event_longitud: 12.5796,
    user_email: 'user1@example.com',
    // image: 'path_to_image1.jpg',
    created_at: '2024-10-10 10:00:00',
  },
  {
    id: 2,
    event_date: '11-09-2024',
    event_description: 'There will be a lot of clothes and accessories for sale. Come and join us!',
    event_start_time: '09:00:00',
    event_end_time: '15:00:00',
    event_name: 'FREDERIKSBERG FLEA MARKET',
    event_location: 'Frederiksberg Rådhus, Smallegade, 2000 Frederiksberg',
    event_latitud: 55.6786,
    event_longitud: 12.5796,
    user_email: 'user2@example.com',
    created_at: '2024-10-10 10:00:00',
    // image: 'path_to_image2.jpg',
  },
  {
    event_id: 3,
    event_date: '11-10-2024',
    event_description: 'There will be a lot of clothes and accessories for sale. Come and join us!',
    event_start_time: '10:00:00',
    event_end_time: '15:00:00',
    event_name: 'VERAS MARKET',
    event_location: 'Bispeengen 20, 2000 Frederiksberg',
    event_latitud: 55.6786,
    event_longitud: 12.5796,
    user_email: 'paulagambus06@gmail.com',
    // image: 'path_to_image3.jpg',
    created_at: '2024-10-10 10:00:00',
  },
]; 

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
  
    // const userProfile = () => {
    //   navigate('/'); // Redirect to the UserProfilePage
    // };
    
    //FETCH EVENTS FROM THE DATABASE
    useEffect(() => {
      const fetchEvents = async () => {
          try {
            const response = await fetch('http://127.0.0.1:5000/events'); // Assicurati che questo corrisponda al tuo endpoint backend
            // console.log(response);
              if (!response.ok) {
                  throw new Error('Network response was not ok');
            }
            const rawText = await response.text(); // Read raw text of response
            // console.log('Raw response:', rawText);
     
            // If the response body is empty or not JSON, log it
            const data = JSON.parse(rawText || '{}');  // Handle empty or invalid JSON
            // console.log('Fetched data:', data);

            // get today's data
            // const today = new Date();

            // filter past events and sort by date and time
            const filteredAndSortedEvents = data.events
              // .filter(event => new Date(event.event_date) >= today) 
              .sort((a, b) => {
                const dateA = new Date(a.event_date);
                const dateB = new Date(b.event_date);
                if (dateA.getTime() === dateB.getTime()) {
                  return new Date(`1970-01-01T${a.event_start_time}`) - new Date(`1970-01-01T${b.event_start_time}`);
                }
                return dateA - dateB;
              });

            setEvents(filteredAndSortedEvents); 

            // const data = await response.json();
            // console.log(data);
            // setEvents(data.events); 
            setLoading(false); // Set loading to false after events are fetched

          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); // Set loading to false even if there is an error
          }
      };

      fetchEvents();
    }, []);


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
          <EventInFeedPage key={index} event={event} />
          ))
        ) : (
          <p>No events found</p>
        )}
    </div>
    )
}

export default FeedPage;