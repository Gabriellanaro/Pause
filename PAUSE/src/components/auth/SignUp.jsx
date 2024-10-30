/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { auth, provider } from '../../Firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import ErrorPopup from '../errorPopUp/ErrorPopUp';
import '../../App.css';

const SignUp = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSignUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
                navigate('/map')
            })
            .catch((error) => {
                // Handle different types of errors
                let message = 'An unknown error occurred.';
                if (error.code === 'auth/email-already-in-use') {
                  message = 'The email address is already in use by another account.';
                } else if (error.code === 'auth/invalid-email') {
                  message = 'The email address is not valid.';
                } else if (error.code === 'auth/operation-not-allowed') {
                  message = 'Email/password accounts are not enabled.';
                } else if (error.code === 'auth/weak-password') {
                  message = 'The password is too weak.';
                }
                setErrorMessage(message);
              });
    }

    return (
        <div className='sign-in-container'>
            <form onSubmit={handleSignUp}>
                <h1 style={{ color: 'white' }}>Create an account</h1>
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
<<<<<<< Updated upstream
                <button type='submit'>Sign Up</button>
=======
                <div className="button-container">
                  <button className="sign-button" type='submit'>Sign Up</button>
                </div>
>>>>>>> Stashed changes
            </form>

            <ErrorPopup message={errorMessage} onClose={() => setErrorMessage('')} />
        </div>

    )
}

export default SignUp