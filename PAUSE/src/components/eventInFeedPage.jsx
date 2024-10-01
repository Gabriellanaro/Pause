import React from 'react';
import '../App.css';

const EventInFeedPage = ( { event }) => {
    return (
        <div className="event-container">
      <img src={event.image} alt={event.title} className="event-image" />
      <div className="event-details">
        <p className="event-subtitle" style={{ fontSize: '25px' }}>{event.time}</p>
        <h2 className="event-title">{event.title}</h2>
        <p className="event-subtitle">{event.location}</p>
      </div>
    </div>
  );
};

export default EventInFeedPage;