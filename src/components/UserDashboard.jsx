import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../features/authSlice'; // Импорт fetchUserData из authSlice
import { selectUserProfile, setProfile } from '../features/userSlice'; // Импортируем селектор и экшен из userSlice
import LogoutButton from './LogoutButton';

const UserDashboard = () => {
  const dispatch = useDispatch();

  // Извлекаем данные профиля пользователя из userSlice
  const { profile, status, error } = useSelector((state) => state.user);  // Используем user вместо auth

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserData()).then((response) => {
        // Когда данные загружены, сохраняем их в userSlice
        if (response.payload) {
          dispatch(setProfile(response.payload));
        }
      });
    }
  }, [dispatch, profile]);

  if (status === 'loading') {
    return <div>Загрузка данных...</div>;
  }

  if (error) {
    return <div>Ошибка при загрузке данных: {error}</div>;
  }

  return (
    <div>
      <h1>Добро пожаловать, {profile ? profile.username : 'Гость'}!</h1>
      <LogoutButton />
    </div>
  );
};

export default UserDashboard;
