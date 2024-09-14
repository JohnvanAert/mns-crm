import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig'; // Используем api, который настроен для запросов к серверу
import './UserDashboard.scss';
import AddRequestForm from './AddRequestForm'; // Импортируем компонент формы заявки
import Navbar from '../Navbar/Navbar';

const UserDashboard = () => {
  const [userData, setUserData] = useState([]); // Локальный стейт для хранения данных пользователей
  const [error, setError] = useState(null); // Локальный стейт для ошибки
  const [isModalOpen, setIsModalOpen] = useState(false); // Стейт для управления модальным окном

  // Функция для получения данных команды пользователя
  const fetchTeamUsers = async () => {
    try {
      const response = await api.get('/teams'); // Запрос к серверу
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

  // Функции для открытия и закрытия модального окна
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (error) {
    return <div>Ошибка при загрузке данных команды: {error.message}</div>;
  }

  return (
    <div className='userDashboard'>
      <Navbar />
      <div className='headSet'>
        <h1>Команда пользователя</h1>
      </div>
      <div className='midSet'>
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
      
      {/* Кнопка открытия модального окна */}
      <button onClick={handleOpenModal}>Добавить заявку</button>

      {/* Модальное окно с формой добавления заявки */}
      {isModalOpen && <AddRequestForm onClose={handleCloseModal} />}
    </div>
  );
};

export default UserDashboard;
