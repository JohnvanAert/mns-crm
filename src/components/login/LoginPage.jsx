import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
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
      const response = await api.post('/api/login', { username, password });

      // Проверяем сессию
      const checkSessionResponse = await api.get('/api/check-session');
      if (checkSessionResponse.data.isAuthenticated) {
        const user = checkSessionResponse.data.user;
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });

        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'team_leader') {
          navigate('/teamleader');
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
      <div className="login-container">
        <h2>АВТОРИЗАЦИЯ</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="E-mail"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {/* <div className="checkbox-group">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Запомнить</label>
          </div> */}
          <button type="submit">ВХОД</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
