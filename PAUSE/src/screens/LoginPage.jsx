/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import img from '../assets/img.jpg';
import '../App.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
// import {GoogleAuthProvider } from "./firebase/auth";
import {signInWithPopup} from 'firebase/auth';
import { auth, provider } from "../Firebase/firebase";
import { useNavigate } from 'react-router-dom';

import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import AuthDetails from '../components/AuthDetails';


const LoginPage = () => {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  const [inputText, setInputText] = useState('')
  const navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User info is available here
        console.log(result.user);
        navigate('/map'); // Navigate to home page
      })
      .catch((error) => {
        // Handle different types of errors
        if (error.code === 'auth/popup-closed-by-user') {
          console.error('The popup was closed by the user before completing the sign-in.');
        } else if (error.code === 'auth/cancelled-popup-request') {
          console.error('The popup request was cancelled.');
        } else if (error.code === 'auth/network-request-failed') {
          console.error('A network error occurred.');
        } else {
          console.error('An unknown error occurred:', error);
        }
      });
  };

  // const sendHttpRequest = async () => {
  //   try {

  //     const response = await fetch('http://localhost:5000/events', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ text: inputText }),
  //     });

  //     const result = await response.json();
  //     setData(result);
  //     console.log(result);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };


  return (
    <div style={{flexDirection: 'column', height: '100vh', overflow: 'auto' }}>
      <div>
        <img src={img} alt="logo" />
      </div>

      <div>
        <SignIn />
        <SignUp />
        <AuthDetails />
        
        <h1>PAUSE</h1>

        <button onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default LoginPage;
