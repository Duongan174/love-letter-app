'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Envelope {
  id: string;
  name: string;
  color: string;
  thumbnail: string;
  points_required: number;
  is_active: boolean;
}

export default function AdminEnvelopes() {
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEnvelope, setEditingEnvelope] = useState<Envelope | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form, setForm] = useState({
    name: '',
    color: '#f8b4c4',
    thumbnail: '',
    points_required: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchEnvelopes();
  }, []);

  const fetchEnvelopes = async () => {
    const { data } = await supabase
      .from('envelopes')
      .select('*')
      .order('created_at', { ascending: false });
    setEnvelopes(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEnvelope) {
      await supabase.from('envelopes').update(form).eq('id', editingEnvelope.id);
    } else {
      await supabase.from('envelopes').insert([form]);
    }
    setShowModal(false);
    resetForm();
    fetchEnvelopes();
  };

  const resetForm = () => {
    setEditingEnvelope(null);
    setForm({ name: '', color: '#f8b4c4', thumbnail: '', points_required: 0, is_active: true });
  };

  const handleEdit = (envelope: Envelope) => {
    setEditingEnvelope(envelope);
    setForm({
      name: envelope.name,
      color: envelope.color,
      thumbnail: envelope.thumbnail || '',
      points_required: envelope.points_required,
      is_active: envelope.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc muốn xóa phong bì này?')) {
      await supabase.from('envelopes').delete().eq('id', id);
      fetchEnvelopes();
    }
  };

  const filteredEnvelopes = envelopes.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Phong bì</h1>
          <p className="text-gray-500">Quản lý các mẫu phong bì</p>
        </div>
        <button
          onClick={() => { setShowModal(true); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
        >
          <Plus className="w-5 h-5" />
          Thêm mẫu
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm phong bì..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Envelopes Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {filteredEnvelopes.map((envelope) => (
          <div key={envelope.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <div
              className="aspect-square rounded-xl mb-3 relative"
              style={{ backgroundColor: envelope.color }}
            >
              {!envelope.is_active && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs">Đã ẩn</span>
                </div>
              )}
            </div>
            <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{envelope.name}</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500">{envelope.color}</span>
              <span className="font-medium text-rose-500 text-sm">💜 {envelope.points_required}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(envelope)}
                className="flex-1 p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <Edit className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => handleDelete(envelope.id)}
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
              {editingEnvelope ? 'Sửa phong bì' : 'Thêm phong bì'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên phong bì</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={form.color}
                    onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
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
                  {editingEnvelope ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}