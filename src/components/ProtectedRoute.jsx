import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (token) {
      // Optionally, validate the token on the server
      axios.get('http://localhost:5001/api/validate-token', {
        headers: { 'Authorization': `Bearer ${token}` }
      }).catch(() => {
        localStorage.removeItem('authToken');
      });
    }
  }, [token]);

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If token is valid, render the component
  return <Component />;
};

export default ProtectedRoute;
