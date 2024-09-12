import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import LogoutButton from '../LogoutButton';
import './TeamLeaderDashboard.scss';

const TeamLeaderDashboard = () => {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await api.get('/teamleader/team');
        setTeamData(response.data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };
  
    fetchTeamData();
  }, []);
  

  return (
    <div>
      <h1>Team Leader Dashboard</h1>
      <LogoutButton />
      <h2>{teamData.length > 0 && teamData[0].team_name}</h2>
      <table className='custom-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {teamData.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamLeaderDashboard;
