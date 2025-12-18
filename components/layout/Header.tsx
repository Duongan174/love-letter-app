// components/layout/Header.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, User, LogOut, Shield, 
  Gift, Menu, X, LayoutDashboard
} from 'lucide-react';
// 👇 IMPORT QUAN TRỌNG: Lấy từ hooks/useAuth
import { useAuth } from '@/hooks/useAuth'; 
import Button from '@/components/ui/Button';
import PromoCodeModal from '@/components/ui/PromoCodeModal'; 

export default function Header() {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Đóng dropdown khi click ra ngoài
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
    { name: 'Mẫu thiệp', href: '/create' }, // Trỏ về /create để người dùng tạo thiệp ngay
    { name: 'Dịch vụ', href: '/services' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* 1. LOGO THƯƠNG HIỆU: ECHO */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <Heart className="w-8 h-8 text-rose-500 group-hover:scale-110 transition-transform" fill="currentColor" />
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </motion.div>
              </div>
              <span className="font-playfair text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                Echo
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-rose-500 ${
                    pathname === link.href ? 'text-rose-600 font-bold' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* 2. NÚT NGƯỜI DÙNG (USER MENU) */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:border-rose-200 hover:bg-rose-50 transition bg-white"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center overflow-hidden border border-rose-100">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-rose-600 font-bold text-xs">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate hidden sm:block">
                      {user.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden ring-1 ring-black ring-opacity-5"
                      >
                        {/* Header của Dropdown: Tên & Tym */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-sm text-gray-500">Xin chào,</p>
                          <p className="font-bold text-gray-900 truncate">{user.name}</p>
                          <div className="mt-2 flex items-center gap-2 text-rose-600 bg-rose-50 px-2 py-1 rounded-md w-fit border border-rose-100">
                            <Heart className="w-3 h-3 fill-current" />
                            <span className="text-xs font-bold">{user.points} Tym</span>
                          </div>
                        </div>

                        {/* Danh sách chức năng */}
                        <div className="py-1">
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition">
                            <LayoutDashboard className="w-4 h-4" />
                            Quản lý thiệp
                          </Link>
                          
                          <button 
                            onClick={() => { setIsDropdownOpen(false); setShowPromoModal(true); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-rose-600 transition text-left"
                          >
                            <Gift className="w-4 h-4" />
                            Nhập mã quà tặng
                          </button>

                          {/* Chỉ hiện Admin nếu role là admin */}
                          {user.role === 'admin' && (
                            <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition">
                              <Shield className="w-4 h-4" />
                              Trang Quản Trị
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth">
                    <Button variant="ghost" size="sm">Đăng nhập</Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
                      Bắt đầu
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu List */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-2 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-3 text-base font-medium text-gray-600 hover:text-rose-600 hover:bg-gray-50 rounded-md"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Modal Nhập Code */}
      <PromoCodeModal isOpen={showPromoModal} onClose={() => setShowPromoModal(false)} />
    </>
  );
}