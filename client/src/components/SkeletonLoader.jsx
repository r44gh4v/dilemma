import { memo } from 'react';
import LoadingBanner from './LoadingBanner.jsx';

const SkeletonLoader = memo(({ type = 'dilemma' }) => {
  if (type === 'dilemma') {
    return (
      <div className="bg-dark-blue bg-opacity-80 backdrop-blur-md border-2 border-light-blue border-opacity-40 mb-8 p-6 sm:p-8 shadow-glow-intense relative overflow-hidden">
        {/* Animated shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-light-blue to-transparent opacity-10 animate-shimmer"></div>
        
        {/* Corner accents - more prominent */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-accent-blue opacity-70"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-accent-blue opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-accent-blue opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-accent-blue opacity-70"></div>

        <div className="flex justify-between items-center mb-6">
          <div className="h-5 bg-gradient-to-r from-light-blue to-accent-blue bg-opacity-30 rounded w-32 animate-pulse"></div>
          <div className="h-5 bg-gradient-to-r from-accent-blue to-light-blue bg-opacity-30 rounded w-24 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border-2 border-light-blue border-opacity-40 p-4 h-64 bg-dark-blue bg-opacity-60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-5 animate-shimmer"></div>
            <div className="w-full h-40 bg-gradient-to-br from-light-blue to-accent-blue bg-opacity-20 mb-4 animate-pulse"></div>
            <div className="h-4 bg-light-blue bg-opacity-30 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-light-blue bg-opacity-30 rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="border-2 border-light-blue border-opacity-40 p-4 h-64 bg-dark-blue bg-opacity-60 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-5 animate-shimmer"></div>
            <div className="w-full h-40 bg-gradient-to-br from-light-blue to-accent-blue bg-opacity-20 mb-4 animate-pulse"></div>
            <div className="h-4 bg-light-blue bg-opacity-30 rounded mb-2 animate-pulse"></div>
            <div className="h-4 bg-light-blue bg-opacity-30 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>

        <div className="flex justify-center gap-4 items-center">
          <div className="h-4 bg-gradient-to-r from-light-blue to-accent-blue bg-opacity-30 rounded w-24 animate-pulse"></div>
          <div className="h-10 w-10 bg-gradient-to-br from-accent-blue to-light-blue bg-opacity-30 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (type === 'feed') {
    return (
      <div className="space-y-8">
        <LoadingBanner message="Loading Feed..." />
        <SkeletonLoader type="dilemma" />
        <SkeletonLoader type="dilemma" />
        <SkeletonLoader type="dilemma" />
      </div>
    );
  }

  return (
    <div className="h-32 bg-gradient-to-r from-light-blue to-accent-blue bg-opacity-20 animate-pulse rounded border-2 border-light-blue border-opacity-30"></div>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
