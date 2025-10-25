import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDilemmaById } from '../store/dilemmasSlice.js';
import { useSingleDilemma, useAsyncAction } from '../hooks/useStore.js';
import DilemmaCard from '../components/DilemmaCard.jsx';

const DilemmaView = () => {
  const { id } = useParams();
  const { singleDilemma } = useSingleDilemma();
  const { execute } = useAsyncAction('singleDilemma');
  
  const lastIdRef = useRef(null);

  useEffect(() => {
    if (lastIdRef.current === id) return;
    lastIdRef.current = id;
    execute(fetchDilemmaById(id), 'Loading dilemma...');
  }, [id, execute]);

  if (!singleDilemma) return null;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <DilemmaCard dilemma={singleDilemma} />
      </div>
    </div>
  );
};

export default DilemmaView;