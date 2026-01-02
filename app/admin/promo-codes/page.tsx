'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Copy, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface PromoCode {
  id: string;
  code: string;
  points: number;
  max_uses: number;
  current_uses: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    code: '',
    points: 10,
    max_uses: 100,
    expires_at: '',
    is_active: true,
  });

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    const { data } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    setPromoCodes(data || []);
    setLoading(false);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'TYM';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const submitData = {
      code: form.code.toUpperCase().trim(),
      points: form.points,
      max_uses: form.max_uses,
      expires_at: form.expires_at || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      is_active: form.is_active,
    };

    if (editingCode) {
      await supabase.from('promo_codes').update(submitData).eq('id', editingCode.id);
    } else {
      await supabase.from('promo_codes').insert([{ ...submitData, current_uses: 0 }]);
    }

    setShowModal(false);
    resetForm();
    fetchPromoCodes();
    setSaving(false);
  };

  const resetForm = () => {
    setEditingCode(null);
    setForm({ code: '', points: 10, max_uses: 100, expires_at: '', is_active: true });
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingCode(promo);
    setForm({
      code: promo.code,
      points: promo.points,
      max_uses: promo.max_uses,
      expires_at: promo.expires_at ? promo.expires_at.split('T')[0] : '',
      is_active: promo.is_active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa mã giảm giá này? Tất cả lịch sử sử dụng mã này cũng sẽ bị xóa.')) return;
    
    try {
      // ✅ API endpoint server-side sẽ tự động xóa các records liên quan
      const res = await fetch(`/api/admin/promo-codes?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete promo code');
      }

      const result = await res.json();
      
      // Hiển thị thông báo nếu có uses đã bị xóa
      if (result.deletedUses > 0) {
        alert(`Đã xóa mã giảm giá và ${result.deletedUses} lịch sử sử dụng liên quan.`);
      }
      
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Delete error:', error);
      alert('Lỗi xóa mã giảm giá: ' + (error.message || 'Đã có lỗi xảy ra'));
    }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isExpired = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const filteredCodes = promoCodes.filter((p) =>
    p.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mã khuyến mãi</h1>
          <p className="text-gray-500">Quản lý mã nhận Tym miễn phí</p>
        </div>
        <button
          onClick={() => {
            setShowModal(true);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition"
        >
          <Plus className="w-5 h-5" />
          Tạo mã mới
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm mã..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Mã</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tym bonus</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Sử dụng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Hết hạn</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Trạng thái</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCodes.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1 bg-gray-100 rounded-lg font-mono font-medium text-gray-800">
                        {promo.code}
                      </code>
                      <button
                        onClick={() => copyCode(promo.code, promo.id)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        {copiedId === promo.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-rose-500">💜 +{promo.points}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div>
                      {promo.current_uses} / {promo.max_uses}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-rose-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min((promo.current_uses / promo.max_uses) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {promo.expires_at ? (
                      <span className={isExpired(promo.expires_at) ? 'text-red-500' : ''}>
                        {new Date(promo.expires_at).toLocaleDateString('vi-VN')}
                      </span>
                    ) : (
                      <span className="text-gray-400">Không giới hạn</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {promo.is_active && !isExpired(promo.expires_at) && promo.current_uses < promo.max_uses ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
                        Ngưng
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(promo)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingCode ? 'Sửa mã khuyến mãi' : 'Tạo mã khuyến mãi'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="TYMXXXXXX"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono uppercase"
                    required
                  />
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Random
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tym bonus</label>
                <input
                  type="number"
                  value={form.points}
                  onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng</label>
                <input
                  type="number"
                  value={form.max_uses}
                  onChange={(e) => setForm({ ...form, max_uses: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                <input
                  type="date"
                  value={form.expires_at}
                  onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 text-rose-500"
                />
                <span className="text-sm text-gray-700">Kích hoạt</span>
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
                  {editingCode ? 'Cập nhật' : 'Tạo mã'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}