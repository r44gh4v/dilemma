import axios from 'axios';
import toast from 'react-hot-toast';

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

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const errorMessage = error.response.data?.error;
      
      if (errorMessage === 'Invalid token' || errorMessage === 'Access denied') {
        const isBrave = navigator.brave && navigator.brave.isBrave;
        
        import('../store/index.js').then(({ store }) => {
          import('../store/authSlice.js').then(({ clearAuth }) => {
            store.dispatch(clearAuth());
            
            if (isBrave) {
              toast.error('Session expired. If using Brave, try disabling shields for this site.', { duration: 4000 });
            } else {
              toast.error('Session expired. Please login again.');
            }
            
            window.location.href = '/';
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;