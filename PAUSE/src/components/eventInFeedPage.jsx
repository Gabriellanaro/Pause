import React from 'react';
import '../App.css';

const EventInFeedPage = ( { event }) => {
    // Split the date to get day, month, and year
    const [day, month, year] = event.date.split('-');
    // Format the date as dd/mm/yyyy
    const formattedDate = `${day}/${month}/${year}`;
    // Combine formatted date with starting and ending times
    const eventTime = `${formattedDate}, ${event.startingTime}h - ${event.endingTime}h`;

    return (
        <div className="event-container">
      <img src={event.image} alt={event.title} className="event-image" />
      <div className="event-details">
        <p className="event-subtitle" style={{ fontSize: '1.8vw' }}>{eventTime}</p>
        <p className="event-title">{event.title}</p>
        <p className="event-subtitle">{event.location}</p>
      </div>
    </div>
  );
};

export default EventInFeedPage;