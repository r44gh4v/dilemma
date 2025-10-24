import { memo } from 'react';
import UploadInput from './UploadInput.jsx';

const DilemmaOption = memo(({ label, value, onChange, onImageUpload, disabled = false }) => (
  <div className="h-full flex flex-col bg-dark-blue bg-opacity-70 backdrop-blur-md p-5 hover:bg-opacity-85 transition-all duration-300 relative">
    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity"></div>
    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity"></div>
    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-light-blue opacity-50 hover:opacity-100 transition-opacity"></div>

    <div className="flex items-center justify-center mb-4 text-lg text-accent-blue font-bold tracking-[0.25em] uppercase">
      {label}
    </div>

  <UploadInput disabled={disabled} onSelect={(file) => onImageUpload(file)} />

    {value.previewUrl ? (
      <img
        src={value.previewUrl}
        alt={label}
        className="w-full h-[12rem] object-contain mt-4 border border-light-blue border-opacity-40 hover:border-accent-blue hover:border-opacity-90 hover:shadow-glow-strong transition-all duration-300"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-[12rem] flex items-center justify-center mt-4 border-2 border-dashed border-light-blue border-opacity-40 text-light-blue opacity-50">
        No image selected
      </div>
    )}

    <textarea
      value={value.text}
      onChange={(e) => onChange({ ...value, text: e.target.value })}
      placeholder={`Describe...`}
      className="input resize-none mt-4 mb-3 h-28 overflow-auto placeholder:opacity-70"
      rows={4}
      maxLength={200}
      required
      disabled={disabled}
    />

    <div className="text-right text-sm text-accent-blue font-bold tracking-wider">
      {value.text.length}/200
    </div>

  </div>
));

DilemmaOption.displayName = 'DilemmaOption';

export default DilemmaOption;
