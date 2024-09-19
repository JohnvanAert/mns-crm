import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import './AdminDashboard.scss';
import Navbar from '../Navbar/Navbar';
import AddUserModal from '../add-user/AddUserModal';

const AdminDashboard = () => {
  const [teamsData, setTeamsData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <button onClick={() => setIsModalOpen(true)}>Add User</button>
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AdminDashboard;
