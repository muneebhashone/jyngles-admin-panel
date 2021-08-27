/* eslint-disable */

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const UsersContext = createContext();

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      setCurrentUser(JSON.parse(localStorage.getItem('currentUser')));
      navigate('/admin/customers', { replace: true });
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
