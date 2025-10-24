import { memo } from 'react';
import { useGlobalLoading } from '../contexts/LoadingContext.jsx';

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
      <div className="text-center">
        <div className="w-24 h-24 border-4 border-accent-blue animate-spin mx-auto mb-8"></div>
        <p className="text-accent-blue font-mono text-lg tracking-[0.2em] uppercase">
          {message}
        </p>
      </div>
    </div>
  );
});

GlobalLoadingOverlay.displayName = 'GlobalLoadingOverlay';

export default GlobalLoadingOverlay;
