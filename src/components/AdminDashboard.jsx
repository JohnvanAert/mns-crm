// src/components/AdminDashboard.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminData } from '../features/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { adminData, status, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAdminData());  // Получаем данные для админа
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <p>Загрузка данных...</p>;
  }

  if (status === 'failed') {
    return <p>Ошибка: {error}</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {adminData ? (
        <div>
          <p>Всего пользователей: {adminData.totalUsers}</p>
          <p>Всего команд: {adminData.totalTeams}</p>
          {/* Здесь добавьте больше информации и функционала для админа */}
        </div>
      ) : (
        <p>Нет данных для администратора</p>
      )}
    </div>
  );
};

export default AdminDashboard;
