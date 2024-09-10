// TeamLeaderDashboard.jsx
import React from 'react';
import LogoutButton from './LogoutButton';

const TeamLeaderDashboard = () => {
  return (
    <div>
      <h1>Панель Тимлидера</h1>
      <LogoutButton /> {/* Кнопка выхода */}
      <p>Добро пожаловать в панель тимлидера.</p>
    </div>
  );
};

export default TeamLeaderDashboard;
