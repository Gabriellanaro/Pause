/* eslint-disable no-unused-vars */
// src/screens/EventFormPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import { FaArrowLeft } from 'react-icons/fa';   // Import FontAwesome left arrow icon
import '../App.css';

function EventFormPage() {
  const navigate = useNavigate();  // Initialize the useNavigate hook

  const [formData, setFormData] = useState({
    event_name: '',
    event_description: '',
    event_date: '',
    event_start_time: '',
    event_end_time: '',
    event_location: '',
    event_image: null,  // For image upload
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    setFormData({
      ...formData,
      event_image: e.target.files[0],  // Get the uploaded file
    });
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
          <button type="submit" className="save-button">Save</button>
        </form>
      </div>
    </>
  );
}

export default EventFormPage;
