// src/components/TeamLeaderDashboard.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeamData, approveRequest, rejectRequest } from '../features/teamSlice';

const TeamLeaderDashboard = () => {
  const dispatch = useDispatch();
  const { teamData, status, error } = useSelector((state) => state.team);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTeamData()); // Получаем данные о команде
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return <p>Загрузка данных...</p>;
  }

  if (status === 'failed') {
    return <p>Ошибка: {error}</p>;
  }

  const handleApprove = (requestId) => {
    dispatch(approveRequest(requestId)); // Обработка одобрения запроса
  };

  const handleReject = (requestId) => {
    dispatch(rejectRequest(requestId)); // Обработка отклонения запроса
  };

  return (
    <div>
      <h1>Team Leader Dashboard</h1>
      {teamData ? (
        <div>
          <h2>Участники команды</h2>
          <ul>
            {teamData.users.map((user) => (
              <li key={user.id}>
                {user.username} — {user.role}
              </li>
            ))}
          </ul>

          <h2>Запросы пользователей</h2>
          <ul>
            {teamData.requests.map((request) => (
              <li key={request.id}>
                <p>Пользователь: {request.username}</p>
                <p>Запрошенная сумма: {request.amount}</p>
                <p>Ссылка: {request.link}</p>
                <p>Количество: {request.quantity}</p>
                <button onClick={() => handleApprove(request.id)}>Одобрить</button>
                <button onClick={() => handleReject(request.id)}>Отклонить</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Нет данных о команде</p>
      )}
    </div>
  );
};

export default TeamLeaderDashboard;
