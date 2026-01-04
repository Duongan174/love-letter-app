// components/ui/ImagePageEditor.tsx
'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Edit2 } from 'lucide-react';
import ImageEditor, { ImageTransform } from '@/components/ui/ImageEditor';

interface ImagePageEditorProps {
  imageUrl: string | null;
  transform: ImageTransform | null;
  onImageChange: (url: string | null) => void;
  onTransformChange: (transform: ImageTransform) => void;
}

export default function ImagePageEditor({
  imageUrl,
  transform,
  onImageChange,
  onTransformChange,
}: ImagePageEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh phải nhỏ hơn 5MB!');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'card-photos');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onImageChange(data.url);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Có lỗi khi tải ảnh. Vui lòng thử lại!');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    if (confirm('Bạn có chắc muốn xóa ảnh này?')) {
      onImageChange(null);
      setIsEditing(false);
    }
  };

  if (!imageUrl) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-2xl border-2 border-dashed border-amber-300 p-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Chưa có ảnh</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tải ảnh lên để tạo trang ảnh đẹp mắt
              </p>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddImage}
              disabled={uploading}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang tải...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Tải ảnh lên</span>
                </>
              )}
            </motion.button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="w-full">
        <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-2xl border border-amber-200/50 shadow-xl p-6">
          <ImageEditor
            src={imageUrl}
            alt="Page Image"
            initialTransform={transform || { scale: 1, x: 0, y: 0 }}
            onSave={(newTransform) => {
              onTransformChange(newTransform);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
            showControls={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-2xl border border-amber-200/50 shadow-xl overflow-hidden">
        {/* Image Preview */}
        <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt="Page Image"
            className="w-full h-full object-cover"
            style={{
              transform: `scale(${transform?.scale || 1}) translate(${transform?.x || 0}px, ${transform?.y || 0}px)`,
              transformOrigin: 'center center',
            }}
          />
          
          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex items-center justify-center gap-3 opacity-0 hover:opacity-100">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium shadow-lg hover:bg-blue-600 transition flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              <span>Chỉnh sửa</span>
            </button>
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium shadow-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span>Xóa ảnh</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-gradient-to-r from-white to-gray-50 border-t border-amber-200/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ImageIcon className="w-4 h-4" />
            <span>Trang ảnh</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition text-sm font-medium flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Chỉnh sửa
            </button>
            <button
              onClick={handleRemoveImage}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

