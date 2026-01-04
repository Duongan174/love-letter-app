// app/dashboard/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Plus, Clock, Eye, Send, 
  Copy, ExternalLink, Search, Calendar, 
  Trash2, Sparkles, LayoutDashboard, 
  Feather, Crown, Mail, ChevronRight,
  BarChart3, FileText, Settings, Menu, X, User,
  Gift, Bell, AlertCircle, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Header from '@/components/layout/Header';
import PiggyBank from '@/components/ui/PiggyBank';
import Breadcrumb from '@/components/dashboard/Breadcrumb';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { useDarkMode } from '@/hooks/useDarkMode';
import PromoCodeModal from '@/components/ui/PromoCodeModal';

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

type DashboardTab = 'overview' | 'drafts' | 'cards' | 'stats' | 'settings' | 'promo';

interface MenuItem {
  id: DashboardTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
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
function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // ✅ State cho drafts
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  
  // ✅ State cho events (Sổ nợ cảm xúc)
  const [events, setEvents] = useState<Array<{
    id: string;
    card_id: string;
    event_type: 'received' | 'sent';
    sender_name: string;
    recipient_name: string;
    event_date: string;
    gift_sent: boolean;
    card: {
      id: string;
      content: string;
      created_at: string;
    };
  }>>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventFilter, setEventFilter] = useState<'all' | 'received' | 'sent'>('all');
  
  // ✅ Active tab state - check URL params
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  
  // ✅ Sync tab with URL params
  useEffect(() => {
    const tab = searchParams?.get('tab');
    if (tab && ['overview', 'drafts', 'cards', 'stats', 'settings'].includes(tab)) {
      setActiveTab(tab as DashboardTab);
    }
  }, [searchParams]);
  
  // ✅ Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // ✅ Dark mode
  const { isDark, toggleDarkMode } = useDarkMode();
  
  // ✅ Promo code modal state
  const [showPromoModal, setShowPromoModal] = useState(false);
  
  // ✅ Delete draft confirmation modal state
  const [deleteDraftId, setDeleteDraftId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // ✅ Fetch drafts
  useEffect(() => {
    const fetchDrafts = async () => {
      if (!user) return;
      
      try {
        const res = await fetch('/api/card-drafts');
        const json = await res.json();
        if (res.ok && json.data) {
          setDrafts(json.data);
        }
      } catch (error) {
        console.error('Error fetching drafts:', error);
      } finally {
        setLoadingDrafts(false);
      }
    };

    if (!authLoading && user) {
      fetchDrafts();
    }
  }, [user, authLoading]);
  
  // ✅ Load events (Sổ nợ cảm xúc)
  useEffect(() => {
    if (!user) return;
    
    const loadEvents = async () => {
      setLoadingEvents(true);
      try {
        // Load received cards
        const { data: receivedCards } = await supabase
          .from('cards')
          .select('*, sender:users!cards_user_id_fkey(name)')
          .eq('recipient_email', user.email)
          .order('created_at', { ascending: false });

        // Load sent cards
        const { data: sentCards } = await supabase
          .from('cards')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Transform to event records
        const receivedEvents = (receivedCards || []).map((card: any) => ({
          id: `received-${card.id}`,
          card_id: card.id,
          event_type: 'received' as const,
          sender_name: (card.sender as any)?.name || card.sender_name || 'Người gửi',
          recipient_name: card.recipient_name || user.name || '',
          event_date: card.created_at,
          gift_sent: false,
          card: {
            id: card.id,
            content: card.content || '',
            created_at: card.created_at,
          },
        }));

        const sentEvents = (sentCards || []).map((card: any) => ({
          id: `sent-${card.id}`,
          card_id: card.id,
          event_type: 'sent' as const,
          sender_name: user.name || '',
          recipient_name: card.recipient_name || 'Người nhận',
          event_date: card.created_at,
          gift_sent: false,
          card: {
            id: card.id,
            content: card.content || '',
            created_at: card.created_at,
          },
        }));

        let allEvents = [...receivedEvents, ...sentEvents];
        
        // Filter
        if (eventFilter === 'received') {
          allEvents = receivedEvents;
        } else if (eventFilter === 'sent') {
          allEvents = sentEvents;
        }

        // Sort by date
        allEvents.sort((a, b) => 
          new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
        );

        setEvents(allEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };
    
    if (!authLoading && user) {
      loadEvents();
    }
  }, [user, authLoading, eventFilter]);

  // ─────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleCopyLink = (cardId: string) => {
    const link = `${window.location.origin}/card/${cardId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(cardId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ✅ Handler để tiếp tục chỉnh sửa draft
  const handleContinueDraft = (draftId: string) => {
    router.push(`/create?draftId=${draftId}`);
  };
  
  // ✅ Handler để xóa draft
  const handleDeleteDraft = async (draftId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/card-drafts/${draftId}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể xóa nháp');
      }
      
      // Cập nhật state - xóa draft khỏi danh sách
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      setDeleteDraftId(null);
    } catch (error: any) {
      console.error('Error deleting draft:', error);
      alert(error.message || 'Có lỗi xảy ra khi xóa nháp');
    } finally {
      setIsDeleting(false);
    }
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

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + 1-5 để chuyển tab
      if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const tabIndex = parseInt(e.key) - 1;
        const tabs: DashboardTab[] = ['overview', 'drafts', 'cards', 'stats', 'settings'];
        if (tabs[tabIndex]) {
          setActiveTab(tabs[tabIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ✅ Menu items cho sidebar
  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      label: 'Tổng quan',
      icon: LayoutDashboard,
    },
    {
      id: 'drafts',
      label: 'Nháp',
      icon: FileText,
      badge: drafts.length,
    },
    {
      id: 'cards',
      label: 'Thiệp đã tạo',
      icon: Mail,
      badge: cards.length,
    },
    {
      id: 'stats',
      label: 'Thống kê',
      icon: BarChart3,
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
    },
    {
      id: 'promo',
      label: 'Nhập Giftcode',
      icon: Gift,
    },
  ];

  // ✅ Breadcrumb items
  const getBreadcrumbItems = (): Array<{ label: string; href?: string }> => {
    const base = [{ label: 'Dashboard', href: '/dashboard' }];
    
    switch (activeTab) {
      case 'overview':
        return base;
      case 'drafts':
        return [...base, { label: 'Nháp' }];
      case 'cards':
        return [...base, { label: 'Thiệp đã tạo' }];
      case 'stats':
        return [...base, { label: 'Thống kê' }];
      case 'settings':
        return [...base, { label: 'Cài đặt' }];
      default:
        return base;
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
    <div className="min-h-screen bg-cream dark:bg-ink">
      <Header />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex pt-16 h-[calc(100vh-4rem)]">
        {/* ═══════════════════════════════════════════════════════════════════
            MOBILE SIDEBAR OVERLAY
        ════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════
            SIDEBAR NAVIGATION
        ════════════════════════════════════════════════════════════════════ */}
        <aside
          className={`
            fixed md:static left-0 top-16 w-64 bg-cream-light dark:bg-ink/70 border-r border-gold/20 dark:border-gold/30 z-50 md:z-40 overflow-y-auto h-[calc(100vh-4rem)] flex-shrink-0
            transition-transform duration-300 ease-in-out
            ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <div className="p-6">
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden absolute top-4 right-4 p-2 text-ink/60 dark:text-cream-light/60 hover:text-ink dark:hover:text-cream-light hover:bg-cream-dark dark:hover:bg-ink/80 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                // Handle promo code separately - open modal instead of switching tab
                if (item.id === 'promo') {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setShowPromoModal(true);
                        setIsMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-ink/70 dark:text-cream-light/70 hover:bg-burgundy-50 dark:hover:bg-burgundy/20 hover:text-burgundy dark:hover:text-gold transition-all duration-200 group"
                    >
                      <Icon className="w-5 h-5 text-ink/60 dark:text-cream-light/60 group-hover:text-burgundy dark:group-hover:text-gold" />
                      <span className="font-display font-medium">{item.label}</span>
                    </button>
                  );
                }
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileSidebarOpen(false); // Close sidebar on mobile when selecting
                      // Update URL without reload
                      const url = new URL(window.location.href);
                      url.searchParams.set('tab', item.id);
                      window.history.pushState({}, '', url.toString());
                    }}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl
                      transition-all duration-200 group
                      ${isActive
                        ? 'bg-burgundy dark:bg-burgundy-600 text-cream-light shadow-md'
                        : 'text-ink/70 dark:text-cream-light/70 hover:bg-burgundy-50 dark:hover:bg-burgundy/20 hover:text-burgundy dark:hover:text-gold'
                      }
                    `}
                    title={`${item.label} (Ctrl+${menuItems.indexOf(item) + 1})`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-ink/60 dark:text-cream-light/60 group-hover:text-burgundy dark:group-hover:text-gold'}`} />
                      <span className="font-display font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`
                        px-2 py-0.5 rounded-full text-xs font-semibold
                        ${isActive
                          ? 'bg-gold/20 dark:bg-gold/30 text-gold'
                          : 'bg-burgundy/10 dark:bg-burgundy/20 text-burgundy dark:text-gold'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════════
            MAIN CONTENT AREA
        ════════════════════════════════════════════════════════════════════ */}
        <main className="flex-1 overflow-y-auto h-[calc(100vh-4rem)] min-w-0">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden fixed top-20 left-4 z-30 p-2 bg-cream-light dark:bg-ink/90 border border-gold/20 dark:border-gold/30 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <Menu className="w-5 h-5 text-ink dark:text-cream-light" />
          </button>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumb items={getBreadcrumbItems()} />
            
            <AnimatePresence mode="wait">
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Welcome Section */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-burgundy flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-cream-light">
                          Tổng quan
                        </h1>
                        <p className="font-body text-ink/60 dark:text-cream-light/60">
                          Chào mừng <span className="font-semibold text-burgundy dark:text-gold">{user.name}</span> quay trở lại!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Piggy Bank Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                  >
                    <div className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-soft shadow-vintage p-8">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="font-display text-2xl font-bold text-ink dark:text-cream-light mb-2">
                            💰 Con heo đất của bạn
                          </h2>
                          <p className="font-body text-ink/60 dark:text-cream-light/60 mb-4">
                            Bạn đang có <span className="font-semibold text-burgundy dark:text-gold">{user.points || 0} Tym</span> trong con heo đất.
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

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className={`
                          relative p-6 bg-cream-light border ${stat.border} rounded-soft
                          shadow-vintage hover:shadow-elevated transition-all duration-300
                          overflow-hidden group
                        `}
                      >
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

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {drafts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-6 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setActiveTab('drafts')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display text-lg font-semibold text-ink dark:text-cream-light mb-1">
                              Nháp chưa hoàn thành
                            </h3>
                            <p className="text-sm text-ink/60 dark:text-cream-light/60">
                              Bạn có {drafts.length} nháp đang chờ chỉnh sửa
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 rounded-full text-sm font-semibold">
                              {drafts.length}
                            </span>
                            <ChevronRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {cards.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-forest/5 dark:bg-forest/20 border border-forest/20 dark:border-forest/40 rounded-xl p-6 cursor-pointer hover:shadow-md transition-all"
                        onClick={() => setActiveTab('cards')}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display text-lg font-semibold text-ink dark:text-cream-light mb-1">
                              Thiệp đã tạo
                            </h3>
                            <p className="text-sm text-ink/60 dark:text-cream-light/60">
                              Xem tất cả {cards.length} thiệp của bạn
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-forest/20 dark:bg-forest/40 text-forest dark:text-forest-light rounded-full text-sm font-semibold">
                              {cards.length}
                            </span>
                            <ChevronRight className="w-5 h-5 text-forest dark:text-forest-light" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Sổ nợ cảm xúc */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-soft shadow-vintage overflow-hidden mb-8"
                  >
                    <div className="p-6 border-b border-gold/20 dark:border-gold/30">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-burgundy dark:text-gold" />
                          <h2 className="font-display text-xl font-semibold text-ink dark:text-cream-light">
                            Sổ nợ cảm xúc
                          </h2>
                        </div>
                        {/* Filter Tabs */}
                        <div className="flex gap-2">
                          {(['all', 'received', 'sent'] as const).map((f) => (
                            <button
                              key={f}
                              onClick={() => setEventFilter(f)}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                                eventFilter === f
                                  ? 'bg-burgundy dark:bg-gold text-cream-light dark:text-ink shadow-md'
                                  : 'bg-cream-dark dark:bg-ink/70 text-ink/60 dark:text-cream-light/60 hover:bg-cream dark:hover:bg-ink/80'
                              }`}
                            >
                              {f === 'all' && 'Tất cả'}
                              {f === 'received' && 'Đã nhận'}
                              {f === 'sent' && 'Đã gửi'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {loadingEvents ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy dark:border-gold"></div>
                        </div>
                      ) : events.length === 0 ? (
                        <div className="text-center py-8 text-ink/60 dark:text-cream-light/60">
                          <Mail className="w-12 h-12 mx-auto mb-3 text-ink/30 dark:text-cream-light/30" />
                          <p className="text-sm">Chưa có thiệp nào</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {events.slice(0, 5).map((event) => {
                            const days = Math.floor((Date.now() - new Date(event.event_date).getTime()) / (1000 * 60 * 60 * 24));
                            const reminder = event.event_type === 'received' && days >= 30 
                              ? (days >= 365 
                                  ? `Đã ${Math.floor(days / 365)} năm kể từ khi nhận thiệp. Có thể gửi lại một món quà nhỏ!`
                                  : `Đã ${Math.floor(days / 30)} tháng. Nhớ gửi lại quà nhé!`)
                              : null;
                            
                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start justify-between p-4 bg-cream-dark dark:bg-ink/70 rounded-lg hover:shadow-md transition-all"
                              >
                                <div className="flex-1 flex items-start gap-3">
                                  {event.event_type === 'received' ? (
                                    <div className="w-10 h-10 rounded-full bg-forest/20 dark:bg-forest/40 flex items-center justify-center flex-shrink-0">
                                      <Heart className="w-5 h-5 text-forest dark:text-forest-light" />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-burgundy/20 dark:bg-burgundy/40 flex items-center justify-center flex-shrink-0">
                                      <Send className="w-5 h-5 text-burgundy dark:text-gold" />
                                    </div>
                                  )}
                                  
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-ink dark:text-cream-light mb-1">
                                      {event.event_type === 'received' 
                                        ? `Nhận từ ${event.sender_name}`
                                        : `Gửi cho ${event.recipient_name}`
                                      }
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-ink/60 dark:text-cream-light/60 mb-2">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {new Date(event.event_date).toLocaleDateString('vi-VN')}
                                        {' • '}
                                        {days === 0 ? 'Hôm nay' : `${days} ngày trước`}
                                      </span>
                                    </div>
                                    
                                    {reminder && !event.gift_sent && (
                                      <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded text-xs text-amber-800 dark:text-amber-200">
                                        {reminder}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <Link
                                  href={`/card/${event.card_id}`}
                                  className="ml-4 px-3 py-2 bg-burgundy/10 dark:bg-gold/20 hover:bg-burgundy/20 dark:hover:bg-gold/30 text-burgundy dark:text-gold rounded-lg transition flex items-center gap-2 text-sm font-medium flex-shrink-0"
                                >
                                  <span>Xem</span>
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              </motion.div>
                            );
                          })}
                          
                          {events.length > 5 && (
                            <div className="text-center pt-2">
                              <button
                                onClick={() => setActiveTab('cards')}
                                className="text-sm text-burgundy dark:text-gold hover:underline font-medium"
                              >
                                Xem tất cả {events.length} thiệp →
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Recent Activity Feed */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-soft shadow-vintage overflow-hidden"
                  >
                    <div className="p-6 border-b border-gold/20 dark:border-gold/30">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-burgundy dark:text-gold" />
                        <h2 className="font-display text-xl font-semibold text-ink dark:text-cream-light">
                          Hoạt động gần đây
                        </h2>
                      </div>
                    </div>
                    <div className="p-6">
                      <RecentActivity cards={cards} drafts={drafts} limit={10} />
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* TAB: DRAFTS */}
              {activeTab === 'drafts' && (
                <motion.div
                  key="drafts"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h1 className="font-display text-3xl font-bold text-ink mb-2">
                      Nháp chưa hoàn thành
                    </h1>
                    <p className="text-ink/60">
                      Tiếp tục chỉnh sửa các thiệp đang làm dở
                    </p>
                  </div>

                  {loadingDrafts ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                    </div>
                  ) : drafts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {drafts.map((draft, index) => (
                        <motion.div
                          key={draft.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-xl border border-amber-200/50 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
                          onClick={() => handleContinueDraft(draft.id)}
                        >
                          {/* Delete Button - Góc trên bên phải */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Ngăn click event bubble lên parent
                              setDeleteDraftId(draft.id);
                            }}
                            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 transition-colors z-10 opacity-0 group-hover:opacity-100"
                            title="Xóa nháp"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-start gap-3">
                            {draft.card_templates?.thumbnail ? (
                              <img
                                src={draft.card_templates.thumbnail}
                                alt={draft.card_templates.name || 'Template'}
                                className="w-16 h-16 rounded-lg object-cover border border-amber-200/30 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-amber-100 border border-amber-200/30 flex items-center justify-center flex-shrink-0">
                                <Feather className="w-8 h-8 text-amber-600" />
                              </div>
                            )}
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-ink truncate mb-1">
                                {draft.card_templates?.name || 'Thiệp chưa đặt tên'}
                              </h3>
                              <p className="text-sm text-ink/60 truncate">
                                {draft.recipient_name ? `Gửi cho: ${draft.recipient_name}` : 'Chưa có người nhận'}
                              </p>
                              <p className="text-xs text-ink/40 mt-2">
                                Cập nhật: {new Date(draft.updated_at || draft.created_at).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex items-center justify-between pt-3 border-t border-amber-100">
                            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                              Nháp
                            </span>
                            <div className="flex items-center gap-1 text-sm text-amber-600 group-hover:text-amber-700 font-medium transition-colors">
                              <span>Tiếp tục</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-24 h-24 rounded-full bg-amber-100 border-2 border-amber-200 flex items-center justify-center mb-6">
                        <FileText className="w-12 h-12 text-amber-600" />
                      </div>
                      <h3 className="font-display text-2xl font-semibold text-ink mb-3">
                        Chưa có nháp nào
                      </h3>
                      <p className="text-ink/60 max-w-md mb-8">
                        Bạn chưa có nháp nào. Hãy bắt đầu tạo thiệp mới!
                      </p>
                      <Link href="/create">
                        <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
                          Tạo thiệp mới
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: CARDS */}
              {activeTab === 'cards' && (
                <motion.div
                  key="cards"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h1 className="font-display text-3xl font-bold text-ink mb-2">
                          Thiệp đã tạo
                        </h1>
                        <p className="text-ink/60">
                          Quản lý và xem tất cả thiệp của bạn
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cream-light border border-gold/20 rounded-soft shadow-vintage overflow-hidden">
                    {/* Search */}
                    <div className="p-6 border-b border-gold/20">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                        <input 
                          type="text" 
                          placeholder="Tìm theo tên người nhận..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="input-vintage pl-10 py-3 w-full"
                        />
                      </div>
                    </div>

                    {/* Cards Table */}
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
                                    
                                    <td className="px-6 py-4 hidden md:table-cell">
                                      <div className="flex items-center gap-2 text-ink/60 font-elegant">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(card.created_at).toLocaleDateString('vi-VN')}
                                      </div>
                                    </td>
                                    
                                    <td className="px-6 py-4 text-center">
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold/10 rounded-full">
                                        <Eye className="w-4 h-4 text-gold-600" />
                                        <span className="font-display font-semibold text-gold-600">
                                          {card.view_count || 0}
                                        </span>
                                      </div>
                                    </td>
                                    
                                    <td className="px-6 py-4 text-center">
                                      <span className={`
                                        inline-flex items-center px-3 py-1 rounded-full text-sm font-elegant border
                                        ${statusConfig.className}
                                      `}>
                                        {statusConfig.label}
                                      </span>
                                    </td>
                                    
                                    <td className="px-6 py-4">
                                      <div className="flex items-center justify-end gap-2">
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

                                        <Link 
                                          href={`/card/${card.id}`}
                                          className="p-2 text-ink/40 hover:text-forest hover:bg-forest/10 rounded-vintage transition-all"
                                          title="Xem thiệp"
                                          target="_blank"
                                        >
                                          <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        
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
                  </div>
                </motion.div>
              )}

              {/* TAB: STATS */}
              {activeTab === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h1 className="font-display text-3xl font-bold text-ink dark:text-cream-light mb-2">
                      Thống kê
                    </h1>
                    <p className="text-ink/60 dark:text-cream-light/60">
                      Xem chi tiết hoạt động của bạn
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`
                          relative p-6 bg-cream-light dark:bg-ink/50 border ${stat.border} dark:border-gold/30 rounded-soft
                          shadow-vintage hover:shadow-elevated transition-all duration-300
                          overflow-hidden group
                        `}
                      >
                        <div className="absolute top-2 right-2 text-gold/20 dark:text-gold/30 font-serif text-lg">✦</div>
                        
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-full ${stat.bg} dark:${stat.bg.replace('/10', '/20')} border ${stat.border} dark:border-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <stat.icon className={`w-7 h-7 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="font-elegant text-sm text-ink/60 dark:text-cream-light/60 mb-1">{stat.label}</p>
                            <p className="font-display text-3xl font-bold text-ink dark:text-cream-light">{stat.value}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6">
                    <h1 className="font-display text-3xl font-bold text-ink dark:text-cream-light mb-2">
                      Cài đặt
                    </h1>
                    <p className="text-ink/60 dark:text-cream-light/60">
                      Quản lý thông tin và tùy chọn của bạn
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Thông tin cá nhân */}
                    <div className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-soft shadow-vintage overflow-hidden">
                      <div className="p-6 border-b border-gold/20 dark:border-gold/30">
                        <h2 className="font-display text-xl font-semibold text-ink dark:text-cream-light flex items-center gap-2">
                          <User className="w-5 h-5 text-burgundy dark:text-gold" />
                          Thông tin cá nhân
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-ink dark:text-cream-light mb-2">
                            Tên hiển thị
                          </label>
                          <input
                            type="text"
                            defaultValue={user.name || ''}
                            className="w-full px-4 py-2 bg-white dark:bg-ink/30 border border-gold/20 dark:border-gold/30 rounded-xl text-ink dark:text-cream-light focus:outline-none focus:ring-2 focus:ring-burgundy/20 dark:focus:ring-gold/30 focus:border-burgundy/30 dark:focus:border-gold/40 transition-all"
                            placeholder="Nhập tên của bạn"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-ink dark:text-cream-light mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            defaultValue={user.email || ''}
                            disabled
                            className="w-full px-4 py-2 bg-cream-dark/50 dark:bg-ink/20 border border-gold/20 dark:border-gold/30 rounded-xl text-ink/60 dark:text-cream-light/60 cursor-not-allowed"
                          />
                          <p className="text-xs text-ink/40 dark:text-cream-light/40 mt-1">
                            Email không thể thay đổi
                          </p>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="primary" size="md">
                            Lưu thay đổi
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Cài đặt web */}
                    <div className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-soft shadow-vintage overflow-hidden">
                      <div className="p-6 border-b border-gold/20 dark:border-gold/30">
                        <h2 className="font-display text-xl font-semibold text-ink dark:text-cream-light flex items-center gap-2">
                          <Settings className="w-5 h-5 text-burgundy dark:text-gold" />
                          Cài đặt web
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display font-medium text-ink dark:text-cream-light mb-1">
                              Chế độ tối
                            </h3>
                            <p className="text-sm text-ink/60 dark:text-cream-light/60">
                              Chuyển đổi giữa chế độ sáng và tối
                            </p>
                          </div>
                          <button
                            onClick={toggleDarkMode}
                            className={`
                              w-14 h-8 rounded-full p-1 transition-colors
                              ${isDark ? 'bg-burgundy dark:bg-gold' : 'bg-ink/20 dark:bg-cream-light/20'}
                            `}
                          >
                            <motion.div
                              animate={{ x: isDark ? 24 : 0 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="w-6 h-6 bg-white rounded-full shadow-md"
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display font-medium text-ink dark:text-cream-light mb-1">
                              Thông báo email
                            </h3>
                            <p className="text-sm text-ink/60 dark:text-cream-light/60">
                              Nhận thông báo qua email
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5 text-burgundy dark:text-gold rounded focus:ring-2 focus:ring-burgundy/20 dark:focus:ring-gold/30"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-display font-medium text-ink dark:text-cream-light mb-1">
                              Tự động lưu nháp
                            </h3>
                            <p className="text-sm text-ink/60 dark:text-cream-light/60">
                              Tự động lưu thiệp khi chỉnh sửa
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-5 h-5 text-burgundy dark:text-gold rounded focus:ring-2 focus:ring-burgundy/20 dark:focus:ring-gold/30"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Thông tin tài khoản */}
                    <div className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-soft shadow-vintage overflow-hidden">
                      <div className="p-6 border-b border-gold/20 dark:border-gold/30">
                        <h2 className="font-display text-xl font-semibold text-ink dark:text-cream-light flex items-center gap-2">
                          <Crown className="w-5 h-5 text-burgundy dark:text-gold" />
                          Thông tin tài khoản
                        </h2>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-burgundy-50 dark:bg-burgundy/20 rounded-xl">
                          <div>
                            <p className="font-display font-medium text-ink dark:text-cream-light mb-1">
                              Số Tym hiện có
                            </p>
                            <p className="text-2xl font-bold text-burgundy dark:text-gold">
                              💜 {user.points || 0}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gold/10 dark:bg-gold/20 rounded-xl">
                          <div>
                            <p className="font-display font-medium text-ink dark:text-cream-light mb-1">
                              Vai trò
                            </p>
                            <p className="text-sm text-ink/60 dark:text-cream-light/60">
                              {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                            </p>
                          </div>
                          {user.role === 'admin' && (
                            <Crown className="w-5 h-5 text-gold" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Promo Code Modal */}
      <PromoCodeModal 
        isOpen={showPromoModal} 
        onClose={() => setShowPromoModal(false)}
      />
      
      {/* Delete Draft Confirmation Modal */}
      <AnimatePresence>
        {deleteDraftId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isDeleting && setDeleteDraftId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cream-light dark:bg-ink rounded-xl shadow-elevated p-6 max-w-md w-full border border-gold/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-ink dark:text-cream-light">
                    Xác nhận xóa nháp
                  </h3>
                  <p className="text-sm text-ink/60 dark:text-cream-light/60">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
              </div>
              
              <p className="text-ink dark:text-cream-light mb-6">
                Bạn có chắc chắn muốn xóa nháp này không? Tất cả dữ liệu sẽ bị mất vĩnh viễn.
              </p>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteDraftId(null)}
                  disabled={isDeleting}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteDraft(deleteDraftId)}
                  disabled={isDeleting}
                  className="flex-1"
                  icon={isDeleting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Trash2 className="w-4 h-4" />}
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa nháp'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrap với Suspense để dùng useSearchParams
export default function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent />
    </Suspense>
  );
}
