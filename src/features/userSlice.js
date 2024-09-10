// src/features/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,  // Здесь можно хранить информацию о профиле
    settings: {},   // Настройки пользователя
    status: 'idle', // Состояние загрузки данных
    error: null,    // Ошибки
  },
  reducers: {
    // Экшен для установки данных профиля пользователя
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    // Экшен для изменения настроек пользователя
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    // Экшен для сброса профиля (например, при логауте)
    clearProfile: (state) => {
      state.profile = null;
      state.settings = {};
    },
  },
});

// Экспортируем экшены
export const { setProfile, updateSettings, clearProfile } = userSlice.actions;

// Экспортируем редьюсер
export default userSlice.reducer;
