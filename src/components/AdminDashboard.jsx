// AdminDashboard.jsx
import React from 'react';
import LogoutButton from './LogoutButton';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Админ Панель</h1>
      
      <LogoutButton /> {/* Кнопка выхода */}
      <p>Добро пожаловать в админскую панель.</p>
    </div>
  );
};

export default AdminDashboard;
