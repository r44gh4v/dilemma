import { useCallback, useMemo, memo } from 'react';
import { useDispatch } from 'react-redux';
import { voteDilemma, likeDilemma, commentDilemma } from '../store/dilemmasSlice.js';
import { useAuthCheck } from '../hooks/useAuthCheck.js';
import VoteOption from './VoteOption.jsx';
import CommentThread from './CommentThread.jsx';
import Panel from './ui/Panel.jsx';
import Button from './ui/Button.jsx';

const DilemmaCard = memo(({ dilemma, onDelete, showComments = true }) => {
  const { requireAuth } = useAuthCheck();
  const dispatch = useDispatch();

  const selectedVote = useMemo(() => {
    if (dilemma.userVote) {
      return dilemma.userVote;
    }
    return null;
  }, [dilemma.userVote]);

  const handleVote = useCallback((choice) => {
    requireAuth(() => {
      dispatch(voteDilemma({ id: dilemma._id, choice }));
    }, 'Please log in to vote');
  }, [dispatch, dilemma._id, requireAuth]);

  const handleLike = useCallback(() => {
    requireAuth(() => {
      dispatch(likeDilemma({ id: dilemma._id }));
    }, 'Please log in to like');
  }, [dispatch, dilemma._id, requireAuth]);

  const handleComment = useCallback((text) => {
    requireAuth(() => {
      dispatch(commentDilemma({ id: dilemma._id, text }));
    }, 'Please log in to comment');
  }, [dispatch, dilemma._id, requireAuth]);

  const handleVoteA = useCallback(() => {
    handleVote('A');
  }, [handleVote]);

  const handleVoteB = useCallback(() => {
    handleVote('B');
  }, [handleVote]);

  const handleDeleteClick = useCallback(() => {
    if (onDelete) {
      onDelete(dilemma._id);
    }
  }, [onDelete, dilemma._id]);

  const total = (dilemma.votesA || 0) + (dilemma.votesB || 0) || 1;
  const percentA = Math.round(((dilemma.votesA || 0) / total) * 100);
  const percentB = Math.round(((dilemma.votesB || 0) / total) * 100);
  const hasImageA = !!dilemma.optionA?.imageUrl;
  const hasImageB = !!dilemma.optionB?.imageUrl;

  return (
    <Panel className="sm:p-8 mb-8 hover:shadow-glow-intense transition-all duration-300">

      {onDelete && (
        <div className="mb-4 pb--0 border-b-0 border-border-primary">
          <Button onClick={handleDeleteClick} variant="danger" className="px-6 py-3 w-full text-sm">
            Delete
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">

        <div className="text-sm sm:text-base text-accent-blue font-mono font-bold tracking-[0.2em] uppercase">
          User {dilemma.anonymousId}
        </div>

        <button
          onClick={handleLike}
          className={`btn icon-btn transition-all duration-300 ${dilemma.userLiked
              ? 'bg-[rgba(30,58,95,0.7)] border-[0.15rem] border-[rgba(96,165,250,0.9)]'
              : 'btn-secondary'
            }  `}
        >
          <span className="group-hover:scale-125 transition-transform duration-300">♥️ {dilemma.likeCount}</span>
        </button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
        <VoteOption
          imageUrl={dilemma.optionA.imageUrl}
          text={dilemma.optionA.text}
          votes={dilemma.votesA}
          percent={percentA}
          onVote={handleVoteA}
          selected={selectedVote === 'A'}
          showImage={hasImageA}
        />

        <VoteOption
          imageUrl={dilemma.optionB.imageUrl}
          text={dilemma.optionB.text}
          votes={dilemma.votesB}
          percent={percentB}
          onVote={handleVoteB}
          selected={selectedVote === 'B'}
          showImage={hasImageB}
        />
      </div>

      {showComments && (
        <div className="">
          <CommentThread comments={dilemma.comments} onComment={handleComment} />
        </div>
      )}


    </Panel>
  );
});

DilemmaCard.displayName = 'DilemmaCard';

export default DilemmaCard;