/* eslint-disable no-unused-vars */
// src/screens/EventFormPage.js
import React, { useState } from "react";
import '../App.css';

function EventFormPage() {
  const [formData, setFormData] = useState({
    event_name: 'test name',
    event_description: 'beautiful clothes',
    event_date: '2024-10-12',
    event_start_time: '10:00',
    event_end_time: '14:01',
    event_location: 'via pippo',
    event_latitude: 0,
    event_longitude: 0,
  });

  const [suggestions, setSuggestions] = useState([]); // State per i suggerimenti degli indirizzi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Chiamata per recuperare i suggerimenti degli indirizzi
    if (name === 'event_location') {
      fetchSuggestions(value);
    }
  };

  // Funzione per recuperare i suggerimenti degli indirizzi
  const fetchSuggestions = async (inputValue) => {
    if (inputValue.length > 2) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(inputValue)}&format=json`);
        const data = await response.json();
        const formattedSuggestions = data.map((suggestion) => ({
          value: suggestion.place_id,  
          label: suggestion.display_name,
          lat: suggestion.lat,
          lon: suggestion.lon, 
        }));
        setSuggestions(formattedSuggestions);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData, 
      event_location: suggestion.label,
      event_latitude: suggestion.lat,
      event_longitude: suggestion.lon,
    });
    setSuggestions([]); //hide suggestions after selection of location
  };

  const sendHttpRequest = async (e) => {
    e.preventDefault(); // Previene il refresh della pagina
    try {
      console.log(formData);
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      {/* Test form per caricare l'evento */}
      <div className="form-screen">
        <h2 className="header-title">Tell us more about your event</h2>
        <form onSubmit={sendHttpRequest}>
          <div>
            <label htmlFor="event_name">Name of your event</label>
            <input
              type="text"
              name="event_name"
              placeholder="Name of your event"
              value={formData.event_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="event_date">Select Date</label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="event_start_time">Select Starting Time</label>
              <input
                type="time"
                name="event_start_time"
                value={formData.event_start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label htmlFor="event_end_time">Select Closing Time</label>
              <input
                type="time"
                name="event_end_time"
                value={formData.event_end_time}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="event_location">Location</label>
            <input
              type="text"
              name="event_location"
              placeholder="Location"
              value={formData.event_location}
              onChange={handleChange}
              required
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-dropdown">
                {suggestions.map((suggestion) => (
                  <li key={suggestion.value} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button type="submit" className="save-button">Save</button>
        </form>
      </div>
    </>
  );
}

export default EventFormPage;
