// app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, Mail, Sparkles, Music, Image, Pen, 
  Send, Star, ArrowRight, Play, ChevronDown
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from './providers';

// Fixed positions for floating hearts (tránh random)
const floatingHearts = [
  { left: '5%', top: '10%', delay: 0 },
  { left: '15%', top: '30%', delay: 0.5 },
  { left: '25%', top: '60%', delay: 1 },
  { left: '35%', top: '20%', delay: 1.5 },
  { left: '45%', top: '80%', delay: 2 },
  { left: '55%', top: '15%', delay: 0.3 },
  { left: '65%', top: '45%', delay: 0.8 },
  { left: '75%', top: '70%', delay: 1.2 },
  { left: '85%', top: '25%', delay: 1.8 },
  { left: '95%', top: '55%', delay: 0.6 },
  { left: '10%', top: '75%', delay: 2.2 },
  { left: '30%', top: '85%', delay: 0.9 },
  { left: '50%', top: '5%', delay: 1.4 },
  { left: '70%', top: '90%', delay: 1.1 },
  { left: '90%', top: '40%', delay: 0.4 },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Phong Bì 3D',
      description: 'Hiệu ứng mở phong bì chân thực với animation 3D xoay 360°',
      color: 'from-rose-500 to-pink-500',
    },
    {
      icon: <Image className="w-8 h-8" />,
      title: 'Thiệp Động',
      description: 'Hàng trăm mẫu thiệp với hiệu ứng chuyển động đẹp mắt',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      icon: <Music className="w-8 h-8" />,
      title: 'Nhạc Nền',
      description: 'Thư viện nhạc đa dạng, từ nhẹ nhàng đến sôi động',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Pen className="w-8 h-8" />,
      title: 'Chữ Ký Tay',
      description: 'Ký tên thủ công tạo dấu ấn cá nhân độc đáo',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Hiệu Ứng Chữ',
      description: 'Nhiều kiểu hiệu ứng xuất hiện chữ ấn tượng',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Send className="w-8 h-8" />,
      title: 'Gửi Dễ Dàng',
      description: 'Chia sẻ qua link hoặc gửi trực tiếp qua email',
      color: 'from-red-500 to-rose-500',
    },
  ];

  const steps = [
    { step: 1, title: 'Chọn Mẫu Thiệp', desc: 'Lựa chọn từ hàng trăm mẫu thiệp đẹp' },
    { step: 2, title: 'Tùy Chỉnh', desc: 'Phong bì, tem, nhạc và nhiều hơn nữa' },
    { step: 3, title: 'Viết Lời Chúc', desc: 'Thêm lời nhắn và ký tên của bạn' },
    { step: 4, title: 'Gửi Đi', desc: 'Chia sẻ tình yêu thương đến người nhận' },
  ];

  const testimonials = [
    {
      name: 'Minh Anh',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'Thiệp đẹp quá! Người yêu mình cảm động khóc luôn 💕',
      rating: 5,
    },
    {
      name: 'Hoàng Nam',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'Giao diện đẹp, dễ sử dụng, nhiều mẫu thiệp đa dạng',
      rating: 5,
    },
    {
      name: 'Thu Hương',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'Hiệu ứng 3D rất chất! Recommend cho mọi người nè',
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 overflow-hidden">
      {/* Floating Elements - chỉ render sau khi mounted */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {floatingHearts.map((heart, i) => (
            <motion.div
              key={i}
              className="absolute text-rose-200"
              style={{
                left: heart.left,
                top: heart.top,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: heart.delay,
              }}
            >
              <Heart className="w-4 h-4" fill="currentColor" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
                <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1" />
              </div>
              <span className="font-playfair text-xl font-bold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                Vintage E-Card
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-rose-500 transition">
                Tính năng
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-rose-500 transition">
                Hướng dẫn
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-rose-500 transition">
                Đánh giá
              </a>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <Link href="/dashboard">
                  <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth">
                    <Button variant="ghost">Đăng nhập</Button>
                  </Link>
                  <Link href="/auth">
                    <Button variant="primary" icon={<Sparkles className="w-4 h-4" />}>
                      Bắt đầu
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 rounded-full text-rose-600 text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Thiệp điện tử thế hệ mới
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Gửi yêu thương
                <br />
                <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  theo cách đặc biệt
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                Tạo thiệp điện tử độc đáo với hiệu ứng 3D, nhạc nền và chữ ký tay. 
                Mỗi thiệp là một trải nghiệm cảm xúc đáng nhớ.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/create">
                  <Button size="lg" icon={<Mail className="w-5 h-5" />}>
                    Tạo Thiệp Ngay
                  </Button>
                </Link>
                <Button variant="outline" size="lg" icon={<Play className="w-5 h-5" />}>
                  Xem Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12 justify-center lg:justify-start">
                {[
                  { value: '10K+', label: 'Thiệp đã gửi' },
                  { value: '5K+', label: 'Người dùng' },
                  { value: '4.9', label: 'Đánh giá' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - 3D Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative z-10">
                {/* Envelope Preview */}
                <div className="relative w-[350px] h-[250px] mx-auto" style={{ perspective: '1000px' }}>
                  <motion.div
                    animate={{ rotateY: [0, 10, 0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-full h-full"
                  >
                    {/* Envelope body */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-rose-600 rounded-lg shadow-2xl" />
                    
                    {/* Envelope flap */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 origin-top">
                      <div 
                        className="w-0 h-0 mx-auto"
                        style={{
                          borderLeft: '175px solid transparent',
                          borderRight: '175px solid transparent',
                          borderTop: '80px solid #f43f5e',
                        }}
                      />
                    </div>

                    {/* Card inside */}
                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-4 bg-white rounded shadow-lg flex items-center justify-center"
                    >
                      <div className="text-center p-4">
                        <Heart className="w-12 h-12 text-rose-400 mx-auto mb-2" fill="currentColor" />
                        <p className="font-dancing text-2xl text-gray-700">Yêu em ♥</p>
                      </div>
                    </motion.div>

                    {/* Wax seal */}
                    <div 
                      className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center z-20"
                      style={{
                        background: 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b 50%, #922b21)',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 5px 15px rgba(0,0,0,0.3)',
                      }}
                    >
                      <Heart className="w-6 h-6 text-white" fill="currentColor" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Floating decorations */}
              <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full opacity-60 blur-xl"
              />
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-rose-400 rounded-full opacity-50 blur-xl"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center text-gray-400"
          >
            <span className="text-sm mb-2">Cuộn xuống</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">nổi bật</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mọi thứ bạn cần để tạo ra những thiệp điện tử đẹp và ý nghĩa nhất
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Đơn giản <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">4 bước</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tạo thiệp chỉ trong vài phút với quy trình dễ dàng
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-rose-300 to-pink-300" />
                )}
                
                <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khách hàng <span className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">nói gì</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <div className="flex gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400" fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">&quot;{item.content}&quot;</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Sẵn sàng gửi yêu thương?
              </h2>
              <p className="text-white/80 mb-8 max-w-lg mx-auto">
                Tạo thiệp điện tử đầu tiên của bạn ngay hôm nay - hoàn toàn miễn phí!
              </p>
              <Link href="/create">
                <Button 
                  size="lg" 
                  className="bg-white text-rose-500 hover:bg-gray-100"
                  icon={<Sparkles className="w-5 h-5" />}
                >
                  Bắt Đầu Ngay
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-rose-400" fill="currentColor" />
                <span className="font-playfair text-lg font-bold">Vintage E-Card</span>
              </div>
              <p className="text-gray-400 text-sm">
                Nền tảng tạo thiệp điện tử độc đáo với hiệu ứng 3D và nhiều tùy chỉnh.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Tạo thiệp</a></li>
                <li><a href="#" className="hover:text-white transition">Mẫu thiệp</a></li>
                <li><a href="#" className="hover:text-white transition">Bảng giá</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Liên hệ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Pháp lý</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition">Chính sách</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 Vintage E-Card. Made with 💕 in Vietnam</p>
          </div>
        </div>
      </footer>
    </main>
  );
}