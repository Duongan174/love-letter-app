'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, Stamp, Upload, Image as ImageIcon, Feather, Eye, EyeOff, Loader2 } from 'lucide-react';
import { ElegantSpinner } from '@/components/ui/Loading';
import { supabase } from '@/lib/supabase';
import ImageEditor, { type ImageTransform } from '@/components/ui/ImageEditor';

interface StampData {
  id: string;
  name: string;
  image_url: string;
  points_required: number;
  is_active: boolean;
  image_transform?: ImageTransform;
}

export default function AdminStamps() {
  const [stamps, setStamps] = useState<StampData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStamp, setEditingStamp] = useState<StampData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewStamp, setPreviewStamp] = useState<StampData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: '',
    image_url: '',
    points_required: 0,
    is_active: true,
    image_transform: { scale: 1, x: 0, y: 0 } as ImageTransform,
  });

  useEffect(() => {
    fetchStamps();
  }, []);

  const fetchStamps = async () => {
    const { data } = await supabase
      .from('stamps')
      .select('*')
      .order('created_at', { ascending: false });
    setStamps(data || []);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh phải nhỏ hơn 5MB!');
      return;
    }

    setUploading(true);

    try {
      // ✅ Dùng API endpoint server-side để upload (bypass Storage RLS)
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/stamps/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload file');
      }

      const data = await res.json();

      setForm(prev => ({ 
        ...prev, 
        image_url: data.url,
        image_transform: { scale: 1, x: 0, y: 0 },
      }));
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Lỗi upload ảnh: ' + (error.message || 'Vui lòng thử lại!'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.image_url) {
      alert('Vui lòng chọn ảnh cho tem!');
      return;
    }

    const dataToSave = {
      name: form.name,
      image_url: form.image_url,
      points_required: form.points_required,
      is_active: form.is_active,
      image_transform: form.image_transform,
    };

    if (editingStamp) {
      await supabase.from('stamps').update(dataToSave).eq('id', editingStamp.id);
    } else {
      await supabase.from('stamps').insert([dataToSave]);
    }
    setShowModal(false);
    resetForm();
    fetchStamps();
  };

  const resetForm = () => {
    setEditingStamp(null);
    setForm({ 
      name: '', 
      image_url: '', 
      points_required: 0, 
      is_active: true,
      image_transform: { scale: 1, x: 0, y: 0 },
    });
  };

  const handleEdit = (stamp: StampData) => {
    setEditingStamp(stamp);
    setForm({
      name: stamp.name,
      image_url: stamp.image_url,
      points_required: stamp.points_required,
      is_active: stamp.is_active,
      image_transform: stamp.image_transform || { scale: 1, x: 0, y: 0 },
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa tem này? Tất cả các card và draft đang sử dụng tem này cũng sẽ bị xóa.')) return;
    
    try {
      // ✅ API endpoint server-side sẽ tự động xóa các drafts và cards liên quan trước khi xóa stamp
      const res = await fetch(`/api/admin/stamps?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete stamp');
      }

      const result = await res.json();
      
      // Hiển thị thông báo nếu có drafts/cards đã bị xóa
      if (result.deletedDrafts > 0 || result.deletedCards > 0) {
        const deletedInfo = [];
        if (result.deletedDrafts > 0) deletedInfo.push(`${result.deletedDrafts} draft`);
        if (result.deletedCards > 0) deletedInfo.push(`${result.deletedCards} card`);
        alert(`Đã xóa tem và ${deletedInfo.join(', ')} liên quan.`);
      }
      
      fetchStamps();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Lỗi xóa tem: ' + (error.message || 'Đã có lỗi xảy ra'));
    }
  };

  const isImageUrl = (url: string) => {
    return url.startsWith('http') || url.startsWith('/') || url.startsWith('data:');
  };

  const filteredStamps = stamps.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Stamp className="w-5 h-5 text-burgundy" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink">Tem thư</h1>
          </div>
          <p className="text-ink/60 font-vn pl-13">Quản lý các mẫu tem với ảnh tùy chỉnh</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowModal(true); resetForm(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition shadow-lg font-vn font-medium"
        >
          <Plus className="w-5 h-5" />
          Thêm tem mới
        </motion.button>
      </div>

      {/* Decorative Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <Feather className="w-4 h-4 text-gold/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Search */}
      <div className="bg-cream-light rounded-2xl p-4 mb-6 border border-gold/20 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
          <input
            type="text"
            placeholder="Tìm kiếm tem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy/50 font-vn transition"
          />
        </div>
      </div>

      {/* Stamps Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <ElegantSpinner size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredStamps.map((stamp, index) => (
            <motion.div 
              key={stamp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-cream-light rounded-2xl p-4 border border-gold/20 shadow-sm hover:shadow-md transition group"
            >
              {/* Stamp Preview */}
              <div 
                className="aspect-[3/4] rounded-xl mb-3 relative overflow-hidden cursor-pointer bg-white border border-gold/20"
                onClick={() => setPreviewStamp(stamp)}
                style={{
                  // Perforated edge effect
                  clipPath: `polygon(
                    0% 4%, 4% 4%, 4% 0%, 12% 0%, 12% 4%, 20% 4%, 20% 0%, 28% 0%, 28% 4%, 36% 4%, 36% 0%, 44% 0%, 44% 4%, 52% 4%, 52% 0%, 60% 0%, 60% 4%, 68% 4%, 68% 0%, 76% 0%, 76% 4%, 84% 4%, 84% 0%, 92% 0%, 92% 4%, 96% 4%, 96% 0%, 100% 0%,
                    100% 4%, 96% 4%, 96% 12%, 100% 12%, 100% 20%, 96% 20%, 96% 28%, 100% 28%, 100% 36%, 96% 36%, 96% 44%, 100% 44%, 100% 52%, 96% 52%, 96% 60%, 100% 60%, 100% 68%, 96% 68%, 96% 76%, 100% 76%, 100% 84%, 96% 84%, 96% 92%, 100% 92%, 100% 100%,
                    96% 100%, 96% 96%, 92% 96%, 92% 100%, 84% 100%, 84% 96%, 76% 96%, 76% 100%, 68% 100%, 68% 96%, 60% 96%, 60% 100%, 52% 100%, 52% 96%, 44% 96%, 44% 100%, 36% 100%, 36% 96%, 28% 96%, 28% 100%, 20% 100%, 20% 96%, 12% 96%, 12% 100%, 4% 100%, 4% 96%, 0% 96%,
                    0% 92%, 4% 92%, 4% 84%, 0% 84%, 0% 76%, 4% 76%, 4% 68%, 0% 68%, 0% 60%, 4% 60%, 4% 52%, 0% 52%, 0% 44%, 4% 44%, 4% 36%, 0% 36%, 0% 28%, 4% 28%, 4% 20%, 0% 20%, 0% 12%, 4% 12%, 4% 4%
                  )`,
                }}
              >
                {isImageUrl(stamp.image_url) ? (
                  <img
                    src={stamp.image_url}
                    alt={stamp.name}
                    className="w-full h-full object-cover"
                    style={stamp.image_transform ? {
                      transform: `translate(${stamp.image_transform.x}px, ${stamp.image_transform.y}px) scale(${stamp.image_transform.scale})`,
                    } : undefined}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {stamp.image_url}
                  </div>
                )}

            {!stamp.is_active && (
                  <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                    <span className="text-cream text-xs font-vn bg-ink/50 px-2 py-1 rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Đã ẩn
                    </span>
                  </div>
            )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-5 h-5 text-burgundy" />
                </div>
              </div>

              {/* Info */}
              <h3 className="font-vn font-semibold text-ink text-sm mb-1 truncate">{stamp.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-ink/50 font-vn">
                  {isImageUrl(stamp.image_url) ? 'Ảnh' : 'Emoji'}
                </span>
                <span className="font-medium text-burgundy text-sm">💜 {stamp.points_required}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
              <button
                onClick={() => handleEdit(stamp)}
                  className="flex-1 p-2 bg-gold/10 text-ink/70 rounded-lg hover:bg-gold/20 transition flex items-center justify-center gap-1"
              >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs font-vn">Sửa</span>
              </button>
              <button
                onClick={() => handleDelete(stamp.id)}
                  className="p-2 bg-burgundy/10 text-burgundy rounded-lg hover:bg-burgundy/20 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            </motion.div>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!loading && filteredStamps.length === 0 && (
        <div className="text-center py-16">
          <Stamp className="w-16 h-16 text-ink/20 mx-auto mb-4" />
          <p className="font-vn text-ink/50">Chưa có tem nào</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
      {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cream-light rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gold/20 shadow-vintage"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-ink">
                  {editingStamp ? 'Sửa tem' : 'Thêm tem mới'}
            </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gold/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-ink/50" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
              <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Tên tem</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                    placeholder="VD: Hoa hồng vintage"
                  required
                />
              </div>

                {/* Image Upload */}
              <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Ảnh tem</label>
                  
                  {/* Upload Button */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  {!form.image_url ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full aspect-[3/4] max-w-[200px] mx-auto flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gold/40 rounded-xl bg-cream hover:bg-gold/10 transition"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
                          <span className="text-sm text-ink/60 font-vn">Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-ink/40" />
                          <span className="text-sm text-ink/60 font-vn">Chọn ảnh</span>
                          <span className="text-xs text-ink/40">PNG, JPG (max 5MB)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Image Editor */}
                      <div className="max-w-[200px] mx-auto">
                        <ImageEditor
                          src={form.image_url}
                          alt={form.name || 'Stamp preview'}
                          aspectRatio={3/4}
                          initialTransform={form.image_transform}
                          showControls={true}
                          onSave={(transform) => setForm({ ...form, image_transform: transform })}
                        />
                      </div>
                      
                      {/* Change image button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-2 text-sm text-burgundy hover:bg-burgundy/10 rounded-lg transition font-vn flex items-center justify-center gap-2"
                      >
                        <ImageIcon className="w-4 h-4" />
                        Đổi ảnh khác
                      </button>
                    </div>
                  )}
                </div>

                {/* Points */}
              <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Giá (Tym)</label>
                <input
                  type="number"
                  value={form.points_required}
                  onChange={(e) => setForm({ ...form, points_required: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                  min="0"
                />
              </div>

                {/* Active */}
                <label className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-gold/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="w-5 h-5 text-burgundy rounded focus:ring-burgundy/30"
                />
                  <div>
                    <span className="font-vn font-medium text-ink">Hiển thị</span>
                    <p className="text-xs text-ink/50">Cho phép người dùng chọn tem này</p>
                  </div>
              </label>

                {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-cream border border-gold/20 text-ink/70 rounded-xl hover:bg-gold/10 transition font-vn font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                    className="flex-1 px-4 py-3 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition font-vn font-medium shadow-lg"
                >
                    {editingStamp ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewStamp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewStamp(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cream-light rounded-2xl p-8 max-w-sm w-full border border-gold/20 shadow-vintage text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold text-ink mb-6">{previewStamp.name}</h3>
              
              <div 
                className="aspect-[3/4] max-w-[180px] mx-auto rounded-xl overflow-hidden bg-white shadow-lg mb-6"
                style={{
                  clipPath: `polygon(
                    0% 4%, 4% 4%, 4% 0%, 12% 0%, 12% 4%, 20% 4%, 20% 0%, 28% 0%, 28% 4%, 36% 4%, 36% 0%, 44% 0%, 44% 4%, 52% 4%, 52% 0%, 60% 0%, 60% 4%, 68% 4%, 68% 0%, 76% 0%, 76% 4%, 84% 4%, 84% 0%, 92% 0%, 92% 4%, 96% 4%, 96% 0%, 100% 0%,
                    100% 4%, 96% 4%, 96% 12%, 100% 12%, 100% 20%, 96% 20%, 96% 28%, 100% 28%, 100% 36%, 96% 36%, 96% 44%, 100% 44%, 100% 52%, 96% 52%, 96% 60%, 100% 60%, 100% 68%, 96% 68%, 96% 76%, 100% 76%, 100% 84%, 96% 84%, 96% 92%, 100% 92%, 100% 100%,
                    96% 100%, 96% 96%, 92% 96%, 92% 100%, 84% 100%, 84% 96%, 76% 96%, 76% 100%, 68% 100%, 68% 96%, 60% 96%, 60% 100%, 52% 100%, 52% 96%, 44% 96%, 44% 100%, 36% 100%, 36% 96%, 28% 96%, 28% 100%, 20% 100%, 20% 96%, 12% 96%, 12% 100%, 4% 100%, 4% 96%, 0% 96%,
                    0% 92%, 4% 92%, 4% 84%, 0% 84%, 0% 76%, 4% 76%, 4% 68%, 0% 68%, 0% 60%, 4% 60%, 4% 52%, 0% 52%, 0% 44%, 4% 44%, 4% 36%, 0% 36%, 0% 28%, 4% 28%, 4% 20%, 0% 20%, 0% 12%, 4% 12%, 4% 4%
                  )`,
                }}
              >
                {isImageUrl(previewStamp.image_url) ? (
                  <img
                    src={previewStamp.image_url}
                    alt={previewStamp.name}
                    className="w-full h-full object-cover"
                    style={previewStamp.image_transform ? {
                      transform: `translate(${previewStamp.image_transform.x}px, ${previewStamp.image_transform.y}px) scale(${previewStamp.image_transform.scale})`,
                    } : undefined}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {previewStamp.image_url}
        </div>
      )}
              </div>

              <p className="text-burgundy font-medium mb-4">💜 {previewStamp.points_required} Tym</p>

              <button
                onClick={() => setPreviewStamp(null)}
                className="w-full py-3 bg-burgundy text-cream rounded-xl font-vn font-medium hover:bg-burgundy-dark transition"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
