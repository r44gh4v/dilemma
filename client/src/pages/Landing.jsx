import { useAuthState } from '../hooks/useStore.js';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';

const Landing = () => {
  const { isAuthenticated } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-4xl mx-auto">
        
        <div className="mb-20">
          <h1 className="text-7xl sm:text-9xl font-mono font-bold text-white mb-8 tracking-[0.2em] drop-shadow-[0_0_30px_rgba(96,165,250,0.5)] animate-pulse">
            DILEMMA
          </h1>

          <div className="h-px w-64 bg-gradient-to-r from-transparent via-accent-blue to-transparent mx-auto mb-10 opacity-60 shadow-glow"></div>

          <p className="text-lg sm:text-2xl text-accent-blue font-mono opacity-90 tracking-[0.3em] uppercase font-bold">
            Make Decisions Together
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button to="/login" variant="ghost" className="w-64 sm:w-72 py-5 text-xl">LOGIN</Button>
          <Button to="/register" variant="primary" className="w-64 sm:w-72 py-5 text-xl">REGISTER</Button>
        </div>

        <div className="mt-24 flex justify-center gap-3">
          <div className="w-3 h-3 border-2 border-accent-blue border-opacity-40 rotate-45 animate-pulse"></div>
          <div className="w-3 h-3 border-2 border-accent-blue border-opacity-60 rotate-45 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 border-2 border-accent-blue border-opacity-40 rotate-45 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
        
      </div>
    </div>
  );
};

export default Landing;
