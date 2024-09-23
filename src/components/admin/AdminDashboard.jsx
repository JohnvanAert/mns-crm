import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import './AdminDashboard.scss';
import Navbar from '../Navbar/Navbar';
import AddUserModal from '../add-user/AddUserModal';
import AddTeamModal from '../add-team/AddTeamModal'; 

const AdminDashboard = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

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
          id: response.data.id, 
          team_name: response.data.name, 
          users: []
        };
        setTeamsData([...teamsData, newTeam]);
      })
      .catch(error => {
        console.error('Error adding team:', error);
      });
  };

  // Функция для удаления команды
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

  const renderTable = (teamId, teamName, users) => (
    <div key={teamId}>
      <h2>{teamName}</h2>
      <button onClick={() => handleDeleteTeam(teamId)} className="delete-button">
        Delete Team
      </button>
      <table className='custom-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No users in this team</td> 
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

  return (
    <div className='adminDashboard'>
      <Navbar />
      <div className='headSet'>
        <h1>Admin Dashboard</h1>
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
    </div>
  );
};

export default AdminDashboard;
