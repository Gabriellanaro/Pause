/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, provider } from '../Firebase/firebase'

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState(null)

    useEffect(() => {
        // Firebase auth
        const listener = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
            }
        })
        return () => {
            listener()
        }

    }, [])

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('Signed Out with success!')
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <div>{authUser ? <><p>{`Signed In as ${authUser.email}`}</p> <button onClick={userSignOut}>Sign Out</button></> : <p>Signed Out</p>}</div>
    )
}

export default AuthDetails