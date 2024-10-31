import api from './axiosConfig';

// Получение списка статусов
export const getStatusList = async () => {
  try {
    const response = await api.get('/api/status-list'); // Убираем передачу токена
    return response.data;
  } catch (error) {
    console.error('Error fetching status list:', error);
    throw error;
  }
};

// Получение заказов по статусу
export const getOrdersByStatus = async (statusId) => {
  try {
    const response = await api.get(`/api/orders-by-status?statusId=${statusId}`); // Токен не передаем
    return response.data;
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    throw error;
  }
};

// Получение заказов по Вебмастеру с параметрами дат
export const getOrdersByWebmaster = async (from, to) => {
  try {
    const response = await api.get(`/api/orders-by-condition?from=${from}&to=${to}`); // Передаем параметры дат
    return response.data;
  } catch (error) {
    console.error('Error fetching webs orders by status:', error);
    throw error;
  }
};
