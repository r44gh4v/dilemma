import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export const useAuthCheck = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

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
