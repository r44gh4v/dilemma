import { useEffect, useRef, useCallback } from 'react';
import { fetchDilemmas, incrementPage } from '../store/dilemmasSlice.js';
import { useDilemmaState, useAppDispatch, useAsyncAction } from '../hooks/useStore.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import DilemmaCard from '../components/DilemmaCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';

const Feed = () => {
  const { dilemmas, page, hasMore } = useDilemmaState();
  const dispatch = useAppDispatch();
  const { execute, isLoading } = useAsyncAction('feed');

  // Prevent double fetch on mount
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) return;
    didMountRef.current = true;
    if (dilemmas.length === 0) {
      execute(fetchDilemmas({ page }), 'Loading feed...');
    }
  }, [execute, dilemmas.length, page]);

  // Load next page when page number increments
  useEffect(() => {
    if (!didMountRef.current) return;
    if (page > 1) {
      dispatch(fetchDilemmas({ page }));
    }
  }, [dispatch, page]);

  const loadMore = useCallback(() => {
    dispatch(incrementPage());
  }, [dispatch]);

  // Show skeleton on initial load
  if (isLoading && dilemmas.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SkeletonLoader type="feed" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {dilemmas.length > 0 && (
          <InfiniteScroll
            dataLength={dilemmas.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="text-center py-8">
                <div className="inline-block bg-dark-blue bg-opacity-70 backdrop-blur-md border-2 border-light-blue border-opacity-40 px-6 py-3 shadow-glow">
                  <span className="text-light-blue font-mono text-sm tracking-wider uppercase">Loading more...</span>
                </div>
              </div>
            }
          >
            {dilemmas.map(dilemma => (
              <DilemmaCard key={dilemma._id} dilemma={dilemma} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Feed;