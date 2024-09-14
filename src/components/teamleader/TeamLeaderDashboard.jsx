import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import './TeamLeaderDashboard.scss';
import Navbar from '../Navbar/Navbar';

const TeamLeaderDashboard = () => {
  const [teamData, setTeamData] = useState([]);
  const [requests, setRequests] = useState([]); // Состояние для заявок

  // Функция для загрузки данных команды
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await api.get('/teams');
        setTeamData(response.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    // Функция для загрузки заявок
    const fetchRequests = async () => {
      try {
        const response = await api.get('/teamleader/requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchTeamData();
    fetchRequests();
  }, []);

  // Функция для одобрения заявки
  const handleApprove = async (requestId) => {
    try {
      await api.put(`/teamleader/requests/${requestId}/approve`);
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: 'approved' } : req
        )
      );
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  // Функция для отклонения заявки
  const handleReject = async (requestId) => {
    try {
      await api.put(`/teamleader/requests/${requestId}/reject`);
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: 'rejected' } : req
        )
      );
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  return (
    <div className='teamleadDashboard'>
      <Navbar />
      <div className="headSet">
        <h1>Team Leader Dashboard</h1>
      </div>
      <div className="midSet">
        <h2>{teamData.length > 0 && teamData[0].team_name}</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {teamData.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Секция для отображения списка заявок */}
      <div className="taskSet">
        <h2>Список заявок на расходы</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Сумма</th>
              <th>Количество</th>
              <th>Ссылка</th>
              <th>Статус</th>
              <th>webmaster</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.amount}</td>
                  <td>{request.quantity || 'Нет описания'}</td>
                  <td>
                    {request.link ? (
                      <a href={request.link} target="_blank" rel="noopener noreferrer">
                        Ссылка
                      </a>
                    ) : (
                      'Нет ссылки'
                    )}
                  </td>
                  <td>{request.status}</td>
                  <td>{request.user_id}</td>
                  <td>
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={request.status !== 'pending'}
                    >
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={request.status !== 'pending'}
                    >
                      Отклонить
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">Заявки отсутствуют</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamLeaderDashboard;
