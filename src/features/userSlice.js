// src/features/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig'; // Используем настроенный API клиент

// Асинхронный запрос для получения данных пользователя
export const fetchUserData = createAsyncThunk('user/fetchUserData', async () => {
  const response = await api.get('/api/user');
  // Здесь '/api/user' — это эндпоинт вашего бекенда
  console.log('Response from server:', response.data); // Лог ответа сервера
  return response.data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    // Экшен для установки пользователя вручную (например, при авторизации)
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    logoutUser: (state) => {
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
