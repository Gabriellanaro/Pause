/* eslint-disable no-unused-vars */
// src/screens/UserRegistrationPage.jsx
import React, { useState, useEffect} from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import '../App.css';

function UserRegistrationPage() {

    const navigate = useNavigate(); // Navigation object to redirect the user
    const { user } = useUser(); // Access the user information
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: '',
    });

  const [message, setMessage] = useState(null); // Error message
  
  // Pre-fill the email field if the user is authenticated
  useEffect(() => {
    if (user && user.email) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        email: user.email,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match!");
      return;
    }
    try {
      console.log(formData); // You can handle your registration logic here

      const response = await fetch('http://localhost:5000/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });
      
      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Optional: Show success alert

        // Redirect to the home page after successful registration
        navigate("/");
      } else {
        alert(result.error); // Handle any error from backend
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user");
    }
  };

  return (
    <>
      {/* User Registration Form */}
      <div className="form-screen">
        <h2 className="header-title">Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first_name">First Name</label>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="last_name">Last Name</label>
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="save-button">Register</button>
        </form>
      </div>
    </>
  );
}

export default UserRegistrationPage;
