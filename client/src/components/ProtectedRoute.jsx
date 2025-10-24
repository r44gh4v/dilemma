import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error('Please login to continue');
    return <Navigate to="/feed" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
