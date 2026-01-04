'use client';

import { useEffect, useState } from 'react';
import { Search, Edit, Ban, Gift, MoreVertical, Check, X, Crown, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { SubscriptionTier } from '@/types';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  points: number;
  role: string;
  provider: string;
  subscription_tier?: SubscriptionTier;
  subscription_expires_at?: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [tymAmount, setTymAmount] = useState(0);
  const [showTymModal, setShowTymModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');
  const [subscriptionMonths, setSubscriptionMonths] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Sử dụng API endpoint thay vì query trực tiếp để tránh RLS issues
      const res = await fetch('/api/admin/users');
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Không thể tải danh sách người dùng');
      }
      
      console.log('✅ Fetched users via API:', result.data?.length || 0);
      setUsers(result.data || []);
    } catch (err: any) {
      console.error('❌ Error in fetchUsers:', err);
      alert(`Lỗi khi tải danh sách người dùng: ${err.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    await supabase.from('users').update({ role }).eq('id', userId);
    fetchUsers();
  };

  const updateUserTym = async () => {
    if (!editingUser) return;
    const newPoints = editingUser.points + tymAmount;
    await supabase.from('users').update({ points: newPoints }).eq('id', editingUser.id);
    setShowTymModal(false);
    setEditingUser(null);
    setTymAmount(0);
    fetchUsers();
  };

  const updateUserSubscription = async () => {
    if (!editingUser) return;
    
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/subscription`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_tier: subscriptionTier,
          months: subscriptionTier === 'free' ? 0 : subscriptionMonths,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể cập nhật subscription');
      }

      setShowSubscriptionModal(false);
      setEditingUser(null);
      setSubscriptionTier('free');
      setSubscriptionMonths(1);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating subscription:', err);
      alert(`Lỗi: ${err.message}`);
    }
  };

  const getSubscriptionBadgeColor = (tier?: SubscriptionTier) => {
    switch (tier) {
      case 'ultra':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400';
      case 'pro':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'plus':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getSubscriptionLabel = (tier?: SubscriptionTier) => {
    switch (tier) {
      case 'ultra':
        return 'Ultra';
      case 'pro':
        return 'Pro';
      case 'plus':
        return 'Plus';
      default:
        return 'Free';
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy mx-auto mb-4"></div>
          <p className="text-ink/60 dark:text-cream-light/60 font-vn">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink dark:text-cream-light font-display">Người dùng</h1>
        <p className="text-ink/60 dark:text-cream-light/60 font-vn">Quản lý tài khoản người dùng ({users.length} người dùng)</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Người dùng</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Tym</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Gói</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Hết hạn</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Ngày tạo</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500 mb-2">Không tìm thấy người dùng nào</p>
                    {users.length === 0 && (
                      <p className="text-sm text-gray-400">
                        Có thể do RLS policies hoặc lỗi kết nối. Vui lòng kiểm tra console.
                      </p>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=f43f5e&color=fff`}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-rose-500">💜 {user.points}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getSubscriptionBadgeColor(user.subscription_tier)}`}>
                      {user.subscription_tier === 'ultra' && <Crown className="w-3 h-3" />}
                      {getSubscriptionLabel(user.subscription_tier)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.subscription_expires_at ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.subscription_expires_at).toLocaleDateString('vi-VN')}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { 
                          setEditingUser(user); 
                          setSubscriptionTier(user.subscription_tier || 'free');
                          setShowSubscriptionModal(true); 
                        }}
                        className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa gói"
                      >
                        <Crown className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setEditingUser(user); setShowTymModal(true); }}
                        className="p-2 text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition"
                        title="Thêm/Trừ Tym"
                      >
                        <Gift className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tym Modal */}
      {showTymModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Điều chỉnh Tym</h2>
            <p className="text-gray-600 mb-4">
              Người dùng: <strong>{editingUser.name}</strong><br />
              Tym hiện tại: <strong className="text-rose-500">💜 {editingUser.points}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Tym (dương = thêm, âm = trừ)
              </label>
              <input
                type="number"
                value={tymAmount}
                onChange={(e) => setTymAmount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Sau khi thay đổi: <strong className="text-rose-500">💜 {editingUser.points + tymAmount}</strong>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowTymModal(false); setTymAmount(0); }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                Hủy
              </button>
              <button
                onClick={updateUserTym}
                className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Modal */}
      {showSubscriptionModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-ink rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-ink dark:text-cream-light mb-4">Chỉnh sửa Gói Dịch vụ</h2>
            <p className="text-ink/60 dark:text-cream-light/60 mb-6">
              Người dùng: <strong>{editingUser.name}</strong><br />
              Gói hiện tại: <strong className={getSubscriptionBadgeColor(editingUser.subscription_tier)}>
                {getSubscriptionLabel(editingUser.subscription_tier)}
              </strong>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-ink dark:text-cream-light mb-2">
                Gói dịch vụ
              </label>
              <select
                value={subscriptionTier}
                onChange={(e) => {
                  setSubscriptionTier(e.target.value as SubscriptionTier);
                  if (e.target.value === 'free') {
                    setSubscriptionMonths(0);
                  }
                }}
                className="w-full px-4 py-2 border border-gold/20 dark:border-gold/30 rounded-lg bg-cream-light dark:bg-ink text-ink dark:text-cream-light focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="free">Free</option>
                <option value="plus">Plus</option>
                <option value="pro">Pro</option>
                <option value="ultra">Ultra</option>
              </select>
            </div>

            {subscriptionTier !== 'free' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-ink dark:text-cream-light mb-2">
                  Thời gian (tháng)
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={subscriptionMonths}
                  onChange={(e) => setSubscriptionMonths(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gold/20 dark:border-gold/30 rounded-lg bg-cream-light dark:bg-ink text-ink dark:text-cream-light focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
                <p className="text-xs text-ink/50 dark:text-cream-light/50 mt-1">
                  Gói sẽ hết hạn sau {subscriptionMonths} tháng
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { 
                  setShowSubscriptionModal(false); 
                  setEditingUser(null);
                  setSubscriptionTier('free');
                  setSubscriptionMonths(1);
                }}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-ink/50 text-gray-700 dark:text-cream-light rounded-lg hover:bg-gray-200 dark:hover:bg-ink/70 transition"
              >
                Hủy
              </button>
              <button
                onClick={updateUserSubscription}
                className="flex-1 px-4 py-2 bg-burgundy dark:bg-gold text-cream-light dark:text-ink rounded-lg hover:bg-burgundy-dark dark:hover:bg-gold/80 transition"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}