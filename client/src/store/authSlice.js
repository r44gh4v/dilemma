import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    Cookies.set('anonymousId', res.data.anonymousId, { expires: 30 });
    return { anonymousId: res.data.anonymousId };
  } catch (err) {
    toast.error(err.response?.data?.error || 'Login failed');
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', { email, password });
    Cookies.set('anonymousId', res.data.anonymousId, { expires: 30 });
    return { anonymousId: res.data.anonymousId };
  } catch (err) {
    toast.error(err.response?.data?.error || 'Registration failed');
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    Cookies.remove('anonymousId');
    toast.success('Logged out');
    return {};
  } catch (err) {
    toast.error('Logout failed');
    return rejectWithValue(err.response?.data?.error || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: Cookies.get('anonymousId') ? { anonymousId: Cookies.get('anonymousId') } : null,
    isAuthenticated: !!Cookies.get('anonymousId'),
    loading: false,
    error: null,
  },
  reducers: {
    // Manual logout action for expired sessions
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      Cookies.remove('anonymousId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;