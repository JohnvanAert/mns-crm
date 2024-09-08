import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../features/userSlice';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Получаем состояние пользователя из Redux
  const { username, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login'); // Если токен не найден, перенаправляем на страницу входа
    } else {
      dispatch(fetchUserData()); // Загружаем данные о пользователе
    }
  }, [dispatch, navigate]);

  if (loading) {
    return <div>Загрузка данных...</div>; // Пока данные загружаются, отображаем сообщение
  }

  if (error) {
    return <div>Ошибка при загрузке данных: {error}</div>; // Обрабатываем ошибки
  }

  return (
    <div>
      <h1>Добро пожаловать, {username || 'Гость'}!</h1>
    </div>
  );
};

export default UserDashboard;
