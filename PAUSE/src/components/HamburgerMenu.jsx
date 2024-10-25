/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../app.css';  // CSS file for styling

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle menu open/close
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="hamburger-menu">
            <button className="menu-icon" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            <nav className={`side-menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><a href="/profile">Profile</a></li>
                    <li><a href="/your-events">Your events</a></li>
                    <li><a>Logout</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default HamburgerMenu;
