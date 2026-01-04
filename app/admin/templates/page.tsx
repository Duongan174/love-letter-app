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
  ZoomIn, Move, CheckCircle2, GripVertical, ChevronDown, ChevronRight, Settings
} from 'lucide-react';
import { ElegantSpinner } from '@/components/ui/Loading';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  points_required: number;
  is_premium?: boolean; // Deprecated, use subscription_tier instead
  subscription_tier?: 'free' | 'plus' | 'pro' | 'ultra';
  is_active?: boolean; // Deprecated, always true
  media_type?: 'image' | 'video' | 'gif';
  image_transform?: ImageTransform;
}

interface Category {
  id: string;
  name: string;
  label: string;
  emoji: string;
  display_order: number;
  is_active: boolean;
  parent_id?: string | null;
  parent?: {
    id: string;
    name: string;
    label: string;
    emoji: string;
  } | null;
  subcategories?: Category[];
  template_count?: number;
  subcategory_count?: number;
}

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

type SubscriptionTier = 'free' | 'plus' | 'pro' | 'ultra';

const SUBSCRIPTION_TIERS: Array<{ value: SubscriptionTier; label: string; color: string }> = [
  { value: 'free', label: 'Free', color: 'text-gray-600' },
  { value: 'plus', label: 'Plus', color: 'text-emerald-600' },
  { value: 'pro', label: 'Pro', color: 'text-blue-600' },
  { value: 'ultra', label: 'Ultra', color: 'text-purple-600' },
];

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploading, setUploading] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    label: '',
    emoji: '⭐',
    display_order: 0,
    is_active: true,
    parent_id: '' as string | null,
  });
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  
  // Multi-upload state
  const [showMultiUpload, setShowMultiUpload] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ 
    id: string; // Unique ID for each file
    file: File; 
    url: string; 
    mediaType: 'image' | 'video' | 'gif'; 
    name: string; // Editable name
    originalName: string; // Original filename without extension
  }>>([]);
  const [batchUploading, setBatchUploading] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [baseName, setBaseName] = useState(''); // Base name for auto-numbering
  const [uploadAbortController, setUploadAbortController] = useState<AbortController | null>(null);
  const [failedFiles, setFailedFiles] = useState<Array<{ id: string; file: File; error: string }>>([]);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [uploadStartTime, setUploadStartTime] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: '',
    thumbnail: '',
    category: '',
    points_required: 0,
    subscription_tier: 'free' as SubscriptionTier,
    media_type: 'image' as 'image' | 'video' | 'gif',
    image_transform: { scale: 1, x: 0, y: 0 } as ImageTransform,
  });
  
  // Batch form (for multi-upload)
  const [batchForm, setBatchForm] = useState({
    category: '',
    points_required: 0,
    subscription_tier: 'free' as SubscriptionTier,
  });

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
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

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch categories');
      }
      const { data } = await res.json();
      setCategories(data || []);
      
      // Set default category if form is empty
      if (!form.category && data && data.length > 0) {
        const firstCategory = data.find((c: Category) => !c.parent_id)?.name || '';
        if (firstCategory) {
          setForm(prev => ({ ...prev, category: firstCategory }));
          setBatchForm(prev => ({ ...prev, category: firstCategory }));
        }
      }
    } catch (error: any) {
      console.error('Lỗi tải danh mục:', error);
      // Set empty array on error to prevent UI crashes
      setCategories([]);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryForm.name || !categoryForm.label || !categoryForm.emoji) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const url = editingCategory 
        ? `/api/admin/categories/${editingCategory.id}`
        : '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...categoryForm,
          parent_id: categoryForm.parent_id || null,
        }),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to save category';
        try {
          const errorData = await res.json();
          errorMessage = errorData?.error || errorData?.message || errorMessage;
        } catch {
          // Response không phải JSON, sử dụng message mặc định
          errorMessage = `HTTP ${res.status}: ${res.statusText || 'Failed to save category'}`;
        }
        throw new Error(errorMessage);
      }

      await fetchCategories();
      setShowCategoryModal(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', label: '', emoji: '⭐', display_order: 0, is_active: true, parent_id: null });
    } catch (error: any) {
      console.error('Save category error:', error);
      alert('Lỗi lưu danh mục: ' + (error.message || 'Vui lòng thử lại!'));
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      label: category.label,
      emoji: category.emoji,
      display_order: category.display_order,
      is_active: category.is_active,
      parent_id: category.parent_id || null,
    });
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Xóa danh mục "${category.label}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error = await res.json();
        if (error.template_count > 0) {
          alert(`Không thể xóa danh mục này vì đang có ${error.template_count} mẫu thiệp đang sử dụng.`);
        } else if (error.subcategory_count > 0) {
          alert(`Không thể xóa danh mục này vì đang có ${error.subcategory_count} danh mục con.`);
        } else {
          throw new Error(error.error || 'Failed to delete category');
        }
        return;
      }

      await fetchCategories();
    } catch (error: any) {
      console.error('Delete category error:', error);
      alert('Lỗi xóa danh mục: ' + (error.message || 'Vui lòng thử lại!'));
    }
  };

  const handleReorderCategories = async (reorderedCategories: Category[]) => {
    try {
      const res = await fetch('/api/admin/categories/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: reorderedCategories.map((cat, index) => ({
            id: cat.id,
            display_order: index,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to reorder categories');
      }

      await fetchCategories();
    } catch (error: any) {
      console.error('Reorder categories error:', error);
      alert('Lỗi sắp xếp danh mục: ' + (error.message || 'Vui lòng thử lại!'));
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

  // Filter only image/video files
  const filterMediaFiles = (files: File[]): File[] => {
    return files.filter(file => {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      return (
        type.startsWith('image/') ||
        type.startsWith('video/') ||
        name.endsWith('.gif') ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.png') ||
        name.endsWith('.webp') ||
        name.endsWith('.mp4') ||
        name.endsWith('.webm') ||
        name.endsWith('.mov')
      );
    });
  };

  // Folder upload handler
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const mediaFiles = filterMediaFiles(files);
    if (mediaFiles.length === 0) {
      alert('Không tìm thấy file ảnh/video nào trong folder. Vui lòng chọn folder có chứa ảnh/video.');
      return;
    }

    await processFiles(mediaFiles);
    
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
    // Remove from failed list
    setFailedFiles(prev => prev.filter(f => f.id !== failedFile.id));
    
    // Upload single file
    const uploaded: Array<{ 
      id: string;
      file: File; 
      url: string; 
      mediaType: 'image' | 'video' | 'gif'; 
      name: string;
      originalName: string;
    }> = [];

    try {
      const formData = new FormData();
      formData.append('file', failedFile.file);

      const res = await fetch('/api/admin/templates/upload', {
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
        mediaType: data.mediaType,
        name: originalName,
        originalName,
      };
      
      uploaded.push(uploadedFile);
      setUploadedFiles(prev => [...prev, ...uploaded]);
    } catch (error: any) {
      console.error('Retry upload error:', error);
      // Add back to failed list
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
    // Hiển thị modal ngay với loading state
    setUploading(true);
    setShowMultiUpload(true);
    setUploadedFiles([]); // Clear previous files
    setFailedFiles([]); // Clear previous failed files
    setBatchProgress({ current: 0, total: files.length });
    setEstimatedTime(null);
    setUploadStartTime(Date.now());
    
    // Create AbortController for cancel functionality
    const abortController = new AbortController();
    setUploadAbortController(abortController);
    
    const uploaded: Array<{ 
      id: string;
      file: File; 
      url: string; 
      mediaType: 'image' | 'video' | 'gif'; 
      name: string;
      originalName: string;
    }> = [];

    const failed: Array<{ id: string; file: File; error: string }> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        // Check if cancelled
        if (abortController.signal.aborted) {
          break;
        }

        const file = files[i];
        setBatchProgress({ current: i + 1, total: files.length });

        // Calculate estimated time remaining
        if (uploadStartTime && i > 0) {
          const elapsed = (Date.now() - uploadStartTime) / 1000; // seconds
          const avgTimePerFile = elapsed / i;
          const remaining = avgTimePerFile * (files.length - i);
          setEstimatedTime(remaining);
        }

        try {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch('/api/admin/templates/upload', {
            method: 'POST',
            body: formData,
            signal: abortController.signal, // Support cancellation
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(`Failed to upload ${file.name}: ${error.error || 'Unknown error'}`);
          }

          const data = await res.json();
          const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
          
          const uploadedFile = {
            id: `${Date.now()}-${i}-${Math.random()}`, // Unique ID
            file,
            url: data.url,
            mediaType: data.mediaType,
            name: originalName, // Will be updated with baseName + number
            originalName,
          };
          
          uploaded.push(uploadedFile);
          
          // Update state incrementally để user thấy progress
          setUploadedFiles([...uploaded]);
        } catch (fileError: any) {
          // Handle individual file errors
          if (fileError.name === 'AbortError') {
            // Upload was cancelled
            break;
          }
          
          const failedFile = {
            id: `${Date.now()}-${i}-${Math.random()}`,
            file,
            error: fileError.message || 'Unknown error',
          };
          failed.push(failedFile);
          setFailedFiles([...failed]);
        }
      }

      // Final update
      setUploadedFiles(uploaded);
      
      if (failed.length > 0) {
        setFailedFiles(failed);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Upload was cancelled
        console.log('Upload cancelled by user');
      } else {
        console.error('Multi-upload error:', error);
        alert('Lỗi upload: ' + (error.message || 'Vui lòng thử lại!'));
      }
      
      // Nếu có lỗi, vẫn giữ modal mở với các files đã upload thành công
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
      // Không reset progress về 0, giữ lại để user thấy đã upload xong
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

  // Batch create templates
  const handleBatchCreate = async () => {
    if (uploadedFiles.length === 0) return;

    // Validate all names
    const emptyNames = uploadedFiles.filter(f => !f.name.trim());
    if (emptyNames.length > 0) {
      alert(`Vui lòng nhập tên cho tất cả ${emptyNames.length} mẫu thiệp!`);
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
          thumbnail: uploaded.url,
          category: batchForm.category,
          points_required: batchForm.points_required,
          subscription_tier: batchForm.subscription_tier,
          media_type: uploaded.mediaType,
          image_transform: { scale: 1, x: 0, y: 0 },
        };

        const res = await fetch('/api/admin/templates/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });

        if (res.ok) {
          successCount++;
        } else {
          errorCount++;
          const error = await res.json();
          console.error(`Failed to create template ${uploaded.name}:`, error);
        }
      }

      alert(`Đã tạo ${successCount} mẫu thiệp${errorCount > 0 ? `, ${errorCount} lỗi` : ''}`);
      setShowMultiUpload(false);
      setUploadedFiles([]);
      setFailedFiles([]);
      setBaseName('');
      const firstCategory = categories.find(c => !c.parent_id)?.name || '';
      setBatchForm({ category: firstCategory, points_required: 0, subscription_tier: 'free' });
      setBatchProgress({ current: 0, total: 0 });
      setEstimatedTime(null);
      setUploadStartTime(null);
      fetchTemplates();
    } catch (error: any) {
      console.error('Batch create error:', error);
      alert('Lỗi tạo mẫu thiệp: ' + error.message);
    } finally {
      setBatchUploading(false);
      setBatchProgress({ current: 0, total: 0 });
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
        subscription_tier: form.subscription_tier,
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
    const firstCategory = categories.find(c => !c.parent_id)?.name || '';
    setForm({ 
      name: '', 
      thumbnail: '', 
      category: firstCategory, 
      points_required: 0, 
      subscription_tier: 'free',
      media_type: 'image',
      image_transform: { scale: 1, x: 0, y: 0 },
    });
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setForm({
      name: template.name,
      thumbnail: template.thumbnail,
      category: template.category || categories.find(c => !c.parent_id)?.name || '',
      points_required: template.points_required,
      subscription_tier: template.subscription_tier || (template.is_premium ? 'ultra' : 'free'),
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

  const filteredTemplates = templates.filter(t => {
    let matchCategory = false;
    if (selectedCategory === 'all') {
      matchCategory = true;
    } else {
      // Check if it matches the selected category (parent or subcategory)
      matchCategory = t.category === selectedCategory;
      // Also include subcategories when parent is selected
      if (!matchCategory) {
        const selectedParent = categories.find(c => c.name === selectedCategory && !c.parent_id);
        if (selectedParent?.subcategories) {
          matchCategory = selectedParent.subcategories.some(sub => sub.name === t.category);
        }
      }
    }
    const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch && matchCategory;
  });

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
    <div className="min-h-screen bg-cream p-6 pb-20">
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
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setShowModal(true); resetForm(); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition shadow-lg font-vn font-medium"
          >
            <Plus className="w-5 h-5" />
            Thêm mẫu mới
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

      {/* Search & Filter */}
      <div className="bg-cream-light rounded-2xl p-4 mb-6 border border-gold/20 shadow-sm space-y-4">
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
        
        {/* Category Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-vn font-medium text-ink/70">Lọc theo danh mục:</span>
            <button
              onClick={() => setShowCategoryManagement(true)}
              className="px-3 py-1.5 rounded-lg font-vn text-sm bg-gold/10 text-ink hover:bg-gold/20 transition flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Quản lý danh mục
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-vn text-sm transition ${
                selectedCategory === 'all'
                  ? 'bg-burgundy text-cream'
                  : 'bg-cream border border-gold/20 text-ink/70 hover:border-burgundy/30'
              }`}
            >
              Tất cả
            </button>
            {categories
              .filter(cat => !cat.parent_id) // Only show parent categories in filter
              .map((parentCat) => (
                <div key={parentCat.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedCategory(parentCat.name)}
                    className={`px-4 py-2 rounded-lg font-vn text-sm transition flex items-center gap-2 ${
                      selectedCategory === parentCat.name
                        ? 'bg-burgundy text-cream'
                        : 'bg-cream border border-gold/20 text-ink/70 hover:border-burgundy/30'
                    }`}
                  >
                    <span>{parentCat.emoji}</span>
                    <span>{parentCat.label}</span>
                    {parentCat.template_count !== undefined && (
                      <span className="text-xs opacity-70">({parentCat.template_count})</span>
                    )}
                  </button>
                  {parentCat.subcategories && parentCat.subcategories.length > 0 && (
                    <div className="flex items-center gap-1 ml-1">
                      {parentCat.subcategories.map((subCat) => (
                        <button
                          key={subCat.id}
                          onClick={() => setSelectedCategory(subCat.name)}
                          className={`px-3 py-1.5 rounded-lg font-vn text-xs transition flex items-center gap-1 ${
                            selectedCategory === subCat.name
                              ? 'bg-burgundy/80 text-cream'
                              : 'bg-cream/80 border border-gold/20 text-ink/70 hover:border-burgundy/30'
                          }`}
                        >
                          <span className="text-xs">{subCat.emoji}</span>
                          <span>{subCat.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({ name: '', label: '', emoji: '⭐', display_order: 0, is_active: true, parent_id: null });
                setShowCategoryModal(true);
              }}
              className="px-4 py-2 rounded-lg font-vn text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo danh mục mới
            </button>
          </div>
        </div>
      </div>

      {/* File type hint */}
      <div className="bg-gold/10 rounded-xl p-4 mb-6 border border-gold/20">
        <p className="text-sm text-ink/70 font-vn">
          <strong>💡 Hỗ trợ:</strong> Ảnh (JPG, PNG, WEBP), GIF động, Video (MP4, WEBM) từ Canva. 
          Video sẽ tự động tắt tiếng khi hiển thị.
        </p>
      </div>

      {/* Folder input (hidden) */}
      <input
        ref={folderInputRef}
        type="file"
        accept="image/*,video/mp4,video/webm,video/quicktime,.gif"
        multiple
        webkitdirectory=""
        directory=""
        onChange={handleFolderUpload}
        className="hidden"
      />

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
                  {template.subscription_tier && template.subscription_tier !== 'free' && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full flex items-center gap-1 ${
                      template.subscription_tier === 'plus' ? 'bg-emerald-500' :
                      template.subscription_tier === 'pro' ? 'bg-blue-500' :
                      template.subscription_tier === 'ultra' ? 'bg-purple-500' : 'bg-gold'
                    }`}>
                      {template.subscription_tier === 'ultra' && <Crown className="w-3 h-3 text-cream" />}
                      <span className="text-[10px] text-cream font-bold">{template.subscription_tier.toUpperCase()}</span>
                    </div>
                  )}
                  {!template.subscription_tier && template.is_premium && (
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
                      {categories.find(c => c.name === template.category)?.emoji || '⭐'} {categories.find(c => c.name === template.category)?.label || template.category}
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
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                      >
                        {categories
                          .filter(cat => !cat.parent_id)
                          .map((parentCat) => (
                            <optgroup key={parentCat.id} label={`${parentCat.emoji} ${parentCat.label}`}>
                              <option value={parentCat.name}>
                                {parentCat.emoji} {parentCat.label} (Danh mục lớn)
                              </option>
                              {parentCat.subcategories && parentCat.subcategories.map((subCat) => (
                                <option key={subCat.id} value={subCat.name}>
                                  &nbsp;&nbsp;{subCat.emoji} {subCat.label}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                      </select>
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

                    {/* Subscription Tier */}
                    <div>
                      <label className="block text-sm font-vn font-medium text-ink mb-2">Gói dịch vụ</label>
                      <select
                        value={form.subscription_tier}
                        onChange={(e) => setForm({ ...form, subscription_tier: e.target.value as SubscriptionTier })}
                        className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                      >
                        {SUBSCRIPTION_TIERS.map((tier) => (
                          <option key={tier.value} value={tier.value}>
                            {tier.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-ink/50 mt-1 font-vn">
                        Chọn gói dịch vụ có thể sử dụng mẫu này (mặc định: Free)
                      </p>
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
                      {categories.find(c => c.name === previewTemplate.category)?.emoji || '⭐'} {categories.find(c => c.name === previewTemplate.category)?.label || previewTemplate.category}
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
                const firstCategory = categories.find(c => !c.parent_id)?.name || '';
                setBatchForm({ category: firstCategory, points_required: 0, subscription_tier: 'free' });
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
                  Tải nhiều mẫu thiệp ({uploadedFiles.length} files)
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
                      const firstCategory = categories.find(c => !c.parent_id)?.name || '';
                      setBatchForm({ category: firstCategory, points_required: 0, subscription_tier: 'free' });
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
                    {categories
                      .filter(cat => !cat.parent_id)
                      .map((parentCat) => (
                        <optgroup key={parentCat.id} label={`${parentCat.emoji} ${parentCat.label}`}>
                          <option value={parentCat.name}>
                            {parentCat.emoji} {parentCat.label} (Danh mục lớn)
                          </option>
                          {parentCat.subcategories && parentCat.subcategories.map((subCat) => (
                            <option key={subCat.id} value={subCat.name}>
                              &nbsp;&nbsp;{subCat.emoji} {subCat.label}
                            </option>
                          ))}
                        </optgroup>
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
                  <label className="block text-sm font-vn font-medium text-ink mb-2">Gói dịch vụ</label>
                  <select
                    value={batchForm.subscription_tier}
                    onChange={(e) => setBatchForm({ ...batchForm, subscription_tier: e.target.value as SubscriptionTier })}
                    disabled={batchUploading}
                    className="w-full px-3 py-2 bg-white border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                  >
                    {SUBSCRIPTION_TIERS.map((tier) => (
                      <option key={tier.value} value={tier.value}>
                        {tier.label}
                      </option>
                    ))}
                  </select>
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
                    placeholder="VD: Tình yêu vĩnh cửu"
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
                      {uploaded.mediaType === 'video' ? (
                        <video
                          src={uploaded.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={uploaded.url}
                          alt={uploaded.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {/* Remove button */}
                      {!batchUploading && (
                        <button
                          onClick={() => removeFile(uploaded.id)}
                          className="absolute top-2 right-2 p-1.5 bg-ink/70 hover:bg-burgundy rounded-full transition"
                          title="Xóa"
                        >
                          <X className="w-4 h-4 text-cream" />
                        </button>
                      )}
                      {/* Media type badge */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-ink/70 rounded-full">
                        <span className="text-[10px] text-cream font-medium capitalize">
                          {uploaded.mediaType === 'video' ? 'Video' : uploaded.mediaType === 'gif' ? 'GIF' : 'Ảnh'}
                        </span>
                      </div>
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="block text-xs font-vn font-medium text-ink/70 mb-1">
                        Tên mẫu #{index + 1}
                      </label>
                      <input
                        type="text"
                        value={uploaded.name}
                        onChange={(e) => updateFileName(uploaded.id, e.target.value)}
                        disabled={batchUploading}
                        className="w-full px-3 py-2 bg-white border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn text-sm"
                        placeholder="Nhập tên mẫu..."
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
                      Đang tạo mẫu thiệp...
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
                      const firstCategory = categories.find(c => !c.parent_id)?.name || '';
                      setBatchForm({ category: firstCategory, points_required: 0, subscription_tier: 'free' });
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
                      Tạo {uploadedFiles.length} mẫu
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cream-light rounded-2xl p-6 w-full max-w-md border border-gold/20 shadow-vintage"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-ink">
                  {editingCategory ? 'Sửa danh mục' : 'Tạo danh mục mới'}
                </h2>
                <button 
                  onClick={() => {
                    setShowCategoryModal(false);
                    setEditingCategory(null);
                    setCategoryForm({ name: '', label: '', emoji: '⭐', display_order: 0, is_active: true, parent_id: null });
                  }}
                  className="p-2 hover:bg-gold/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-ink/50" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">
                    Tên danh mục (ID) *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value.toLowerCase().trim().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                    placeholder="VD: new-year"
                    required
                  />
                  <p className="text-xs text-ink/50 mt-1 font-vn">
                    Tên ID (không dấu, không khoảng trắng, dùng dấu gạch ngang)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">
                    Tên hiển thị *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.label}
                    onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                    placeholder="VD: Năm mới"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">
                    Emoji *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.emoji}
                    onChange={(e) => setCategoryForm({ ...categoryForm, emoji: e.target.value })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn text-2xl text-center"
                    placeholder="🎉"
                    maxLength={2}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">
                    Danh mục lớn (tùy chọn)
                  </label>
                  <select
                    value={categoryForm.parent_id || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value || null })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                  >
                    <option value="">-- Không có (Danh mục lớn) --</option>
                    {categories
                      .filter(cat => !cat.parent_id && (!editingCategory || cat.id !== editingCategory.id))
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.emoji} {cat.label}
                        </option>
                      ))}
                  </select>
                  <p className="text-xs text-ink/50 mt-1 font-vn">
                    Chọn danh mục lớn nếu đây là danh mục nhỏ
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-vn font-medium text-ink mb-2">
                    Thứ tự hiển thị
                  </label>
                  <input
                    type="number"
                    value={categoryForm.display_order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-cream border border-gold/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn"
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-cream rounded-xl border border-gold/20">
                  <input
                    type="checkbox"
                    checked={categoryForm.is_active}
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.checked })}
                    className="w-5 h-5 text-burgundy rounded focus:ring-burgundy/30"
                  />
                  <div>
                    <span className="font-vn font-medium text-ink">Kích hoạt</span>
                    <p className="text-xs text-ink/50">Hiển thị danh mục này cho người dùng</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setEditingCategory(null);
                      setCategoryForm({ name: '', label: '', emoji: '⭐', display_order: 0, is_active: true, parent_id: null });
                    }}
                    className="flex-1 px-4 py-3 bg-cream border border-gold/20 text-ink/70 rounded-xl hover:bg-gold/10 transition font-vn font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-burgundy text-cream rounded-xl hover:bg-burgundy-dark transition font-vn font-medium shadow-lg"
                  >
                    Tạo danh mục
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showCategoryManagement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCategoryManagement(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-cream-light rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gold/20 shadow-vintage"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-ink">
                  Quản lý danh mục
                </h2>
                <button 
                  onClick={() => setShowCategoryManagement(false)}
                  className="p-2 hover:bg-gold/10 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-ink/50" />
                </button>
              </div>

              {/* Categories List with Hierarchy */}
              <div className="space-y-3 mb-6">
                {categories
                  .filter(cat => !cat.parent_id)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((parentCat) => (
                    <div key={parentCat.id} className="bg-cream rounded-xl p-4 border border-gold/20">
                      {/* Parent Category */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <GripVertical className="w-5 h-5 text-ink/30 cursor-move" />
                          <span className="text-2xl">{parentCat.emoji}</span>
                          <div>
                            <div className="font-vn font-semibold text-ink">{parentCat.label}</div>
                            <div className="text-xs text-ink/50 font-vn">ID: {parentCat.name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-vn text-ink/60">
                            {parentCat.template_count || 0} mẫu
                            {parentCat.subcategory_count ? ` • ${parentCat.subcategory_count} danh mục con` : ''}
                          </span>
                          <button
                            onClick={() => {
                              handleEditCategory(parentCat);
                              setShowCategoryManagement(false);
                            }}
                            className="p-2 hover:bg-gold/10 rounded-lg transition"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4 text-ink/60" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(parentCat)}
                            className="p-2 hover:bg-red-50 rounded-lg transition"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {/* Subcategories */}
                      {parentCat.subcategories && parentCat.subcategories.length > 0 && (
                        <div className="ml-8 mt-3 space-y-2 pl-4 border-l-2 border-gold/20">
                          {parentCat.subcategories
                            .sort((a, b) => a.display_order - b.display_order)
                            .map((subCat) => (
                              <div key={subCat.id} className="flex items-center justify-between py-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <GripVertical className="w-4 h-4 text-ink/20 cursor-move" />
                                  <span className="text-lg">{subCat.emoji}</span>
                                  <div>
                                    <div className="font-vn text-sm text-ink">{subCat.label}</div>
                                    <div className="text-xs text-ink/40 font-vn">ID: {subCat.name}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-vn text-ink/50">
                                    {templates.filter(t => t.category === subCat.name).length} mẫu
                                  </span>
                                  <button
                                    onClick={() => {
                                      handleEditCategory(subCat);
                                      setShowCategoryManagement(false);
                                    }}
                                    className="p-1.5 hover:bg-gold/10 rounded transition"
                                    title="Sửa"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-ink/60" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(subCat)}
                                    className="p-1.5 hover:bg-red-50 rounded transition"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Add Subcategory Button */}
                      <button
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryForm({ 
                            name: '', 
                            label: '', 
                            emoji: '⭐', 
                            display_order: (parentCat.subcategories?.length || 0), 
                            is_active: true, 
                            parent_id: parentCat.id 
                          });
                          setShowCategoryModal(true);
                          setShowCategoryManagement(false);
                        }}
                        className="ml-8 mt-2 px-3 py-1.5 text-xs font-vn text-emerald-600 hover:bg-emerald-50 rounded-lg transition flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Thêm danh mục nhỏ
                      </button>
                    </div>
                  ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gold/20">
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: '', label: '', emoji: '⭐', display_order: 0, is_active: true, parent_id: null });
                    setShowCategoryModal(true);
                    setShowCategoryManagement(false);
                  }}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition font-vn font-medium flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tạo danh mục lớn mới
                </button>
                <button
                  onClick={() => setShowCategoryManagement(false)}
                  className="px-4 py-3 bg-cream border border-gold/20 text-ink/70 rounded-xl hover:bg-gold/10 transition font-vn font-medium"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
