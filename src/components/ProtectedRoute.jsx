import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ component: Component }) => {
  const token = localStorage.getItem('authToken');
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5001/api/validate-token', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.log('Token validation failed:', error.response.data); // Лог ошибки
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      });
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  if (isAuthenticated === null) {
    // Можно добавить спиннер для загрузки, пока идет проверка токена
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default ProtectedRoute;
