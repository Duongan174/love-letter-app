'use client';

import { useEffect, useState } from 'react';
import { 
  Users, FileHeart, TrendingUp, Heart, 
  ArrowUpRight, ArrowDownRight, Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
// 1. Import PromoCodeButton
import PromoCodeButton from '@/components/ui/PromoCodeButton';

interface Stats {
  totalUsers: number;
  totalCards: number;
  totalViews: number;
  totalTym: number;
  recentCards: any[];
  recentUsers: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCards: 0,
    totalViews: 0,
    totalTym: 0,
    recentCards: [],
    recentUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null); // State lưu admin hiện tại

  useEffect(() => {
    const fetchStats = async () => {
      // Lấy thông tin session của admin/user đang đăng nhập
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      // Fetch users count
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Fetch cards count and total views
      const { data: cards } = await supabase
        .from('cards')
        .select('id, view_count, created_at, recipient_name, sender_name');

      const totalViews = cards?.reduce((sum, card) => sum + (card.view_count || 0), 0) || 0;

      // Fetch total Tym in circulation
      const { data: users } = await supabase
        .from('users')
        .select('points');
      const totalTym = users?.reduce((sum, user) => sum + (user.points || 0), 0) || 0;

      // Recent cards
      const { data: recentCards } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Recent users
      const { data: recentUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersCount || 0,
        totalCards: cards?.length || 0,
        totalViews,
        totalTym,
        recentCards: recentCards || [],
        recentUsers: recentUsers || [],
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Tổng người dùng', value: stats.totalUsers, icon: Users, color: 'blue', change: '+12%' },
    { label: 'Thiệp đã tạo', value: stats.totalCards, icon: FileHeart, color: 'rose', change: '+8%' },
    { label: 'Lượt xem thiệp', value: stats.totalViews, icon: Eye, color: 'green', change: '+24%' },
    { label: 'Tổng Tym', value: stats.totalTym, icon: Heart, color: 'purple', change: '0%' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header với tiêu đề và nút Promo Code */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Tổng quan hệ thống</p>
        </div>

        {/* Nút Promo Code hiển thị nếu user (admin) đã login */}
        {currentUser && (
          <div className="flex items-center gap-3">
            <PromoCodeButton 
              userId={currentUser.id} 
              onBalanceUpdate={(newBalance) => {
                // Tùy chọn: Load lại trang để cập nhật điểm trên header chung
                window.location.reload();
              }}
            />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                </div>
                <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-gray-500'}`}>
                  {stat.change}
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : null}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value.toLocaleString()}</h3>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Cards */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Thiệp mới tạo</h2>
          <div className="space-y-3">
            {stats.recentCards.length > 0 ? (
              stats.recentCards.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-800">Gửi: {card.recipient_name}</p>
                    <p className="text-sm text-gray-500">Từ: {card.sender_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{new Date(card.created_at).toLocaleDateString('vi-VN')}</p>
                    <p className="text-xs text-gray-400">{card.view_count || 0} views</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có thiệp nào</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Người dùng mới</h2>
          <div className="space-y-3">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=f43f5e&color=fff`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-rose-500">💜 {user.points}</p>
                    <p className="text-xs text-gray-400 uppercase">{user.provider || 'email'}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có người dùng</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}