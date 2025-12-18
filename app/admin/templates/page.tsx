// app/admin/templates/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';
import { Loader2, Plus, Trash2, Edit2, Play, Image as ImageIcon } from 'lucide-react';

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // State quay khi lưu vào DB

  // Form State
  const [form, setForm] = useState({
    name: '',
    thumbnail: '', // URL ảnh
    category: 'love', // love, birthday, classic...
    points_required: 0,
    is_premium: false,
    is_active: true
  });

  // 1. Tải danh sách mẫu
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

  // 2. Xử lý lưu (Tạo mới)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.thumbnail) return alert('Vui lòng upload ảnh mẫu!');

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('card_templates').insert([form]);

      if (error) throw error;

      // Reset form & reload list
      setForm({
        name: '',
        thumbnail: '',
        category: 'love',
        points_required: 0,
        is_premium: false,
        is_active: true
      });
      fetchTemplates();
      alert('Thêm mẫu thành công!');

    } catch (error: any) {
      console.error('Lỗi lưu DB:', error);
      alert('Lỗi lưu: ' + error.message);
    } finally {
      setIsSubmitting(false); // Tắt quay
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa mẫu này?')) return;
    await supabase.from('card_templates').delete().eq('id', id);
    fetchTemplates();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý Mẫu Thiệp</h1>

      {/* FORM THÊM MỚI */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-rose-500" /> Thêm mẫu mới
        </h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột trái: Upload */}
          <div>
            <CloudinaryUpload 
              label="Ảnh/Video Mẫu"
              currentUrl={form.thumbnail}
              onUpload={(url) => setForm({ ...form, thumbnail: url })}
            />
            <p className="text-xs text-gray-400 mt-2 italic">
              *Hỗ trợ ảnh (.jpg, .png) hoặc video ngắn (.mp4) làm thiệp động.
            </p>
          </div>

          {/* Cột phải: Thông tin */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên mẫu</label>
              <input 
                required
                type="text" 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                placeholder="Ví dụ: Tình yêu vĩnh cửu..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                <select 
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full p-2 border rounded-lg outline-none"
                >
                  <option value="love">Tình yêu</option>
                  <option value="birthday">Sinh nhật</option>
                  <option value="classic">Cổ điển</option>
                  <option value="thankyou">Cảm ơn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá (Tym)</label>
                <input 
                  type="number" 
                  value={form.points_required}
                  onChange={e => setForm({...form, points_required: Number(e.target.value)})}
                  className="w-full p-2 border rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.is_premium}
                  onChange={e => setForm({...form, is_premium: e.target.checked})}
                  className="w-4 h-4 text-rose-500 rounded"
                />
                <span className="text-sm font-medium">Premium</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.is_active}
                  onChange={e => setForm({...form, is_active: e.target.checked})}
                  className="w-4 h-4 text-green-500 rounded"
                />
                <span className="text-sm font-medium">Hiển thị ngay</span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting || !form.thumbnail}
              className="w-full py-2.5 bg-rose-500 text-white rounded-lg font-bold hover:bg-rose-600 disabled:bg-gray-300 transition-colors flex justify-center items-center gap-2"
            >
              {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
              {isSubmitting ? 'Đang lưu...' : 'Lưu Mẫu Thiệp'}
            </button>
          </div>
        </form>
      </div>

      {/* DANH SÁCH HIỆN CÓ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-500 text-xs uppercase">
          Danh sách mẫu ({templates.length})
        </div>
        
        {loading ? (
          <div className="p-8 text-center"><Loader2 className="animate-spin w-6 h-6 mx-auto text-gray-400" /></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {templates.map(t => (
              <div key={t.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 relative">
                  {t.thumbnail?.endsWith('.mp4') ? (
                    <>
                      <video src={t.thumbnail} className="w-full h-full object-cover" muted />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20"><Play className="w-6 h-6 text-white" /></div>
                    </>
                  ) : (
                    <img src={t.thumbnail} className="w-full h-full object-cover" alt={t.name} />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 truncate">{t.name}</h3>
                  <div className="flex gap-2 text-xs mt-1">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded capitalize">{t.category}</span>
                    <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded">{t.points_required} Tym</span>
                    {t.is_premium && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Premium</span>}
                  </div>
                </div>

                {/* Actions */}
                <button 
                  onClick={() => handleDelete(t.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}