import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';
import './modal.scss';

const AddUserModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [team_id, setTeamId] = useState('');
  const [teams, setTeams] = useState([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [timer, setTimer] = useState(600); // 10 минут

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams');
        setTeams(response.data.teams);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (step === 2 && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleAddUser = async () => {
    if (!username || !email || !password || !team_id) {
      setError('Все поля обязательны для заполнения');
      return;
    }
  
    try {
      const response = await axios.post('/api/admin/add-user', { username, email, password, team_id });
      
      if (response.data.success) {
        setStep(2);
        setTimer(600); // 10 минут
        setSuccessMessage('Код подтверждения отправлен');
      }
    } catch (err) {
      // Обрабатываем ошибку сервера
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message); // Сообщение от сервера
      } else {
        setError('Ошибка при добавлении пользователя');
      }
    }
  };
  

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('/api/admin/verify-code', { username, email, verificationCode, password, team_id });
      if (response.data.success) {
        setSuccessMessage('User successfully added');
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 3000);
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('Failed to verify code');
    }
  };

  return isOpen ? (
    <div className="modal">
      <div className="modal-content">
        <h2>{step === 1 ? 'Add New User' : 'Enter Verification Code'}</h2>
        {step === 1 ? (
          <div>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Team:</label>
              <select
                value={team_id}
                onChange={(e) => setTeamId(e.target.value)}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={handleAddUser}>Send Verification Code</button>
          </div>
        ) : (
          <div>
            <label>Verification Code:</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button onClick={handleVerifyCode}>Verify and Add User</button>
            <p>{`Time remaining: ${Math.floor(timer / 60)}:${timer % 60}`}</p>
          </div>
        )}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;
};

export default AddUserModal;
