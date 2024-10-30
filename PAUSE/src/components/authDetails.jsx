/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged} from 'firebase/auth'
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

    return (
        <div>
          {user ? (
            <div>
                <p>Welcome, {user.displayName ? user.displayName : user.email}</p>
                {/* <button onClick={userSignOut}>Sign Out</button> */}
            </div>
<<<<<<< Updated upstream
          ) : (
            <p>No user is signed in</p>
          )}
=======
            ) : (
                console.log('No user logged in')
            )}
>>>>>>> Stashed changes
        </div>
      );
}

export default AuthDetails