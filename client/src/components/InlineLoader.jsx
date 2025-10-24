import { memo } from 'react';

const InlineLoader = memo(({ size = 'small', className = '' }) => {
  const sizeClasses = {
    tiny: 'w-3 h-3 border-2',
    small: 'w-5 h-5 border-2',
    medium: 'w-7 h-7 border-3'
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className={`${sizeClasses[size]} border-transparent border-t-accent-blue border-r-accent-blue animate-spin rounded-full shadow-glow`}></div>
    </div>
  );
});

InlineLoader.displayName = 'InlineLoader';

export default InlineLoader;
