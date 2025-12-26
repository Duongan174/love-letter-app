'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileHeart,
  Heart,
  ArrowUpRight,
  Eye,
  Feather,
  Crown,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PromoCodeButton from '@/components/ui/PromoCodeButton';
import { ElegantSpinner } from '@/components/ui/Loading';

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * ✅ Admin dashboard fetch (safe)
   * - Use getSession() instead of getUser() to avoid auth network stalls when switching browser tabs
   * - Parallelize queries
   * - Always release loading
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fast + local
      const { data: sessionRes, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) console.warn('admin getSession warn:', sessionErr);
      setCurrentUser(sessionRes.session?.user ?? null);

      const [
        usersCountRes,
        cardsRes,
        pointsRes,
        recentCardsRes,
        recentUsersRes,
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('cards').select('id, view_count, created_at, recipient_name, sender_name'),
        supabase.from('users').select('points'),
        supabase.from('cards').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('users').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      if (usersCountRes.error) throw usersCountRes.error;
      if (cardsRes.error) throw cardsRes.error;
      if (pointsRes.error) throw pointsRes.error;
      if (recentCardsRes.error) throw recentCardsRes.error;
      if (recentUsersRes.error) throw recentUsersRes.error;

      const cards = cardsRes.data ?? [];
      const totalViews =
        cards.reduce((sum: number, card: any) => sum + (card.view_count || 0), 0) || 0;

      const usersPoints = pointsRes.data ?? [];
      const totalTym =
        usersPoints.reduce((sum: number, u: any) => sum + (u.points || 0), 0) || 0;

      setStats({
        totalUsers: usersCountRes.count || 0,
        totalCards: cards.length || 0,
        totalViews,
        totalTym,
        recentCards: recentCardsRes.data || [],
        recentUsers: recentUsersRes.data || [],
      });
    } catch (e) {
      console.warn('admin fetchStats warn:', e);
      setError('Không thể tải dữ liệu admin. Hãy thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      label: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+12%',
    },
    {
      label: 'Thiệp đã tạo',
      value: stats.totalCards,
      icon: FileHeart,
      gradient: 'from-burgundy to-burgundy-dark',
      bgLight: 'bg-burgundy/10',
      textColor: 'text-burgundy',
      change: '+8%',
    },
    {
      label: 'Lượt xem thiệp',
      value: stats.totalViews,
      icon: Eye,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: '+24%',
    },
    {
      label: 'Tổng Tym',
      value: stats.totalTym,
      icon: Heart,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '0%',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ElegantSpinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-ink/70 font-vn mb-3">{error}</p>
          <button
            type="button"
            onClick={() => fetchStats()}
            className="px-4 py-2 rounded-xl bg-burgundy text-cream hover:bg-burgundy-dark transition font-vn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Crown className="w-5 h-5 text-burgundy" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink">Dashboard</h1>
          </div>
          <p className="text-ink/60 font-vn pl-13">Tổng quan hệ thống Echo Cards</p>
        </div>

        {currentUser && (
          <div className="flex items-center gap-3">
            <PromoCodeButton userId={currentUser.id} onBalanceUpdate={() => window.location.reload()} />
          </div>
        )}
      </div>

      {/* Decorative Divider */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <Feather className="w-4 h-4 text-gold/40" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change.startsWith('+');
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream-light rounded-2xl p-6 border border-gold/20 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgLight} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                {isPositive && stat.change !== '+0%' && (
                  <span className="flex items-center text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    {stat.change}
                    <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-display font-bold text-ink mb-1">
                {stat.value.toLocaleString()}
              </h3>
              <p className="text-ink/60 text-sm font-vn">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cream-light rounded-2xl p-6 border border-gold/20 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileHeart className="w-5 h-5 text-burgundy" />
            <h2 className="text-lg font-display font-bold text-ink">Thiệp mới tạo</h2>
          </div>
          <div className="space-y-3">
            {stats.recentCards.length > 0 ? (
              stats.recentCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-cream rounded-xl border border-gold/10"
                >
                  <div>
                    <p className="font-vn font-medium text-ink">Gửi: {card.recipient_name}</p>
                    <p className="text-sm text-ink/60 font-vn">Từ: {card.sender_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-ink/60 font-vn">
                      {new Date(card.created_at).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-xs text-ink/40 flex items-center justify-end gap-1">
                      <Eye className="w-3 h-3" />
                      {card.view_count || 0}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileHeart className="w-12 h-12 text-ink/20 mx-auto mb-2" />
                <p className="text-ink/50 font-vn">Chưa có thiệp nào</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cream-light rounded-2xl p-6 border border-gold/20 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-burgundy" />
            <h2 className="text-lg font-display font-bold text-ink">Người dùng mới</h2>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((u, index) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-cream rounded-xl border border-gold/10"
                >
                  <img
                    src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=8b2346&color=fff`}
                    alt={u.name}
                    className="w-10 h-10 rounded-full ring-2 ring-gold/20"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-vn font-medium text-ink truncate">{u.name}</p>
                    <p className="text-sm text-ink/60 truncate">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-burgundy flex items-center gap-1">
                      <Heart className="w-3 h-3" fill="currentColor" />
                      {u.points}
                    </p>
                    <p className="text-xs text-ink/40 uppercase font-medium">{u.provider || 'email'}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-ink/20 mx-auto mb-2" />
                <p className="text-ink/50 font-vn">Chưa có người dùng nào</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
