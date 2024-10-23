/* eslint-disable no-unused-vars */
// src/screens/EventFormPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import { FaArrowLeft } from 'react-icons/fa';   // Import FontAwesome left arrow icon
import '../App.css';

function EventFormPage() {
  const navigate = useNavigate();  // Initialize the useNavigate hook

  // Handle input change
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

  // Handle image upload
  const handleImageUpload = (e) => {
    setFormData({
      ...formData,
      event_image: e.target.files[0],  // Get the uploaded file
    });

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

  // Send HTTP request to backend
  const sendHttpRequest = async (e) => {
    e.preventDefault();  // Prevent form from reloading

    // Create form data to send the image and other details
    const formDataToSend = new FormData();
    formDataToSend.append('event_name', formData.event_name);
    formDataToSend.append('event_description', formData.event_description);
    formDataToSend.append('event_date', formData.event_date);
    formDataToSend.append('event_start_time', formData.event_start_time);
    formDataToSend.append('event_end_time', formData.event_end_time);
    formDataToSend.append('event_location', formData.event_location);
    if (formData.event_image) {
      formDataToSend.append('event_image', formData.event_image);  // Append image if uploaded
    }

    e.preventDefault(); // Previene il refresh della pagina

    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        body: formDataToSend,  // Send form data
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Back button functionality
  const handleBackClick = () => {
    navigate('/');  // Navigate back to the FeedPage
  };

  return (
    <>
      <div className="form-screen">
        
        {/* Back button with arrow */}
        <button onClick={handleBackClick} className="back-button">
          <FaArrowLeft size={30} />
        </button>

        <h2 className="header-title">Tell us more about your event</h2>

        <form onSubmit={sendHttpRequest}>
          
          {/* Image Upload Field */}
          <div>
            <label htmlFor="event_image">Upload your cover</label>
            <input 
              type="file"
              name="event_image"
              accept="image/*"
              onChange={handleImageUpload}
              className="image-upload"
            />
          </div>
          
          {/* Input Fields with Placeholders */}
          <div>

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

          {/* Description Input Field */}
          <div>
            <textarea
              name="event_description"
              placeholder="Event Description"
              value={formData.event_description}
              onChange={handleChange}
              rows="5"
              required
            />
          </div>
          
          <div>
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

              <input
                type="time"
                name="event_start_time"
                placeholder="Select Starting Time"
                value={formData.event_start_time}
                onChange={handleChange}
                required
              />
            </div>
            <div style={{ flex: 1 }}>

              <input
                type="time"
                name="event_end_time"
                placeholder="Select Closing Time"
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
          </div>

          {/* Submit Button */}
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
