import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../features/authSlice'; // Импорт fetchUserData из authSlice

const UserDashboard = () => {
  const dispatch = useDispatch();

  // Извлекаем данные о пользователе из auth или user slice
  const { user, status, error } = useSelector((state) => state.auth || {});  // auth может быть заменено на user, в зависимости от структуры

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserData());
    }
  }, [dispatch, user]);

  if (status === 'loading') {
    return <div>Загрузка данных...</div>;
  }

  if (error) {
    return <div>Ошибка при загрузке данных: {error}</div>;
  }

  return (
    <div>
      <h1>Добро пожаловать, {user ? user.username : 'Гость'}!</h1>
    </div>
  );
};

export default UserDashboard;
