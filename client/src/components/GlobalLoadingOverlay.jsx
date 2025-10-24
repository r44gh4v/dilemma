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
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fadeIn">
      <div className="relative bg-dark-blue bg-opacity-90 backdrop-blur-xl border-4 border-accent-blue border-opacity-60 p-12 sm:p-16 shadow-glow-intense min-w-[320px] sm:min-w-[400px] overflow-hidden">
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-10 animate-shimmer"></div>
        
        {/* Corner accents - more prominent */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent-blue shadow-glow"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-accent-blue shadow-glow"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-accent-blue shadow-glow"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent-blue shadow-glow"></div>

        {/* Enhanced dual spinning rings */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-light-blue border-opacity-30 rounded-full"></div>
          <div 
            className="absolute inset-0 border-4 border-transparent border-t-accent-blue border-r-accent-blue rounded-full animate-spin shadow-glow-strong"
            style={{ animationDuration: '1s' }}
          ></div>
          <div 
            className="absolute inset-3 border-4 border-transparent border-b-accent-blue border-l-accent-blue rounded-full animate-spin shadow-glow-strong"
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          ></div>
          {/* Pulsing center glow */}
          <div className="absolute inset-1/4 bg-accent-blue bg-opacity-20 rounded-full animate-pulse shadow-glow-intense"></div>
        </div>

        <div className="text-accent-blue font-mono text-lg sm:text-xl text-center tracking-[0.3em] uppercase font-bold mb-6 relative z-10">
          {message}
        </div>

        <ProgressBar indeterminate className="mb-6" />

        {/* Enhanced animated dots */}
        <div className="flex gap-3 justify-center relative z-10">
          <div className="w-3 h-3 bg-accent-blue rounded-full shadow-glow-strong animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-accent-blue rounded-full shadow-glow-strong animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-accent-blue rounded-full shadow-glow-strong animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
});

GlobalLoadingOverlay.displayName = 'GlobalLoadingOverlay';

export default GlobalLoadingOverlay;
