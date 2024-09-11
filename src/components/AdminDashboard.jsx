// AdminDashboard.jsx
import LogoutButton from './LogoutButton';
import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await api.get('/admin');
        setAdminData(response.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <LogoutButton />
      {adminData ? (
        <div>
          <p>{adminData.message}</p>
          {/* Добавьте необходимые статистики и возможности для администратора */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminDashboard;

