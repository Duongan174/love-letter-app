// components/ui/CloudinaryUpload.tsx
'use client';

import { useState } from 'react';
import { Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploadProps {
  onUpload: (url: string) => void; // Hàm trả về URL sau khi up xong
  currentUrl?: string; // URL hiện tại (nếu đang sửa)
  label?: string;
}

export default function CloudinaryUpload({ onUpload, currentUrl, label = "Ảnh bìa" }: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || '');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true); // Bắt đầu quay

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'vintage-ecard/templates'); // Folder trên Cloudinary

      // Gọi API
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Lỗi upload');

      // Upload xong -> Hiện ảnh & Trả về URL
      setPreview(data.url);
      onUpload(data.url);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload thất bại! Hãy kiểm tra lại file .env.local');
    } finally {
      setUploading(false); // Dừng quay dù thành công hay thất bại
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {preview ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            onClick={handleRemove}
            type="button"
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center">
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
                <p className="text-sm text-gray-500">Đang tải lên mây...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-gray-700">Nhấn để chọn ảnh/video</p>
                <p className="text-xs text-gray-400">JPG, PNG, MP4 (Max 10MB)</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}