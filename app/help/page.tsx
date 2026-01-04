// app/help/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HelpCircle, ArrowLeft, Search, BookOpen, 
  MessageCircle, Video, FileText, ChevronRight,
  Mail, Phone, Clock
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Bắt đầu',
      icon: BookOpen,
      questions: [
        {
          q: 'Làm thế nào để tạo thiệp mới?',
          a: 'Bạn có thể tạo thiệp mới bằng cách click vào nút "TẠO THIỆP MỚI" trên trang chủ hoặc vào menu "Tạo thiệp" trong Dashboard. Sau đó chọn mẫu thiệp và bắt đầu tùy chỉnh.'
        },
        {
          q: 'Tôi có thể lưu nháp và tiếp tục chỉnh sửa sau không?',
          a: 'Có! Hệ thống tự động lưu nháp khi bạn chỉnh sửa. Bạn có thể xem và tiếp tục chỉnh sửa các nháp trong phần "Nháp" của Dashboard.'
        },
        {
          q: 'Làm thế nào để gửi thiệp?',
          a: 'Sau khi hoàn thành thiệp, bạn có thể gửi qua link, QR code, email hoặc Facebook Messenger. Tất cả các tùy chọn có trong bước cuối cùng khi tạo thiệp.'
        }
      ]
    },
    {
      id: 'customization',
      title: 'Tùy chỉnh',
      icon: FileText,
      questions: [
        {
          q: 'Tôi có thể thay đổi màu sắc và phong cách của thiệp không?',
          a: 'Có! Bạn có thể tùy chỉnh màu phong bì, tem, nền, chữ ký và nhiều yếu tố khác trong quá trình tạo thiệp.'
        },
        {
          q: 'Có thể thêm nhạc nền vào thiệp không?',
          a: 'Có, bạn có thể chọn nhạc nền từ thư viện có sẵn hoặc tải lên nhạc của riêng bạn trong bước tùy chỉnh thiệp.'
        },
        {
          q: 'Làm thế nào để thêm ảnh vào thiệp?',
          a: 'Bạn có thể thêm ảnh trong bước tùy chỉnh thiệp. Hệ thống hỗ trợ nhiều khung ảnh và vị trí khác nhau.'
        }
      ]
    },
    {
      id: 'account',
      title: 'Tài khoản',
      icon: MessageCircle,
      questions: [
        {
          q: 'Làm thế nào để đăng ký tài khoản?',
          a: 'Bạn có thể đăng ký bằng cách click vào "Đăng nhập" và chọn "Đăng ký" hoặc đăng nhập bằng Google/Facebook.'
        },
        {
          q: 'Tôi quên mật khẩu, làm sao để lấy lại?',
          a: 'Bạn có thể click vào "Quên mật khẩu" trên trang đăng nhập và làm theo hướng dẫn để đặt lại mật khẩu.'
        },
        {
          q: 'Tym là gì và làm thế nào để có thêm Tym?',
          a: 'Tym là đơn vị tiền tệ trong hệ thống. Bạn có thể nhận Tym bằng cách nhập mã khuyến mãi hoặc mua gói Tym trong phần cài đặt.'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email hỗ trợ',
      description: 'Gửi email cho chúng tôi',
      contact: 'support@echo-vintage.com',
      action: 'mailto:support@echo-vintage.com'
    },
    {
      icon: Phone,
      title: 'Hotline',
      description: 'Gọi điện trực tiếp',
      contact: '1900 1234',
      action: 'tel:19001234'
    },
    {
      icon: Clock,
      title: 'Giờ làm việc',
      description: 'Thời gian hỗ trợ',
      contact: '9:00 - 18:00 (T2 - CN)',
      action: null
    }
  ];

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-cream-light dark:bg-ink">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link 
              href="/"
              className="inline-flex items-center gap-2 text-ink/60 dark:text-cream-light/60 hover:text-burgundy dark:hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-elegant">Quay lại trang chủ</span>
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-burgundy flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold text-ink dark:text-cream-light mb-2">
                  Trung tâm trợ giúp
                </h1>
                <p className="text-ink/60 dark:text-cream-light/60">
                  Tìm câu trả lời cho các câu hỏi thường gặp
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40 dark:text-cream-light/40" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gold/20 dark:border-gold/30 bg-cream-light dark:bg-ink/50 text-ink dark:text-cream-light placeholder:text-ink/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40"
              />
            </div>
          </motion.div>

          {/* FAQ Categories */}
          {filteredFAQs.length > 0 ? (
            <div className="space-y-8 mb-12">
              {filteredFAQs.map((category, categoryIndex) => {
                const Icon = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 }}
                    className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl shadow-vintage overflow-hidden"
                  >
                    <div className="p-6 border-b border-gold/20 dark:border-gold/30 bg-burgundy-gradient">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-gold" />
                        <h2 className="font-display text-2xl font-semibold text-cream-light">
                          {category.title}
                        </h2>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {category.questions.map((faq, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                          className="border-b border-gold/10 dark:border-gold/20 last:border-0 pb-4 last:pb-0"
                        >
                          <h3 className="font-display font-semibold text-ink dark:text-cream-light mb-2 flex items-start gap-2">
                            <span className="text-burgundy dark:text-gold">Q:</span>
                            <span>{faq.q}</span>
                          </h3>
                          <p className="text-ink/70 dark:text-cream-light/70 ml-6 flex items-start gap-2">
                            <span className="text-gold">A:</span>
                            <span>{faq.a}</span>
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-16 h-16 text-ink/20 dark:text-cream-light/20 mx-auto mb-4" />
              <p className="text-ink/60 dark:text-cream-light/60">
                Không tìm thấy câu hỏi nào phù hợp với từ khóa "{searchQuery}"
              </p>
            </motion.div>
          )}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl shadow-vintage p-8"
          >
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-cream-light mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-burgundy dark:text-gold" />
              Liên hệ hỗ trợ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    className={`
                      p-6 rounded-xl border border-gold/20 dark:border-gold/30
                      ${method.action ? 'hover:bg-burgundy-50 dark:hover:bg-burgundy/20 cursor-pointer transition-colors' : ''}
                    `}
                    onClick={method.action ? () => window.open(method.action) : undefined}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-burgundy/10 dark:bg-burgundy/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-burgundy dark:text-gold" />
                      </div>
                      <h3 className="font-display font-semibold text-ink dark:text-cream-light">
                        {method.title}
                      </h3>
                    </div>
                    <p className="text-sm text-ink/60 dark:text-cream-light/60 mb-2">
                      {method.description}
                    </p>
                    <p className="font-medium text-ink dark:text-cream-light">
                      {method.contact}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

