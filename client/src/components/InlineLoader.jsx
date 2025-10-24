import { memo } from 'react';

const InlineLoader = memo(({ size = 'small', className = '' }) => {
  const sizeClasses = {
    tiny: 'w-3 h-3',
    small: 'w-4 h-4',
    medium: 'w-6 h-6'
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-transparent border-t-accent-blue border-r-accent-blue animate-spin rounded-full`}></div>
    </div>
  );
});

InlineLoader.displayName = 'InlineLoader';

export default InlineLoader;
