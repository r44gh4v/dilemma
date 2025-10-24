import { memo } from 'react';

const SkeletonLoader = memo(({ type = 'dilemma' }) => {
  if (type === 'dilemma') {
    return (
      <div className="bg-dark-blue bg-opacity-70 backdrop-blur-md border-[0.01rem] border-light-blue border-opacity-30 mb-8 p-6 sm:p-8 shadow-glow-intense relative animate-pulse">
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-light-blue opacity-50"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-light-blue opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-light-blue opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-light-blue opacity-50"></div>

        <div className="flex justify-between items-center mb-6">
          <div className="h-4 bg-light-blue bg-opacity-20 rounded w-32"></div>
          <div className="h-4 bg-light-blue bg-opacity-20 rounded w-24"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-light-blue border-opacity-30 p-4 h-64 bg-dark-blue bg-opacity-50">
            <div className="w-full h-40 bg-light-blue bg-opacity-10 mb-4"></div>
            <div className="h-4 bg-light-blue bg-opacity-20 rounded mb-2"></div>
            <div className="h-4 bg-light-blue bg-opacity-20 rounded w-3/4"></div>
          </div>
          <div className="border border-light-blue border-opacity-30 p-4 h-64 bg-dark-blue bg-opacity-50">
            <div className="w-full h-40 bg-light-blue bg-opacity-10 mb-4"></div>
            <div className="h-4 bg-light-blue bg-opacity-20 rounded mb-2"></div>
            <div className="h-4 bg-light-blue bg-opacity-20 rounded w-3/4"></div>
          </div>
        </div>

        <div className="flex justify-center gap-4 items-center">
          <div className="h-3 bg-light-blue bg-opacity-20 rounded w-24"></div>
          <div className="h-8 w-8 bg-light-blue bg-opacity-20 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (type === 'feed') {
    return (
      <div className="space-y-8">
        <SkeletonLoader type="dilemma" />
        <SkeletonLoader type="dilemma" />
        <SkeletonLoader type="dilemma" />
      </div>
    );
  }

  return (
    <div className="h-32 bg-light-blue bg-opacity-10 animate-pulse rounded"></div>
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
