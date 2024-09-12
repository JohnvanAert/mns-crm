import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import LogoutButton from '../LogoutButton';
import './AdminDashboard.scss';

const AdminDashboard = () => {
  const [teamsData, setTeamsData] = useState([]);

  useEffect(() => {
    const fetchTeamsData = async () => {
      try {
        const response = await api.get('/admin/teams');
        setTeamsData(response.data);
      } catch (error) {
        console.error('Error fetching teams data:', error);
      }
    };

    fetchTeamsData();
  }, []);
  
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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const groupedTeams = teamsData.reduce((acc, user) => {
    if (!acc[user.team_name]) {
      acc[user.team_name] = [];
    }
    acc[user.team_name].push(user);
    return acc;
  }, {});

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <LogoutButton />
      <div className='teamsTable'>
      {Object.keys(groupedTeams).map(teamName =>
        renderTable(teamName, groupedTeams[teamName])
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
