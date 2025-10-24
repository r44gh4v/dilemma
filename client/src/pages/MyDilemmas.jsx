import { useEffect, useCallback, useRef } from 'react';
import { fetchUserDilemmas, deleteDilemma } from '../store/dilemmasSlice.js';
import { useUserDilemmas, useAsyncAction } from '../hooks/useStore.js';
import { useLoading } from '../contexts/LoadingContext.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import LoadingBanner from '../components/LoadingBanner.jsx';
import DilemmaCard from '../components/DilemmaCard.jsx';
import Panel from '../components/ui/Panel.jsx';
import Button from '../components/ui/Button.jsx';

const MyDilemmas = () => {
  const { userDilemmas, loading } = useUserDilemmas();
  const { execute } = useAsyncAction('userDilemmas');
  const deleteLoading = useLoading('deleteDilemma');
  
  // Prevent duplicate fetch on mount
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    execute(fetchUserDilemmas(), 'Loading your dilemmas...');
  }, [execute]);

  const handleDelete = useCallback(async (id) => {
    await deleteLoading.withLoading(
      async () => {
        await execute(deleteDilemma(id), 'Deleting...');
      },
      'Deleting dilemma...'
    );
  }, [execute, deleteLoading]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-8">
          <h2 className="heading">My Dilemmas</h2>
          <div className="heading-rule"></div>
        </div>
        
        {loading ? (
          <div>
            <LoadingBanner message="Loading Your Dilemmas" />
            <SkeletonLoader type="feed" />
          </div>
        ) : userDilemmas.length === 0 ? (
          <Panel className="text-center py-16">
            <div className="text-accent-blue font-mono text-lg font-bold mb-8 tracking-[0.25em] uppercase">No dilemmas yet</div>
            <Button to="/post" variant="primary" className="inline-block px-8 py-4 text-base">Create one</Button>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userDilemmas.map(dilemma => (
              <DilemmaCard 
                key={dilemma._id} 
                dilemma={dilemma} 
                onDelete={handleDelete}
                showComments={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyDilemmas;