/* eslint-disable */

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const UsersContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
      if (location.pathname === '/admin/login') {
        navigate('/admin/customers', { replace: true });
      }

      console.log(location);
    } else {
      navigate('/admin/login', { replace: true });
    }
  }, [localStorage.getItem('currentUser')]);

  return (
    <UsersContext.Provider value={{ currentUser }}>
      {children}
    </UsersContext.Provider>
  );
};

export default UserProvider;
