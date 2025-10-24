import { memo } from 'react';

const SimpleLoader = memo(({ message = 'Loading...', fullScreen = false, size = 'large' }) => {
  const sizeClasses = {
    small: 'w-8 h-8 border-2',
    medium: 'w-16 h-16 border-3',
    large: 'w-24 h-24 border-4'
  };

  const content = (
    <div className="text-center">
      <div className={`${sizeClasses[size]} border-accent-blue animate-spin mx-auto mb-8`}></div>
      <p className="text-accent-blue font-mono text-lg tracking-[0.2em] uppercase">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
});

SimpleLoader.displayName = 'SimpleLoader';

export default SimpleLoader;
