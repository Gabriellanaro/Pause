/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, provider } from '../Firebase/firebase'
import { useUser } from '../contexts/UserContext';

const AuthDetails = () => {
    // const [authUser, setAuthUser] = useState(null)
    const { user, setUser } = useUser();

    useEffect(() => {
        // Firebase auth
        const listener = onAuthStateChanged(auth, (user) => {
            if (user) {
                // setAuthUser(user)
                setUser(user);
            } else {
                // setAuthUser(null)
                setUser(null);
            }
        })
        return () => {
            listener()
        }

    }, [setUser])

    const userSignOut = () => {
        signOut(auth).then(() => {
            console.log('Signed Out with success!')
        }).catch((error) => {
            console.error(error)
        })
    }

    return (
        <div>
          {user ? (
            <div>
                <p>Welcome, {user.displayName ? user.displayName : user.email}</p>
                <button onClick={userSignOut}>Sign Out</button>
            </div>
          ) : (
            <p className="event-subtitle" style={{ fontSize: '0.9vw', textAlign: 'center' }}>No user is signed in</p>
          )}
        </div>
      );
}

export default AuthDetails