/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import '../App.css';
import { useUser } from '../contexts/UserContext';
import { FaPen } from "react-icons/fa";


const EventInFeedPage = ( { event }) => {
  
  const user = useUser();
  const userEmail = user.user.email;
  console.log("USER EMAIL: ",userEmail);

  // Function to format the event date and time
  const formatEventDateTime = (event) => {
    // Extract year, month, and day from the event_date
    const eventDate = new Date(event.event_date);

    // Get the day of the week (e.g., 'Sat')
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'short' });

    // Get the formatted date (e.g., '12 Oct 2024')
    const formattedDate = `${dayOfWeek}, ${eventDate.getDate()} ${eventDate.toLocaleString('en-US', { month: 'long' })} ${eventDate.getFullYear()}`;

    // Format start and end times
    const formatTime = (time) => {
      const [hour, minute] = time.split(':');
      return `${hour}:${minute}`;
    };

    const eventStartTime = formatTime(event.event_start_time);
    const eventEndTime = formatTime(event.event_end_time);

    // Combine formatted date with starting and ending times
    const eventTime = `${formattedDate}, ${eventStartTime}h - ${eventEndTime}h`;
      return eventTime;
    };

    const eventTime = formatEventDateTime(event);

    const defaultImage = '/default_img_vintageshop.jpg'; 
    //use image from event if present in the database, otherwise use default image
    const eventImage = event.event_image && event.event_image !== 'null' ? event.event_image : defaultImage;

    return (
    <div className="event-container">
      <img src={eventImage} alt={event.event_name} className="event-image" />
      <div className="event-details">
        <p className="event-subtitle" style={{ fontSize: '1.8vw' }}>{eventTime}</p>
        <p className="event-title">{event.event_name}</p>
        <p className="event-subtitle">{event.event_location}</p>
        <p className="event-subtitle" style={{fontSize: '0.8vw'}}>Created by: {event.user_email}</p>
      </div>
      {userEmail === event.user_email && (
          <button className='modify-button'>
            <FaPen /> 
          </button>
      )}  
    </div>
  );
};

export default EventInFeedPage;