import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      try {
        // Проверяем сессию
        const response = await api.get('/api/check-session');
        if (response.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUserRole(response.data.user.role); // Устанавливаем роль пользователя из ответа
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Если пользователь не аутентифицирован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Если требуется определённая роль и роль пользователя не совпадает, перенаправляем на другую страницу
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" />; // Страница, если доступ запрещён
  }

  return children;
};

export default ProtectedRoute;
