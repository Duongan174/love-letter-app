'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Play, Pause, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import CloudinaryUpload from '@/components/ui/CloudinaryUpload';

interface Music {
  id: string;
  name: string;
  url: string;
  category: string;
  duration: number;
  points_required: number;
  is_active: boolean;
}

export default function AdminMusic() {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMusic, setEditingMusic] = useState<Music | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const [form, setForm] = useState({
    name: '',
    url: '',
    category: 'romantic',
    duration: 180,
    points_required: 0,
    is_active: true,
  });

  const categories = [
    { value: 'romantic', label: 'Lãng mạn' },
    { value: 'birthday', label: 'Sinh nhật' },
    { value: 'classic', label: 'Cổ điển' },
    { value: 'peaceful', label: 'Nhẹ nhàng' },
    { value: 'holiday', label: 'Lễ hội' },
  ];

  useEffect(() => {
    fetchMusic();
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, []);

  const fetchMusic = async () => {
    const { data } = await supabase
      .from('music')
      .select('*')
      .order('created_at', { ascending: false });
    setMusicList(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (editingMusic) {
      await supabase.from('music').update(form).eq('id', editingMusic.id);
    } else {
      await supabase.from('music').insert([form]);
    }

    setShowModal(false);
    resetForm();
    fetchMusic();
    setSaving(false);
  };

  const resetForm = () => {
    setEditingMusic(null);
    setForm({
      name: '',
      url: '',
      category: 'romantic',
      duration: 180,
      points_required: 0,
      is_active: true,
    });
  };

  const handleEdit = (music: Music) => {
    setEditingMusic(music);
    setForm({
      name: music.name,
      url: music.url,
      category: music.category,
      duration: music.duration,
      points_required: music.points_required,
      is_active: music.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa nhạc này? Các draft và card đang sử dụng sẽ được cập nhật (music_id = null).')) return;
    
    try {
      // ✅ API endpoint server-side sẽ tự động xử lý các drafts và cards liên quan
      const res = await fetch(`/api/admin/music?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete music');
      }

      const result = await res.json();
      
      // Hiển thị thông báo nếu có drafts/cards đã được cập nhật
      if (result.updatedDrafts > 0 || result.updatedCards > 0) {
        const updatedInfo = [];
        if (result.updatedDrafts > 0) updatedInfo.push(`${result.updatedDrafts} draft`);
        if (result.updatedCards > 0) updatedInfo.push(`${result.updatedCards} card`);
        alert(`Đã xóa nhạc và cập nhật ${updatedInfo.join(', ')} liên quan.`);
      }
      
      fetchMusic();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Lỗi xóa nhạc: ' + (error.message || 'Đã có lỗi xảy ra'));
    }
  };

  const togglePlay = (music: Music) => {
    if (playingId === music.id) {
      audioElement?.pause();
      setPlayingId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(music.url);
      audio.play();
      audio.onended = () => setPlayingId(null);
      setAudioElement(audio);
      setPlayingId(music.id);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredMusic = musicList.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nhạc nền</h1>
          <p className="text-gray-500">Quản lý các bài nhạc nền</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm nhạc
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhạc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filteredMusic.map((music) => (
            <div key={music.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
              <button
                onClick={() => togglePlay(music)}
                disabled={!music.url}
                className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-200 transition disabled:opacity-50"
              >
                {playingId === music.id ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-1" />
                )}
              </button>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800">{music.name}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{categories.find((c) => c.value === music.category)?.label}</span>
                  <span>•</span>
                  <span>{formatDuration(music.duration)}</span>
                </div>
              </div>
              <span className="font-medium text-rose-500">💜 {music.points_required}</span>
              {!music.is_active && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">Ẩn</span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(music)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(music.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingMusic ? 'Sửa nhạc' : 'Thêm nhạc'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên bài hát</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">File nhạc (MP3)</label>
                <CloudinaryUpload
                  onUpload={(url) => setForm({ ...form, url })}
                  folder="vintage-ecard/music"
                  accept="audio/*"
                  type="audio"
                  maxSize={25}
                  currentUrl={form.url}
                />
                {form.url && (
                  <p className="text-xs text-gray-500 mt-1 truncate">{form.url}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thể loại</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời lượng (giây)
                </label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giá (Tym)</label>
                <input
                  type="number"
                  value={form.points_required}
                  onChange={(e) => setForm({ ...form, points_required: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  min="0"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-rose-500"
                />
                <span className="text-sm text-gray-700">Hiển thị</span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingMusic ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}