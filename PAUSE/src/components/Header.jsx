/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { FaPlus } from 'react-icons/fa'; // Import FaPlus icon
import { useUser } from '../contexts/UserContext';
import HamburgerMenu from '../components/HamburgerMenu';
import LoginConfirmPopup from '../components/LoginConfirmPopup';
import '../app.css';

const Header = () => {
    const { user } = useUser(); // Get the user object from the UserContext
    const navigate = useNavigate(); // Create navigate function
    const location = useLocation(); // Get the current location
    const [showLoginConfirm, setShowLoginConfirm] = useState(false); // Track logout confirmation popup

    const handleAddEventClick = () => {
        console.log(user);
        if (user) {
          navigate('/event-form'); // Navigate to event form if user is logged in
        } else if(user === null) {
          setShowLoginConfirm(true);
        }
      };
    
    const confirmLogin = () => {
        setShowLoginConfirm(false);  // Hide confirmation popup
        localStorage.setItem('redirectAfterLogin', 'true');
        navigate('/login');
    };
  
    const cancelLogin = () => {
        setShowLoginConfirm(false);  // Hide confirmation popup
    };

    return (
        <div>
            <HamburgerMenu />
            <h1 className="feed-title">HOT IN COPENHAGEN</h1>
            <button className="add-event-button" onClick={handleAddEventClick}>
                <FaPlus className="add-icon" />
            </button>

            <div className="feed-controls">
                <div className="tags">
                    {/* Conditionally add 'active' class based on the current route */}
                    <button
                        className={`switchview-button ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={() => navigate('/')}
                    >
                        Feed View
                    </button>
                    <button
                        className={`switchview-button ${location.pathname === '/map' ? 'active' : ''}`}
                        onClick={() => navigate('/map')}
                    >
                        Map View
                    </button>
                </div>
                <div className="tags">
                    <span className="tag">Tag 1</span>
                    <span className="tag">Tag 2</span>
                    <span className="tag">Tag 3</span>
                </div>
            </div>
            {/* Show Login Confirm Popup if the user is not logged in and tries to add an event */}
            {showLoginConfirm && (
                <LoginConfirmPopup onConfirm={confirmLogin} onCancel={cancelLogin} />
            )}
        </div>

    );
}

export default Header;
