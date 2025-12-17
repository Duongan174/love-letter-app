'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Stamp {
  id: string;
  name: string;
  image_url: string;
  points_required: number;
  is_active: boolean;
}

export default function AdminStamps() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStamp, setEditingStamp] = useState<Stamp | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    name: '',
    image_url: '❤️',
    points_required: 0,
    is_active: true,
  });

  const emojiOptions = ['❤️', '🌹', '⭐', '🦋', '🌈', '🎂', '🎁', '🌷', '💕', '🌸', '🎉', '🔥', '💝', '🌺', '🎀', '✨'];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStamp) {
      await supabase.from('stamps').update(form).eq('id', editingStamp.id);
    } else {
      await supabase.from('stamps').insert([form]);
    }
    setShowModal(false);
    resetForm();
    fetchStamps();
  };

  const resetForm = () => {
    setEditingStamp(null);
    setForm({ name: '', image_url: '❤️', points_required: 0, is_active: true });
  };

  const handleEdit = (stamp: Stamp) => {
    setEditingStamp(stamp);
    setForm({
      name: stamp.name,
      image_url: stamp.image_url,
      points_required: stamp.points_required,
      is_active: stamp.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa tem này?')) {
      await supabase.from('stamps').delete().eq('id', id);
      fetchStamps();
    }
  };

  const filteredStamps = stamps.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tem</h1>
          <p className="text-gray-500">Quản lý các mẫu tem</p>
        </div>
        <button
          onClick={() => { setShowModal(true); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm tem
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tem..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Stamps Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {filteredStamps.map((stamp) => (
          <div key={stamp.id} className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <div className="text-5xl mb-2">{stamp.image_url}</div>
            <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{stamp.name}</h3>
            <p className="text-rose-500 text-sm font-medium mb-3">💜 {stamp.points_required}</p>
            {!stamp.is_active && (
              <span className="text-xs text-gray-400">Đã ẩn</span>
            )}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(stamp)}
                className="flex-1 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Edit className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => handleDelete(stamp.id)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingStamp ? 'Sửa tem' : 'Thêm tem'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên tem</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn emoji</label>
                <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-lg">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm({ ...form, image_url: emoji })}
                      className={`text-2xl p-2 rounded-lg transition ${
                        form.image_url === emoji ? 'bg-rose-100 ring-2 ring-rose-500' : 'hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <p className="text-center text-3xl mt-3">{form.image_url}</p>
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
                  className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  {editingStamp ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}