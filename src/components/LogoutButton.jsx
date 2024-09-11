import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useDispatch } from 'react-redux';

const LogoutButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
      dispatch({ type: 'LOGOUT' });
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
