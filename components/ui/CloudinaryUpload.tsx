'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Music } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
  accept?: string;
  maxSize?: number;
  type?: 'image' | 'audio' | 'any';
  className?: string;
  preview?: boolean;
  currentUrl?: string;
}

export default function CloudinaryUpload({
  onUpload,
  folder = 'vintage-ecard',
  accept = 'image/*',
  maxSize = 25,
  type = 'image',
  className = '',
  preview = true,
  currentUrl,
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File quá lớn. Tối đa ${maxSize}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    if (type === 'image' && preview) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      onUpload(data.url);
      setPreviewUrl(data.url);
    } catch (err) {
      setError('Upload thất bại. Vui lòng thử lại.');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreviewUrl(null);
    setError(null);
    onUpload('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const inputId = `cloudinary-upload-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id={inputId}
      />

      {previewUrl && preview ? (
        <div className="relative">
          {type === 'image' ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-24 bg-gray-100 rounded-xl flex items-center justify-center">
              <Music className="w-8 h-8 text-gray-400" />
              <span className="ml-2 text-sm text-gray-600 truncate max-w-[200px]">
                {previewUrl.split('/').pop()}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={clearPreview}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`
            flex flex-col items-center justify-center w-full h-48 
            border-2 border-dashed border-gray-300 rounded-xl 
            cursor-pointer hover:border-rose-400 hover:bg-rose-50/50 transition
            ${uploading ? 'pointer-events-none opacity-50' : ''}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 text-rose-500 animate-spin mb-2" />
              <span className="text-gray-500">Đang upload...</span>
            </>
          ) : (
            <>
              {type === 'image' ? (
                <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
              ) : (
                <Music className="w-10 h-10 text-gray-400 mb-2" />
              )}
              <span className="text-gray-600 font-medium">Click để chọn file</span>
              <span className="text-gray-400 text-sm mt-1">Tối đa {maxSize}MB</span>
            </>
          )}
        </label>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}