// components/layout/Header.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, User, LogOut, Shield, 
  Gift, Menu, X, LayoutDashboard, Feather, Crown, Calendar
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth'; 
import Button from '@/components/ui/Button';
import PromoCodeModal from '@/components/ui/PromoCodeModal'; 

export default function Header() {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Mẫu thiệp', href: '/templates' },
    { name: 'Dịch vụ', href: '/services' },
  ];

  return (
    <>
      <header 
        className={`
          sticky top-0 z-50 transition-all duration-500
          ${isScrolled 
            ? 'bg-cream-light/95 backdrop-blur-lg shadow-vintage border-b border-gold/20' 
            : 'bg-cream-light/80 backdrop-blur-sm border-b border-gold/10'
          }
        `}
      >
        {/* ═══════════════════════════════════════════════════════════════════
            DECORATIVE TOP BORDER
        ════════════════════════════════════════════════════════════════════ */}
        <div className="h-1 bg-gold-shimmer" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* ═══════════════════════════════════════════════════════════════
                LOGO - ECHO BRAND
            ════════════════════════════════════════════════════════════════ */}
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo Icon Container */}
              <div className="relative">
                {/* Outer decorative ring */}
                <div className="absolute inset-0 rounded-full border-2 border-gold/30 scale-125 group-hover:scale-150 transition-transform duration-500" />
                
                {/* Main logo circle */}
                <div className="relative w-10 h-10 rounded-full bg-burgundy flex items-center justify-center shadow-vintage group-hover:shadow-elevated transition-all duration-300">
                  <Heart 
                    className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" 
                    fill="currentColor" 
                  />
                </div>
                
                {/* Floating accent */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Feather className="w-4 h-4 text-gold" />
                </motion.div>
              </div>
              
              {/* Brand Name */}
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-burgundy tracking-wide">
                  Echo
                </span>
                <span className="text-[10px] font-elegant text-ink/50 tracking-[0.2em] uppercase -mt-1">
                  Vintage E-Card
                </span>
              </div>
            </Link>

            {/* ═══════════════════════════════════════════════════════════════
                DESKTOP NAVIGATION
            ════════════════════════════════════════════════════════════════ */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`
                    relative px-4 py-2 font-display text-sm font-medium tracking-wide
                    transition-all duration-300
                    ${pathname === link.href 
                      ? 'text-burgundy' 
                      : 'text-ink/70 hover:text-burgundy'
                    }
                  `}
                >
                  {/* Active indicator */}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* ═══════════════════════════════════════════════════════════════
                USER ACTIONS
            ════════════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  {/* Tym Balance - Desktop */}
                  <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-burgundy-50 border border-burgundy/20 rounded-full">
                    <span className="text-burgundy">💜</span>
                    <span className="font-display font-semibold text-burgundy">{user.points || 0}</span>
                    <span className="text-xs text-burgundy/60 font-elegant">Tym</span>
                  </div>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`
                        flex items-center gap-2 p-1.5 rounded-full
                        border-2 transition-all duration-300
                        ${isDropdownOpen 
                          ? 'border-gold bg-gold/10 shadow-gold-glow' 
                          : 'border-gold/30 hover:border-gold hover:bg-cream-dark/50'
                        }
                      `}
                    >
                      {user.avatar ? (
                        <img 
                          src={user.avatar || undefined} 
                          alt={user.name || undefined} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center">
                          <User className="w-4 h-4 text-gold" />
                        </div>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-72 origin-top-right"
                        >
                          {/* Decorative arrow */}
                          <div className="absolute -top-2 right-4 w-4 h-4 bg-cream-light border-l border-t border-gold/30 rotate-45" />
                          
                          <div className="relative bg-cream-light border border-gold/30 rounded-soft shadow-elevated overflow-hidden">
                            {/* User Info Header */}
                            <div className="p-4 bg-burgundy-gradient">
                              <div className="flex items-center gap-3">
                                {user.avatar ? (
                                  <img 
                                    src={user.avatar || undefined} 
                                    alt={user.name || undefined}
                                    className="w-12 h-12 rounded-full border-2 border-gold/50 object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-burgundy-dark flex items-center justify-center border-2 border-gold/50">
                                    <User className="w-6 h-6 text-gold" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-display font-semibold text-cream-light truncate">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-cream-light/70 truncate font-elegant">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              
                              {/* Tym Balance in dropdown */}
                              <div className="mt-3 flex items-center justify-between p-2 bg-white/10 rounded-vintage">
                                <span className="text-sm text-cream-light/80 font-elegant">Số Tym</span>
                                <span className="font-display font-bold text-gold flex items-center gap-1">
                                  💜 {user.points || 0}
                                </span>
                              </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2">
                              <Link 
                                href="/dashboard"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-vintage text-ink hover:bg-burgundy-50 hover:text-burgundy transition-colors"
                              >
                                <LayoutDashboard className="w-4 h-4 text-gold" />
                                <span className="font-elegant">Tổng quan</span>
                              </Link>
                              
                              <Link 
                                href="/dashboard/events"
                                onClick={() => setIsDropdownOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-vintage text-ink hover:bg-burgundy-50 hover:text-burgundy transition-colors"
                              >
                                <Calendar className="w-4 h-4 text-gold" />
                                <span className="font-elegant">Sổ nợ cảm xúc</span>
                              </Link>
                              
                              <button
                                onClick={() => { setShowPromoModal(true); setIsDropdownOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-vintage text-ink hover:bg-burgundy-50 hover:text-burgundy transition-colors"
                              >
                                <Gift className="w-4 h-4 text-gold" />
                                <span className="font-elegant">Nhập mã khuyến mãi</span>
                              </button>
                              
                              {user.role === 'admin' && (
                                <Link 
                                  href="/admin"
                                  onClick={() => setIsDropdownOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-vintage text-ink hover:bg-burgundy-50 hover:text-burgundy transition-colors"
                                >
                                  <Shield className="w-4 h-4 text-gold" />
                                  <span className="font-elegant">Quản trị</span>
                                  <Crown className="w-3 h-3 text-gold ml-auto" />
                                </Link>
                              )}
                              
                              {/* Divider */}
                              <div className="my-2 border-t border-gold/20" />
                              
                              <button
                                onClick={() => { signOut(); setIsDropdownOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-vintage text-red-700 hover:bg-red-50 transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                <span className="font-elegant">Đăng xuất</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <Link href="/auth">
                  <Button variant="primary" size="sm" icon={<User className="w-4 h-4" />}>
                    Đăng nhập
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-soft text-ink hover:bg-cream-dark/50 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            MOBILE NAVIGATION
        ════════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-gold/20"
            >
              <nav className="px-4 py-4 space-y-1 bg-cream-light">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      block px-4 py-3 rounded-soft font-display tracking-wide transition-all
                      ${pathname === link.href 
                        ? 'bg-burgundy text-cream-light' 
                        : 'text-ink hover:bg-burgundy-50 hover:text-burgundy'
                      }
                    `}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {user && (
                  <div className="pt-3 mt-3 border-t border-gold/20">
                    <div className="flex items-center justify-between px-4 py-2 bg-burgundy-50 rounded-soft">
                      <span className="text-sm text-burgundy font-elegant">Số Tym của bạn</span>
                      <span className="font-display font-bold text-burgundy">💜 {user.points || 0}</span>
                    </div>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Promo Code Modal */}
      {user && user.id && (
      <PromoCodeModal 
        isOpen={showPromoModal} 
        onClose={() => setShowPromoModal(false)}
          userId={user.id}
        onSuccess={(newBalance) => {
          // Optionally refresh user data
            window.location.reload();
        }}
      />
      )}
    </>
  );
}