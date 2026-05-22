import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Features/authSlice.js';
import eventsReducer from '../Features/eventsSlice';
import bookmarksReducer from '../Features/bookmarksSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer,
        bookmarks: bookmarksReducer,
    },
});