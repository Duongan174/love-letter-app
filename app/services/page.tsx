// app/services/page.tsx
'use client';

import { motion } from 'framer-motion';
import { 
  Diamond, Crown, Zap, Check, ArrowRight, 
  Heart, Star, ShieldCheck, Mail
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';

export default function ServicesPage() {
  const services = [
    {
      id: 'tym-pack',
      title: 'Nạp Tym Lẻ',
      description: 'Mua Tym để mở khóa từng mẫu thiệp Premium bạn thích.',
      price: 'Từ 20.000đ',
      icon: <Heart className="w-8 h-8 text-rose-500" />,
      image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop', // Hình trái tim/quà
      features: [
        'Mua bao nhiêu dùng bấy nhiêu',
        'Tym không bao giờ hết hạn',
        'Tặng Tym cho bạn bè',
        'Mở khóa tem & phong bì đặc biệt'
      ],
      cta: 'Mua Tym Ngay',
      link: '/shop/tym', // Giả định link
      popular: false,
    },
    {
      id: 'echo-plus',
      title: 'Echo Plus',
      description: 'Mở khóa toàn bộ kho thiệp & tính năng cao cấp không giới hạn.',
      price: '99.000đ / tháng',
      icon: <Crown className="w-8 h-8 text-amber-500" />,
      image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop', // Hình hộp quà sang trọng
      features: [
        'Miễn phí tất cả mẫu Premium',
        'Tải lên nhạc riêng của bạn',
        'Không giới hạn dung lượng ảnh',
        'Xóa logo Echo ở chân thiệp',
        'Hỗ trợ ưu tiên 24/7'
      ],
      cta: 'Đăng Ký Ngay',
      link: '/subscribe',
      popular: true,
    },
    {
      id: 'custom',
      title: 'Thiết Kế Riêng',
      description: 'Dành cho doanh nghiệp hoặc sự kiện đặc biệt cần sự độc bản.',
      price: 'Liên hệ',
      icon: <Diamond className="w-8 h-8 text-purple-500" />,
      image: 'https://images.unsplash.com/photo-1542435503-956c469947f6?q=80&w=800&auto=format&fit=crop', // Hình thiết kế/vẽ
      features: [
        'Thiết kế phong bì độc quyền',
        'Tùy chỉnh animation theo yêu cầu',
        'Tích hợp logo thương hiệu',
        'Gửi hàng loạt (Bulk send) qua email',
        'Báo cáo thống kê người nhận'
      ],
      cta: 'Liên Hệ Tư Vấn',
      link: '/contact',
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-purple-50 opacity-50" />
        
        {/* Decorative Circles */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Dịch vụ & <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">Bảng Giá</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Chọn gói dịch vụ phù hợp để gửi trọn vẹn những thông điệp yêu thương theo cách riêng của bạn.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 -mt-20 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative bg-white rounded-3xl overflow-hidden shadow-xl border-2 transition-transform hover:-translate-y-2
                  ${service.popular ? 'border-rose-500 ring-4 ring-rose-100' : 'border-transparent'}
                `}
              >
                {/* Popular Badge */}
                {service.popular && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-30">
                    PHỔ BIẾN NHẤT
                  </div>
                )}

                {/* Image Header */}
                <div className="h-48 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur p-3 rounded-2xl shadow-lg">
                    {service.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 h-10">{service.description}</p>
                  
                  <div className="mb-8">
                    <span className="text-3xl font-bold text-gray-900">{service.price}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={service.link} className="block">
                    <Button 
                      className={`w-full py-6 text-lg rounded-xl ${
                        service.popular 
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-200' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {service.cta}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise / Additional Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} 
            />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-6 text-amber-300 border border-white/20">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Solution</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Bạn là Doanh nghiệp?</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Echo cung cấp giải pháp gửi thiệp số lượng lớn (Bulk Sending) cho nhân viên và đối tác vào các dịp Lễ, Tết, Sinh nhật công ty với chi phí tối ưu nhất.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact">
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 border-0">
                    Liên hệ Báo giá
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="secondary" className="text-white border-white/30 hover:bg-white/10">
                    Xem Demo Doanh nghiệp
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10">
              <div className="w-64 h-64 md:w-80 md:h-80 bg-gradient-to-tr from-rose-500 to-purple-600 rounded-full flex items-center justify-center relative animate-blob">
                 <Mail className="w-32 h-32 text-white opacity-90" />
                 {/* Decorative elements */}
                 <div className="absolute -top-4 -right-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg font-bold text-sm transform rotate-12">
                   Brand Logo
                 </div>
                 <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 px-4 py-2 rounded-lg shadow-lg font-bold text-sm transform -rotate-12">
                   Analytics
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Mini */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Câu hỏi thường gặp</h2>
          <div className="space-y-4 text-left">
            {[
              { q: 'Tym là gì?', a: 'Tym là đơn vị tiền tệ trong Echo, dùng để đổi lấy các mẫu thiệp Premium.' },
              { q: 'Gói Echo Plus có tự động gia hạn không?', a: 'Có, gói sẽ tự động gia hạn hàng tháng. Bạn có thể hủy bất cứ lúc nào.' },
              { q: 'Tôi có thể hoàn tiền nếu không hài lòng?', a: 'Echo hỗ trợ hoàn tiền trong vòng 3 ngày đầu tiên nếu bạn gặp lỗi kỹ thuật.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition">
                <h4 className="font-bold text-gray-900 mb-2">{item.q}</h4>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}