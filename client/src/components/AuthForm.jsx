import { useState, useMemo, useCallback } from 'react';
import { login, register } from '../store/authSlice.js';
import { useAsyncAction } from '../hooks/useStore.js';
import { useNavigate, useLocation } from 'react-router-dom';
import Panel from './ui/Panel.jsx';
import Button from './ui/Button.jsx';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { execute, isLoading } = useAsyncAction('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const type = useMemo(() => 
    location.pathname.includes('register') ? 'register' : 'login'
  , [location.pathname]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      const action = type === 'login' 
        ? login({ email, password })
        : register({ email, password });
      
      await execute(action, type === 'login' ? 'Logging in...' : 'Creating account...');
      navigate(from, { replace: true });
    } catch (err) {
    }
  }, [type, email, password, execute, navigate, from]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <Panel className="w-full max-w-lg font-mono">
        <form onSubmit={handleSubmit}>
        <div className="mb-10 text-center">
          <h2 className="heading">{type === 'login' ? 'Login' : 'Register'}</h2>
          <div className="heading-rule"></div>
        </div>

        <div className="mb-7">
          <label className="label">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="mb-10">
          <label className="label">Password</label>
          <input
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <Button type="submit" loading={isLoading} disabled={isLoading} variant="primary" className="w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? 'Processing...' : type === 'login' ? 'Login' : 'Create Account'}
        </Button>

        <div className="mt-10 text-center border-t border-accent-blue border-opacity-30 pt-8">
          <p className="text-sm text-accent-blue opacity-80 mb-4 tracking-wider">
            {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            type="button"
            onClick={() => navigate(type === 'login' ? '/register' : '/login')}
            className="link-underline font-mono uppercase tracking-[0.2em] text-sm"
          >
            {type === 'login' ? 'Register here' : 'Login here'}
          </button>
        </div>
        </form>
      </Panel>
    </div>
  );
};

export default AuthForm;