/* eslint-disable no-unused-vars */
import React from 'react';
import { useState } from 'react';
import img from '../assets/img.jpg';
import '../App.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import {signInWithPopup} from 'firebase/auth';
import { auth, provider } from "../Firebase/firebase";
<<<<<<< Updated upstream
import { useNavigate } from 'react-router-dom';

=======
import { useNavigate, Link} from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
>>>>>>> Stashed changes
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import AuthDetails from '../components/AuthDetails';
import ErrorPopup from '../components/errorPopUp/ErrorPopUp';


const LoginPage = () => {
<<<<<<< Updated upstream
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState(null);
=======
  // const [inputText, setInputText] = useState('');
  // const [data, setData] = useState(null);
  const { user } = useUser();
>>>>>>> Stashed changes
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User info is available here
<<<<<<< Updated upstream
        console.log(result.user);
        navigate('/map'); // Navigate to home page
=======
        // console.log(result.user);
        setUser(result.user); // Set user in context
        navigate('/'); // Navigate to home page
>>>>>>> Stashed changes
      })
      .catch((error) => {
        // Handle different types of errors
        let message = 'An unknown error occurred.';
        if (error.code === 'auth/popup-closed-by-user') {
          message = 'The popup was closed by the user before completing the sign-in.';
        } else if (error.code === 'auth/cancelled-popup-request') {
          message = 'The popup request was cancelled.';
        } else if (error.code === 'auth/network-request-failed') {
          message = 'A network error occurred.';
        } else if (error.code === 'auth/invalid-credential') {
          message = 'The credential is invalid.';
        }
        setErrorMessage(message);
      });
  };

  
  const sendHttpRequest = async () => {
    try {

      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  return (
    <div style={{flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
      <div>
        <img src={img} alt="logo" />
      </div>
        <div className='event-title' style={{fontSize: '60'}}>PAUSE</div>

      <div>
        <SignIn />
        <AuthDetails />
        {/* <SignUp /> */}
        
        {!user && (
        <button onClick={signInWithGoogle} className="google-sign-in-btn">
          <img src="../public/7123025_logo_google_g_icon.png" alt="Google logo" />
          Sign in with Google
        </button>
        
        )}
        {!user && (
        <div className="signup-link">
          Don&apos;t have an account? <Link to="/registration">Sign up</Link>
        </div>
        )}
      </div>

      <ErrorPopup message={errorMessage} onClose={() => setErrorMessage('')} />

    </div>
  );
};

export default LoginPage;
