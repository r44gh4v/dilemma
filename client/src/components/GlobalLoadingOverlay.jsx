import { memo } from 'react';
import { useGlobalLoading } from '../contexts/LoadingContext.jsx';
import ProgressBar from './ProgressBar.jsx';

// Full-screen loading overlay for critical operations
const GlobalLoadingOverlay = memo(() => {
  const { loadingStates } = useGlobalLoading();
  
  // Show overlay only for high-priority operations
  const priorityKeys = ['auth', 'createDilemma', 'deleteDilemma'];
  const priorityLoading = priorityKeys.find(key => loadingStates[key]?.active);
  
  if (!priorityLoading) return null;

  const message = loadingStates[priorityLoading]?.message || 'Processing...';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fadeIn">
      <div className="relative bg-dark-blue bg-opacity-80 backdrop-blur-xl p-12 shadow-glow-intense min-w-[300px]">
        {/* Corner borders */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-blue shadow-glow"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-blue shadow-glow"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-blue shadow-glow"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-blue shadow-glow"></div>

        {/* Dual spinning rings */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-2 border-light-blue border-opacity-40"></div>
          <div 
            className="absolute inset-0 border-2 border-transparent border-t-accent-blue border-r-accent-blue animate-spin shadow-glow"
            style={{ animationDuration: '1s' }}
          ></div>
          <div 
            className="absolute inset-2 border-2 border-transparent border-b-accent-blue border-l-accent-blue animate-spin shadow-glow"
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          ></div>
        </div>

        <div className="text-accent-blue font-mono text-base text-center tracking-[0.25em] uppercase font-bold mb-4">
          {message}
        </div>

        <ProgressBar indeterminate className="mb-4" />

        {/* Animated dots */}
        <div className="flex gap-3 justify-center">
          <div className="w-2 h-2 bg-accent-blue shadow-glow animate-pulse"></div>
          <div className="w-2 h-2 bg-accent-blue shadow-glow animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-accent-blue shadow-glow animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
});

GlobalLoadingOverlay.displayName = 'GlobalLoadingOverlay';

export default GlobalLoadingOverlay;
