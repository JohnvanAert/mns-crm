// src/features/teamSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig'; // Используем axios для запросов

// Асинхронный запрос для получения данных о команде
export const fetchTeamData = createAsyncThunk('team/fetchTeamData', async () => {
  const response = await api.get('/api/team'); // Укажите правильный эндпоинт для команды
  return response.data;
});

// Асинхронный запрос для одобрения запроса
export const approveRequest = createAsyncThunk('team/approveRequest', async (requestId) => {
  const response = await api.post(`/api/request/approve/${requestId}`); // Эндпоинт для одобрения запроса
  return response.data;
});

// Асинхронный запрос для отклонения запроса
export const rejectRequest = createAsyncThunk('team/rejectRequest', async (requestId) => {
  const response = await api.post(`/api/request/reject/${requestId}`); // Эндпоинт для отклонения запроса
  return response.data;
});

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    teamData: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeamData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.teamData = action.payload;
      })
      .addCase(fetchTeamData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(approveRequest.fulfilled, (state, action) => {
        // Логика обновления состояния после одобрения запроса
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        // Логика обновления состояния после отклонения запроса
      });
  },
});

export default teamSlice.reducer;
