// components/create/Step4Photos.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, X, Upload, Camera, Heart, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { resolveImageUrl } from '@/lib/utils';
import ImageEditor, { ImageTransform } from '@/components/ui/ImageEditor';

// Simple photo slot upload component
function PhotoSlotUpload({ slotIndex, onUpload }: { slotIndex: number; onUpload: (url: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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

      onUpload(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Có lỗi khi tải ảnh. Vui lòng thử lại!');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />
      {uploading ? (
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center">
          <Plus className="w-6 h-6 text-rose-500 mb-1" />
          <span className="text-xs text-gray-600 text-center">Thêm ảnh</span>
        </div>
      )}
    </div>
  );
}

interface PhotoSlot {
  x: number; // Percentage from left
  y: number; // Percentage from top
  width: number; // Percentage
  height: number; // Percentage
  rotation?: number; // Degrees
  zIndex?: number;
}

interface PhotoFrame {
  id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  frame_image_url: string;
  photo_slots: PhotoSlot[];
  points_required: number;
  category?: string;
}

interface Step4PhotosProps {
  frameId: string | null;
  photoSlots: Array<{ slotIndex: number; photoUrl: string; transform?: ImageTransform }>;
  onSelectFrame: (frame: PhotoFrame | null) => void;
  onUpdatePhotoSlot: (slotIndex: number, photoUrl: string, transform?: ImageTransform) => void;
  onUpdatePhotoSlotTransform: (slotIndex: number, transform: ImageTransform) => void;
  onRemovePhotoSlot: (slotIndex: number) => void;
  userTym?: number;
}

export default function Step4Photos({
  frameId,
  photoSlots,
  onSelectFrame,
  onUpdatePhotoSlot,
  onUpdatePhotoSlotTransform,
  onRemovePhotoSlot,
  userTym = 0,
}: Step4PhotosProps) {
  const [frames, setFrames] = useState<PhotoFrame[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFrame, setSelectedFrame] = useState<PhotoFrame | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadFrames();
  }, []);

  useEffect(() => {
    if (frameId && frames.length > 0) {
      const frame = frames.find(f => f.id === frameId);
      if (frame) {
        setSelectedFrame(frame);
        onSelectFrame(frame);
      }
    }
  }, [frameId, frames]);

  const loadFrames = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_frames')
        .select('*')
        .eq('is_active', true)
        .order('points_required')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFrames(data || []);
    } catch (error) {
      console.error('Error loading frames:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFrame = (frame: PhotoFrame) => {
    if (frame.points_required > 0 && userTym < frame.points_required) {
      alert(`Bạn cần ${frame.points_required} Tym để sử dụng khuôn này!`);
      return;
    }
    setSelectedFrame(frame);
    onSelectFrame(frame);
  };


  const getSlotPhoto = (slotIndex: number): string | null => {
    const slot = photoSlots.find(s => s.slotIndex === slotIndex);
    return slot?.photoUrl || null;
  };

  const getSlotTransform = (slotIndex: number): ImageTransform | undefined => {
    const slot = photoSlots.find(s => s.slotIndex === slotIndex);
    return slot?.transform;
  };

  const [editingSlotIndex, setEditingSlotIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Chọn khuôn ảnh
        </h2>
        <p className="text-gray-600">
          Chọn một khuôn ảnh và thay thế bằng ảnh của bạn
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Frame Selection */}
          {!selectedFrame && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Chọn khuôn ảnh</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence>
                  {frames.map((frame) => (
                    <motion.button
                      key={frame.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => handleSelectFrame(frame)}
                      className={`
                        relative aspect-square rounded-xl overflow-hidden border-2 transition-all
                        ${frame.points_required > 0 && userTym < frame.points_required
                          ? 'border-gray-200 opacity-60 cursor-not-allowed'
                          : 'border-gray-200 hover:border-rose-400 cursor-pointer'
                        }
                      `}
                    >
                      {frame.thumbnail_url || frame.frame_image_url ? (
                        <img
                          src={resolveImageUrl((frame.thumbnail_url || frame.frame_image_url) as string) || ''}
                          alt={frame.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Image className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex flex-col items-center justify-center p-2">
                        <p className="text-white text-sm font-medium text-center mb-1 opacity-0 hover:opacity-100 transition-opacity">
                          {frame.name}
                        </p>
                        {frame.points_required > 0 && (
                          <span className="text-xs text-amber-300 opacity-0 hover:opacity-100 transition-opacity">
                            {frame.points_required} Tym
                          </span>
                        )}
                      </div>

                      {/* Free badge */}
                      {frame.points_required === 0 && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Free
                        </div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Frame Editor */}
          {selectedFrame && (
            <div className="space-y-6">
              {/* Frame Info & Actions */}
              <div className="flex items-center justify-between bg-rose-50 rounded-xl p-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{selectedFrame.name}</h3>
                  {selectedFrame.description && (
                    <p className="text-sm text-gray-600">{selectedFrame.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFrame(null);
                      onSelectFrame(null);
                    }}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Chọn khuôn khác
                  </button>
                </div>
              </div>

              {/* Frame Preview with Photo Slots */}
              <div className="relative bg-gray-50 rounded-2xl p-8 flex justify-center">
                <div className="relative" style={{ maxWidth: '100%', width: '100%' }}>
                  {/* Frame Image */}
                  <img
                    src={resolveImageUrl(selectedFrame.frame_image_url) || ''}
                    alt={selectedFrame.name}
                    className="w-full h-auto"
                    style={{ aspectRatio: 'auto' }}
                  />

                  {/* Photo Slots */}
                  {selectedFrame.photo_slots.map((slot, index) => {
                    const photoUrl = getSlotPhoto(index);

                    return (
                      <div
                        key={index}
                        className="absolute"
                        style={{
                          left: `${slot.x}%`,
                          top: `${slot.y}%`,
                          width: `${slot.width}%`,
                          height: `${slot.height}%`,
                          transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
                          zIndex: slot.zIndex || 10,
                        }}
                      >
                        {previewMode ? (
                          // Preview mode: show photo or placeholder
                          photoUrl ? (
                            <div className="w-full h-full overflow-hidden rounded">
                              <img
                                src={photoUrl}
                                alt={`Slot ${index + 1}`}
                                className="w-full h-full object-cover"
                                style={{
                                  transform: (() => {
                                    const transform = getSlotTransform(index);
                                    if (!transform) return undefined;
                                    return `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`;
                                  })(),
                                  transformOrigin: 'center center',
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 rounded flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-400" />
                            </div>
                          )
                        ) : editingSlotIndex === index ? (
                          // Edit mode with ImageEditor
                          <div className="w-full h-full border-2 border-blue-500 rounded bg-white">
                            <ImageEditor
                              src={photoUrl || ''}
                              alt={`Slot ${index + 1}`}
                              initialTransform={getSlotTransform(index) || { scale: 1, x: 0, y: 0 }}
                              onSave={(transform) => {
                                onUpdatePhotoSlotTransform(index, transform);
                                setEditingSlotIndex(null);
                              }}
                              onCancel={() => setEditingSlotIndex(null)}
                              showControls={true}
                              className="w-full h-full"
                            />
                          </div>
                        ) : (
                          // Edit mode: show photo or upload button
                          <div className="w-full h-full border-2 border-dashed border-rose-400 rounded bg-white/80 backdrop-blur-sm hover:bg-white transition group">
                            {photoUrl ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={photoUrl}
                                  alt={`Slot ${index + 1}`}
                                  className="w-full h-full object-cover rounded"
                                  style={{
                                    transform: (() => {
                                      const transform = getSlotTransform(index);
                                      if (!transform) return undefined;
                                      return `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px)`;
                                    })(),
                                    transformOrigin: 'center center',
                                  }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => setEditingSlotIndex(index)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition text-xs"
                                  >
                                    Chỉnh sửa
                                  </button>
                                  <button
                                    onClick={() => onRemovePhotoSlot(index)}
                                    className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <PhotoSlotUpload
                                slotIndex={index}
                                onUpload={(url) => onUpdatePhotoSlot(index, url)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-rose-500" />
                  Hướng dẫn
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    Click vào các ô trống để thêm ảnh của bạn
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    Bạn có thể thay thế ảnh bất cứ lúc nào
                  </li>
                  <li className="flex items-start gap-2">
                    <Heart className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                    Sử dụng nút "Xem trước" để xem kết quả cuối cùng
                  </li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
