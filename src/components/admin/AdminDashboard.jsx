import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import './AdminDashboard.scss';
import Navbar from '../Navbar/Navbar';
import AddUserModal from '../add-user/AddUserModal';
import AddTeamModal from '../add-team/AddTeamModal'; // Import the new modal

const AdminDashboard = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false); // State for team modal

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const response = await api.get('/teams');
        setTeamsData(response.data);
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };

    fetchTeamsData();
  }, []);

  const handleAddTeam = (teamName) => {
    api.post('/teams', { name: teamName })
      .then(response => {
        const newTeam = {
          id: response.data.id, // предполагается, что сервер вернёт id новой команды
          team_name: response.data.name, // устанавливаем имя новой команды
          users: [] // по умолчанию пустой список пользователей
        };
        setTeamsData([...teamsData, newTeam]); // Добавляем новую команду в список
      })
      .catch(error => {
        console.error('Error adding team:', error);
      });
  };

  const renderTable = (teamName, users) => (
    <div key={teamName}>
      <h2>{teamName}</h2>
      <table className='custom-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? ( // Проверяем, есть ли пользователи в команде
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users in this team</td> {/* Сообщение, если пользователей нет */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Группировка данных команд
  const groupedTeams = teamsData.reduce((acc, user) => {
    const teamName = user.team_name || 'Unnamed Team'; // используем 'Unnamed Team' если имя команды отсутствует
    if (!acc[teamName]) {
      acc[teamName] = [];
    }
    acc[teamName].push(user);
    return acc;
  }, {});

  return (
    <div className='adminDashboard'>
      <Navbar />
      <div className='headSet'>
        <h1>Admin Dashboard</h1>
      </div>
      <div className='midSet'>
        {Object.keys(groupedTeams).map(teamName =>
          renderTable(teamName, groupedTeams[teamName])
        )}
      </div>
      <button onClick={() => setIsAddUserModalOpen(true)}>Add User</button>
      <button onClick={() => setIsAddTeamModalOpen(true)}>Add Team</button> {/* New Add Team button */}
      <AddUserModal isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />
      <AddTeamModal isOpen={isAddTeamModalOpen} onClose={() => setIsAddTeamModalOpen(false)} onAddTeam={handleAddTeam} /> {/* Add team modal */}
    </div>
  );
};

export default AdminDashboard;
