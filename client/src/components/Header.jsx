import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.js';
import { useState } from 'react';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return; // Prevent double-click
    setLoggingOut(true);
    try {
      await dispatch(logout()).unwrap();
      navigate('/');
    } catch (err) {
      // Even on error, navigate away (local state is cleared)
      navigate('/');
    } finally {
      setLoggingOut(false);
    }
  };

  if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <header className="fixed top-0 w-full bg-dark-blue bg-opacity-100 backdrop-blur-[4px] border-b-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">

        <Link to="/feed" className="relative text-xl sm:text-3xl font-mono font-bold text-white hover:text-accent-blue transition-all duration-300 cursor-pointer tracking-widest group">
          DILEMMA
        </Link>

        <nav className="flex gap-3 sm:gap-4">
          {isAuthenticated ? (
            <>

              <Link to="/post" className="btn btn-primary px-3 sm:px-3 py-2.5 text-xs sm:text-sm">
                + POST
              </Link>

              <Link to="/my-dilemmas" className="btn btn-secondary px-3 sm:px-3 py-2.5 text-xs sm:text-sm whitespace-nowrap">
                MY DILEMMAS
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="btn btn-logout px-3 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOut ? 'LOGGING OUT...' : 'LOGOUT'}
              </button>

              {user?.anonymousId && (
                <span className="text-accent-blue font-mono text-xs flex items-center sm:text-lg tracking-widest">
                  {user.anonymousId}
                </span>
              )}

            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost px-4 sm:px-6 py-2.5 text-xs sm:text-sm">
                LOGIN
              </Link>
              <Link to="/register" className="btn btn-primary px-4 sm:px-6 py-2.5 text-xs sm:text-sm">
                REGISTER
              </Link>
            </>
          )}
        </nav>

      </div>

    </header>
  );
};

export default Header;