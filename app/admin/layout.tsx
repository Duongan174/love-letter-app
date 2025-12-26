// app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Image, Stamp, Music, 
  Gift, FileHeart, Settings, LogOut, Menu, X, Heart, Feather, Crown, Home, Sparkles, Frame
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ElegantSpinner } from '@/components/ui/Loading';

const menuItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: Users, label: 'Người dùng' },
  { href: '/admin/templates', icon: Image, label: 'Mẫu thiệp' },
  { href: '/admin/stamps', icon: Stamp, label: 'Tem' },
  { href: '/admin/music', icon: Music, label: 'Nhạc nền' },
  { href: '/admin/stickers', icon: Sparkles, label: 'Sticker' },
  { href: '/admin/photo-frames', icon: Frame, label: 'Khuôn ảnh' },
  { href: '/admin/promo-codes', icon: Gift, label: 'Mã khuyến mãi' },
  { href: '/admin/cards', icon: FileHeart, label: 'Thiệp đã tạo' },
  { href: '/admin/settings', icon: Settings, label: 'Cài đặt' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <ElegantSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-ink/60 font-elegant">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      {/* Mobile Header */}
      <div className="lg:hidden bg-cream-light/80 backdrop-blur-xl border-b border-gold/20 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-burgundy to-burgundy-dark rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-cream" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-ink">Echo Admin</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 hover:bg-gold/10 rounded-lg transition"
        >
          {sidebarOpen ? <X className="w-6 h-6 text-ink" /> : <Menu className="w-6 h-6 text-ink" />}
        </button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-cream-light border-r border-gold/20 shadow-vintage transform transition-transform lg:translate-x-0 lg:static lg:inset-auto shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-gold/20 hidden lg:block">
              <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-burgundy to-burgundy-dark rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-cream" fill="currentColor" />
                </div>
                <div>
                    <h1 className="font-display font-bold text-xl text-ink">Echo Admin</h1>
                    <p className="text-xs text-ink/50 font-elegant">Bảng điều khiển</p>
                  </div>
                </div>
                {/* Home button */}
                <Link
                  href="/"
                  className="p-2.5 bg-gold/10 hover:bg-gold/20 rounded-xl transition-all group"
                  title="Về trang chủ"
                >
                  <Home className="w-5 h-5 text-ink/60 group-hover:text-burgundy transition-colors" />
                </Link>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="px-6 py-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                <Feather className="w-3 h-3 text-gold/40" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/30 to-transparent" />
              </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-burgundy/10 text-burgundy font-medium border border-burgundy/20 shadow-sm'
                        : 'text-ink/70 hover:bg-gold/10 hover:text-ink'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-burgundy' : ''}`} />
                    <span className="font-vn">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="ml-auto w-1.5 h-1.5 rounded-full bg-burgundy"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Info */}
            <div className="p-4 border-t border-gold/20 bg-cream/50">
              <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-gold/5">
                <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center overflow-hidden ring-2 ring-gold/20">
                   {user.avatar ? (
                     <img src={user.avatar || undefined} alt={user.name || ''} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-burgundy font-bold">{user.name?.charAt(0) || 'U'}</span>
                   )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink truncate font-vn">{user.name}</p>
                  <p className="text-xs text-ink/50 truncate flex items-center gap-1">
                    <Crown className="w-3 h-3 text-gold" />
                    Quản trị viên
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2.5 text-burgundy hover:bg-burgundy/10 rounded-xl transition w-full border border-burgundy/20"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-vn font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        <AnimatePresence>
        {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-h-0 lg:p-8 p-4 overflow-x-hidden overflow-y-auto">
          {/* Background decorations */}
          <div className="fixed top-20 right-10 text-6xl text-gold/5 font-serif pointer-events-none select-none">❧</div>
          <div className="fixed bottom-20 left-10 text-6xl text-gold/5 font-serif pointer-events-none select-none rotate-180">❧</div>
          
          <div className="page">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
