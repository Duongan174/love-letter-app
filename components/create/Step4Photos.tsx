// components/create/Step4Photos.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, X, Upload, Camera, Heart } from 'lucide-react';

interface Step4PhotosProps {
  photos: string[];
  onAddPhoto: (photoUrl: string) => void;
  onRemovePhoto: (index: number) => void;
}

export default function Step4Photos({
  photos,
  onAddPhoto,
  onRemovePhoto,
}: Step4PhotosProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Ảnh phải nhỏ hơn 5MB!');
      return;
    }
    
    setUploading(true);
    
    try {
      // For now, use local preview URL
      // In production, upload to Cloudinary
      const previewUrl = URL.createObjectURL(file);
      onAddPhoto(previewUrl);
      
      // TODO: Upload to Cloudinary
      // const formData = new FormData();
      // formData.append('file', file);
      // formData.append('upload_preset', 'your_preset');
      // const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud/image/upload', {
      //   method: 'POST',
      //   body: formData
      // });
      // const data = await res.json();
      // onAddPhoto(data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Có lỗi khi tải ảnh. Vui lòng thử lại!');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && photos.length < 4) {
      const input = fileInputRef.current;
      if (input) {
        // Create a new DataTransfer to set files
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(files[0]);
        input.files = dataTransfer.files;
        handleFileSelect({ target: input } as any);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Thêm ảnh kỷ niệm
        </h2>
        <p className="text-gray-600">
          Tải lên tối đa 4 ảnh để làm thiệp thêm đặc biệt (tùy chọn)
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Area */}
      <div 
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Existing Photos */}
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => (
            <motion.div
              key={photo}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              className="relative aspect-square rounded-2xl overflow-hidden group shadow-lg"
            >
              <img
                src={photo}
                alt={`Ảnh ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onRemovePhoto(index)}
                  className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Index badge */}
              <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-xs font-bold text-rose-500">
                {index + 1}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add Photo Button */}
        {photos.length < 4 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`
              aspect-square rounded-2xl border-2 border-dashed
              flex flex-col items-center justify-center gap-2
              transition-all
              ${uploading 
                ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                : 'border-rose-300 bg-rose-50 hover:bg-rose-100 hover:border-rose-400 cursor-pointer'
              }
            `}
          >
            {uploading ? (
              <>
                <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-500">Đang tải...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-rose-200 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-rose-500" />
                </div>
                <span className="text-sm font-medium text-rose-600">Thêm ảnh</span>
                <span className="text-xs text-gray-400">{photos.length}/4</span>
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Drop Zone Info */}
      <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 mb-1">Kéo thả ảnh vào đây</p>
        <p className="text-xs text-gray-400">hoặc click vào ô trống để chọn ảnh</p>
        <p className="text-xs text-gray-400 mt-2">Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)</p>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Camera className="w-5 h-5 text-rose-500" />
          Mẹo chọn ảnh đẹp
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            Chọn ảnh có ý nghĩa với cả hai người
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            Ảnh có độ sáng tốt sẽ hiển thị đẹp hơn
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            Ảnh vuông hoặc dọc phù hợp với thiệp nhất
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            Bạn có thể bỏ qua bước này nếu không cần ảnh
          </li>
        </ul>
      </div>
    </div>
  );
}
