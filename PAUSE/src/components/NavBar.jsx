// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
        <div class="navbar-left">
            <p>PAUSE</p> 
        </div>
        <ul class="navbar-right">
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#events">Events</a></li>   
        </ul>   
    </nav>
  );
};

export default Navbar;

