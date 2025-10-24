import { useState, memo, useCallback } from 'react';

const CommentThread = memo(({ comments, onComment }) => {
  const [newComment, setNewComment] = useState('');
  const [visibleComments, setVisibleComments] = useState(5);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onComment(newComment);
      setNewComment('');
    }
  }, [newComment, onComment]);

  const loadMore = useCallback(() => {
    setVisibleComments(v => v + 5);
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="h-0.5 w-8 bg-accent-blue shadow-glow"></div>
        <h4 className="text-sm text-accent-blue font-bold tracking-[0.2em] uppercase">Comments ({comments.length})</h4>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="input flex-1 h-fit !py-2 text-xs"
          maxLength={200}
        />

        <button type="submit" className="btn btn-primary h-fit px-4 py-2 text-sm">
          Post
        </button>
      </form>
      
      <div className="space-y-0 max-h-72 overflow-y-auto">
        {comments.slice(0, visibleComments).map((comment) => (
          <div key={comment._id} className="relative bg-dark-blue bg-opacity-60 backdrop-blur-sm border-l-2 border-accent-blue border-opacity-40 px-4 py-2 hover:bg-opacity-80 hover:border-opacity-100 hover:shadow-glow transition-all duration-300">
            <div className="text-sm text-light-blue font-mono">
              <span className="text-accent-blue font-bold tracking-wider">#{comment.anonymousId}</span>
              <span className="mx-3 text-light-blue opacity-40">·</span>
              <span className="text-white leading-relaxed">{comment.text}</span>
            </div>
          </div>
        ))}

        {comments.length > visibleComments && (
          <button onClick={loadMore} className="btn btn-secondary w-full py-3 text-sm">
            Load more ({comments.length - visibleComments})
          </button>
        )}
      </div>

    </div>
  );
});

CommentThread.displayName = 'CommentThread';

export default CommentThread;