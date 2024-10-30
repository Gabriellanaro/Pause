// src/components/BackButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';  // Import the same icon
import '../App.css';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Navigate back to the FeedPage or previous page
  };

  return (
    <button className="back-button" onClick={handleBackClick}>
      <FaArrowLeft size={30} />
    </button>
  );
};

export default BackButton;
