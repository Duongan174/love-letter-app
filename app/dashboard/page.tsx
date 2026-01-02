// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Plus, Clock, Eye, Send, 
  Copy, ExternalLink, Search, Calendar, 
  Trash2, Sparkles, LayoutDashboard, 
  Feather, Crown, Mail
} from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Header from '@/components/layout/Header';
import PiggyBank from '@/components/ui/PiggyBank';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface Card {
  id: string;
  recipient_name: string;
  message: string;
  view_count: number;
  created_at: string;
  status: 'draft' | 'sent' | 'viewed';
  envelope_color?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
const OrnamentDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    <Feather className="w-4 h-4 text-gold/60" />
    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/50 to-transparent" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // FETCH DATA
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCopyLink = (cardId: string) => {
    const link = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // COMPUTED VALUES
  // ─────────────────────────────────────────────────────────────────────────────
  const filteredCards = cards.filter(card => 
    card.recipient_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { 
      label: 'Tổng thiệp đã tạo', 
      value: cards.length, 
      icon: Send, 
      color: 'text-forest', 
      bg: 'bg-forest/10',
      border: 'border-forest/20'
    },
    { 
      label: 'Lượt xem', 
      value: cards.reduce((acc, curr) => acc + (curr.view_count || 0), 0), 
      icon: Eye, 
      color: 'text-gold-600', 
      bg: 'bg-gold/10',
      border: 'border-gold/20'
    },
    { 
      label: 'Số Tym hiện có', 
      value: user?.points || 0, 
      icon: Heart, 
      color: 'text-burgundy', 
      bg: 'bg-burgundy/10',
      border: 'border-burgundy/20'
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'viewed':
        return { 
          label: 'Đã xem', 
          className: 'bg-forest/10 text-forest border-forest/30' 
        };
      case 'sent':
        return { 
          label: 'Đã gửi', 
          className: 'bg-gold/10 text-gold-600 border-gold/30' 
        };
      default:
        return { 
          label: 'Nháp', 
          className: 'bg-ink/5 text-ink/60 border-ink/20' 
        };
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // LOADING & AUTH STATES
  // ─────────────────────────────────────────────────────────────────────────────
  if (authLoading || loading) return <Loading />;
  if (!user) return null;

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-cream pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ═══════════════════════════════════════════════════════════════════
            WELCOME SECTION
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-burgundy flex items-center justify-center">
                <LayoutDashboard className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-ink">
                  Tổng quan
                </h1>
                <p className="font-body text-ink/60">
                  Chào mừng <span className="font-semibold text-burgundy">{user.name}</span> quay trở lại!
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/create">
            <Button 
              variant="primary" 
              size="lg" 
              icon={<Plus className="w-5 h-5" />}
            >
              Tạo Thiệp Mới
            </Button>
          </Link>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            PIGGY BANK SECTION
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-cream-light border border-gold/20 rounded-soft shadow-vintage p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-display text-2xl font-bold text-ink mb-2">
                  💰 Con heo đất của bạn
                </h2>
                <p className="font-body text-ink/60 mb-4">
                  Bạn đang có <span className="font-semibold text-burgundy">{user.points || 0} Tym</span> trong con heo đất.
                  Sử dụng Tym để mở khóa các tính năng cao cấp và tạo thiệp đẹp hơn!
                </p>
                {user.points >= 1000 && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-elegant text-amber-800">
                      Bạn có hơn 1000 đồng xu! 🎉
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                <PiggyBank points={user.points || 0} size="lg" showLabel={false} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════════
            STATS GRID
        ════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-6 bg-cream-light border ${stat.border} rounded-soft
                shadow-vintage hover:shadow-elevated transition-all duration-300
                overflow-hidden group
              `}
            >
              {/* Decorative corner */}
              <div className="absolute top-2 right-2 text-gold/20 font-serif text-lg">✦</div>
              
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full ${stat.bg} border ${stat.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-elegant text-sm text-ink/60 mb-1">{stat.label}</p>
                  <p className="font-display text-3xl font-bold text-ink">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            CARDS LIST SECTION
        ════════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cream-light border border-gold/20 rounded-soft shadow-vintage overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gold/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-burgundy" />
                <h2 className="font-display text-xl font-semibold text-ink">
                  Danh sách thiệp
                </h2>
                <span className="px-2 py-0.5 bg-burgundy/10 text-burgundy text-sm rounded-full font-elegant">
                  {cards.length}
                </span>
              </div>
              
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                <input 
                  type="text" 
                  placeholder="Tìm theo tên người nhận..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-vintage pl-10 py-2"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {filteredCards.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gold/20 bg-cream/50">
                      <th className="px-6 py-4 text-left font-display text-sm font-medium text-ink/70 uppercase tracking-wider">
                        Người nhận
                      </th>
                      <th className="px-6 py-4 text-left font-display text-sm font-medium text-ink/70 uppercase tracking-wider hidden md:table-cell">
                        Ngày tạo
                      </th>
                      <th className="px-6 py-4 text-center font-display text-sm font-medium text-ink/70 uppercase tracking-wider">
                        Lượt xem
                      </th>
                      <th className="px-6 py-4 text-center font-display text-sm font-medium text-ink/70 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-right font-display text-sm font-medium text-ink/70 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {filteredCards.map((card, index) => {
                      const statusConfig = getStatusConfig(card.status);
                      return (
                        <motion.tr
                          key={card.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group hover:bg-burgundy-50/50 transition-colors"
                        >
                          {/* Recipient */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-gold/30"
                                style={{ backgroundColor: card.envelope_color || '#722F37' }}
                              >
                                <Heart className="w-4 h-4 text-gold" fill="currentColor" />
                              </div>
                              <div>
                                <p className="font-display font-medium text-ink">
                                  {card.recipient_name || 'Chưa đặt tên'}
                                </p>
                                <p className="font-body text-sm text-ink/50 truncate max-w-[200px]">
                                  {card.message || 'Chưa có lời nhắn'}
                                </p>
                              </div>
                            </div>
                          </td>
                          
                          {/* Date */}
                          <td className="px-6 py-4 hidden md:table-cell">
                            <div className="flex items-center gap-2 text-ink/60 font-elegant">
                              <Calendar className="w-4 h-4" />
                              {new Date(card.created_at).toLocaleDateString('vi-VN')}
                            </div>
                          </td>
                          
                          {/* Views */}
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 rounded-full">
                              <Eye className="w-4 h-4 text-gold-600" />
                              <span className="font-display font-semibold text-gold-600">
                                {card.view_count || 0}
                              </span>
                            </div>
                          </td>
                          
                          {/* Status */}
                          <td className="px-6 py-4 text-center">
                            <span className={`
                              inline-flex items-center px-3 py-1 rounded-full text-sm font-elegant border
                              ${statusConfig.className}
                            `}>
                              {statusConfig.label}
                            </span>
                          </td>
                          
                          {/* Actions */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              {/* Copy Link */}
                              <button
                                onClick={() => handleCopyLink(card.id)}
                                className={`
                                  relative p-2 rounded-vintage transition-all
                                  ${copiedId === card.id 
                                    ? 'bg-forest/10 text-forest' 
                                    : 'text-ink/40 hover:text-gold hover:bg-gold/10'
                                  }
                                `}
                                title="Copy link"
                              >
                                {copiedId === card.id ? (
                                  <Sparkles className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                                
                                {/* Tooltip */}
                                <AnimatePresence>
                                  {copiedId === card.id && (
                                    <motion.span
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 5 }}
                                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-ink text-cream-light text-xs rounded shadow-lg whitespace-nowrap"
                                    >
                                      Đã copy!
                                    </motion.span>
                                  )}
                                </AnimatePresence>
                              </button>

                              {/* View Card */}
                              <Link 
                                href={`/card/${card.id}`}
                                className="p-2 text-ink/40 hover:text-forest hover:bg-forest/10 rounded-vintage transition-all"
                                title="Xem thiệp"
                                target="_blank"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              
                              {/* Delete */}
                              <button 
                                className="p-2 text-ink/40 hover:text-red-600 hover:bg-red-50 rounded-vintage transition-all"
                                title="Xóa"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* ═══════════════════════════════════════════════════════════════
                  EMPTY STATE
              ════════════════════════════════════════════════════════════════ */
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 rounded-full bg-burgundy/10 border-2 border-burgundy/20 flex items-center justify-center mb-6"
                >
                  <Heart className="w-12 h-12 text-burgundy/50" />
                </motion.div>
                
                <h3 className="font-display text-2xl font-semibold text-ink mb-3">
                  Chưa có thiệp nào
                </h3>
                
                <OrnamentDivider className="max-w-[200px] mb-4" />
                
                <p className="font-body text-ink/60 max-w-md mb-8">
                  Bạn chưa tạo tấm thiệp nào cả. Hãy bắt đầu gửi yêu thương ngay hôm nay nhé!
                </p>
                
                <Link href="/create">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    icon={<Sparkles className="w-5 h-5" />}
                  >
                    Tạo thiệp đầu tiên
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="text-center mt-16 pb-8">
        <p className="font-elegant text-ink/40 text-sm flex items-center justify-center gap-2">
          <span>Được làm với</span>
          <Heart className="w-3 h-3 text-burgundy" fill="currentColor" />
          <span>bởi Echo Team</span>
        </p>
      </div>
    </div>
  );
}