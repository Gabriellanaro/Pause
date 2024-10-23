/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Optional: Create a separate CSS file for styling

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <button className="back-button" onClick={handleBackClick}>
      &#8592;
    </button>
  );
};

export default BackButton;
