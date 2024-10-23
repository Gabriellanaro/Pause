/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { auth, provider } from '../../Firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../errorPopUp/ErrorPopUp';
import '../../App.css';

const SignIn = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                navigate('/map');
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

    return (
        <div className='sign-in-container'>
            <form onSubmit={handleSignIn}>
                <h1 style={{ color: 'white' }}>Log In</h1>
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
                <button type='submit'>Sign In</button>
            </form>

            <ErrorPopup message={errorMessage} onClose={() => setErrorMessage('')} />
        </div>

    )
}

export default SignIn