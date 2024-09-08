import axios from 'axios';

// Создаем экземпляр Axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'http://localhost:5001/', // Базовый URL для всех запросов
  headers: {
    'Content-Type': 'application/json',
  },
});

// Пример функции для логина
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    localStorage.setItem('token', response.data.token);
  } catch (error) {
    console.error('Login failed:', error.response.data.message);
  }
};

// Пример использования токена для защищенных запросов
export const getUserData = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.get('/user', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response.data.message);
  }
};

// Экспортируем api как экспорт по умолчанию
export default api;
