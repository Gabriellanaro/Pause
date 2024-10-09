/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const EventInFeedPage = ( { event }) => {

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

    return (
        <div className="event-container">
      <img src={event.image} alt={event.event_title} className="event-image" />
      <div className="event-details">
        <p className="event-subtitle" style={{ fontSize: '1.8vw' }}>{eventTime}</p>
        <p className="event-title">{event.event_name}</p>
        <p className="event-subtitle">{event.event_location}</p>
      </div>
    </div>
  );
};

EventInFeedPage.propTypes = {
  event: PropTypes.shape({
      event_date: PropTypes.string.isRequired,
      event_start_time: PropTypes.string.isRequired,
      event_end_time: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      event_title: PropTypes.string.isRequired,
      event_name: PropTypes.string.isRequired,
      event_location: PropTypes.string.isRequired,
  }).isRequired,
};

export default EventInFeedPage;