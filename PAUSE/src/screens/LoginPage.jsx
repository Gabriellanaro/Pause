/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import img from '../assets/img.jpg';
import '../App.css';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
// import { signInWithPopup, GoogleAuthProvider } from "./firebase/auth";
import {signInWithPopup} from 'firebase/auth';
import { auth, provider } from "../Firebase/firebase";

import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';
import AuthDetails from '../components/AuthDetails';

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // User info is available here
      console.log(result.user);
    })
    .catch((error) => {
      console.error(error);
    });
};

const LoginPage = () => {
  const [count, setCount] = useState(0)
  const [data, setData] = useState(null)
  const [inputText, setInputText] = useState('')

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
    <>
      <div>
        <img src={img} alt="logo" />
        <h1 style={{ color: 'white' }}>PAUSE</h1>
        <h2>Take a break from fast fashion</h2>
      </div>

      <div>
        <SignIn />
        <SignUp />
        <AuthDetails />
      </div>
    </>
  );
};

export default LoginPage;
