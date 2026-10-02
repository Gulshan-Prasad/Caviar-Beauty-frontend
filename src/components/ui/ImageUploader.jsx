import { useState, useRef } from 'react';
import { FiUploadCloud, FiX, FiImage, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { uploadFile } from '@/utils/api';

export default function ImageUploader({ value, onChange, onRemove, index }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError(null);
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!allowed.includes(file.type)) {
      setError('Invalid file type. Accepted: JPG, PNG, WebP, AVIF.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFile(file);
      onChange(result.url);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);

  const handleBrowse = () => inputRef.current?.click();

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = '';
  };

  if (value) {
    return (
      <div className="relative w-full h-full group">
        <img
          src={value.startsWith('http') ? value : value}
          alt=""
          className="w-full h-full object-cover rounded"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
            <button type="button" onClick={handleBrowse} className="p-1.5 bg-white/90 rounded hover:bg-white transition-colors">
              <FiImage className="w-3.5 h-3.5" />
            </button>
            <button type="button" onClick={onRemove} className="p-1.5 bg-white/90 rounded hover:bg-white transition-colors">
              <FiX className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleBrowse}
      className={`relative w-full h-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed rounded transition-colors ${
        dragOver
          ? 'border-gold-500 bg-gold-50 dark:bg-gold-900/10'
          : error
            ? 'border-red-300 bg-red-50 dark:bg-red-900/10'
            : 'border-caviar-200 dark:border-caviar-700 hover:border-caviar-400 dark:hover:border-caviar-500 bg-caviar-50 dark:bg-caviar-900/30'
      }`}
    >
      {uploading ? (
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-[10px] text-caviar-500">Uploading...</p>
        </div>
      ) : error ? (
        <div className="text-center px-4">
          <FiAlertCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
          <p className="text-[10px] text-red-500">{error}</p>
        </div>
      ) : (
        <div className="text-center">
          <FiUploadCloud className="w-8 h-8 text-caviar-300 mx-auto mb-2" />
          <p className="text-[10px] text-caviar-500 uppercase tracking-wider">Drop image here</p>
          <p className="text-[9px] text-caviar-400 mt-1">or click to browse</p>
          <p className="text-[8px] text-caviar-400 mt-1">JPG, PNG, WebP, AVIF · Max 5MB</p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleInputChange} className="hidden" />
    </div>
  );
}
