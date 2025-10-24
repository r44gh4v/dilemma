const Panel = ({ className = '', children }) => {
  return (
    <div className={`panel ${className} relative`}>
      <div className="pointer-events-none absolute -top-[2px] -left-[2px] w-4 h-4 border-t-2 border-l-2 border-accent-blue shadow-glow z-10"></div>
      <div className="pointer-events-none absolute -top-[2px] -right-[2px] w-4 h-4 border-t-2 border-r-2 border-accent-blue shadow-glow z-10"></div>
      <div className="pointer-events-none absolute -bottom-[2px] -left-[2px] w-4 h-4 border-b-2 border-l-2 border-accent-blue shadow-glow z-10"></div>
      <div className="pointer-events-none absolute -bottom-[2px] -right-[2px] w-4 h-4 border-b-2 border-r-2 border-accent-blue shadow-glow z-10"></div>
      {children}
    </div>
  );
};

export default Panel;
