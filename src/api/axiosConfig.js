import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001',
  withCredentials: true,  // Важно для работы с сессиями и куки
});

export default api;
