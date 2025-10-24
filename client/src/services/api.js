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
    // Handle 401 (Unauthorized) or 403 (Forbidden) - token expired or invalid
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const errorMessage = error.response.data?.error;
      
      // Only handle auth errors, not "Access denied" from missing token on public routes
      if (errorMessage === 'Invalid token' || errorMessage === 'Access denied') {
        // Import store dynamically to avoid circular dependency
        import('../store/index.js').then(({ store }) => {
          import('../store/authSlice.js').then(({ clearAuth }) => {
            store.dispatch(clearAuth());
            toast.error('Session expired. Please login again.');
            
            // Redirect to login page
            window.location.href = '/';
          });
        });
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;