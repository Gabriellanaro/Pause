/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { FaPlus } from 'react-icons/fa'; // Import FaPlus icon
import { useUser } from '../contexts/UserContext';
import HamburgerMenu from '../components/HamburgerMenu';
import LoginConfirmPopup from '../components/LoginConfirmPopup';
import img from '../assets/logo_nobackground.png';
import '../app.css';

const Header = ({ title, navigation, onTagClick, selectedTags = [] }) => {
    const { user } = useUser(); // Get the user object from the UserContext
    const navigate = useNavigate(); // Create navigate function
    const location = useLocation(); // Get the current location
    const [showLoginConfirm, setShowLoginConfirm] = useState(false); // Track logout confirmation popup

    const handleAddEventClick = () => {
        console.log(user);
        if (user) {
            navigate('/event-form'); // Navigate to event form if user is logged in
        } else if (user === null) {
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

    const renderSwitchViewButtons = () => {
        const buttonConfigs = navigation
            ? [
                { text: 'Feed View', path: '/' },
                { text: 'Map View', path: '/map' },
            ]
            : [
                { text: 'Feed View', path: '/your-events' },
                { text: 'Map View', path: '/your-events-map' },
            ];
    
        return (
            <>
                {buttonConfigs.map(({ text, path }) => (
                    <button
                        key={path}
                        className={`switchview-button ${location.pathname === path ? 'active' : ''}`}
                        onClick={() => navigate(path)}
                    >
                        {text}
                    </button>
                ))}
            </>
        );
    };
    
    const tags = ['Shop', 'Flea Market', 'Garage Sale', 'Other'];
    
    // Effect to monitor selectedTags changes and log it
    
    const handleTagClick = (tag) => {
        // Aggiungi o rimuovi il tag dai tag selezionati
        if (selectedTags.includes(tag)) {
            // Se il tag è già selezionato, rimuovilo
            onTagClick(selectedTags.filter((item) => item !== tag));
        } else {
            // Altrimenti aggiungilo
            onTagClick([...selectedTags, tag]);
        }
        console.log("Updated selectedTags from Header:", selectedTags); // Log selectedTags every time it changes
    };
    
    return (
        <div>
            <header className="header">
                <div className="left-container">
                    {/* <div className="logo-container">
                        <img src={img} alt="logo" className="logo" />
                        <span className="logo-text">Pause</span>
                    </div> */}
                    <HamburgerMenu />
                </div>  
                <h1 className="feed-title">{title}</h1>
                <button className="add-event-button" onClick={handleAddEventClick}>
                    <FaPlus className="add-icon" />
                </button>
            </header>
    
            <section className="feed-controls">
                <div className="tags">
                    {renderSwitchViewButtons()}
                </div>
                <div className="tags">
                {tags.map((tag) => (
                    <span 
                    key={tag} 
                    className={`tag ${selectedTags.includes(tag) ? 'active' : ''}`} 
                    onClick={() => handleTagClick(tag)} // Gestisci il click
                    >
                    {tag}
                    </span>
                ))}
                </div>
            </section>
    
            {/* Show Login Confirm Popup if the user is not logged in and tries to add an event */}
            {showLoginConfirm && (
                <LoginConfirmPopup onConfirm={confirmLogin} onCancel={cancelLogin} />
            )}
        </div>
    );
};

export default Header;
