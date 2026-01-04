'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, X, Stamp, Upload, Image as ImageIcon, Feather, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
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
    points_required: 0,
    is_active: true,
  });

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

      const res = await fetch('/api/admin/stamps/upload', {
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

          const res = await fetch('/api/admin/stamps/upload', {
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

  // Batch create stamps
  const handleBatchCreate = async () => {
    if (uploadedFiles.length === 0) return;

    const emptyNames = uploadedFiles.filter(f => !f.name.trim());
    if (emptyNames.length > 0) {
      alert(`Vui lòng nhập tên cho tất cả ${emptyNames.length} tem!`);
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
          points_required: batchForm.points_required,
          is_active: batchForm.is_active,
          image_transform: { scale: 1, x: 0, y: 0 },
        };

        const res = await fetch('/api/admin/stamps/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });

        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
          const error = await res.json();
          console.error(`Failed to create stamp ${uploaded.name}:`, error);
        }
      }

      alert(`Đã tạo ${successCount} tem${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      setShowMultiUpload(false);
      setUploadedFiles([]);
      setFailedFiles([]);
      setBaseName('');
      setBatchForm({ points_required: 0, is_active: true });
      setBatchProgress({ current: 0, total: 0 });
      fetchStamps();
    } catch (error: any) {
      console.error('Batch create error:', error);
      alert('Lỗi tạo tem: ' + error.message);
    } finally {
      setBatchUploading(false);
      setBatchProgress({ current: 0, total: 0 });
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
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowModal(true); resetForm(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition shadow-lg font-vn font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm tem mới
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
                setBatchForm({ points_required: 0, is_active: true });
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
                  Tải nhiều tem ({uploadedFiles.length} files)
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
                      setBatchForm({ points_required: 0, is_active: true });
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-cream rounded-xl border border-gold/20">
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
                      <p className="text-xs text-ink/50">Cho phép người dùng chọn tem này</p>
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
                    placeholder="VD: Tem hoa hồng"
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
                      <div className="aspect-[3/4] relative mb-3 rounded-lg overflow-hidden bg-ink/5">
                        <img
                          src={uploaded.url}
                          alt={uploaded.name}
                          className="w-full h-full object-cover"
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
                          Tên tem #{index + 1}
                        </label>
                        <input
                          type="text"
                          value={uploaded.name}
                          onChange={(e) => updateFileName(uploaded.id, e.target.value)}
                          disabled={batchUploading}
                          className="w-full px-3 py-2 bg-white border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn text-sm"
                          placeholder="Nhập tên tem..."
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
                      Đang tạo tem...
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
                      setBatchForm({ points_required: 0, is_active: true });
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
                      Tạo {uploadedFiles.length} tem
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
