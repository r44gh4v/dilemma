import { memo } from 'react';

const LoadingSpinner = memo(({ 
  message = 'Loading...', 
  fullScreen = false,
  size = 'medium',
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-20 h-20',
    large: 'w-32 h-32'
  };

  const paddingClasses = {
    small: 'p-6',
    medium: 'p-12',
    large: 'p-16'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-base',
    large: 'text-xl'
  };

  const containerClass = fullScreen 
    ? 'flex flex-col justify-center items-center h-screen'
    : 'flex flex-col justify-center items-center h-64';

  const spinnerContent = (
    <div className={`relative bg-dark-blue bg-opacity-80 backdrop-blur-xl ${paddingClasses[size]} shadow-glow-intense`}>
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent-blue shadow-glow"></div>
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent-blue shadow-glow"></div>
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent-blue shadow-glow"></div>
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent-blue shadow-glow"></div>

      <div className={`relative ${sizeClasses[size]} mx-auto mb-6`}>
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

      <div className={`text-accent-blue font-mono ${textSizes[size]} text-center tracking-[0.25em] uppercase font-bold`}>
        {message}
      </div>

      <div className="flex gap-3 mt-4 justify-center">
        <div className="w-2 h-2 bg-accent-blue shadow-glow animate-pulse"></div>
        <div className="w-2 h-2 bg-accent-blue shadow-glow animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-accent-blue shadow-glow animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {spinnerContent}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
