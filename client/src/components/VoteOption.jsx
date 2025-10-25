import { memo } from 'react';

const VoteOption = memo(({
  imageUrl,
  text,
  votes,
  percent,
  onVote,
  selected,
  showImage
}) => (
  <button
    type="button"
    onClick={onVote}
    className={`text-left h-full flex flex-col border-[0.01rem] backdrop-blur-md p-5 transition-all duration-300 relative hover:shadow-glow-strong transform-gpu hover:cursor-pointer ${selected
        ? 'bg-[rgba(30,58,95,0.7)] border-[rgba(96,165,250,0.9)]'
        : 'btn-secondary bg-dark-blue bg-opacity-70 hover:bg-opacity-85'
      }`}
  >
    <div className="pointer-events-none absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity z-10"></div>
    <div className="pointer-events-none absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity z-10"></div>
    <div className="pointer-events-none absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity z-10"></div>
    <div className="pointer-events-none absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity z-10"></div>

    <div
      className="absolute inset-0 bg-gradient-to-r from-accent-blue/0 via-accent-blue/20 to-accent-blue/0 pointer-events-none transition-all duration-500"
      style={{ width: `${percent}%` }}
    ></div>

    <div className="relative z-10 flex flex-col flex-1">
      <div className="flex-1 flex flex-col items-center justify-center">
        {showImage && imageUrl && (
          <img
            src={imageUrl}
            alt="Option"
            className="w-full h-[12rem] mb-3 object-contain border-1 border-light-blue border-opacity-40 hover:border-accent-blue hover:border-opacity-90 hover:shadow-glow-strong transition-all duration-300"
            loading="lazy"
          />
        )}

        <p className="text-white text-base text-center sm:text-lg font-mono break-words leading-relaxed">
          {text}
        </p>
      </div>

      <div className="mt-4">
        <div className={`px-4 py-2 flex justify-between text-sm font-mono font-bold text-accent-blue bg-dark-blue bg-opacity-60 backdrop-blur-sm border border-accent-blue border-opacity-10 transition-all duration-300`}>

          <div className="relative z-10 tracking-wider">
            {votes} {votes > 1 ? 'votes' : 'vote'}
          </div>

          <div className="relative z-10 tracking-wider">
            {percent}%
          </div>

        </div>
      </div>
    </div>
  </button>
));

VoteOption.displayName = 'VoteOption';

export default VoteOption;
