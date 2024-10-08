/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { auth, provider } from '../../Firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const SignIn = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
            }).catch((error) => {
                console.error(error);
            })
    }

    return (
        <div className='sign-in-container'>SignIn
            <form onSubmit={signIn}>
                <h1 style={{ color: 'white' }}>Log In</h1>
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
                <button type='submit'>Sign In</button>
            </form>

        </div>

    )
}

export default SignIn