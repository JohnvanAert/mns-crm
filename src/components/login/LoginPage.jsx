import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser, fetchUserData } from '../../features/userSlice'; // Импорт экшенов из userSlice

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5001/api/login', {
        username,
        password,
      });
  
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Проверка перед перенаправлением
      console.log('Token saved:', localStorage.getItem('token'));
      console.log('User:', user);
      
      dispatch(setUser(user));
      dispatch(fetchUserData());
  
      window.location.href = '/user'; // Перенаправление на страницу пользователя
    } catch (error) {
      console.error('Login error:', error.response || error.message);
      setError('Invalid username or password');
    }
  };
  
  

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Введите логин"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
