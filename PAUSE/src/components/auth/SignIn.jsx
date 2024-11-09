/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { auth, provider } from '../../Firebase/firebase'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../errorPopUp/ErrorPopUp';
import '../../App.css';

const SignIn = () => {

    const [email, setEmail] = useState('Prova111@gmail.com')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false);  // Track login state
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

  
    useEffect(() => {
      // Monitor auth state changes
      const unsubscribe = auth.onAuthStateChanged((user) => {
          setIsLoggedIn(!!user);
      });
      return () => unsubscribe();  // Clean up listener
    }, []);
  
    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                navigate('/');
            })
            .catch((error) => {
                // Handle different types of errors
                let message = 'An unknown error occurred.';
                if (error.code === 'auth/invalid-email') {
                  message = 'The email address is not valid.';
                } else if (error.code === 'auth/user-disabled') {
                  message = 'The user account has been disabled by an administrator.';
                } else if (error.code === 'auth/user-not-found') {
                  message = 'There is no user record corresponding to this identifier.';
                } else if (error.code === 'auth/wrong-password') {
                  message = 'The password is invalid or the user does not have a password.';
                } else if (error.code === 'auth/user-token-expired') {
                message = 'The user is already signed in.';
                }
                setErrorMessage(message);
              });
    }
  
    const handleSignOut = () => {
      signOut(auth)
          .then(() => {
              setIsLoggedIn(false);  // Update state after sign-out
          })
          .catch((error) => console.error('Sign out error:', error));
    };

    return (
      <div className='sign-in-container'>
      <div className='login_body'>
        <div className="login_body">
            {isLoggedIn ? (
                <div>
                    <p>Welcome back!</p>
                    <button onClick={handleSignOut} className="sign-button" style={{height: '5vh', width: '15vw'}}>Sign Out</button>
                </div>
            ) : (
            <form onSubmit={handleSignIn}>
                <p className='header-title' style={{ textAlign: 'center', color: 'white' }}>Log In</p>
                <input className='input'
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>
                </input>
                <input className='input'
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <div className="button-container">
                  <button className="sign-button" type='submit' style={{marginBottom:'10px'}}>Sign In</button>
                </div>
                <div className="button-container">
                  <button className="sign-button" type='submit' style={{marginBottom:'10px'}}>Sign In</button>
                </div>
            </form>
          )}
        </div>
            <ErrorPopup message={errorMessage} onClose={() => setErrorMessage('')} />
      </div>
  </div>
    )
}

export default SignIn