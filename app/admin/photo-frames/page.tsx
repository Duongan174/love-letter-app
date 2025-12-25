// app/admin/photo-frames/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Plus, X, Edit2, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';
import { resolveImageUrl } from '@/lib/utils';
import PhotoSlotEditor from '@/components/ui/PhotoSlotEditor';

interface PhotoSlot {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
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
  is_active: boolean;
}

export default function AdminPhotoFramesPage() {
  const [frames, setFrames] = useState<PhotoFrame[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFrame, setEditingFrame] = useState<PhotoFrame | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    thumbnail_url: '',
    frame_image_url: '',
    photo_slots: [] as PhotoSlot[],
    points_required: 0,
    category: '',
    is_active: true,
  });

  useEffect(() => {
    loadFrames();
  }, []);

  const loadFrames = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_frames')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFrames(data || []);
    } catch (error) {
      console.error('Error loading frames:', error);
      alert('Lỗi khi tải danh sách khuôn ảnh');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.frame_image_url) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      if (editingFrame) {
        // Update
        const { error } = await supabase
          .from('photo_frames')
          .update({
            name: formData.name,
            description: formData.description,
            thumbnail_url: formData.thumbnail_url,
            frame_image_url: formData.frame_image_url,
            photo_slots: formData.photo_slots,
            points_required: formData.points_required,
            category: formData.category,
            is_active: formData.is_active,
          })
          .eq('id', editingFrame.id);

        if (error) throw error;
      } else {
        // Create
        const { error } = await supabase
          .from('photo_frames')
          .insert([{
            name: formData.name,
            description: formData.description,
            thumbnail_url: formData.thumbnail_url,
            frame_image_url: formData.frame_image_url,
            photo_slots: formData.photo_slots,
            points_required: formData.points_required,
            category: formData.category,
            is_active: formData.is_active,
          }]);

        if (error) throw error;
      }

      resetForm();
      loadFrames();
      alert(editingFrame ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
    } catch (error) {
      console.error('Error saving frame:', error);
      alert('Lỗi khi lưu khuôn ảnh');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khuôn ảnh này?')) return;

    try {
      // Check if frame is used in any cards
      const { data: cards } = await supabase
        .from('cards')
        .select('id')
        .eq('frame_id', id)
        .limit(1);

      if (cards && cards.length > 0) {
        alert('Không thể xóa khuôn ảnh này vì đã có thiệp sử dụng!');
        return;
      }

      const { error } = await supabase
        .from('photo_frames')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadFrames();
      alert('Xóa thành công!');
    } catch (error) {
      console.error('Error deleting frame:', error);
      alert('Lỗi khi xóa khuôn ảnh');
    }
  };

  const handleEdit = (frame: PhotoFrame) => {
    setEditingFrame(frame);
    setFormData({
      name: frame.name,
      description: frame.description || '',
      thumbnail_url: frame.thumbnail_url || '',
      frame_image_url: frame.frame_image_url,
      photo_slots: frame.photo_slots || [],
      points_required: frame.points_required,
      category: frame.category || '',
      is_active: frame.is_active,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingFrame(null);
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      thumbnail_url: '',
      frame_image_url: '',
      photo_slots: [],
      points_required: 0,
      category: '',
      is_active: true,
    });
  };

  const addPhotoSlot = () => {
    setFormData(prev => ({
      ...prev,
      photo_slots: [
        ...prev.photo_slots,
        { x: 10, y: 10, width: 30, height: 30, rotation: 0, zIndex: 10 },
      ],
    }));
  };

  const updatePhotoSlot = (index: number, updates: Partial<PhotoSlot>) => {
    setFormData(prev => ({
      ...prev,
      photo_slots: prev.photo_slots.map((slot, i) =>
        i === index ? { ...slot, ...updates } : slot
      ),
    }));
  };

  const removePhotoSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photo_slots: prev.photo_slots.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Khuôn Ảnh</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm khuôn mới
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {editingFrame ? 'Chỉnh sửa khuôn ảnh' : 'Thêm khuôn ảnh mới'}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên khuôn *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh thumbnail
                </label>
                <CloudinaryUpload
                  folder="photo-frames"
                  onUpload={(url) => setFormData(prev => ({ ...prev, thumbnail_url: url }))}
                  currentUrl={formData.thumbnail_url}
                  accept="image/*"
                  label=""
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh khuôn (Frame) *
                </label>
                <CloudinaryUpload
                  folder="photo-frames"
                  onUpload={(url) => setFormData(prev => ({ ...prev, frame_image_url: url }))}
                  currentUrl={formData.frame_image_url}
                  accept="image/*"
                  label=""
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (Tym)
                </label>
                <input
                  type="number"
                  value={formData.points_required}
                  onChange={(e) => setFormData(prev => ({ ...prev, points_required: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="birthday, wedding, etc."
                />
              </div>
            </div>

            {/* Photo Slots Editor */}
            {formData.frame_image_url && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vị trí ảnh (Photo Slots) - Kéo thả để di chuyển, kéo góc để resize, kéo icon xoay để xoay
                </label>
                <PhotoSlotEditor
                  frameImageUrl={formData.frame_image_url}
                  slots={formData.photo_slots}
                  onSlotsChange={(newSlots) => setFormData(prev => ({ ...prev, photo_slots: newSlots }))}
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Kích hoạt
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
              >
                {editingFrame ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Hủy
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Frames List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {frames.map((frame) => (
          <motion.div
            key={frame.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="relative aspect-square">
              {frame.thumbnail_url || frame.frame_image_url ? (
                <img
                  src={resolveImageUrl((frame.thumbnail_url || frame.frame_image_url) as string) || ''}
                  alt={frame.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              {!frame.is_active && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  Ẩn
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-1">{frame.name}</h3>
              {frame.description && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{frame.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{frame.photo_slots?.length || 0} slots</span>
                <span className={frame.points_required > 0 ? 'text-amber-500' : 'text-green-600'}>
                  {frame.points_required === 0 ? 'Free' : `${frame.points_required} Tym`}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(frame)}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(frame.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {frames.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>Chưa có khuôn ảnh nào</p>
        </div>
      )}
    </div>
  );
}

