/* eslint-disable no-unused-vars */
// src/screens/EventFormPage.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // Import useNavigate hook
import BackButton from "../components/BackButton";
import { MdDeleteOutline } from "react-icons/md";
import '../App.css';
import { useUser } from "../contexts/UserContext";
import { useEffect } from 'react';
import DeleteConfirmPopup from '../components/DeleteConfirmPopup';

function EditEventPage() {
  
  const { user } = useUser();  // Get the user object from the UserContext
  const navigate = useNavigate();
  const { eventId } = useParams();  // Get the event ID from the URL


  const [formData, setFormData] = useState({
    event_name: '',
    event_description: '',
    event_date: '',
    event_start_time: '',
    event_end_time: '',
    event_location: '',
    event_latitude: '',
    event_longitude: '',
    user_email: user.user_email
  });

  const [loading, setLoading] = useState(true); // State for loading
    // Fetch event details using event ID
    useEffect(() => {
      const fetchEventDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/events/${eventId}`);
          const event = await response.json();
          setFormData({
            event_name: event.event.event_name,
            event_description: event.event.event_description,
            event_date: formatDate(event.event.event_date),
            event_start_time: event.event.event_start_time,
            event_end_time: event.event.event_end_time,
            event_location: event.event.event_location,
            event_latitude: event.event.event_latitude,
            event_longitude: event.event.event_longitude,
            user_email: event.event.user_email
          });
          console.log('Fetched event details:', event.event.event_date);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching event details:', error);
          setLoading(false);
        }
      };
  
      fetchEventDetails();
    }, [eventId]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
  
      // Fetch address suggestions
      if (name === 'event_location') {
        fetchSuggestions(value);
      }
    };

  const [suggestions, setSuggestions] = useState([]); // State for address suggestions


  // Fetch address suggestions
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

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setFormData({
      ...formData,
      event_location: suggestion.label,
      event_latitude: suggestion.lat,
      event_longitude: suggestion.lon,
    });
    setSuggestions([]); // Hide suggestions after selection
  };

    // // Temporary form submission handler --> FUNCTION IF WE DONT HAVE DATABASE
    // const handleFormSubmit = (e) => {
    //   e.preventDefault();  // Prevent form from reloading
    //   console.log('Form submitted with data:', formData);
    //   navigate('/');  // Navigate back to the FeedPage after form submission
    // };

  // Send HTTP request to backend
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form from reloading
    console.log(eventId);

    // Format the event_date before sending
    const updatedFormData = {
      ...formData,
      event_date: formatDate(formData.event_date),  // Ensure event_date is formatted correctly
    };
    // console.log('Form data:', updatedFormData);
    try {
      const response = await fetch(`http://localhost:5000/events_update/${eventId}`, {
        method: 'PUT',  // Use PUT method to update the event
        headers: {
        'Content-Type': 'application/json',  // Specify content type as JSON
      },
        body: JSON.stringify(updatedFormData),  // Send form data
      });
      

      const result = await response.json();

      console.log('Response:', result);
      if (response.ok) {
        navigate(`/`);
      } else {
        console.error('Error updating event:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);  // Create a Date object from the string

    // Get the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');

    // Return the formatted date
    return `${year}-${month}-${day}`;  // Returns in the format yyyy-MM-dd
  }
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);  // Track delete confirmation popup

  const handleDelete = () => {
    setShowDeleteConfirm(true);  // Show confirmation popup
  }

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);  // Hide confirmation popup
    try {
      const response = await fetch(`http://localhost:5000/events_delete/${eventId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        navigate('/');
      } else {
        console.error('Error deleting event:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
    navigate('/');
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false);  // Hide confirmation popup
  }

  return (
    <div className="form-screen">
      {/* Loading Check */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Back button with arrow */}
          <BackButton/>

          <h2 className="header-title">Edit your event</h2>

          <button className="delete-button" style={{ float: 'right'
}} onClick={handleDelete}>
          <MdDeleteOutline /> Delete Event
          </button>
          <form onSubmit={handleSubmit}>
            {/* Input Fields with Placeholders */}
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
                  placeholder="Select Starting Time"
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
          </>
      )}

      {/* Show Delete Confirm Popup */}
        {showDeleteConfirm && (
          <DeleteConfirmPopup onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}
      
    </div>
      );
}
export default EditEventPage;