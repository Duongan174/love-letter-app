// app/admin/stickers/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, Sparkles, Upload, Feather, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
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
  const folderInputRef = useRef<HTMLInputElement>(null);
  
  // Multi-upload state
  const [showMultiUpload, setShowMultiUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ 
    id: string;
    file: File; 
    url: string; 
    name: string;
    originalName: string;
  }>>([]);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [baseName, setBaseName] = useState('');
  const [uploadAbortController, setUploadAbortController] = useState<AbortController | null>(null);
  const [failedFiles, setFailedFiles] = useState<Array<{ id: string; file: File; error: string }>>([]);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [uploadStartTime, setUploadStartTime] = useState<number | null>(null);
  
  // Batch form (for multi-upload)
  const [batchForm, setBatchForm] = useState({
    category: 'general',
    points_required: 0,
    is_active: true,
  });

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

  // Filter only image files
  const filterImageFiles = (files: File[]): File[] => {
    return files.filter(file => file.type.startsWith('image/'));
  };

  // Folder upload handler
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = filterImageFiles(files);
    if (imageFiles.length === 0) {
      alert('Không tìm thấy file ảnh nào trong folder. Vui lòng chọn folder có chứa ảnh.');
      return;
    }

    await processFiles(imageFiles);
    
    if (folderInputRef.current) {
      folderInputRef.current.value = '';
    }
  };

  // Cancel upload
  const cancelUpload = () => {
    if (uploadAbortController) {
      uploadAbortController.abort();
      setUploadAbortController(null);
    }
    setUploading(false);
    setEstimatedTime(null);
    setUploadStartTime(null);
  };

  // Retry failed files
  const retryFailedFiles = async () => {
    if (failedFiles.length === 0) return;
    const filesToRetry = failedFiles.map(f => f.file);
    setFailedFiles([]);
    await processFiles(filesToRetry);
  };

  // Retry single failed file
  const retrySingleFile = async (failedFile: { id: string; file: File; error: string }) => {
    setFailedFiles(prev => prev.filter(f => f.id !== failedFile.id));
    
    try {
      const formData = new FormData();
      formData.append('file', failedFile.file);

      const res = await fetch('/api/admin/stickers/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(`Failed to upload ${failedFile.file.name}: ${error.error || 'Unknown error'}`);
      }

      const data = await res.json();
      const originalName = failedFile.file.name.replace(/\.[^/.]+$/, '');
      
      const uploadedFile = {
        id: `${Date.now()}-${Math.random()}`,
        file: failedFile.file,
        url: data.url,
        name: originalName,
        originalName,
      };
      
      setUploadedFiles(prev => [...prev, uploadedFile]);
    } catch (error: any) {
      console.error('Retry upload error:', error);
      setFailedFiles(prev => [...prev, { ...failedFile, error: error.message }]);
    }
  };

  // Format time remaining
  const formatTimeRemaining = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)} giây`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = Math.ceil(seconds % 60);
    return `${minutes} phút ${secs} giây`;
  };

  // Process files (upload and prepare for batch)
  const processFiles = async (files: File[]) => {
    setUploading(true);
    setShowMultiUpload(true);
    setUploadedFiles([]);
    setFailedFiles([]);
    setBatchProgress({ current: 0, total: files.length });
    setEstimatedTime(null);
    setUploadStartTime(Date.now());
    
    const abortController = new AbortController();
    setUploadAbortController(abortController);
    
    const uploaded: Array<{ 
      id: string;
      file: File; 
      url: string; 
      name: string;
      originalName: string;
    }> = [];

    const failed: Array<{ id: string; file: File; error: string }> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        if (abortController.signal.aborted) break;

        const file = files[i];
        setBatchProgress({ current: i + 1, total: files.length });

        if (uploadStartTime && i > 0) {
          const elapsed = (Date.now() - uploadStartTime) / 1000;
          const avgTimePerFile = elapsed / i;
          const remaining = avgTimePerFile * (files.length - i);
          setEstimatedTime(remaining);
        }

        try {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/api/admin/stickers/upload', {
            method: 'POST',
            body: formData,
            signal: abortController.signal,
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(`Failed to upload ${file.name}: ${error.error || 'Unknown error'}`);
          }

          const data = await res.json();
          const originalName = file.name.replace(/\.[^/.]+$/, '');
          
          const uploadedFile = {
            id: `${Date.now()}-${i}-${Math.random()}`,
            file,
            url: data.url,
            name: originalName,
            originalName,
          };
          
          uploaded.push(uploadedFile);
          setUploadedFiles([...uploaded]);
        } catch (fileError: any) {
          if (fileError.name === 'AbortError') break;
          
          const failedFile = {
            id: `${Date.now()}-${i}-${Math.random()}`,
            file,
            error: fileError.message || 'Unknown error',
          };
          failed.push(failedFile);
          setFailedFiles([...failed]);
        }
      }

      setUploadedFiles(uploaded);
      if (failed.length > 0) {
        setFailedFiles(failed);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Upload cancelled by user');
      } else {
        console.error('Multi-upload error:', error);
        alert('Lỗi upload: ' + (error.message || 'Vui lòng thử lại!'));
      }
      
      if (uploaded.length > 0 || failed.length > 0) {
        setUploadedFiles(uploaded);
        if (failed.length > 0) {
          setFailedFiles(failed);
        }
      } else {
        setShowMultiUpload(false);
      }
    } finally {
      setUploading(false);
      setUploadAbortController(null);
      setEstimatedTime(null);
      setUploadStartTime(null);
    }
  };

  // Remove file from list
  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // Update file name
  const updateFileName = (id: string, newName: string) => {
    setUploadedFiles(prev => prev.map(f => 
      f.id === id ? { ...f, name: newName } : f
    ));
  };

  // Auto-generate names with base name + number
  const generateNames = () => {
    if (!baseName.trim()) {
      alert('Vui lòng nhập tên gốc trước khi tự động tạo tên!');
      return;
    }

    setUploadedFiles(prev => prev.map((f, index) => ({
      ...f,
      name: `${baseName.trim()} ${String(index + 1).padStart(2, '0')}`
    })));
  };

  // Batch create stickers
  const handleBatchCreate = async () => {
    if (uploadedFiles.length === 0) return;

    const emptyNames = uploadedFiles.filter(f => !f.name.trim());
    if (emptyNames.length > 0) {
      alert(`Vui lòng nhập tên cho tất cả ${emptyNames.length} sticker!`);
      return;
    }

    setBatchUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < uploadedFiles.length; i++) {
        const uploaded = uploadedFiles[i];
        setBatchProgress({ current: i + 1, total: uploadedFiles.length });

        const dataToSave = {
          name: uploaded.name.trim(),
          image_url: uploaded.url,
          category: batchForm.category,
          points_required: batchForm.points_required,
          is_active: batchForm.is_active,
        };

        const res = await fetch('/api/admin/stickers/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });

        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
          const error = await res.json();
          console.error(`Failed to create sticker ${uploaded.name}:`, error);
        }
      }

      alert(`Đã tạo ${successCount} sticker${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      setShowMultiUpload(false);
      setUploadedFiles([]);
      setFailedFiles([]);
      setBaseName('');
      setBatchForm({ category: 'general', points_required: 0, is_active: true });
      setBatchProgress({ current: 0, total: 0 });
      fetchStickers();
    } catch (error: any) {
      console.error('Batch create error:', error);
      alert('Lỗi tạo sticker: ' + error.message);
    } finally {
      setBatchUploading(false);
      setBatchProgress({ current: 0, total: 0 });
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
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowModal(true); resetForm(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition shadow-lg font-vn font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm sticker
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-lg font-vn font-medium"
          >
            <Upload className="w-5 h-5" />
            Chọn folder
          </motion.button>
        </div>
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

      {/* Folder input (hidden) */}
      <input
        ref={folderInputRef}
        type="file"
        accept="image/*"
        multiple
        webkitdirectory=""
        directory=""
        onChange={handleFolderUpload}
        className="hidden"
      />

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

      {/* Multi-Upload Modal */}
      <AnimatePresence>
        {showMultiUpload && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!batchUploading && !uploading) {
                if (uploadAbortController) {
                  uploadAbortController.abort();
                }
                setShowMultiUpload(false);
                setUploadedFiles([]);
                setFailedFiles([]);
                setBaseName('');
                setBatchForm({ category: 'general', points_required: 0, is_active: true });
                setBatchProgress({ current: 0, total: 0 });
                setEstimatedTime(null);
                setUploadStartTime(null);
                setUploadAbortController(null);
              }
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cream-light rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gold/20 shadow-vintage"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-ink">
                  Tải nhiều sticker ({uploadedFiles.length} files)
                </h2>
                {!batchUploading && !uploading && (
                  <button 
                    onClick={() => {
                      if (uploadAbortController) {
                        uploadAbortController.abort();
                      }
                      setShowMultiUpload(false);
                      setUploadedFiles([]);
                      setFailedFiles([]);
                      setBaseName('');
                      setBatchForm({ category: 'general', points_required: 0, is_active: true });
                      setBatchProgress({ current: 0, total: 0 });
                      setEstimatedTime(null);
                      setUploadStartTime(null);
                      setUploadAbortController(null);
                    }}
                    className="p-2 hover:bg-gold/10 rounded-lg transition"
                  >
                    <X className="w-5 h-5 text-ink/50" />
                  </button>
                )}
              </div>

              {/* Batch Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-cream rounded-xl border border-gold/20">
                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Danh mục</label>
                  <select
                    value={batchForm.category}
                    onChange={(e) => setBatchForm({ ...batchForm, category: e.target.value })}
                    disabled={batchUploading}
                    className="w-full px-3 py-2 bg-white border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Giá (Tym)</label>
                  <input
                    type="number"
                    value={batchForm.points_required}
                    onChange={(e) => setBatchForm({ ...batchForm, points_required: parseInt(e.target.value) || 0 })}
                    disabled={batchUploading}
                    className="w-full px-3 py-2 bg-white border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                    min="0"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gold/20 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={batchForm.is_active}
                      onChange={(e) => setBatchForm({ ...batchForm, is_active: e.target.checked })}
                      disabled={batchUploading}
                      className="w-5 h-5 text-burgundy rounded focus:ring-burgundy/30"
                    />
                    <div>
                      <span className="font-vn font-medium text-ink">Hiển thị</span>
                      <p className="text-xs text-ink/50">Cho phép người dùng sử dụng sticker này</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Base Name Input */}
              <div className="mb-6 p-4 bg-gold/10 rounded-xl border border-gold/20">
                <label className="block text-sm font-vn font-medium text-ink mb-2">
                  Tên gốc (để tự động tạo tên với số thứ tự)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={baseName}
                    onChange={(e) => setBaseName(e.target.value)}
                    disabled={batchUploading}
                    placeholder="VD: Sticker trái tim"
                    className="flex-1 px-4 py-2 bg-white border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                  />
                  <button
                    type="button"
                    onClick={generateNames}
                    disabled={batchUploading || !baseName.trim()}
                    className="px-4 py-2 bg-burgundy text-cream rounded-lg hover:bg-burgundy-dark transition font-vn font-medium disabled:opacity-50"
                  >
                    Tạo tên tự động
                  </button>
                </div>
                <p className="text-xs text-ink/50 mt-2 font-vn">
                  Sau khi nhập tên gốc, click "Tạo tên tự động" để tạo: {baseName || 'Tên gốc'} 01, {baseName || 'Tên gốc'} 02, ...
                </p>
              </div>

              {/* Upload Progress */}
              {uploading && (
                <div className="mb-6 p-4 bg-gold/10 rounded-xl border border-gold/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-vn text-ink flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tải lên {batchProgress.current} / {batchProgress.total} files...
                    </span>
                    <div className="flex items-center gap-3">
                      {estimatedTime !== null && (
                        <span className="text-sm font-vn text-ink/60">
                          Còn lại: {formatTimeRemaining(estimatedTime)}
                        </span>
                      )}
                      <span className="text-sm font-vn text-ink/60">
                        {batchProgress.total > 0 ? Math.round((batchProgress.current / batchProgress.total) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-cream rounded-full h-2 overflow-hidden mb-3">
                    <div 
                      className="bg-burgundy h-full transition-all duration-300"
                      style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }}
                    />
                  </div>
                  <button
                    onClick={cancelUpload}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-vn font-medium flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Hủy upload
                  </button>
                </div>
              )}

              {/* Failed Files */}
              {!uploading && failedFiles.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-vn font-medium text-red-800 dark:text-red-200">
                        {failedFiles.length} file upload lỗi
                      </span>
                    </div>
                    <button
                      onClick={retryFailedFiles}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-vn font-medium flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Retry tất cả
                    </button>
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {failedFiles.map((failed) => (
                      <div key={failed.id} className="flex items-center justify-between p-2 bg-white dark:bg-ink/10 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-vn text-ink truncate">{failed.file.name}</p>
                          <p className="text-xs text-red-600 dark:text-red-400 truncate">{failed.error}</p>
                        </div>
                        <button
                          onClick={() => retrySingleFile(failed)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-xs font-vn hover:bg-red-600 transition"
                        >
                          Retry
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Files Grid */}
              {uploading && uploadedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-ink/50">
                  <Loader2 className="w-12 h-12 animate-spin mb-4 text-burgundy" />
                  <p className="font-vn">Đang tải lên files...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
                  {uploadedFiles.map((uploaded, index) => (
                    <motion.div
                      key={uploaded.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-cream rounded-xl p-4 border border-gold/20 hover:border-burgundy/30 transition"
                    >
                      {/* Preview */}
                      <div className="aspect-square relative mb-3 rounded-lg overflow-hidden bg-ink/5">
                        <img
                          src={uploaded.url}
                          alt={uploaded.name}
                          className="w-full h-full object-contain"
                        />
                        {!batchUploading && (
                          <button
                            onClick={() => removeFile(uploaded.id)}
                            className="absolute top-2 right-2 p-1.5 bg-ink/70 hover:bg-burgundy rounded-full transition"
                            title="Xóa"
                          >
                            <X className="w-4 h-4 text-cream" />
                          </button>
                        )}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-ink/70 rounded-full">
                          <span className="text-[10px] text-cream font-medium">Ảnh</span>
                        </div>
                      </div>

                      {/* Name Input */}
                      <div>
                        <label className="block text-xs font-vn font-medium text-ink/70 mb-1">
                          Tên sticker #{index + 1}
                        </label>
                        <input
                          type="text"
                          value={uploaded.name}
                          onChange={(e) => updateFileName(uploaded.id, e.target.value)}
                          disabled={batchUploading}
                          className="w-full px-3 py-2 bg-white border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn text-sm"
                          placeholder="Nhập tên sticker..."
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Batch Create Progress */}
              {batchUploading && (
                <div className="mb-6 p-4 bg-burgundy/10 rounded-xl border border-burgundy/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-vn text-ink flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tạo sticker...
                    </span>
                    <span className="text-sm font-vn text-ink/60">
                      {batchProgress.current} / {batchProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-cream rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-burgundy h-full transition-all duration-300"
                      style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gold/20">
                <button
                  type="button"
                  onClick={() => {
                    if (!uploading && !batchUploading) {
                      if (uploadAbortController) {
                        uploadAbortController.abort();
                      }
                      setShowMultiUpload(false);
                      setUploadedFiles([]);
                      setFailedFiles([]);
                      setBaseName('');
                      setBatchForm({ category: 'general', points_required: 0, is_active: true });
                      setBatchProgress({ current: 0, total: 0 });
                      setEstimatedTime(null);
                      setUploadStartTime(null);
                      setUploadAbortController(null);
                    }
                  }}
                  disabled={batchUploading || uploading}
                  className="flex-1 px-4 py-3 bg-cream border border-gold/20 text-ink/70 rounded-xl hover:bg-gold/10 transition font-vn font-medium disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleBatchCreate}
                  disabled={batchUploading || uploadedFiles.length === 0}
                  className="flex-1 px-4 py-3 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition font-vn font-medium shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {batchUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Tạo {uploadedFiles.length} sticker
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

