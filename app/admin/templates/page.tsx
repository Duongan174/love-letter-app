// app/admin/templates/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import ImageEditor, { type ImageTransform } from '@/components/ui/ImageEditor';
import VideoEditor, { type VideoTransform } from '@/components/ui/VideoEditor';
import { CARD_ASPECT_RATIO } from '@/lib/constants';
import { 
  Loader2, Plus, Trash2, Edit2, Play, Pause, Image as ImageIcon, 
  Upload, X, Search, Feather, Eye, EyeOff, Crown, Film, FileImage,
  ZoomIn, Move
} from 'lucide-react';
import { ElegantSpinner } from '@/components/ui/Loading';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  points_required: number;
  is_premium: boolean;
  is_active: boolean;
  media_type?: 'image' | 'video' | 'gif';
  image_transform?: ImageTransform;
}

const CATEGORIES = [
  { value: 'love', label: 'Tình yêu', emoji: '❤️' },
  { value: 'birthday', label: 'Sinh nhật', emoji: '🎂' },
  { value: 'classic', label: 'Cổ điển', emoji: '📜' },
  { value: 'thankyou', label: 'Cảm ơn', emoji: '🙏' },
  { value: 'wedding', label: 'Cưới hỏi', emoji: '💒' },
  { value: 'holiday', label: 'Lễ hội', emoji: '🎉' },
];

// Detect media type from URL
const getMediaType = (url: string): 'image' | 'video' | 'gif' => {
  const lower = url.toLowerCase();
  if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.mov')) {
    return 'video';
  }
  if (lower.endsWith('.gif')) {
    return 'gif';
  }
  return 'image';
};

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const [form, setForm] = useState({
    name: '',
    thumbnail: '',
    category: 'love',
    points_required: 0,
    is_premium: false,
    is_active: true,
    media_type: 'image' as 'image' | 'video' | 'gif',
    image_transform: { scale: 1, x: 0, y: 0 } as ImageTransform,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('card_templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Lỗi tải danh sách:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // ✅ Dùng API endpoint server-side để upload (bypass Storage RLS)
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/templates/upload', {
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
        thumbnail: data.url,
        media_type: data.mediaType,
        image_transform: { scale: 1, x: 0, y: 0 },
      }));
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Lỗi upload: ' + (error.message || 'Vui lòng thử lại!'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.thumbnail) {
      alert('Vui lòng upload ảnh/video mẫu!');
      return;
    }

    setUploading(true);
    
    try {
      const dataToSave = {
        name: form.name,
        thumbnail: form.thumbnail,
        category: form.category,
        points_required: form.points_required,
        is_premium: form.is_premium,
        is_active: form.is_active,
        media_type: form.media_type,
        image_transform: form.image_transform,
      };

      if (editingTemplate) {
        // ✅ Dùng API endpoint server-side để update
        const res = await fetch('/api/admin/templates', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingTemplate.id,
            ...dataToSave,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to update template');
        }
      } else {
        // ✅ Dùng API endpoint server-side để insert (bypass RLS)
        const res = await fetch('/api/admin/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || 'Failed to create template');
        }
      }

      setShowModal(false);
      resetForm();
      fetchTemplates();
    } catch (error: any) {
      console.error('Lỗi lưu DB:', error);
      alert('Lỗi lưu: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setEditingTemplate(null);
    setForm({
      name: '',
      thumbnail: '',
      category: 'love',
      points_required: 0,
      is_premium: false,
      is_active: true,
      media_type: 'image',
      image_transform: { scale: 1, x: 0, y: 0 },
    });
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setForm({
      name: template.name,
      thumbnail: template.thumbnail,
      category: template.category,
      points_required: template.points_required,
      is_premium: template.is_premium,
      is_active: template.is_active,
      media_type: template.media_type || getMediaType(template.thumbnail),
      image_transform: template.image_transform || { scale: 1, x: 0, y: 0 },
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa mẫu thiệp này? Tất cả các card và draft đang sử dụng mẫu này cũng sẽ bị xóa.')) return;
    
    try {
      // ✅ API endpoint server-side sẽ tự động xóa các drafts và cards liên quan trước khi xóa template
      const res = await fetch(`/api/admin/templates?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete template');
      }

      const result = await res.json();
      
      // Hiển thị thông báo nếu có drafts/cards đã bị xóa
      if (result.deletedDrafts > 0 || result.deletedCards > 0) {
        const deletedInfo = [];
        if (result.deletedDrafts > 0) deletedInfo.push(`${result.deletedDrafts} draft`);
        if (result.deletedCards > 0) deletedInfo.push(`${result.deletedCards} card`);
        alert(`Đã xóa mẫu thiệp và ${deletedInfo.join(', ')} liên quan.`);
      }
      
      fetchTemplates();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Lỗi xóa mẫu thiệp: ' + (error.message || 'Đã có lỗi xảy ra'));
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleVideoPreview = () => {
    const video = videoPreviewRef.current;
    if (!video) return;
    
    if (isVideoPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
          <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <FileImage className="w-5 h-5 text-burgundy" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink">Mẫu thiệp</h1>
          </div>
          <p className="text-ink/60 font-vn pl-13">Quản lý thiệp tĩnh và động từ Canva</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setShowModal(true); resetForm(); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition shadow-lg font-vn font-medium"
                >
          <Plus className="w-5 h-5" />
          Thêm mẫu mới
        </motion.button>
      </div>

      {/* Decorative Divider */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <Feather className="w-4 h-4 text-gold/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
              </div>

      {/* Search & Filter */}
      <div className="bg-cream-light rounded-2xl p-4 mb-6 border border-gold/20 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                <input 
            type="text"
            placeholder="Tìm kiếm mẫu thiệp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy/50 font-vn transition"
                />
              </div>
            </div>

      {/* File type hint */}
      <div className="bg-gold/10 rounded-xl p-4 mb-6 border border-gold/20">
        <p className="text-sm text-ink/70 font-vn">
          <strong>💡 Hỗ trợ:</strong> Ảnh (JPG, PNG, WEBP), GIF động, Video (MP4, WEBM) từ Canva. 
          Video sẽ tự động tắt tiếng khi hiển thị.
        </p>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <ElegantSpinner size="md" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map((template, index) => {
            const mediaType = template.media_type || getMediaType(template.thumbnail);
            
            return (
              <motion.div 
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-cream-light rounded-2xl overflow-hidden border border-gold/20 shadow-sm hover:shadow-md transition group"
              >
                {/* Preview */}
                <div 
                  className="aspect-[3/4] relative overflow-hidden cursor-pointer bg-ink/5"
                  onClick={() => setPreviewTemplate(template)}
                >
                  {mediaType === 'video' ? (
                    <>
                      <video
                        src={template.thumbnail}
                        className="w-full h-full object-cover"
                        style={template.image_transform ? {
                          transform: `translate(${template.image_transform.x}px, ${template.image_transform.y}px) scale(${template.image_transform.scale})`,
                        } : undefined}
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-ink/70 rounded-full flex items-center gap-1">
                        <Film className="w-3 h-3 text-cream" />
                        <span className="text-[10px] text-cream font-medium">Video</span>
                      </div>
                    </>
                  ) : mediaType === 'gif' ? (
                    <>
                      <img
                        src={template.thumbnail}
                        alt={template.name}
                        className="w-full h-full object-cover"
                        style={template.image_transform ? {
                          transform: `translate(${template.image_transform.x}px, ${template.image_transform.y}px) scale(${template.image_transform.scale})`,
                        } : undefined}
                      />
                      <div className="absolute top-2 left-2 px-2 py-1 bg-purple-500/80 rounded-full">
                        <span className="text-[10px] text-cream font-medium">GIF</span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover"
                      style={template.image_transform ? {
                        transform: `translate(${template.image_transform.x}px, ${template.image_transform.y}px) scale(${template.image_transform.scale})`,
                      } : undefined}
                    />
                  )}

                  {/* Badges */}
                  {template.is_premium && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-gold rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3 text-ink" />
                      <span className="text-[10px] text-ink font-bold">Premium</span>
                    </div>
                  )}

                  {!template.is_active && (
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
                <div className="p-3">
                  <h3 className="font-vn font-semibold text-ink text-sm mb-1 truncate">{template.name}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs px-2 py-0.5 bg-gold/10 rounded-full text-ink/70 capitalize">
                      {CATEGORIES.find(c => c.value === template.category)?.emoji} {template.category}
                    </span>
                    <span className="font-medium text-burgundy text-sm">💜 {template.points_required}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(template)}
                      className="flex-1 p-2 bg-gold/10 text-ink/70 rounded-lg hover:bg-gold/20 transition flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span className="text-xs font-vn">Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2 bg-burgundy/10 text-burgundy rounded-lg hover:bg-burgundy/20 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTemplates.length === 0 && (
        <div className="text-center py-16">
          <FileImage className="w-16 h-16 text-ink/20 mx-auto mb-4" />
          <p className="font-vn text-ink/50">Chưa có mẫu thiệp nào</p>
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
              className="bg-cream-light rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gold/20 shadow-vintage"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-ink">
                  {editingTemplate ? 'Sửa mẫu thiệp' : 'Thêm mẫu thiệp mới'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gold/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-ink/50" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Media Upload */}
                  <div>
                    <label className="block text-sm font-vn font-medium text-ink mb-2">
                      Ảnh/Video/GIF từ Canva
                    </label>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*,video/mp4,video/webm,video/quicktime,.gif"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    {!form.thumbnail ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="w-full aspect-[3/4] flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gold/40 rounded-xl bg-cream hover:bg-gold/10 transition"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-8 h-8 text-burgundy animate-spin" />
                            <span className="text-sm text-ink/60 font-vn">Đang tải...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-10 h-10 text-ink/40" />
                            <span className="text-sm text-ink/60 font-vn">Chọn file</span>
                            <span className="text-xs text-ink/40 text-center px-4">
                              JPG, PNG, GIF, WEBP, MP4, WEBM<br/>
                              (Ảnh max 10MB, Video max 50MB)
                            </span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="space-y-3">
                        {/* Media Preview with Editor */}
                        {form.media_type === 'video' ? (
                          <VideoEditor
                            src={form.thumbnail}
                            aspectRatio={CARD_ASPECT_RATIO}
                            initialTransform={form.image_transform}
                            showControls={true}
                            onSave={(transform) => setForm({ ...form, image_transform: transform })}
                          />
                        ) : (
                          <ImageEditor
                            src={form.thumbnail}
                            alt={form.name || 'Template preview'}
                            aspectRatio={CARD_ASPECT_RATIO}
                            initialTransform={form.image_transform}
                            showControls={true}
                            onSave={(transform) => setForm({ ...form, image_transform: transform })}
                          />
                        )}

                        {/* Info about editing */}
                        <div className="flex items-center gap-2 p-2 bg-gold/10 rounded-lg text-xs text-ink/60">
                          <ZoomIn className="w-4 h-4" />
                          <span>Scroll để zoom, kéo để di chuyển</span>
                        </div>
                        
                        {/* Change file button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full py-2 text-sm text-burgundy hover:bg-burgundy/10 rounded-lg transition font-vn flex items-center justify-center gap-2"
                        >
                          <ImageIcon className="w-4 h-4" />
                          Đổi file khác
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Form Fields */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-vn font-medium text-ink mb-2">Tên mẫu</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                        placeholder="VD: Tình yêu vĩnh cửu"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-vn font-medium text-ink mb-2">Danh mục</label>
                      <div className="grid grid-cols-3 gap-2">
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

                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-gold/20 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.is_premium}
                          onChange={(e) => setForm({ ...form, is_premium: e.target.checked })}
                          className="w-5 h-5 text-gold rounded focus:ring-gold/30"
                        />
                        <div className="flex items-center gap-2">
                          <Crown className="w-4 h-4 text-gold" />
                          <span className="font-vn font-medium text-ink">Premium</span>
                        </div>
                      </label>

                      <label className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-gold/20 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.is_active}
                          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                          className="w-5 h-5 text-burgundy rounded focus:ring-burgundy/30"
                        />
                        <div>
                          <span className="font-vn font-medium text-ink">Hiển thị</span>
                          <p className="text-xs text-ink/50">Cho phép người dùng chọn mẫu này</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gold/20">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-3 bg-cream border border-gold/20 text-ink/70 rounded-xl hover:bg-gold/10 transition font-vn font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !form.thumbnail}
                    className="flex-1 px-4 py-3 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition font-vn font-medium shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingTemplate ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewTemplate(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-cream-light rounded-2xl overflow-hidden border border-gold/20 shadow-vintage">
                <div className="aspect-[3/4] relative">
                  {(previewTemplate.media_type || getMediaType(previewTemplate.thumbnail)) === 'video' ? (
                    <video
                      src={previewTemplate.thumbnail}
                      className="w-full h-full object-cover"
                      style={previewTemplate.image_transform ? {
                        transform: `translate(${previewTemplate.image_transform.x}px, ${previewTemplate.image_transform.y}px) scale(${previewTemplate.image_transform.scale})`,
                      } : undefined}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={previewTemplate.thumbnail}
                      alt={previewTemplate.name}
                      className="w-full h-full object-cover"
                      style={previewTemplate.image_transform ? {
                        transform: `translate(${previewTemplate.image_transform.x}px, ${previewTemplate.image_transform.y}px) scale(${previewTemplate.image_transform.scale})`,
                      } : undefined}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl font-bold text-ink mb-2">{previewTemplate.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm px-2 py-1 bg-gold/10 rounded-full capitalize">
                      {CATEGORIES.find(c => c.value === previewTemplate.category)?.emoji} {previewTemplate.category}
                    </span>
                    <span className="font-medium text-burgundy">💜 {previewTemplate.points_required} Tym</span>
                    {previewTemplate.is_premium && (
                      <span className="px-2 py-1 bg-gold rounded-full text-xs font-bold text-ink flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="w-full py-3 bg-burgundy text-cream rounded-xl font-vn font-medium hover:bg-burgundy-dark transition"
                  >
                    Đóng
                  </button>
                </div>
      </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
