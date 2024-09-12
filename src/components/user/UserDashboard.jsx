// Компонент UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig'; // Используем api, который настроен для запросов к серверу
import LogoutButton from '../LogoutButton';
import './UserDashboard.scss'

const UserDashboard = () => {
  const [userData, setUserData] = useState([]); // Локальный стейт для хранения данных пользователей
  const [error, setError] = useState(null); // Локальный стейт для ошибки

  // Функция для получения данных команды пользователя
  const fetchTeamUsers = async () => {
    try {
      const response = await api.get('/user/team'); // Запрос к серверу
      setUserData(response.data); // Сохраняем данные пользователей в стейт
    } catch (error) {
      console.error('Ошибка при загрузке данных команды:', error);
      setError(error); // Устанавливаем ошибку, если что-то пошло не так
    }
  };

  // Запрашиваем данные команды при загрузке компонента
  useEffect(() => {
    fetchTeamUsers();
  }, []);

  if (error) {
    return <div>Ошибка при загрузке данных команды: {error.message}</div>;
  }

  return (
    <div>
      <h1>Команда пользователя</h1>
      <LogoutButton />
      <table className="custom-table">
         <thead>
            <tr><th>ID</th><th>Имя</th><th>Роль</th></tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.id}><td>{user.id}</td><td>{user.username}</td><td>{user.role}</td></tr>
            ))}
          </tbody>
        </table>

    </div>
  );
};

export default UserDashboard;
