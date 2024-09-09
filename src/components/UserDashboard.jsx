import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../features/userSlice';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userData, status } = useSelector((state) => state.user);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(fetchUserData());
    }
  }, [dispatch, navigate]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {userData ? (
        <h1>Добро пожаловать, {userData.username}!</h1>
      ) : (
        <h1>Добро пожаловать, Гость!</h1>
      )}
    </div>
  );
};

export default UserDashboard;
