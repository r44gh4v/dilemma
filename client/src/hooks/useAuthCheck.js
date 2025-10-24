import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

// Hook to check authentication and require login for actions
export const useAuthCheck = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Execute callback if authenticated, otherwise show message
  const requireAuth = useCallback((callback, message = 'Please log in to continue') => {
    if (!isAuthenticated) {
      toast.error(message);
      return false;
    }
    callback();
    return true;
  }, [isAuthenticated]);

  return { isAuthenticated, requireAuth };
};
