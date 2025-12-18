// app/page.tsx
'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Heart, Mail, Sparkles, ChevronRight, Star, Feather, Crown, ArrowRight, Quote } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const OrnamentDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
    <Feather className="w-5 h-5 text-gold rotate-45" />
    <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold to-transparent" />
  </div>
);

const FloatingElement = ({ children, delay = 0, className = '' }: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) => (
  <motion.div
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <main className="min-h-screen bg-cream overflow-hidden">
      
      {/* Header */}
      <Header />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION - Elegant Introduction
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-68px)] flex items-center justify-center overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-vintage-gradient" />
        
        {/* Floating decorative elements */}
        <FloatingElement delay={0} className="absolute top-20 left-[10%] opacity-20">
          <Heart className="w-16 h-16 text-burgundy" />
        </FloatingElement>
        <FloatingElement delay={1} className="absolute top-40 right-[15%] opacity-15">
          <Mail className="w-12 h-12 text-gold" />
        </FloatingElement>
        <FloatingElement delay={2} className="absolute bottom-32 left-[20%] opacity-20">
          <Star className="w-10 h-10 text-burgundy" />
        </FloatingElement>
        <FloatingElement delay={0.5} className="absolute bottom-40 right-[10%] opacity-15">
          <Feather className="w-14 h-14 text-gold" />
        </FloatingElement>

        {/* Decorative corner ornaments */}
        <div className="absolute top-8 left-8 text-4xl text-gold/20 font-serif">❧</div>
        <div className="absolute top-8 right-8 text-4xl text-gold/20 font-serif rotate-90">❧</div>
        <div className="absolute bottom-8 left-8 text-4xl text-gold/20 font-serif -rotate-90">❧</div>
        <div className="absolute bottom-8 right-8 text-4xl text-gold/20 font-serif rotate-180">❧</div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 bg-cream-light border border-gold/40 rounded-full shadow-vintage mb-8"
          >
            <Crown className="w-4 h-4 text-gold" />
            <span className="font-elegant text-sm text-burgundy tracking-wide">
              Nền tảng thiệp điện tử cao cấp
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-ink leading-tight mb-4">
              Gửi lời yêu thương
            </h1>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
              <span className="text-burgundy-gradient bg-clip-text text-transparent bg-gradient-to-r from-burgundy via-burgundy-light to-burgundy">
                cùng Echo
              </span>
            </h2>
          </motion.div>

          {/* Ornament Divider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <OrnamentDivider className="max-w-md mx-auto mb-8" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="font-body text-lg md:text-xl text-ink/70 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Không chỉ là một tấm thiệp, Echo giúp bạn gói trọn cảm xúc vào những 
            trải nghiệm tương tác 3D, âm nhạc và những lời chúc chân thành nhất.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/create">
              <Button 
                variant="primary" 
                size="lg" 
                icon={<Sparkles className="w-5 h-5" />}
                className="min-w-[200px]"
              >
                Tạo Thiệp Ngay
              </Button>
            </Link>
            <Link href="/templates">
              <Button 
                variant="gold" 
                size="lg" 
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="min-w-[200px]"
              >
                Xem Bộ Sưu Tập
              </Button>
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 text-gold/60"
            >
              <span className="font-elegant text-xs tracking-widest uppercase">Khám phá</span>
              <ChevronRight className="w-5 h-5 rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES SECTION - Why Echo?
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-cream-light">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-script text-2xl text-gold mb-4 block"
            >
              Tại sao chọn Echo?
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold text-ink mb-6"
            >
              Trải Nghiệm <span className="text-burgundy">Khác Biệt</span>
            </motion.h2>
            <OrnamentDivider className="max-w-xs mx-auto" />
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-8 h-8" />,
                title: 'Thiết Kế Cổ Điển',
                description: 'Mẫu thiệp vintage độc quyền, mang đậm phong cách hoài cổ châu Âu pha lẫn nét Á Đông tinh tế.',
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Tương Tác 3D',
                description: 'Thiệp có thể mở ra như thật, hiệu ứng lật trang sống động khiến người nhận ngỡ ngàng.',
              },
              {
                icon: <Mail className="w-8 h-8" />,
                title: 'Cá Nhân Hóa',
                description: 'Tùy chỉnh phong bì, tem thư, nhạc nền và chữ ký tay để mỗi tấm thiệp là duy nhất.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className="relative p-8 bg-cream border border-gold/20 rounded-soft shadow-vintage hover:shadow-elevated hover:border-gold/40 transition-all duration-500">
                  {/* Corner ornament */}
                  <div className="absolute top-3 right-3 text-gold/30 font-serif text-xl">✦</div>
                  
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-full bg-burgundy/10 border border-burgundy/20 flex items-center justify-center mb-6 text-burgundy group-hover:bg-burgundy group-hover:text-gold transition-all duration-300">
                    {feature.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="font-display text-xl font-semibold text-ink mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-body text-ink/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TESTIMONIAL / QUOTE SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-burgundy overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl text-cream-light">❧</div>
          <div className="absolute bottom-10 right-10 text-6xl text-cream-light rotate-180">❧</div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Quote className="w-12 h-12 text-gold/60 mx-auto mb-8" />
            
            <blockquote className="font-display text-2xl md:text-3xl lg:text-4xl text-cream-light leading-relaxed mb-8 italic">
              "Một tấm thiệp không chỉ chứa đựng lời chúc, mà còn là cầu nối 
              của những trái tim yêu thương."
            </blockquote>
            
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-px bg-gold/50" />
              <span className="font-script text-xl text-gold">Echo Team</span>
              <div className="w-12 h-px bg-gold/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRICING SECTION - Tym System
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-script text-2xl text-gold mb-4 block"
            >
              Hệ thống Tym
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold text-ink mb-6"
            >
              Đơn Giản & <span className="text-burgundy">Minh Bạch</span>
            </motion.h2>
            <OrnamentDivider className="max-w-xs mx-auto mb-8" />
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
              Sử dụng Tym để mở khóa các tính năng cao cấp. 
              Đăng ký tài khoản để nhận Tym miễn phí ngay hôm nay!
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Cơ Bản',
                price: 'Miễn phí',
                features: ['5 mẫu thiệp cơ bản', 'Phong bì tiêu chuẩn', 'Chia sẻ qua link'],
                highlight: false,
              },
              {
                name: 'Cao Cấp',
                price: '50 Tym',
                features: ['Tất cả mẫu thiệp premium', 'Phong bì & tem độc quyền', 'Nhạc nền tùy chọn', 'Chữ ký tay', 'Upload ảnh không giới hạn'],
                highlight: true,
              },
              {
                name: 'Doanh Nghiệp',
                price: 'Liên hệ',
                features: ['Thiết kế theo yêu cầu', 'Logo thương hiệu', 'API tích hợp', 'Hỗ trợ ưu tiên'],
                highlight: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className={`
                  relative p-8 rounded-soft border-2 transition-all duration-300
                  ${plan.highlight 
                    ? 'bg-cream-light border-gold shadow-elevated scale-105' 
                    : 'bg-cream-light border-gold/30 shadow-vintage hover:border-gold/60'
                  }
                `}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-cream-light text-sm font-display tracking-wider rounded-full">
                    PHỔ BIẾN
                  </div>
                )}
                
                <h3 className="font-display text-xl font-semibold text-ink mb-2">{plan.name}</h3>
                <p className="font-display text-3xl font-bold text-burgundy mb-6">{plan.price}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 font-body text-ink/70">
                      <Star className="w-4 h-4 text-gold flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.highlight ? 'primary' : 'gold'} 
                  className="w-full"
                >
                  {plan.price === 'Liên hệ' ? 'Liên Hệ' : 'Bắt Đầu'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA SECTION - Final Call to Action
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-vintage-gradient overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-script text-2xl text-gold mb-4 block">
              Sẵn sàng chưa?
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink mb-6">
              Bắt Đầu Gửi Yêu Thương <span className="text-burgundy">Ngay Hôm Nay</span>
            </h2>
            <OrnamentDivider className="max-w-xs mx-auto mb-8" />
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto mb-10">
              Tạo tài khoản miễn phí và nhận ngay Tym để trải nghiệm. 
              Mỗi tấm thiệp là một câu chuyện, hãy để Echo kể câu chuyện của bạn.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth">
                <Button variant="primary" size="lg" icon={<Heart className="w-5 h-5" fill="currentColor" />}>
                  Đăng Ký Miễn Phí
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="secondary" size="lg">
                  Khám Phá Mẫu Thiệp
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-ink py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo & Tagline */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-burgundy flex items-center justify-center">
                <Heart className="w-5 h-5 text-gold" fill="currentColor" />
              </div>
              <span className="font-display text-2xl font-bold text-cream-light">Echo</span>
            </div>
            <p className="font-elegant text-cream-light/60 italic">
              "Gửi trọn yêu thương, chạm đến trái tim"
            </p>
          </div>
          
          {/* Divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <Feather className="w-4 h-4 text-gold/50" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>
          
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {['Trang chủ', 'Mẫu thiệp', 'Dịch vụ', 'Về chúng tôi', 'Liên hệ'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-elegant text-cream-light/60 hover:text-gold transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
          
          {/* Copyright */}
          <p className="text-center text-cream-light/40 text-sm font-body">
            © 2024 Echo. Được tạo với{' '}
            <Heart className="w-3 h-3 inline text-burgundy" fill="currentColor" />{' '}
            tại Việt Nam.
          </p>
        </div>
      </footer>
    </main>
  );
}