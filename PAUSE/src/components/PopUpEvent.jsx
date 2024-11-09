
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/PopUpEvent.js
import React from 'react';
import '../App.css';

const PopUpEvent = ({ event, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 352 512"
            height="1.2em"
            width="1.2em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c-12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
          </svg>
        </button>
        
        {/* Use the event image or default to '/default_img_vintageshop.jpg' if no image URL is provided */}
        <img 
          src={event.image || "/default_img_vintageshop.jpg"} 
          alt={event.event_name} 
          className="popup-image" 
        />
        
        <h2 className="popup-title">{event.event_name}</h2>
        
        <p className="popup-date">
          <strong>{new Date(event.event_date).toDateString()} {event.event_start_time} - {event.event_end_time}</strong>
        </p>
        
        <p className="popup-location">
          Place: <a href={`https://www.google.com/maps/search/?api=1&query=${event.event_location}`} target="_blank" rel="noopener noreferrer">
            {event.event_location}
          </a>
        </p>
        
        <p className="popup-description">{event.event_description}</p>
        
        <p className="popup-creator">Created by: {event.user_name}</p>
        
        <div className="tags">
          {event.tags && event.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopUpEvent;
