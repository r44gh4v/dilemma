const UploadInput = ({ onSelect, disabled = false }) => {
  const onChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <label className={`btn btn-primary block ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative p-1 items-center justify-center text-center">
        <p className="text-sm tracking-[0.2em] font-bold uppercase">Select image (max 5MB)</p>
      </div>

      <input type="file" accept="image/*" onChange={onChange} className="hidden" disabled={disabled} />
    </label>
  );
};

export default UploadInput;