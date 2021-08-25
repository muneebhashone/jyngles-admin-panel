// import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

const Logout = () => {
  const navigate = useNavigate();

  if (localStorage.getItem('currentUser')) {
    localStorage.removeItem('currentUser');
    navigate('/app/customers', { replace: true });
  }
};

export default Logout;
