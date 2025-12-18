// app/auth/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Facebook, Mail } from 'lucide-react';
// Import từ hooks để tránh lỗi
import { useAuth } from '@/hooks/useAuth'; 

// Icon Google SVG Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.766 12.2764C23.766 11.4607 23.6999 10.6406 23.5588 9.83807H12.24V14.4591H18.7217C18.4528 15.9494 17.5885 17.2678 16.323 18.1056V21.1039H20.19C22.4608 19.0139 23.766 15.9274 23.766 12.2764Z" fill="#4285F4"/>
    <path d="M12.24 24.0008C15.4765 24.0008 18.2058 22.9382 20.19 21.1039L16.323 18.1056C15.251 18.8375 13.8627 19.252 12.24 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.24 24.0008Z" fill="#34A853"/>
    <path d="M5.50705 14.3003C5.01664 12.8688 5.01664 11.1321 5.50705 9.70058V6.60971H1.5166C-0.370591 10.3709 -0.370591 13.6304 1.5166 17.3912L5.50705 14.3003Z" fill="#FBBC05"/>
    <path d="M12.24 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.24 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.60971L5.50705 9.70058C6.45079 6.86106 9.10912 4.74966 12.24 4.74966Z" fill="#EA4335"/>
  </svg>
);

export default function AuthPage() {
  const { user, signInWithFacebook, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-400 to-purple-500" />
        
        {/* Logo Echo */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="relative">
             <Heart className="w-10 h-10 text-rose-500" fill="currentColor" />
             <Sparkles className="w-5 h-5 text-amber-400 absolute -top-2 -right-2 animate-bounce" />
          </div>
          <span className="font-playfair text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            Echo
          </span>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h2>
        <p className="text-gray-500 mb-8">Kết nối để lưu giữ những kỷ niệm.</p>

        <div className="space-y-4">
          {/* Nút Facebook */}
          <button
            onClick={signInWithFacebook}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-[#1877F2] text-white rounded-xl font-medium hover:bg-[#166fe5] transition shadow-md hover:shadow-lg"
          >
            <Facebook className="w-5 h-5" />
            Tiếp tục với Facebook
          </button>

          {/* Nút Google (Đã thêm lại) */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition shadow-sm hover:shadow-md"
          >
            <GoogleIcon />
            Tiếp tục với Google
          </button>

          {/* Nút Email */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-100 text-gray-400 rounded-xl font-medium cursor-not-allowed"
          >
            <Mail className="w-5 h-5" />
            Đăng nhập Email (Sắp ra mắt)
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Bằng việc tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Echo.
        </p>
      </motion.div>
    </div>
  );
}