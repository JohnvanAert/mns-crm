import axios from 'axios';

// Создаем экземпляр Axios с базовой конфигурацией
const api = axios.create({
  baseURL: 'http://localhost:5001/', // Базовый URL для всех запросов
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для автоматической установки токена в заголовок
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Используем правильный ключ для токена
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Добавляем токен в заголовок
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Пример функции для логина
export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    localStorage.setItem('authToken', response.data.token); // Сохраняем токен с правильным ключом
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || 'Unknown error');
  }
};

// Пример использования токена для защищенных запросов
export const getUserData = async () => {
  try {
    const response = await api.get('/user');
    console.log(response.data); // Данные пользователя
  } catch (error) {
    console.error('Error:', error.response?.data?.message || 'Unknown error');
  }
};

// Экспортируем api как экспорт по умолчанию
export default api;
