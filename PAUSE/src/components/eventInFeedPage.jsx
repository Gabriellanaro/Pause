/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const EventInFeedPage = ( { event }) => {
    // Split the date to get day, month, and year
    const [day, month, year] = event.event_date.split('-');
    // Format the date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;
    // Combine formatted date with starting and ending times
    const eventTime = `${formattedDate}, ${event.event_start_time}h - ${event.event_end_time}h`;

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