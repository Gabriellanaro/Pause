/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from "react";
import '../App.css';
import EventInFeedPage from "../components/eventInFeedPage";
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import PopUpEvent from '../components/PopUpEvent';
import Header from '../components/Header';
import Footer from "../components/Footer";

const FeedPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to manage selected event
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const navigate = useNavigate();
  const user = useUser();
  const [loading, setLoading] = React.useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
  const [showLoginConfirm, setShowLoginConfirm] = useState(false); // Track logout confirmation popup

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

  // // Fetch events from the database
  // useEffect(() => {
  //   const fetchEvents = async () => {
  //     try {
  //       const response = await fetch('http://127.0.0.1:5000/events'); // Ensure this matches your backend endpoint
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       const rawText = await response.text(); // Read raw text of response
  //       const data = JSON.parse(rawText || '{}'); // Handle empty or invalid JSON
  //       setEvents(data.events);
  //       setLoading(false); // Set loading to false after events are fetched
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setLoading(false); // Set loading to false even if there is an error
  //     }
  //   }
  // });
  

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
     
          // If the response body is empty or not JSON, log it
          const data = JSON.parse(rawText || '{}');  // Handle empty or invalid JSON
          
          // Get today's date at 00:00:00
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // filter past events and sort by date and time
          const filteredAndSortedEvents = data.events
            .filter(event => new Date(event.event_date) >= today)  // Filter out past events
            // .filter(event => new Date(event.event_date) >= today) 
            .sort((a, b) => {
              const dateA = new Date(a.event_date);
              const dateB = new Date(b.event_date);
              if (dateA.getTime() === dateB.getTime()) {
                return new Date(`1970-01-01T${a.event_start_time}`) - new Date(`1970-01-01T${b.event_start_time}`);
              }
              return dateA - dateB;
            });

          setEvents(filteredAndSortedEvents); // Set events state to the fetched events
          setLoading(false); // Set loading to false after events are fetched

        } catch (error) {
          console.error('Error fetching data:', error);
          setLoading(false); // Set loading to false even if there is an error
        }
      };
      fetchEvents();
    }, []);

    const handleEventClick = (event) => {
      setSelectedEvent(event);
      setShowPopup(true);
    };

    const handleClosePopup = () => {
      setShowPopup(false);
      setSelectedEvent(null);
    };

    return (
      
      <>
        <Header />
        <div className="feed-container">
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

        </div>
        {/* <Footer/> */}
      </>
    )
  }

export default FeedPage;