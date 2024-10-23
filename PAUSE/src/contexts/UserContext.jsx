/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import PropTypes from 'prop-types';
import { auth } from '../Firebase/firebase';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      listener();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export const useUser = () => useContext(UserContext);