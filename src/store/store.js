// src/store/store.js

import { configureStore } from '@reduxjs/toolkit';
import adminReducer from '../features/adminSlice'; // Импорт adminSlice
import teamReducer from '../features/teamSlice'; // Импорт teamSlice
import userReducer from '../features/userSlice'; // Импорт userSlice

export const store = configureStore({
  reducer: {
    admin: adminReducer,  // Добавляем reducer для admin
    team: teamReducer,    // Reducer для команды
    user: userReducer,    // Reducer для пользователей
  },
});
