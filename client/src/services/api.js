import axios from 'axios';

// For local dev: uses proxy (/api -> localhost:5000)
// For production: uses VITE_API_URL environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true
});

export default api;