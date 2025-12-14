// app/dashboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Plus, Mail, Eye, Clock, Heart, Gift, 
  LogOut, Settings, Copy, ExternalLink
} from 'lucide-react';
import { useAuth } from '../providers';
import { db } from '@/lib/supabase';
import { formatDate, generateShareLink, copyToClipboard, formatPoints } from '@/lib/utils';
import { Card } from '@/types';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';

export default function DashboardPage() {
  const { user, loading: authLoading, signOut, refreshUser } = useAuth();
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoModal, setPromoModal] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadCards();
    }
  }, [user]);

  const loadCards = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await db.getUserCards(user.id);
    if (data) setCards(data);
    setLoading(false);
  };

  const handleCopyLink = async (cardId: string) => {
    const link = generateShareLink(cardId);
    const success = await copyToClipboard(link);
    if (success) {
      setCopied(cardId);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  const handleRedeemCode = async () => {
    if (!promoCode.trim() || !user) return;
    
    setPromoLoading(true);
    const { valid, data, error } = await db.validatePromoCode(promoCode.trim().toUpperCase());
    
    if (!valid) {
      alert(error || 'Mã không hợp lệ');
      setPromoLoading(false);
      return;
    }

    if (data) {
      await db.usePromoCode(data.id, user.id);
      await refreshUser();
      alert(`Thành công! Bạn nhận được ${data.points} điểm`);
      setPromoCode('');
      setPromoModal(false);
    }
    
    setPromoLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading || !user) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-rose-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Heart className="w-7 h-7 text-rose-500" fill="currentColor" />
              <span className="font-playfair text-xl font-bold text-gray-800">Vintage E-Card</span>
            </Link>

            {/* User Info */}
            <div className="flex items-center gap-4">
              {/* Points */}
              <button 
                onClick={() => setPromoModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full hover:from-amber-200 hover:to-yellow-200 transition"
              >
                <Gift className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-700">{formatPoints(user.points)}</span>
                <span className="text-amber-600 text-sm">điểm</span>
              </button>

              {/* Avatar dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border-2 border-rose-200" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Dropdown */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b">
                    <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    {user.role === 'admin' && (
                      <Link href="/admin" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-rose-50 rounded-lg transition">
                        <Settings className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Xin chào, <span className="gradient-text">{user.name}</span>! 👋
          </h1>
          <p className="text-gray-600">Quản lý và tạo thiệp yêu thương của bạn</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Mail, label: 'Tổng thiệp', value: cards.length, color: 'text-rose-500', bg: 'bg-rose-100' },
            { icon: Eye, label: 'Lượt xem', value: cards.reduce((sum, c) => sum + (c.view_count || 0), 0), color: 'text-purple-500', bg: 'bg-purple-100' },
            { icon: Clock, label: 'Đã gửi', value: cards.filter(c => c.status === 'sent' || c.status === 'viewed').length, color: 'text-blue-500', bg: 'bg-blue-100' },
            { icon: Gift, label: 'Điểm hiện có', value: user.points, color: 'text-amber-500', bg: 'bg-amber-100' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Create Card CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tạo thiệp mới ngay!</h2>
              <p className="text-white/80">Gửi yêu thương đến người bạn quan tâm</p>
            </div>
            <Link href="/create">
              <Button 
                className="bg-white text-rose-500 hover:bg-gray-100 shadow-lg"
                size="lg"
                icon={<Plus className="w-5 h-5" />}
              >
                Tạo Thiệp Mới
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Cards List */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Thiệp của bạn</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
            </div>
          ) : cards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200"
            >
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Chưa có thiệp nào</h3>
              <p className="text-gray-400 mb-6">Bắt đầu tạo thiệp đầu tiên của bạn!</p>
              <Link href="/create">
                <Button icon={<Plus className="w-4 h-4" />}>
                  Tạo Thiệp
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Card Preview */}
                  <div className="h-40 bg-gradient-to-br from-rose-100 to-pink-100 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-16 bg-gradient-to-br from-rose-400 to-rose-500 rounded shadow-lg transform group-hover:scale-110 transition-transform" />
                    </div>
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        card.status === 'viewed' ? 'bg-green-100 text-green-700' :
                        card.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {card.status === 'viewed' ? 'Đã xem' :
                         card.status === 'sent' ? 'Đã gửi' : 'Nháp'}
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 truncate">
                      Gửi: {card.recipient_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {formatDate(card.created_at)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {card.view_count || 0} lượt xem
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleCopyLink(card.id)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition text-sm font-medium"
                      >
                        {copied === card.id ? (
                          <>✓ Đã copy</>
                        ) : (
                          <><Copy className="w-4 h-4" /> Copy Link</>
                        )}
                      </button>
                      <Link
                        href={`/card/${card.id}`}
                        target="_blank"
                        className="flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Promo Code Modal */}
      <Modal isOpen={promoModal} onClose={() => setPromoModal(false)} title="Nhập mã khuyến mãi">
        <div className="space-y-4">
          <p className="text-gray-600">
            Nhập mã để nhận thêm điểm sử dụng các tính năng premium!
          </p>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="VD: WELCOME100"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 text-center text-lg font-mono uppercase"
          />
          <Button
            onClick={handleRedeemCode}
            loading={promoLoading}
            disabled={!promoCode.trim()}
            className="w-full"
          >
            Đổi Mã
          </Button>
        </div>
      </Modal>
    </main>
  );
}