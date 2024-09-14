import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

// Асинхронный запрос для получения данных о команде
export const fetchTeamData = createAsyncThunk('team/fetchTeamData', async () => {
  const response = await api.get('/api/team');
  return response.data;
});

// Асинхронный запрос для одобрения запроса
export const approveRequest = createAsyncThunk('team/approveRequest', async (requestId) => {
  const response = await api.post(`/api/request/approve/${requestId}`);
  return response.data;
});

// Асинхронный запрос для отклонения запроса
export const rejectRequest = createAsyncThunk('team/rejectRequest', async (requestId) => {
  const response = await api.post(`/api/request/reject/${requestId}`);
  return response.data;
});

// Асинхронный запрос для получения заявок пользователя
export const fetchUserRequests = createAsyncThunk('team/fetchUserRequests', async (userId) => {
  const response = await api.get(`/api/user/${userId}/requests`);
  return response.data;
});

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    teamData: null,
    userRequests: [], // Данные для заявок пользователя
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
      .addCase(fetchUserRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userRequests = action.payload;
      })
      .addCase(fetchUserRequests.rejected, (state, action) => {
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
