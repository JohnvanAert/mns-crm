import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig'; // Используем axios для запросов

// Асинхронный запрос для получения данных администратора
export const fetchAdminData = createAsyncThunk('admin/fetchAdminData', async () => {
  const response = await api.get('/api/admin'); // Замените на реальный эндпоинт для админа
  return response.data;
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    adminData: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdminData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.adminData = action.payload;
      })
      .addCase(fetchAdminData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default adminSlice.reducer;
