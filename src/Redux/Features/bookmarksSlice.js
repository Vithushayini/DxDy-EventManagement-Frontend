import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from '../Api/api';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.getBookmarks();
      return response.data.items || response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to load bookmarks');
    }
  }
);

export const toggleBookmark = createAsyncThunk(
  'bookmarks/toggleBookmark',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await API.toggleBookmark(eventId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Failed to toggle bookmark');
    }
  }
);

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookmarks.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchBookmarks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(toggleBookmark.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { bookmarked, savedEvents }
        if (action.payload && action.payload.savedEvents) {
          state.items = action.payload.savedEvents;
        }
      })
      .addCase(toggleBookmark.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default bookmarksSlice.reducer;
