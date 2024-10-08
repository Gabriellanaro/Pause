/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { auth, provider } from '../../Firebase/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

const SignUp = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
            }).catch((error) => {
                console.error(error);
            })
    }

    return (
        <div className='sign-in-container'>SignUp
            <form onSubmit={signUp}>
                <h1 style={{ color: 'white' }}>Create an account</h1>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>
                </input>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <button type='submit'>Sign Up</button>
            </form>

        </div>

    )
}

export default SignUp