import { memo, useEffect, useState } from 'react';

// Progress bar with indeterminate and determinate modes
const ProgressBar = memo(({ 
  duration = 2000, 
  indeterminate = false,
  className = '' 
}) => {
  const [progress, setProgress] = useState(0);

  // Smooth progress animation for determinate mode
  useEffect(() => {
    if (indeterminate) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        // Asymptotic approach to 100%
        return prev + (100 - prev) * 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [indeterminate]);

  // Indeterminate mode with shimmer animation
  if (indeterminate) {
    return (
      <div className={`w-full h-1 bg-dark-blue bg-opacity-30 overflow-hidden ${className}`}>
        <div 
          className="h-full bg-accent-blue shadow-glow animate-shimmer"
          style={{ width: '30%' }}
        ></div>
      </div>
    );
  }

  // Determinate mode with actual progress
  return (
    <div className={`w-full h-1 bg-dark-blue bg-opacity-30 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-accent-blue shadow-glow transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
