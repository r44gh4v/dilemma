import { useEffect, useCallback, useRef } from 'react';
import { fetchUserDilemmas, deleteDilemma } from '../store/dilemmasSlice.js';
import { useUserDilemmas, useAsyncAction } from '../hooks/useStore.js';
import { useLoading } from '../contexts/LoadingContext.jsx';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        <div className="text-center">
          <h2 className="heading">My Dilemmas</h2>
          <div className="heading-rule"></div>
        </div>

        {loading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 border-4 border-accent-blue animate-spin mx-auto mb-8"></div>
              <p className="text-accent-blue font-mono text-lg tracking-[0.2em] uppercase">
                Loading...
              </p>
            </div>
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