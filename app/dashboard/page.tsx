// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Plus, Clock, Eye, Send, 
  LogOut, Settings, Copy, ExternalLink, 
  Search, Calendar, Trash2, MoreVertical,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

// 👇 FIX LỖI IMPORT Ở ĐÂY
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

// Components
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Header from '@/components/layout/Header'; // Dùng Header chung

// Types
interface Card {
  id: string;
  recipient_name: string;
  message: string;
  view_count: number;
  created_at: string;
  status: 'draft' | 'sent' | 'viewed';
  envelope_color?: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchCards = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCards(data || []);
      } catch (error) {
        console.error('Error fetching cards:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchCards();
    } else if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Xử lý copy link
  const handleCopyLink = (cardId: string) => {
    const link = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Lọc thiệp theo tìm kiếm
  const filteredCards = cards.filter(card => 
    card.recipient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán thống kê
  const stats = [
    { 
      label: 'Tổng thiệp đã tạo', 
      value: cards.length, 
      icon: Send, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      label: 'Lượt xem', 
      value: cards.reduce((acc, curr) => acc + (curr.view_count || 0), 0), 
      icon: Eye, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
    { 
      label: 'Số Tym hiện có', 
      value: user?.points || 0, 
      icon: Heart, 
      color: 'text-rose-500', 
      bg: 'bg-rose-50' 
    },
  ];

  if (authLoading || loading) return <Loading />;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 1. Sử dụng Header chung của Echo */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8 text-rose-500" />
              Tổng quan
            </h1>
            <p className="text-gray-500 mt-1">Chào mừng <span className="font-semibold text-gray-900">{user.name}</span> quay trở lại!</p>
          </div>
          <Link href="/create">
            <Button icon={<Plus className="w-5 h-5" />} className="shadow-lg shadow-rose-200">
              Tạo Thiệp Mới
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-t-3xl border-b border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mt-4">
          <h2 className="text-xl font-bold text-gray-900">Danh sách thiệp</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm theo tên người nhận..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Cards List */}
        <div className="bg-white rounded-b-3xl shadow-sm min-h-[400px]">
          {filteredCards.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold">Người nhận</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold text-center">Lượt xem</th>
                    <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                    <th className="px-6 py-4 font-semibold text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredCards.map((card) => (
                    <motion.tr 
                      key={card.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-rose-50/30 transition-colors"
                    >
                      {/* Cột 1: Người nhận & Message preview */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center text-rose-500">
                             <Heart className="w-5 h-5" fill="currentColor" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{card.recipient_name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                              {card.message || "Gửi lời yêu thương..."}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Trạng thái */}
                      <td className="px-6 py-4">
                        <span className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                          ${card.view_count > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                          }
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full ${card.view_count > 0 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          {card.view_count > 0 ? 'Đã xem' : 'Đã gửi'}
                        </span>
                      </td>

                      {/* Cột 3: Lượt xem */}
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 font-medium">
                          <Eye className="w-3.5 h-3.5" />
                          {card.view_count}
                        </div>
                      </td>

                      {/* Cột 4: Ngày tạo */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(card.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </td>

                      {/* Cột 5: Hành động */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Nút Copy Link */}
                          <button 
                            onClick={() => handleCopyLink(card.id)}
                            className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all relative group/btn"
                            title="Sao chép liên kết"
                          >
                            {copiedId === card.id ? (
                              <Sparkles className="w-4 h-4 text-amber-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                            {copiedId === card.id && (
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                Đã copy!
                              </span>
                            )}
                          </button>

                          {/* Nút Xem Card */}
                          <Link 
                            href={`/card/${card.id}`}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                            title="Xem thiệp"
                            target="_blank"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          
                          {/* Nút Xóa (Demo UI) */}
                          <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <Heart className="w-10 h-10 text-rose-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có thiệp nào</h3>
              <p className="text-gray-500 max-w-md mb-8">
                Bạn chưa tạo tấm thiệp nào cả. Hãy bắt đầu gửi yêu thương ngay hôm nay nhé!
              </p>
              <Link href="/create">
                <Button size="lg" icon={<Sparkles className="w-5 h-5" />}>
                  Tạo thiệp đầu tiên
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Decorative footer text */}
      <div className="text-center mt-12 pb-8">
        <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
          <span>Được làm với</span>
          <Heart className="w-3 h-3 text-rose-400 fill-current" />
          <span>bởi Echo Team</span>
        </p>
      </div>
    </div>
  );
}