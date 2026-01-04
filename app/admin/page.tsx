'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileHeart,
  Heart,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Feather,
  Crown,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  UserPlus,
  FileText,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PromoCodeButton from '@/components/ui/PromoCodeButton';
import { ElegantSpinner } from '@/components/ui/Loading';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalCards: number;
  totalViews: number;
  totalTym: number;
  totalDrafts: number;
  recentCards: any[];
  recentUsers: any[];
  // Analytics data
  usersGrowth: number;
  cardsGrowth: number;
  viewsGrowth: number;
  // Time series data
  usersByMonth: Array<{ month: string; count: number }>;
  cardsByMonth: Array<{ month: string; count: number }>;
  viewsByMonth: Array<{ month: string; views: number }>;
  // User activity
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  // Card statistics
  cardsToday: number;
  cardsThisWeek: number;
  cardsThisMonth: number;
  // Top users
  topUsers: Array<{ id: string; name: string; email: string; cards_count: number; views_count: number; points: number }>;
  // Card status distribution
  cardStatusDistribution: Array<{ status: string; count: number }>;
}

const COLORS = ['#722F37', '#C9A962', '#2D4A3E', '#8B5A2B', '#704214'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCards: 0,
    totalViews: 0,
    totalTym: 0,
    totalDrafts: 0,
    recentCards: [],
    recentUsers: [],
    usersGrowth: 0,
    cardsGrowth: 0,
    viewsGrowth: 0,
    usersByMonth: [],
    cardsByMonth: [],
    viewsByMonth: [],
    activeUsers: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
    cardsToday: 0,
    cardsThisWeek: 0,
    cardsThisMonth: 0,
    topUsers: [],
    cardStatusDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  /**
   * Tính toán growth percentage
   */
  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  /**
   * Lấy dữ liệu theo tháng
   */
  const getDataByMonth = (data: any[], dateField: string = 'created_at'): Array<{ month: string; count: number; views: number }> => {
    const monthMap = new Map<string, number>();
    const now = new Date();
    const months: Array<{ month: string; count: number; views: number }> = [];
    
    // Tạo 6 tháng gần nhất
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
      months.push({ month: monthKey, count: 0, views: 0 });
      monthMap.set(monthKey, months.length - 1);
    }

    data.forEach((item: any) => {
      const date = new Date(item[dateField]);
      const monthKey = date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' });
      const index = monthMap.get(monthKey);
      if (index !== undefined) {
        months[index].count += 1;
        if (item.view_count) {
          months[index].views += item.view_count || 0;
        }
      }
    });

    return months;
  };

  /**
   * Fetch comprehensive analytics data từ API endpoint
   * Sử dụng admin client để bypass RLS
   */
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: sessionRes, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) console.warn('admin getSession warn:', sessionErr);
      setCurrentUser(sessionRes.session?.user ?? null);

      // Gọi API endpoint để lấy analytics data (sử dụng admin client)
      const res = await fetch('/api/admin/analytics');
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Không thể tải dữ liệu analytics');
      }

      // Set stats từ API response
      setStats({
        totalUsers: result.totalUsers || 0,
        totalCards: result.totalCards || 0,
        totalViews: result.totalViews || 0,
        totalTym: result.totalTym || 0,
        totalDrafts: result.totalDrafts || 0,
        recentCards: result.recentCards || [],
        recentUsers: result.recentUsers || [],
        usersGrowth: result.usersGrowth || 0,
        cardsGrowth: result.cardsGrowth || 0,
        viewsGrowth: result.viewsGrowth || 0,
        usersByMonth: result.usersByMonth || [],
        cardsByMonth: result.cardsByMonth || [],
        viewsByMonth: result.viewsByMonth || [],
        activeUsers: result.activeUsers || 0,
        newUsersToday: result.newUsersToday || 0,
        newUsersThisWeek: result.newUsersThisWeek || 0,
        newUsersThisMonth: result.newUsersThisMonth || 0,
        cardsToday: result.cardsToday || 0,
        cardsThisWeek: result.cardsThisWeek || 0,
        cardsThisMonth: result.cardsThisMonth || 0,
        topUsers: result.topUsers || [],
        cardStatusDistribution: result.cardStatusDistribution || []
      });

      console.log('✅ Analytics data loaded:', {
        users: result.totalUsers,
        cards: result.totalCards,
        views: result.totalViews
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
      bgLight: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400',
      change: stats.usersGrowth,
      subtitle: `${stats.newUsersThisMonth} người dùng mới tháng này`
    },
    {
      label: 'Thiệp đã tạo',
      value: stats.totalCards,
      icon: FileHeart,
      gradient: 'from-burgundy to-burgundy-dark',
      bgLight: 'bg-burgundy/10 dark:bg-burgundy/20',
      textColor: 'text-burgundy dark:text-gold',
      change: stats.cardsGrowth,
      subtitle: `${stats.cardsThisMonth} thiệp tháng này`
    },
    {
      label: 'Lượt xem thiệp',
      value: stats.totalViews,
      icon: Eye,
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      change: stats.viewsGrowth,
      subtitle: `${stats.activeUsers} người dùng hoạt động`
    },
    {
      label: 'Tổng Tym',
      value: stats.totalTym,
      icon: Heart,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400',
      change: 0,
      subtitle: `${stats.totalDrafts} nháp đang chờ`
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
          <p className="text-ink/70 dark:text-cream-light/70 font-vn mb-3">{error}</p>
          <button
            type="button"
            onClick={() => fetchStats()}
            className="px-4 py-2 rounded-xl bg-burgundy dark:bg-gold text-cream-light dark:text-ink hover:bg-burgundy-dark dark:hover:bg-gold/80 transition font-vn"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-burgundy/10 dark:bg-burgundy/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-burgundy dark:text-gold" />
            </div>
            <h1 className="text-2xl font-display font-bold text-ink dark:text-cream-light">Dashboard Analytics</h1>
          </div>
          <p className="text-ink/60 dark:text-cream-light/60 font-vn pl-13">Phân tích dữ liệu khách hàng và hoạt động hệ thống</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl px-3 py-2">
            <Calendar className="w-4 h-4 text-ink/60 dark:text-cream-light/60" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="bg-transparent border-none outline-none text-sm text-ink dark:text-cream-light font-vn"
            >
              <option value="7d">7 ngày</option>
              <option value="30d">30 ngày</option>
              <option value="90d">90 ngày</option>
              <option value="all">Tất cả</option>
            </select>
          </div>

          {currentUser && (
            <PromoCodeButton userId={currentUser.id} onBalanceUpdate={() => window.location.reload()} />
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const isNegative = stat.change < 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgLight} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                {stat.change !== 0 && (
                  <span className={`flex items-center text-sm px-2 py-1 rounded-full ${
                    isPositive 
                      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20' 
                      : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                  }`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {Math.abs(stat.change).toFixed(1)}%
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-display font-bold text-ink dark:text-cream-light mb-1">
                {stat.value.toLocaleString('vi-VN')}
              </h3>
              <p className="text-ink/60 dark:text-cream-light/60 text-sm font-vn mb-1">{stat.label}</p>
              <p className="text-xs text-ink/40 dark:text-cream-light/40 font-vn">{stat.subtitle}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Users Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-burgundy dark:text-gold" />
              <h2 className="text-lg font-display font-bold text-ink dark:text-cream-light">Tăng trưởng người dùng</h2>
            </div>
            <UserPlus className="w-4 h-4 text-ink/40 dark:text-cream-light/40" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.usersByMonth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#722F37" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#722F37" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#C9A962" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                stroke="#6B5D4A"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B5D4A"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F5F0E8', 
                  border: '1px solid #C9A962',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#722F37" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cards Created Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileHeart className="w-5 h-5 text-burgundy dark:text-gold" />
              <h2 className="text-lg font-display font-bold text-ink dark:text-cream-light">Thiệp đã tạo</h2>
            </div>
            <FileText className="w-4 h-4 text-ink/40 dark:text-cream-light/40" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.cardsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C9A962" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                stroke="#6B5D4A"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B5D4A"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F5F0E8', 
                  border: '1px solid #C9A962',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#722F37" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Views Chart and Status Distribution */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Views Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-burgundy dark:text-gold" />
              <h2 className="text-lg font-display font-bold text-ink dark:text-cream-light">Lượt xem theo thời gian</h2>
            </div>
            <Eye className="w-4 h-4 text-ink/40 dark:text-cream-light/40" />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.viewsByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C9A962" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                stroke="#6B5D4A"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B5D4A"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#F5F0E8', 
                  border: '1px solid #C9A962',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="views" 
                stroke="#C9A962" 
                strokeWidth={2}
                dot={{ fill: '#722F37', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-burgundy dark:text-gold" />
              <h2 className="text-lg font-display font-bold text-ink dark:text-cream-light">Phân bố trạng thái</h2>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={stats.cardStatusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => {
                  const name = props.name || '';
                  const percent = props.percent || 0;
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.cardStatusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-burgundy dark:text-gold" />
            <h2 className="text-lg font-display font-bold text-ink dark:text-cream-light">Top người dùng</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-ink/10 dark:hover:bg-cream-light/10 rounded-lg transition">
              <Filter className="w-4 h-4 text-ink/60 dark:text-cream-light/60" />
            </button>
            <button className="p-2 hover:bg-ink/10 dark:hover:bg-cream-light/10 rounded-lg transition">
              <Download className="w-4 h-4 text-ink/60 dark:text-cream-light/60" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/20 dark:border-gold/30">
                <th className="text-left py-3 px-4 text-sm font-semibold text-ink/70 dark:text-cream-light/70 font-vn">#</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-ink/70 dark:text-cream-light/70 font-vn">Người dùng</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-ink/70 dark:text-cream-light/70 font-vn">Email</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-ink/70 dark:text-cream-light/70 font-vn">Số thiệp</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-ink/70 dark:text-cream-light/70 font-vn">Lượt xem</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-ink/70 dark:text-cream-light/70 font-vn">Tym</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10 dark:divide-gold/20">
              {stats.topUsers.length > 0 ? (
                stats.topUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="hover:bg-cream dark:hover:bg-ink/30 transition-colors"
                  >
                    <td className="py-4 px-4 text-ink/60 dark:text-cream-light/60 font-vn">{index + 1}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-burgundy/10 dark:bg-burgundy/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-burgundy dark:text-gold">
                            {user.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="font-medium text-ink dark:text-cream-light font-vn">{user.name || 'Không tên'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-ink/70 dark:text-cream-light/70 text-sm font-vn">{user.email}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-burgundy/10 dark:bg-burgundy/20 text-burgundy dark:text-gold text-sm font-medium">
                        <FileHeart className="w-3 h-3" />
                        {user.cards_count}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center text-ink/70 dark:text-cream-light/70 font-vn">{user.views_count.toLocaleString()}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-burgundy dark:text-gold font-medium">
                        <Heart className="w-3 h-3" fill="currentColor" />
                        {user.points.toLocaleString()}
                      </span>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ink/50 dark:text-cream-light/50 font-vn">
                    Chưa có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileHeart className="w-5 h-5 text-burgundy dark:text-gold" />
              <h2 className="text-lg font-display font-bold text-ink dark:text-cream-light">Thiệp mới tạo</h2>
            </div>
            <Link href="/admin/cards" className="text-sm text-burgundy dark:text-gold hover:underline font-vn">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentCards.length > 0 ? (
              stats.recentCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-cream dark:bg-ink/30 rounded-xl border border-gold/10 dark:border-gold/20"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-vn font-medium text-ink dark:text-cream-light truncate">
                      {card.recipient_name || 'Chưa có tên'}
                    </p>
                    <p className="text-sm text-ink/60 dark:text-cream-light/60 font-vn truncate">
                      Từ: {card.sender_name || 'Ẩn danh'}
                    </p>
                    <p className="text-xs text-ink/40 dark:text-cream-light/40 font-vn mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(card.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium text-ink dark:text-cream-light flex items-center justify-end gap-1">
                      <Eye className="w-3 h-3" />
                      {card.view_count || 0}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      card.status === 'sent' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                        : card.status === 'viewed'
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                        : 'bg-ink/10 dark:bg-cream-light/10 text-ink/60 dark:text-cream-light/60'
                    }`}>
                      {card.status === 'sent' ? 'Đã gửi' : card.status === 'viewed' ? 'Đã xem' : 'Nháp'}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileHeart className="w-12 h-12 text-ink/20 dark:text-cream-light/20 mx-auto mb-2" />
                <p className="text-ink/50 dark:text-cream-light/50 font-vn">Chưa có thiệp nào</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Users */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-cream-light dark:bg-ink/50 rounded-2xl p-6 border border-gold/20 dark:border-gold/30 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-burgundy dark:text-gold" />
              <h2 className="text-lg font-display font-bold text-ink dark:text-cream-light">Người dùng mới</h2>
            </div>
            <Link href="/admin/users" className="text-sm text-burgundy dark:text-gold hover:underline font-vn">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((u, index) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-cream dark:bg-ink/30 rounded-xl border border-gold/10 dark:border-gold/20"
                >
                  <div className="w-10 h-10 rounded-full bg-burgundy/10 dark:bg-burgundy/20 flex items-center justify-center overflow-hidden ring-2 ring-gold/20">
                    {u.avatar ? (
                      <img 
                        src={u.avatar} 
                        alt={u.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-burgundy dark:text-gold font-bold text-sm">
                        {u.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-vn font-medium text-ink dark:text-cream-light truncate">{u.name || 'Không tên'}</p>
                    <p className="text-sm text-ink/60 dark:text-cream-light/60 truncate font-vn">{u.email}</p>
                    <p className="text-xs text-ink/40 dark:text-cream-light/40 font-vn mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(u.created_at).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-burgundy dark:text-gold flex items-center gap-1 justify-end">
                      <Heart className="w-3 h-3" fill="currentColor" />
                      {u.points || 0}
                    </p>
                    <p className="text-xs text-ink/40 dark:text-cream-light/40 uppercase font-medium font-vn">
                      {u.provider || 'email'}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-ink/20 dark:text-cream-light/20 mx-auto mb-2" />
                <p className="text-ink/50 dark:text-cream-light/50 font-vn">Chưa có người dùng nào</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
