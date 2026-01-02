// components/create/Step4Photos.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, X, Upload, Camera, Heart, Trash2, Edit2 } from 'lucide-react';
import ImageEditor, { ImageTransform } from '@/components/ui/ImageEditor';

interface Step4PhotosProps {
  photos: string[];
  onAddPhoto: (photoUrl: string) => void;
  onRemovePhoto: (index: number) => void;
  onUpdatePhotoTransform?: (index: number, transform: ImageTransform) => void;
  photoTransforms?: Array<ImageTransform | undefined>;
}

export default function Step4Photos({
  photos,
  onAddPhoto,
  onRemovePhoto,
  onUpdatePhotoTransform,
  photoTransforms = [],
}: Step4PhotosProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);

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

      onAddPhoto(data.url);
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

  const handleAddPhoto = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Thêm ảnh
        </h2>
        <p className="text-gray-600">
          Mỗi ảnh sẽ là một trang riêng trong thiệp của bạn
        </p>
      </div>

      {/* Upload Button */}
      <div className="mb-8 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddPhoto}
          disabled={uploading}
          className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Đang tải...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>Thêm ảnh mới</span>
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

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Chưa có ảnh nào</p>
          <p className="text-sm text-gray-500">Nhấn nút "Thêm ảnh mới" để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {photos.map((photoUrl, index) => {
              const isEditing = editingPhotoIndex === index;
              const transform = photoTransforms[index] || { scale: 1, x: 0, y: 0 };

              return (
                <motion.div
                  key={`${photoUrl}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 border-gray-200"
                >
                  {isEditing && onUpdatePhotoTransform ? (
                    <div className="aspect-[3/4] relative">
                      <ImageEditor
                        src={photoUrl}
                        alt={`Photo ${index + 1}`}
                        initialTransform={transform}
                        onSave={(newTransform) => {
                          onUpdatePhotoTransform(index, newTransform);
                          setEditingPhotoIndex(null);
                        }}
                        onCancel={() => setEditingPhotoIndex(null)}
                        showControls={true}
                        className="w-full h-full"
                      />
                    </div>
                  ) : (
                    <>
                      {/* Photo Preview */}
                      <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                        <img
                          src={photoUrl}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          style={{
                            transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`,
                            transformOrigin: 'center center',
                          }}
                        />
                        
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                          {onUpdatePhotoTransform && (
                            <button
                              onClick={() => setEditingPhotoIndex(index)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium shadow-lg hover:bg-blue-600 transition flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              <span>Chỉnh sửa</span>
                            </button>
                          )}
                          <button
                            onClick={() => onRemovePhoto(index)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium shadow-lg hover:bg-red-600 transition flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Xóa</span>
                          </button>
                        </div>
                      </div>

                      {/* Photo Info */}
                      <div className="p-4 bg-gradient-to-b from-white to-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Trang {index + 1}
                            </span>
                          </div>
                          <button
                            onClick={() => onRemovePhoto(index)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Camera className="w-5 h-5 text-rose-500" />
          Hướng dẫn
        </h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            Mỗi ảnh bạn thêm sẽ là một trang riêng trong thiệp
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            Bạn có thể thêm nhiều ảnh, sắp xếp thứ tự và xóa bất cứ lúc nào
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            Sử dụng nút "Chỉnh sửa" để điều chỉnh vị trí và kích thước ảnh
          </li>
        </ul>
      </div>
    </div>
  );
}
