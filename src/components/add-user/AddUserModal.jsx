import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosConfig';

const AddUserModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [team_id, setTeamId] = useState(''); // для хранения выбранной команды
  const [teams, setTeams] = useState([]);   // для хранения списка команд
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // Step 1: User form, Step 2: Verification code
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Для сообщения об успехе

  useEffect(() => {
    // Получаем список команд при монтировании компонента
    const fetchTeams = async () => {
      try {
        const response = await axios.get('/api/teams'); // API для получения списка команд
        setTeams(response.data.teams);
      } catch (err) {
        console.error('Failed to fetch teams:', err);
      }
    };

    fetchTeams();
  }, []);

  const validateForm = () => {
    // Проверяем, заполнены ли все поля
    if (!username || !email || !password || !team_id) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('/api/admin/add-user', { 
        username, 
        email, 
        password, 
        team_id // Отправляем выбранный team_id
      });
      if (response.data.success) {
        setStep(2);  // Переходим на шаг подтверждения кода
        setError(null); // Очищаем ошибки
      } else {
        setError('Failed to send verification code');
      }
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await axios.post('/api/admin/verify-code', {
        username, 
        email, 
        verificationCode, 
        password, 
        team_id
      });
      if (response.data.success) {
        setSuccess('User successfully added');
        setError(null); // Убираем ошибку
        setTimeout(() => {
          onClose();  // Закрыть модальное окно через 2 секунды
        }, 2000);
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
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;
};

export default AddUserModal;
