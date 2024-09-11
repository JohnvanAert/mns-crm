// TeamLeaderDashboard.jsx
import LogoutButton from './LogoutButton';
import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const TeamLeaderDashboard = () => {
  const [teamLeaderData, setTeamLeaderData] = useState(null);

  useEffect(() => {
    const fetchTeamLeaderData = async () => {
      try {
        const response = await api.get('/teamleader');
        setTeamLeaderData(response.data);
      } catch (error) {
        console.error('Error fetching team leader data:', error);
      }
    };

    fetchTeamLeaderData();
  }, []);

  return (
    <div>
      <h1>Team Leader Dashboard</h1>
      <LogoutButton />
      {teamLeaderData ? (
        <div>
          <p>{teamLeaderData.message}</p>
          {/* Добавьте функционал для тим-лида */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TeamLeaderDashboard;
