import React, { useState } from "react";
import '../App.css';  // Assuming your CSS is in App.css

function EventFormPage() {
  const [showForm, setShowForm] = useState(false);  // This controls which page is visible
  const [formData, setFormData] = useState({
    event_name: '',
    event_description: '',
    event_date: '',
    event_start_time: '',
    event_end_time: '',
    event_location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sendHttpRequest = async (e) => {
    e.preventDefault();
    try {
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
      {/* Only show "+" screen if showForm is false */}
      {!showForm ? (
        <div className="plus-screen">
          <button className="add-event-button" onClick={() => setShowForm(true)}>
            <span className="add-icon">+</span>
          </button>
        </div>
      ) : (
        // Show the form screen after the "+" button is clicked
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
      )}
    </>
  );
}

export default EventFormPage;
