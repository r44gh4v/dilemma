import { memo } from 'react';

const LoadingBanner = memo(({ message = 'Loading' }) => {
  return (
    <div className="text-center py-8 mb-8">
      <div className="inline-block bg-dark-blue bg-opacity-90 backdrop-blur-md border-4 border-accent-blue border-opacity-60 px-10 py-5 shadow-glow-intense relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-20 animate-shimmer"></div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce shadow-glow" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce shadow-glow" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce shadow-glow" style={{ animationDelay: '300ms' }}></div>
          </div>
          <span className="text-accent-blue font-mono text-xl font-bold tracking-[0.3em] uppercase relative z-10">
            {message}
          </span>
          <div className="flex gap-1">
            <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce shadow-glow" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce shadow-glow" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce shadow-glow" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
});

LoadingBanner.displayName = 'LoadingBanner';

export default LoadingBanner;
