/* eslint-disable no-unused-vars */
// src/screens/UserProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import "../App.css";
import BackButton from "../components/BackButton";

function UserProfilePage() {
    const { user } = useUser(); // Access user data from context
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const fetchUser = async () => {
          if (!user.email) {
            console.error('User email is not available');
            return;
          }
    
            try {
            const response = await fetch(`http://127.0.0.1:5000/users/${user.email}`); // Ensure this matches your backend endpoint
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const rawText = await response.text(); // Read raw text of response
    
            // If the response body is empty or not JSON, log it
            const data = JSON.parse(rawText || '{}'); // Handle empty or invalid JSON
            console.log('Fetched user data:', data);
            if (data.user) {
                setUserData(data.user);
            } else {
              console.error('User not found');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
    
        fetchUser();
      }, [user]);

    return (
      <div className="form-screen">
      <BackButton />
      <div style={{ marginTop: '20px' }}></div>
      <h2 className="header-title">Your Profile</h2>
      <form>
      <div className="profile-picture-container">
        <label htmlFor="profile-picture-input">
          {userData && userData.profile_picture ? (
            <img
              src={userData.profile_picture}
              alt="Profile"
              className="profile-picture"
            />
          ) : (
            <div className="profile-picture-placeholder"></div>
          )}
        </label>
        <input
          type="file"
          id="profile-picture-input"
          name="profile_picture"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setUserData({ ...userData, profile_picture: reader.result });
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      </div>
      <div>
        <label htmlFor="first_name">First Name</label>
        <input
          type="text"
          name="first_name"
          value={userData ? userData.first_name : ''}
          onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
        />
      </div>
      <div>
      <label htmlFor="last_name">Last Name</label>
      <input
        type="text"
        name="last_name"
        value={userData ? userData.last_name : ''}
        onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
      />
      </div>
      <div>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        value={userData ? userData.username : ''}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
      />
      </div>
      <div>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        value={userData ? userData.email : ''}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      </div>
      <button
      type="submit"
      className="save-button"
      style={{ width: '100%' }}
      onClick={async (e) => {
        e.preventDefault();
        try {
        const response = await fetch(`http://127.0.0.1:5000/users/${user.email}`, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        });

        if (!response.ok) {
        throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('User data updated successfully:', data);
        } catch (error) {
        console.error('Error updating user data:', error);
        }
      }}
      >
      Save
      </button>
      </form>
      </div>
    );
}

export default UserProfilePage;
