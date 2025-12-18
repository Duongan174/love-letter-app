// app/page.tsx
'use client';
import { motion } from 'framer-motion';
import { Heart, Mail, Sparkles, ChevronRight, Star } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header'; // Import Header mới

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 overflow-hidden">
      
      {/* 1. Use the new Header */}
      <Header />

      {/* 2. Hero Section - Focus on Branding */}
      <section className="relative min-h-[calc(100vh-64px)] flex items-center justify-center">
        {/* Decorative Background Blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur border border-rose-100 rounded-full text-rose-600 text-sm font-medium mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Nền tảng thiệp điện tử số 1 Việt Nam</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
              Gửi lời yêu thương cùng
              <br />
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Echo
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Không chỉ là một tấm thiệp, Echo giúp bạn gói trọn cảm xúc vào những trải nghiệm 
              tương tác 3D, âm nhạc và những lời chúc chân thành nhất.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/create">
                <Button size="lg" className="h-14 px-8 text-lg rounded-2xl shadow-xl shadow-rose-200/50 hover:shadow-rose-300/50 transition-all">
                  <Mail className="w-5 h-5 mr-2" />
                  Tạo Thiệp Ngay
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-2xl bg-white/50 backdrop-blur hover:bg-white">
                  Khám phá Mẫu
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-16 flex flex-col items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-rose-50 flex items-center justify-center text-xs font-bold text-rose-600">
                  +5K
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span>Được yêu thích bởi hàng ngàn cặp đôi</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}