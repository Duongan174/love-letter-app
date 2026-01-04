// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Heart, Mail, Sparkles, ChevronRight, Star, Feather, Crown, ArrowRight, Quote } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Header from '@/components/layout/Header';

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const OrnamentDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-4 ${className}`}>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-gold/60" />
      <div className="w-1 h-1 rounded-full bg-gold/40" />
      <div className="w-2 h-2 rounded-full bg-gold/60" />
    </div>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
  </div>
);

const FloatingElement = ({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    className={`absolute pointer-events-none ${className}`}
  >
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  const reduceMotion = useReducedMotion();
  const [showStickyCta, setShowStickyCta] = useState(false);

  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Mobile sticky CTA appears after the user starts scrolling
    const unsubscribe = scrollYProgress.on('change', (v) => {
      setShowStickyCta(v > 0.06);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div className="min-h-screen bg-cream-light text-ink overflow-hidden">
      {/* Header */}
      <Header />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-vintage-paper" />

        {/* Floating decorative elements */}
        <div className="absolute inset-0">
          <FloatingElement className="top-20 left-[8%] opacity-20" delay={0.2}>
            <Heart className="w-16 h-16 text-burgundy" />
          </FloatingElement>
          <FloatingElement className="top-32 right-[12%] opacity-15" delay={0.4}>
            <Mail className="w-14 h-14 text-gold" />
          </FloatingElement>
          <FloatingElement className="bottom-28 left-[14%] opacity-15" delay={0.6}>
            <Star className="w-12 h-12 text-burgundy" />
          </FloatingElement>
          <FloatingElement className="bottom-36 right-[10%] opacity-10" delay={0.8}>
            <Feather className="w-16 h-16 text-gold" />
          </FloatingElement>
        </div>

        {/* Decorative corner ornaments */}
        <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-gold/20 rounded-tl-3xl" />
        <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-gold/20 rounded-tr-3xl" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-gold/20 rounded-bl-3xl" />
        <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-gold/20 rounded-br-3xl" />

        {/* Main Content */}
        <motion.div
          style={{ y: reduceMotion ? 0 : heroY }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-cream/50 border border-gold/30 backdrop-blur-sm shadow-vintage mb-10"
          >
            <Crown className="w-5 h-5 text-gold" />
            <span className="font-elegant text-sm text-burgundy tracking-wide">
              Nền tảng thiệp điện tử cao cấp
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.4 }}
            className="mx-auto max-w-5xl text-center"
          >
            <h1
              className="
                font-display font-extrabold text-ink
                text-[clamp(2.6rem,6vw,5rem)]
                leading-[1.05]
                text-balance
                [text-wrap:balance]
              "
            >
              Gửi lời yêu thương
            </h1>

            <h2
              className="
                mt-1 font-display font-semibold
                text-[clamp(2rem,4vw,3.2rem)]
                text-burgundy/90
              "
            >
              cùng Echo
            </h2>
          </motion.div>

          {/* Ornament Divider */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
            className="mt-8 mb-8"
          >
            <OrnamentDivider className="max-w-md mx-auto" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.8 }}
            className="font-body text-lg md:text-xl text-ink/80 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            Không chỉ là một tấm thiệp,
            Echo giúp bạn gửi gắm cảm xúc qua những trải nghiệm tương tác 3D,
            âm nhạc và lời nhắn được cá nhân hóa cho từng dịp.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 1 }}
            className="flex items-center justify-center relative z-10"
          >
            <Link href="/templates" aria-label="Chọn mẫu thiệp">
              <Button
                variant="primary"
                size="lg"
                icon={<Sparkles className="w-5 h-5" />}
                className="min-w-[240px]"
              >
                Tạo thiệp ngay
              </Button>
            </Link>
          </motion.div>

          {/* Trust / Value props */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.6, delay: 1.15 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-ink/70"
          >
            <span className="px-3 py-1 rounded-full bg-cream/60 border border-gold/20">Gửi qua link hoặc QR</span>
            <span className="px-3 py-1 rounded-full bg-cream/60 border border-gold/20">Có nhạc nền &amp; hiệu ứng 3D</span>
            <span className="px-3 py-1 rounded-full bg-cream/60 border border-gold/20">Tùy biến phong bì, tem, chữ ký</span>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 1.4 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-0"
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, 10, 0] }}
              transition={reduceMotion ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-ink/40 pointer-events-none"
            >
              <span className="font-elegant text-xs tracking-widest uppercase">Khám phá</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-cream-light overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-script text-2xl text-gold mb-4 block"
            >
              Tại sao chọn Echo?
            </motion.span>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
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
                description:
                  'Mẫu thiệp vintage tinh tế, tập trung vào cảm xúc, nhịp đọc và chất liệu thị giác như thư tay.',
              },
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Tương Tác 3D',
                description: 'Thiệp mở ra như thật, hiệu ứng sống động vừa đủ—không phô trương nhưng "đáng nhớ".',
              },
              {
                icon: <Mail className="w-8 h-8" />,
                title: 'Cá Nhân Hóa',
                description: 'Tùy chỉnh phong bì, tem, nhạc nền và chữ ký để mỗi tấm thiệp mang dấu ấn riêng.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduceMotion ? { duration: 0 } : { delay: index * 0.15 }}
                className="group relative bg-cream/50 border border-gold/20 rounded-3xl p-8 shadow-vintage hover:shadow-elevated transition-all duration-500"
              >
                {/* Corner ornament */}
                <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-burgundy/10 flex items-center justify-center text-burgundy mb-6 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-ink mb-4">
                  {feature.title}
                </h3>
                <p className="font-body text-ink/70 leading-relaxed">
                  {feature.description}
                </p>

                {/* Decorative pattern */}
                <div className="absolute bottom-6 left-6 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="w-full h-full border-2 border-burgundy rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PRICING SECTION
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-vintage-paper overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-vintage-texture opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-script text-2xl text-gold mb-4 block"
            >
              Gói dịch vụ
            </motion.span>
            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold text-ink mb-6"
            >
              Chọn Gói <span className="text-burgundy">Phù Hợp</span>
            </motion.h2>
            <OrnamentDivider className="max-w-xs mx-auto mb-8" />
            <p className="font-body text-lg text-ink/60 max-w-2xl mx-auto">
              Sử dụng Tym để mở khóa các tính năng cao cấp.
              Đăng ký tài khoản để nhận Tym miễn phí ngay hôm nay!
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                name: 'Free',
                price: 'Miễn phí',
                features: ['5 mẫu thiệp cơ bản', 'Phong bì tiêu chuẩn', 'Chia sẻ qua link', 'Hỗ trợ cộng đồng'],
                highlight: false,
                tier: 'free',
              },
              {
                name: 'Plus',
                price: '99.000đ/tháng',
                features: ['Tất cả mẫu Plus', 'Tương tác 3D cơ bản', 'Nhạc nền', 'Tem & phong bì premium'],
                highlight: false,
                tier: 'plus',
              },
              {
                name: 'Pro',
                price: '199.000đ/tháng',
                features: ['Tất cả mẫu Pro', 'Tải nhạc riêng', 'Không giới hạn ảnh', 'Xóa logo Echo', 'Hỗ trợ ưu tiên'],
                highlight: true,
                tier: 'pro',
              },
              {
                name: 'Ultra',
                price: '399.000đ/tháng',
                features: ['Mẫu Ultra độc quyền', 'Thiết kế tùy chỉnh', 'API tích hợp', 'Bulk sending', 'Analytics', 'Hỗ trợ 24/7'],
                highlight: false,
                tier: 'ultra',
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={reduceMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduceMotion ? { duration: 0 } : { delay: index * 0.15 }}
                className={`
                  relative p-8 rounded-3xl border shadow-vintage transition-all duration-500
                  ${plan.highlight
                    ? 'bg-cream-light border-gold/40 shadow-elevated scale-105'
                    : 'bg-cream/50 border-gold/20 hover:border-gold/30 hover:shadow-elevated'
                  }
                `}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-gold text-cream-light font-display text-sm font-bold tracking-widest uppercase shadow-vintage">
                    Phổ biến
                  </div>
                )}

                <h3 className="font-display text-2xl font-bold text-ink mb-2">
                  {plan.name}
                </h3>
                <div className="font-display text-4xl font-bold text-burgundy mb-6">
                  {plan.price}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-ink/70">
                      <span className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <span className="font-body">{feature}</span>
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
            initial={reduceMotion ? false : { opacity: 0, y: 30 }}
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
                <Button variant="gold" size="lg">
                  Xem Mẫu Thiệp
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <motion.div
        initial={false}
        animate={
          showStickyCta
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
        className="fixed bottom-4 left-0 right-0 z-50 px-4 sm:hidden pointer-events-none"
        aria-hidden={!showStickyCta}
      >
        <div className="max-w-md mx-auto pointer-events-auto">
          <div className="rounded-2xl border border-gold/30 bg-cream-light/90 backdrop-blur-md shadow-elevated p-3">
            <Link href="/templates" aria-label="Chọn mẫu thiệp (nút nổi)">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                icon={<Sparkles className="w-5 h-5" />}
              >
                Tạo thiệp ngay
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <footer className="relative py-16 bg-cream-light">
        {/* Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-12" />

          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-burgundy flex items-center justify-center">
                  <Heart className="w-5 h-5 text-cream-light" fill="currentColor" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-ink">Echo</div>
                  <div className="font-elegant text-sm text-ink/60">Vintage E-card</div>
                </div>
              </div>
              <p className="font-body text-ink/60 leading-relaxed max-w-md">
                Nơi những lời yêu thương được gửi gắm một cách tinh tế và đáng nhớ.
                Tạo thiệp điện tử vintage độc đáo cho những người bạn yêu quý.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-display font-bold text-ink mb-4">Sản phẩm</h4>
              <ul className="space-y-2">
                <li><Link href="/templates" className="text-ink/60 hover:text-burgundy transition-colors">Mẫu thiệp</Link></li>
                <li><Link href="/services" className="text-ink/60 hover:text-burgundy transition-colors">Dịch vụ</Link></li>
                <li><Link href="/pricing" className="text-ink/60 hover:text-burgundy transition-colors">Bảng giá</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-ink mb-4">Hỗ trợ</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-ink/60 hover:text-burgundy transition-colors">Trung tâm trợ giúp</Link></li>
                <li><Link href="/privacy" className="text-ink/60 hover:text-burgundy transition-colors">Bảo mật</Link></li>
                <li><Link href="/terms" className="text-ink/60 hover:text-burgundy transition-colors">Điều khoản</Link></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gold/20 text-center text-ink/50 font-elegant">
            © {new Date().getFullYear()} Echo Vintage E-card. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
