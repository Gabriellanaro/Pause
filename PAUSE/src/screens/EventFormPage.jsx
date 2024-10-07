// src/screens/EventFormPage.js
import React from "react";
import { useState } from 'react'
import '../App.css'


function EventFormPage() {

  const [formData, setFormData] = useState({
    event_name: 'test name',
    event_description: 'beautiful clothes',
    event_date: '2024-10-12',
    event_start_time: '10:00',
    event_end_time: '14:01',
    event_location: 'via pippo',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    

  const sendHttpRequest = async (e) => {
    e.preventDefault(); //prevents refreshh of the page
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
      {/* test form to upload event */}        
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
            </div>
            <button type="submit" className="save-button">Save</button>
          </form>
        </div>
    </>
  )
}

export default EventFormPage