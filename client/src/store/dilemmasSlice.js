import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export const fetchDilemmas = createAsyncThunk('dilemmas/fetchDilemmas', async ({ page, limit = 10 }, { rejectWithValue }) => {
  try {
    const res = await api.get(`/dilemmas?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to load dilemmas');
    return rejectWithValue(err.response?.data?.error || 'Failed to load dilemmas');
  }
});

export const fetchDilemmaById = createAsyncThunk('dilemmas/fetchDilemmaById', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/dilemmas/${id}`);
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to load dilemma');
    return rejectWithValue(err.response?.data?.error || 'Failed to load dilemma');
  }
});

export const fetchUserDilemmas = createAsyncThunk('dilemmas/fetchUserDilemmas', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/dilemmas/user');
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to load user dilemmas');
    return rejectWithValue(err.response?.data?.error || 'Failed to load user dilemmas');
  }
});

export const createDilemma = createAsyncThunk('dilemmas/createDilemma', async ({ optionA, optionB, imageUrlA, imageUrlB }, { rejectWithValue }) => {
  try {
    const res = await api.post('/dilemmas', { optionA, optionB, imageUrlA, imageUrlB });
    toast.success('Dilemma posted');
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to post');
    return rejectWithValue(err.response?.data?.error || 'Failed to post');
  }
});

export const deleteDilemma = createAsyncThunk('dilemmas/deleteDilemma', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/dilemmas/${id}`);
    toast.success('Dilemma deleted');
    return id;
  } catch (err) {
    toast.error(err.response?.data?.error || 'Delete failed');
    return rejectWithValue(err.response?.data?.error || 'Delete failed');
  }
});

export const voteDilemma = createAsyncThunk('dilemmas/voteDilemma', async ({ id, choice }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/dilemmas/${id}/vote`, { choice });
    return { id, votesA: res.data.votesA, votesB: res.data.votesB, userVote: res.data.userVote };
  } catch (err) {
    toast.error(err.response?.data?.error || 'Vote failed');
    return rejectWithValue(err.response?.data?.error || 'Vote failed');
  }
});

export const likeDilemma = createAsyncThunk('dilemmas/likeDilemma', async ({ id, currentLikeCount }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/dilemmas/${id}/like`);
    return { id, likeCount: res.data.likeCount, userLiked: res.data.userLiked };
  } catch (err) {
    toast.error(err.response?.data?.error || 'Like failed');
    return rejectWithValue(err.response?.data?.error || 'Like failed');
  }
});

export const commentDilemma = createAsyncThunk('dilemmas/commentDilemma', async ({ id, text }, { rejectWithValue }) => {
  try {
    await api.post(`/dilemmas/${id}/comment`, { text });
    const res = await api.get(`/dilemmas/${id}`);
    toast.success('Comment added');
    return res.data;
  } catch (err) {
    toast.error(err.response?.data?.error || 'Comment failed');
    return rejectWithValue(err.response?.data?.error || 'Comment failed');
  }
});

const dilemmasSlice = createSlice({
  name: 'dilemmas',
  initialState: {
    dilemmas: [],
    userDilemmas: [],
    singleDilemma: null,
    page: 1,
    hasMore: true,
    loading: {
      feed: false,
      single: false,
      user: false,
      creating: false,
    },
    error: null,
  },
  reducers: {
    incrementPage: (state) => {
      state.page += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDilemmas.pending, (state) => {
        state.loading.feed = true;
        state.error = null;
      })
      .addCase(fetchDilemmas.fulfilled, (state, action) => {
        const byId = new Map(state.dilemmas.map(d => [d._id, d]));
        for (const item of action.payload) {
          byId.set(item._id, { ...byId.get(item._id), ...item });
        }
        state.dilemmas = Array.from(byId.values());
        state.hasMore = action.payload.length === 10;
        state.loading.feed = false;
      })
      .addCase(fetchDilemmas.rejected, (state, action) => {
        state.loading.feed = false;
        state.error = action.payload;
      })

      .addCase(fetchDilemmaById.pending, (state) => {
        state.loading.single = true;
      })
      .addCase(fetchDilemmaById.fulfilled, (state, action) => {
        state.singleDilemma = action.payload;
        state.loading.single = false;
      })
      .addCase(fetchDilemmaById.rejected, (state, action) => {
        state.loading.single = false;
        state.error = action.payload;
      })

      .addCase(fetchUserDilemmas.pending, (state) => {
        state.loading.user = true;
      })
      .addCase(fetchUserDilemmas.fulfilled, (state, action) => {
        state.userDilemmas = action.payload;
        state.loading.user = false;
      })
      .addCase(fetchUserDilemmas.rejected, (state, action) => {
        state.loading.user = false;
        state.error = action.payload;
      })

      .addCase(createDilemma.pending, (state) => {
        state.loading.creating = true;
      })
      .addCase(createDilemma.fulfilled, (state, action) => {
        state.userDilemmas = [action.payload, ...state.userDilemmas];
        state.dilemmas = [action.payload, ...state.dilemmas];
        state.loading.creating = false;
      })
      .addCase(createDilemma.rejected, (state, action) => {
        state.loading.creating = false;
        state.error = action.payload;
      })

      .addCase(deleteDilemma.fulfilled, (state, action) => {
        state.dilemmas = state.dilemmas.filter(d => d._id !== action.payload);
        state.userDilemmas = state.userDilemmas.filter(d => d._id !== action.payload);
      })

      .addCase(voteDilemma.fulfilled, (state, action) => {
        const { id, votesA, votesB, userVote } = action.payload;
        const updateDilemma = (d) => d._id === id ? { ...d, votesA, votesB, userVote } : d;
        
        state.dilemmas = state.dilemmas.map(updateDilemma);
        if (state.singleDilemma?._id === id) {
          state.singleDilemma = { ...state.singleDilemma, votesA, votesB, userVote };
        }
        state.userDilemmas = state.userDilemmas.map(updateDilemma);
      })
      .addCase(likeDilemma.fulfilled, (state, action) => {
        const { id, likeCount, userLiked } = action.payload;
        const updateDilemma = (d) => d._id === id ? { ...d, likeCount, userLiked } : d;
        
        state.dilemmas = state.dilemmas.map(updateDilemma);
        if (state.singleDilemma?._id === id) {
          state.singleDilemma = { ...state.singleDilemma, likeCount, userLiked };
        }
        state.userDilemmas = state.userDilemmas.map(updateDilemma);
      })
      .addCase(commentDilemma.fulfilled, (state, action) => {
        const updateDilemma = (d) => d._id === action.payload._id ? action.payload : d;
        
        state.dilemmas = state.dilemmas.map(updateDilemma);
        if (state.singleDilemma?._id === action.payload._id) {
          state.singleDilemma = action.payload;
        }
        state.userDilemmas = state.userDilemmas.map(updateDilemma);
      });
  },
});

export const { incrementPage } = dilemmasSlice.actions;
export default dilemmasSlice.reducer;