import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; // Проверьте путь
import './LoginPage.scss';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log({ username, password });
      const response = await api.post('/api/login', { username, password });

      // Если сессия активна, проверяем пользователя и его роль
      const checkSessionResponse = await api.get('/api/check-session');
      if (checkSessionResponse.data.isAuthenticated) {
        const user = checkSessionResponse.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });

        // Перенаправление в зависимости от роли пользователя
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'teamleader') {
          navigate('/team-leader');
        } else {
          navigate('/user');
        }
      } else {
        setErrorMessage('Session not valid.');
      }
    } catch (error) {
      setErrorMessage('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
