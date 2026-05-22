import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from '../Api/api';

const initialState = {
  items: [],
  total: 0,
  event: null,
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (query = {}, { rejectWithValue }) => {
    try {
      const response = await API.listEvents(query);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.getEventById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load event');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await API.createEvent(eventData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await API.updateEvent(id, data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.deleteEvent(id);
      return { id, data: response.data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to delete event');
    }
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || action.payload;
        state.total = action.payload.total || (action.payload.items ? action.payload.items.length : state.items.length);
      })
      .addCase(fetchEvents.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchEventById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEventById.fulfilled, (state, action) => { state.loading = false; state.event = action.payload; })
      .addCase(fetchEventById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createEvent.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateEvent.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.items = state.items.map((it) => (it._id === updated._id ? updated : it));
        if (state.event && state.event._id === updated._id) state.event = updated;
      })
      .addCase(updateEvent.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteEvent.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((it) => it._id !== action.payload.id);
      })
      .addCase(deleteEvent.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default eventsSlice.reducer;
