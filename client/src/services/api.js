import axios from 'axios';

// For local dev: uses Vite proxy (/api -> localhost:5000)
// For production: uses VITE_API_URL env var + /api
const getBaseURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // If VITE_API_URL is set (production), ensure it ends with /api
  if (apiUrl) {
    return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
  }
  
  // Local development - uses Vite proxy
  return '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

export default api;