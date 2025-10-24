import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import dilemmasReducer from './dilemmasSlice.js';

export default configureStore({
  reducer: {
    auth: authReducer,
    dilemmas: dilemmasReducer,
  },
});