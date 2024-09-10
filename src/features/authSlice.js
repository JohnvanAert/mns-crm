// src/features/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosConfig';

// Асинхронный запрос для получения данных пользователя
export const fetchUserData = createAsyncThunk('auth/fetchUserData', async () => {
  const response = await api.get('/api/user');
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    LOGIN_SUCCESS: (state, action) => {
      state.user = action.payload;
    },
    LOGOUT: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { LOGIN_SUCCESS, LOGOUT } = authSlice.actions;
export default authSlice.reducer;
