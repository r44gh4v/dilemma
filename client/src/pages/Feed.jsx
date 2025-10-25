import { useEffect, useRef, useCallback } from 'react';
import { fetchDilemmas, incrementPage } from '../store/dilemmasSlice.js';
import { useDilemmaState, useAppDispatch, useAsyncAction } from '../hooks/useStore.js';
import InfiniteScroll from 'react-infinite-scroll-component';
import DilemmaCard from '../components/DilemmaCard.jsx';

const Feed = () => {
  const { dilemmas, page, hasMore } = useDilemmaState();
  const dispatch = useAppDispatch();
  const { execute, isLoading } = useAsyncAction('feed');

  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) return;
    didMountRef.current = true;
    if (dilemmas.length === 0) {
      execute(fetchDilemmas({ page: 1 }), 'Loading feed...');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 border-4 border-accent-blue animate-spin mx-auto mb-8"></div>
          <p className="text-accent-blue font-mono text-lg tracking-[0.2em] uppercase">
            Loading...
          </p>
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
                <div className="inline-flex items-center gap-4 bg-dark-blue bg-opacity-80 backdrop-blur-md border-2 border-accent-blue border-opacity-40 px-8 py-4 shadow-glow-intense">
                  <div className="w-5 h-5 border-2 border-accent-blue animate-spin"></div>
                  <span className="text-accent-blue font-mono text-sm tracking-[0.2em] uppercase">
                    Loading...
                  </span>
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