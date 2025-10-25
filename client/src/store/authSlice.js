import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('anonymousId', res.data.anonymousId);
    return { anonymousId: res.data.anonymousId };
  } catch (err) {
    toast.error(err.response?.data?.error || 'Login failed');
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', { email, password });
    localStorage.setItem('anonymousId', res.data.anonymousId);
    return { anonymousId: res.data.anonymousId };
  } catch (err) {
    toast.error(err.response?.data?.error || 'Registration failed');
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('anonymousId');
    return {};
  } catch (err) {
    localStorage.removeItem('anonymousId');
    console.warn('Server logout failed, but local state cleared:', err);
    return {};
  }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/check');
    localStorage.setItem('anonymousId', res.data.anonymousId);
    return { anonymousId: res.data.anonymousId };
  } catch (err) {
    localStorage.removeItem('anonymousId');
    return rejectWithValue('Not authenticated');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: localStorage.getItem('anonymousId') ? { anonymousId: localStorage.getItem('anonymousId') } : null,
    isAuthenticated: !!localStorage.getItem('anonymousId'),
    loading: false,
    error: null,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('anonymousId');
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
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;