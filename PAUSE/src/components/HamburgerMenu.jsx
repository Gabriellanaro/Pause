/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import { auth } from '../Firebase/firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../app.css';

const HamburgerMenu = () => {
    const user = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // Track logout confirmation popup

    const userName = user.user ? user.user.email : 'Guest';

    // Toggle menu open/close
    const toggleMenu = () => setIsOpen(!isOpen);

    useEffect(() => {
        // Monitor auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();  // Clean up listener
    }, []);

    const handleLogoutClick = () => {
        if (!isLoggedIn) {
            console.warn('User is not logged in. No need to logout.');
            return;
        }
        setShowLogoutConfirm(true);  // Show confirmation popup
    };
    
    const handleLoginClick = () => {
        navigate("/login")
    };

    const confirmLogout = () => {
        signOut(auth)
            .then(() => {
                setIsLoggedIn(false);  // Update state after sign-out
                setShowLogoutConfirm(false);  // Hide confirmation popup
                navigate('/');
            })
            .catch((error) => console.error('Sign out error:', error));
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);  // Hide confirmation popup
    };

    return (
        <div className={`hamburger-menu ${showLogoutConfirm ? 'blur-background' : ''}`}>
            <button className="menu-icon" onClick={toggleMenu}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>
            
            <nav className={`side-menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    Hi, {userName}
                    
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href={isLoggedIn ? "/profile" : "/login"}>
                            Profile
                        </a>
                    </li>
                    <li><a href="/your-events">Your events</a></li>
                    {isLoggedIn ? (
                        <li>
                            <button className="logout-button" onClick={handleLogoutClick}>
                                Logout
                            </button>
                        </li>
                    ) : (
                        <button className="logout-button" onClick={handleLoginClick}>
                                Login
                        </button>
                    )
                    }
                </ul>
            </nav>

            {showLogoutConfirm && (
                <div className="logout-confirm-popup">
                    <div className="popup-content">
                        <p>Are you sure you want to logout?</p>
                        <button className="confirm-button" onClick={confirmLogout}>Yes</button>
                        <button className="cancel-button" onClick={cancelLogout}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
