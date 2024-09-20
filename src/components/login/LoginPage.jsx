import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import './LoginPage.scss';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false); // Управление модальным окном
  const [email, setEmail] = useState(''); // Email для сброса пароля
  const [resetCode, setResetCode] = useState(''); // Код сброса пароля
  const [newPassword, setNewPassword] = useState(''); // Новый пароль
  const [step, setStep] = useState(1); // Шаги модального окна
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/login', { username, password });

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

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/forgot-password', { email });
      setMessage(response.data.message);
      setStep(2); // Переход на шаг ввода кода сброса
    } catch (error) {
      setError(error.response?.data?.message || 'Error sending reset code');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await api.post('/api/reset-password', { email, resetCode, newPassword });
      setMessage(response.data.message);
      setStep(1); // Сбросить шаги, чтобы начать заново
      setIsForgotPasswordOpen(false); // Закрываем модальное окно после успешного сброса
    } catch (error) {
      setError(error.response?.data?.message || 'Error resetting password');
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
          <button type="submit">ВХОД</button>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>

        {/* Кнопка для открытия модального окна сброса пароля */}
        <button className="forgot-password-btn" onClick={() => setIsForgotPasswordOpen(true)}>
          Забыли пароль?
        </button>
      </div>

      {/* Модальное окно для сброса пароля */}
      {isForgotPasswordOpen && (
        <div className="modal">
          <div className="modal-content">
            {step === 1 ? (
              <div>
                <h2>Сброс пароля</h2>
                <form onSubmit={handleForgotPassword}>
                  <div className="input-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  <button type="submit">Отправить код для сброса</button>
                </form>
              </div>
            ) : (
              <div>
                <h2>Введите код и новый пароль</h2>
                <form onSubmit={handleResetPassword}>
                  <div className="input-group">
                    <label>Код сброса:</label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="Введите код сброса"
                    />
                  </div>
                  <div className="input-group">
                    <label>Новый пароль:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Введите новый пароль"
                    />
                  </div>
                  <button type="submit">Сбросить пароль</button>
                </form>
              </div>
            )}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={() => setIsForgotPasswordOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
