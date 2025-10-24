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
      <Panel className="w-full max-w-lg font-mono relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-dark-blue bg-opacity-95 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-8 border-2 border-accent-blue border-opacity-50">
            <div className="w-24 h-24 border-4 border-accent-blue animate-spin"></div>
            <p className="text-accent-blue font-mono text-lg tracking-[0.2em] uppercase">
              Loading...
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} autoComplete="on">
        <div className="mb-10 text-center">
          <h2 className="heading">{type === 'login' ? 'Login' : 'Register'}</h2>
          <div className="heading-rule"></div>
        </div>

        <div className="mb-7">
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="input"
          />
        </div>

        <div className="mb-10">
          <label htmlFor="password" className="label">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={type === 'login' ? 'current-password' : 'new-password'}
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