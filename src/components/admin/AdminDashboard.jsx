import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { getStatusList, getOrdersByStatus, getOrdersByWebmaster } from '../../api/leadVertexService';
import './AdminDashboard.scss';
import Navbar from '../Navbar/Navbar';
import AddUserModal from '../add-user/AddUserModal';
import AddTeamModal from '../add-team/AddTeamModal'; 
import EditUserModal from '../edit-user/EditUserModal';

const AdminDashboard = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false); 
  const [editMode, setEditMode] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [statusList, setStatusList] = useState([]);
  const [ordersInStatus, setOrdersInStatus] = useState([]);
  const [ordersByWebm, setOrdersByWeb] = useState ([]);
  const [fromDate, setFromDate] = useState('2024-10-01'); // Начальная дата
  const [toDate, setToDate] = useState('2024-10-24'); // Конечная дата
  const [datesUpdated, setDatesUpdated] = useState(false); // Состояние для контроля обновления

// Новый useEffect для получения данных статусов и заказов
useEffect(() => {
  const fetchData = async () => {
    try {
      const statuses = await getStatusList();  // Получаем статусы
      setStatusList(statuses);

      const orders = await getOrdersByStatus(0); // Заказы в статусе "в процессе"
      setOrdersInStatus(orders);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchData();
},[]);

  // Эффект для обновления данных по вебмастерам после сабмита
  useEffect(() => {
    if (datesUpdated) {
      const fetchWebmasterOrders = async () => {
        try {
          const weborders = await getOrdersByWebmaster(fromDate, toDate); // Передаем даты в запрос
          setOrdersByWeb(weborders);
          setDatesUpdated(false); // Сбрасываем флаг обновления после получения данных
        } catch (error) {
          console.error('Error fetching webmaster orders:', error);
        }
      };

      fetchWebmasterOrders();
    }
  }, [datesUpdated, fromDate, toDate]);

  const handleDateSubmit = () => {
    setDatesUpdated(true); // Устанавливаем флаг для триггера обновления данных
  };

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const response = await api.get('/teams');
        
        // Инициализируем пустые массивы пользователей для команд, если их нет
        const teamsWithUsers = response.data.map(team => ({
          ...team,
          users: team.users || [] // Если у команды нет пользователей, устанавливаем пустой массив
        }));

        setTeamsData(teamsWithUsers);
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };

    fetchTeamsData();
  }, [teamsData]);

  const handleAddTeam = async (teamName) => {
    try {
      const response = await api.post('/teams', { name: teamName });
      const newTeam = {
        id: response.data.id, 
        team_name: response.data.name, 
        users: [] // по умолчанию пустой список пользователей
      };

      setTeamsData(prevTeams => [...prevTeams, newTeam]);

      setIsAddTeamModalOpen(false);
      
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.delete(`/teams/${teamId}`);
        setTeamsData(teamsData.filter(team => team.team_id !== teamId));
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        const updatedTeams = teamsData.map(team => ({
          ...team,
          users: team.users.filter(user => user.id !== userId)
        }));
        setTeamsData(updatedTeams);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const updateUserInState = (updatedUser) => {
    const updatedTeams = teamsData.map(team => {
      // Проверяем, к какой команде относится пользователь
      if (team.team_id === updatedUser.team_id) {
        const updatedUsers = team.users.some(user => user.id === updatedUser.id) 
          ? team.users.map(user => user.id === updatedUser.id ? updatedUser : user)
          : [...team.users, updatedUser];  // Добавляем пользователя, если его еще нет
        return { ...team, users: updatedUsers };
      } else {
        return { ...team, users: team.users.filter(user => user.id !== updatedUser.id) };
      }
    });
  
    setTeamsData(updatedTeams);  // Обновляем состояние
  };
  
  const handleEditUser = (user) => {
    setSelectedUser(user); 
    setIsEditUserModalOpen(true); 
  };

  const renderTable = (teamId, teamName, users = []) => (
    <div key={teamId}>
      <h2>{teamName}</h2>
      {editMode && (
        <button onClick={() => handleDeleteTeam(teamId)} className="delete-button">
          Delete Team
        </button>
      )}
      <table className='custom-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            {editMode && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                {editMode && (
                  <td>
                    <button onClick={() => handleEditUser(user)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users in this team</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const groupedTeams = teamsData.reduce((acc, user) => {
    const teamName = user.team_name || 'Unnamed Team'; 
    if (!acc[teamName]) {
      acc[teamName] = { teamId: user.team_id, users: [] };
    }
    if (user.id) {
      acc[teamName].users.push(user);
    }
    return acc;
  }, {});

  
 // Извлекаем данные по вебмастерам
 const renderWebmasterStatistics = () => {
  return Object.keys(ordersByWebm).map((webmasterId) => {
    const data = ordersByWebm[webmasterId];
    return (
      <div key={webmasterId}>
        <h3>Вебмастер {webmasterId}</h3>
        <p>Количество заказов: {data.ordersCount}</p>
        <p>Обработано заказов: {data.ordersCountWmProcessing}</p>
        <p>Принято заказов: {data.ordersCountWmAccepted}</p>
        <p>Отменено заказов: {data.ordersCountWmCanceled}</p>
        <p>Сумма принятых заказов: {data.ordersSumWmAccepted}</p>
        <p>Сумма отмененных заказов: {data.ordersSumWmCanceled}</p>
        <p>Уникальные пользователи: {data.uniq}</p>
        <p>Конверсия: {data.conversion}%</p>
      </div>
    );
  });
};

  return (
    <div className='adminDashboard'>
      <Navbar />
      <div className='headSet'>
        <h1>Admin Dashboard</h1>
        <button onClick={() => setEditMode(!editMode)}>{editMode ? 'Cancel Edit' : 'Edit'}</button>
      </div>
      <div className='midSet'>
        {Object.entries(groupedTeams).map(([teamName, { teamId, users }]) =>
          renderTable(teamId, teamName, users)
        )}
      </div>
      <button onClick={() => setIsAddUserModalOpen(true)}>Add User</button>
      <button onClick={() => setIsAddTeamModalOpen(true)}>Add Team</button> 
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />
      <AddTeamModal isOpen={isAddTeamModalOpen} onClose={() => setIsAddTeamModalOpen(false)} onAddTeam={handleAddTeam} /> 
      <EditUserModal 
        isOpen={isEditUserModalOpen} 
        onClose={() => setIsEditUserModalOpen(false)} 
        user={selectedUser} 
        teams={teamsData}
        onUserUpdated={updateUserInState}
      />

<h1>Status List</h1>
      <ul>
        {Object.entries(statusList).map(([id, status]) => (
          <li key={id}>
            {status.name} - {status.orders} orders
          </li>
        ))}
      </ul>

      <h1>Orders in "Processing" status</h1>
      <ul>
        {ordersInStatus.map(orderId => (
          <li key={orderId}>{orderId}</li>
        ))}
      </ul>


      <h1>Webmasters order</h1>
       {/* Выбор диапазона дат */}
       <div>
        <label>От: 
          <input 
            type="date" 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)} 
          />
        </label>
        <label>До: 
          <input 
            type="date" 
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)} 
          />
        </label>
        {/* Кнопка подтверждения */}
        <button onClick={handleDateSubmit}>Обновить статистику</button>
      </div>
      {renderWebmasterStatistics()} {/* Отображаем статистику */}
    </div>
  );
};



export default AdminDashboard;
