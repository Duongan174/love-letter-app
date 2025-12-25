// app/admin/stickers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, Sparkles, Upload, Feather, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';
import StickerEditor from '@/components/ui/StickerEditor';
import { ImageTransform } from '@/components/ui/ImageEditor';

interface Sticker {
  id: string;
  name: string;
  image_url: string;
  category: string;
  points_required: number;
  is_active: boolean;
  created_at: string;
}

const CATEGORIES = [
  { value: 'general', label: 'Chung', emoji: '⭐' },
  { value: 'love', label: 'Tình yêu', emoji: '❤️' },
  { value: 'birthday', label: 'Sinh nhật', emoji: '🎂' },
  { value: 'celebration', label: 'Chúc mừng', emoji: '🎉' },
  { value: 'nature', label: 'Thiên nhiên', emoji: '🌿' },
  { value: 'animal', label: 'Động vật', emoji: '🐾' },
  { value: 'food', label: 'Đồ ăn', emoji: '🍰' },
  { value: 'holiday', label: 'Lễ hội', emoji: '🎄' },
];

export default function AdminStickers() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSticker, setEditingSticker] = useState<Sticker | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    image_url: '',
    category: 'general',
    points_required: 0,
    is_active: true,
  });
  const [showEditor, setShowEditor] = useState(false);
  const [editorImageUrl, setEditorImageUrl] = useState('');
  const [imageTransform, setImageTransform] = useState<ImageTransform>({ scale: 1, x: 0, y: 0 });

  useEffect(() => {
    fetchStickers();
  }, []);

  const fetchStickers = async () => {
    try {
      const { data } = await supabase
        .from('stickers')
        .select('*')
        .order('created_at', { ascending: false });
      
      setStickers(data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.image_url) {
      alert('Vui lòng upload ảnh sticker!');
      return;
    }

    setUploading(true);
    
    try {
      if (editingSticker) {
        await supabase.from('stickers').update(form).eq('id', editingSticker.id);
      } else {
        await supabase.from('stickers').insert([form]);
      }

      setShowModal(false);
      resetForm();
      fetchStickers();
    } catch (error: any) {
      console.error('Lỗi lưu DB:', error);
      alert('Lỗi lưu: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingSticker(null);
    setForm({
      name: '',
      image_url: '',
      category: 'general',
      points_required: 0,
      is_active: true,
    });
    setEditorImageUrl('');
    setImageTransform({ scale: 1, x: 0, y: 0 });
    setShowEditor(false);
  };

  const handleEdit = (sticker: Sticker) => {
    setEditingSticker(sticker);
    setForm({
      name: sticker.name,
      image_url: sticker.image_url,
      category: sticker.category,
      points_required: sticker.points_required,
      is_active: sticker.is_active,
    });
    setEditorImageUrl(sticker.image_url);
    setImageTransform({ scale: 1, x: 0, y: 0 });
    setShowEditor(false);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa sticker này?')) return;
    
    try {
      const { error } = await supabase.from('stickers').delete().eq('id', id);
      
      if (error) {
        console.error('Delete error:', error);
        alert('Lỗi xóa sticker: ' + error.message);
        return;
      }
      
      fetchStickers();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Lỗi xóa sticker: ' + (error.message || 'Đã có lỗi xảy ra'));
    }
  };

  const filteredStickers = stickers.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-burgundy" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink">Sticker</h1>
          </div>
          <p className="text-ink/60 font-vn pl-13">Quản lý các sticker có thể kéo thả vào thư</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowModal(true); resetForm(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition shadow-lg font-vn font-medium"
        >
          <Plus className="w-5 h-5" />
          Thêm sticker
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
            placeholder="Tìm kiếm sticker..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy/50 font-vn transition"
          />
        </div>
      </div>

      {/* Stickers Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredStickers.map((sticker, index) => (
            <motion.div 
              key={sticker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-cream-light rounded-2xl p-4 border border-gold/20 shadow-sm hover:shadow-md transition group"
            >
              {/* Preview */}
              <div className="aspect-square rounded-xl mb-3 relative overflow-hidden bg-white border border-gold/20">
                <img
                  src={sticker.image_url}
                  alt={sticker.name}
                  className="w-full h-full object-contain"
                />
                
                {!sticker.is_active && (
                  <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
                    <span className="text-cream text-xs font-vn bg-ink/50 px-2 py-1 rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" />
                      Đã ẩn
                    </span>
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-burgundy/0 group-hover:bg-burgundy/10 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye className="w-6 h-6 text-burgundy" />
                </div>
              </div>

              {/* Info */}
              <h3 className="font-vn font-semibold text-ink text-sm mb-1 truncate">{sticker.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2 py-0.5 bg-gold/10 rounded-full text-ink/70">
                  {CATEGORIES.find(c => c.value === sticker.category)?.emoji} {CATEGORIES.find(c => c.value === sticker.category)?.label}
                </span>
                <span className="font-medium text-burgundy text-sm">💜 {sticker.points_required}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(sticker)}
                  className="flex-1 p-2 bg-gold/10 text-ink/70 rounded-lg hover:bg-gold/20 transition flex items-center justify-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs font-vn">Sửa</span>
                </button>
                <button
                  onClick={() => handleDelete(sticker.id)}
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
      {!loading && filteredStickers.length === 0 && (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 text-ink/20 mx-auto mb-4" />
          <p className="font-vn text-ink/50">Chưa có sticker nào</p>
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
                  {editingSticker ? 'Sửa sticker' : 'Thêm sticker mới'}
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
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Tên sticker</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                    placeholder="VD: Trái tim đỏ"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Ảnh sticker</label>
                  {!showEditor ? (
                    <div className="space-y-3">
                      <CloudinaryUpload
                        onUpload={(url) => {
                          setEditorImageUrl(url);
                          setShowEditor(true);
                        }}
                        folder="vintage-ecard/stickers"
                        accept="image/*"
                        type="image"
                        maxSize={5}
                        currentUrl={form.image_url}
                      />
                      {form.image_url && (
                        <div className="relative">
                          <img
                            src={form.image_url}
                            alt="Preview"
                            className="w-full max-w-xs mx-auto rounded-xl border border-gold/20"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditorImageUrl(form.image_url);
                              setShowEditor(true);
                            }}
                            className="mt-2 w-full px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-lg transition font-vn text-sm text-ink"
                          >
                            Chỉnh sửa (Zoom/Pan/Xóa nền)
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <StickerEditor
                        src={editorImageUrl}
                        alt="Sticker Editor"
                        initialTransform={imageTransform}
                        onSave={(transform, processedUrl) => {
                          const finalUrl = processedUrl || editorImageUrl;
                          setForm({ ...form, image_url: finalUrl });
                          setImageTransform(transform);
                          setShowEditor(false);
                        }}
                        onCancel={() => {
                          setShowEditor(false);
                          if (!form.image_url) {
                            setEditorImageUrl('');
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Danh mục</label>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat.value })}
                        className={`p-2 rounded-lg text-sm font-vn transition text-center ${
                          form.category === cat.value 
                            ? 'bg-burgundy text-cream' 
                            : 'bg-cream border border-gold/20 text-ink/70 hover:border-burgundy/30'
                        }`}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="block text-xs mt-1">{cat.label}</span>
                      </button>
                    ))}
                  </div>
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
                    <p className="text-xs text-ink/50">Cho phép người dùng sử dụng sticker này</p>
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
                    disabled={uploading || !form.image_url}
                    className="flex-1 px-4 py-3 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition font-vn font-medium shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingSticker ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

