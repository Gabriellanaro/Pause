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
      <h1>PAUSE</h1>
      <h2>Take a break from fast fashion</h2>

      {/* test form to upload event */}
      <form onSubmit={sendHttpRequest}>
      <div>
        <label htmlFor="event_name">Name of the Event:</label>
        <input
          type="text"
          name="event_name"
          placeholder='My amazing clothes'
          value={formData.event_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="event_description">Description:</label>
        <textarea
          name="event_description"
          value={formData.event_description}
          placeholder='female clothes, all sizes, all colors'
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="event_date">Date:</label>
        <input
          type="date"
          name="event_date"
          value={formData.event_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="event_start_time">Start time</label>
        <input
          type="time"
          name="event_start_time"
          value={formData.event_start_time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="event_end_time">End time</label>
        <input
          type="time"
          name="event_end_time"
          value={formData.event_end_time}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="event_location">Location</label>
        <input
          type="text"
          name="event_location"
          value={formData.event_location}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Crea Evento</button>
    </form>
      

      
      
      {/* {data && (
        <div>
          <h2>Fetched Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )} */}
    </>
  )
}

export default EventFormPage