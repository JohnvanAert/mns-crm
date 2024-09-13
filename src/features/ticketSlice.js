// src/features/ticketSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action для добавления тикета
export const addTicket = createAsyncThunk(
  'ticket/addTicket',
  async (ticketData) => {
    const response = await axios.post('/api/tickets', ticketData);
    return response.data;
  }
);

const ticketSlice = createSlice({
  name: 'ticket',
  initialState: {
    tickets: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tickets.push(action.payload);
      })
      .addCase(addTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ticketSlice.reducer;
