// app/feedback/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MessageSquare, ArrowLeft, Send, CheckCircle,
  Star, AlertCircle, Heart, Lightbulb
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function FeedbackPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    type: 'suggestion',
    rating: 0,
    subject: '',
    message: '',
    email: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const feedbackTypes = [
    {
      id: 'suggestion',
      label: 'Đề xuất',
      icon: Lightbulb,
      description: 'Gợi ý tính năng mới hoặc cải thiện'
    },
    {
      id: 'bug',
      label: 'Báo lỗi',
      icon: AlertCircle,
      description: 'Báo cáo lỗi hoặc sự cố kỹ thuật'
    },
    {
      id: 'compliment',
      label: 'Khen ngợi',
      icon: Heart,
      description: 'Chia sẻ điều bạn thích về Echo'
    },
    {
      id: 'other',
      label: 'Khác',
      icon: MessageSquare,
      description: 'Ý kiến khác'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Gửi feedback đến API hoặc email service
      // Ví dụ: await fetch('/api/feedback', { method: 'POST', body: JSON.stringify(formData) });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      setFormData({
        type: 'suggestion',
        rating: 0,
        subject: '',
        message: '',
        email: user?.email || ''
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Có lỗi xảy ra khi gửi phản hồi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-cream-light dark:bg-ink">
        <Header />
        <main className="pt-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="font-display text-3xl font-bold text-ink dark:text-cream-light mb-4">
                Cảm ơn bạn đã gửi phản hồi!
              </h1>
              <p className="text-ink/60 dark:text-cream-light/60 mb-8">
                Chúng tôi đã nhận được ý kiến của bạn và sẽ xem xét trong thời gian sớm nhất.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/">
                  <Button variant="primary">
                    Về trang chủ
                  </Button>
                </Link>
                <Button 
                  variant="ghost"
                  onClick={() => setIsSubmitted(false)}
                >
                  Gửi phản hồi khác
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light dark:bg-ink">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                <MessageSquare className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold text-ink dark:text-cream-light mb-2">
                  Gửi ý kiến phản hồi
                </h1>
                <p className="text-ink/60 dark:text-cream-light/60">
                  Chúng tôi rất mong nhận được ý kiến của bạn để cải thiện Echo
                </p>
              </div>
            </div>
          </motion.div>

          {/* Feedback Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl shadow-vintage p-8 space-y-6"
          >
            {/* Feedback Type */}
            <div>
              <label className="block font-display font-semibold text-ink dark:text-cream-light mb-3">
                Loại phản hồi
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`
                        p-4 rounded-xl border-2 transition-all
                        ${formData.type === type.id
                          ? 'border-burgundy dark:border-gold bg-burgundy-50 dark:bg-burgundy/20'
                          : 'border-gold/20 dark:border-gold/30 hover:border-gold/40 dark:hover:border-gold/50'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-2 ${formData.type === type.id ? 'text-burgundy dark:text-gold' : 'text-ink/40 dark:text-cream-light/40'}`} />
                      <p className={`text-sm font-medium ${formData.type === type.id ? 'text-burgundy dark:text-gold' : 'text-ink/60 dark:text-cream-light/60'}`}>
                        {type.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block font-display font-semibold text-ink dark:text-cream-light mb-3">
                Đánh giá tổng thể
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= formData.rating
                          ? 'text-gold fill-gold'
                          : 'text-ink/20 dark:text-cream-light/20'
                      }`}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <span className="ml-2 text-sm text-ink/60 dark:text-cream-light/60">
                    {formData.rating === 5 ? 'Tuyệt vời!' : 
                     formData.rating === 4 ? 'Tốt' :
                     formData.rating === 3 ? 'Ổn' :
                     formData.rating === 2 ? 'Cần cải thiện' : 'Không hài lòng'}
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block font-display font-semibold text-ink dark:text-cream-light mb-2">
                Tiêu đề
              </label>
              <input
                type="text"
                id="subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Tóm tắt ngắn gọn về phản hồi của bạn"
                className="w-full px-4 py-3 rounded-xl border border-gold/20 dark:border-gold/30 bg-cream-light dark:bg-ink text-ink dark:text-cream-light placeholder:text-ink/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block font-display font-semibold text-ink dark:text-cream-light mb-2">
                Nội dung chi tiết
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mô tả chi tiết về phản hồi của bạn..."
                className="w-full px-4 py-3 rounded-xl border border-gold/20 dark:border-gold/30 bg-cream-light dark:bg-ink text-ink dark:text-cream-light placeholder:text-ink/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40 resize-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-display font-semibold text-ink dark:text-cream-light mb-2">
                Email liên hệ (tùy chọn)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gold/20 dark:border-gold/30 bg-cream-light dark:bg-ink text-ink dark:text-cream-light placeholder:text-ink/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40"
              />
              <p className="mt-2 text-sm text-ink/50 dark:text-cream-light/50">
                Chúng tôi có thể liên hệ lại với bạn nếu cần thêm thông tin
              </p>
            </div>

            {/* Legal Consent */}
            <div className="bg-ink/5 dark:bg-cream-light/5 border border-gold/20 dark:border-gold/30 rounded-xl p-6 space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-5 h-5 text-burgundy dark:text-gold border-gold/30 dark:border-gold/40 rounded focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40 cursor-pointer"
                  required
                />
                <div className="flex-1">
                  <p className="text-sm text-ink dark:text-cream-light mb-3">
                    Chúng tôi có thể gửi email cho bạn để hỏi thêm thông tin hoặc để cập nhật thông tin cho bạn
                  </p>
                  <p className="text-xs text-ink/70 dark:text-cream-light/70 leading-relaxed">
                    Một số{' '}
                    <Link href="/privacy" className="underline hover:text-burgundy dark:hover:text-gold transition-colors">
                      thông tin về tài khoản và hệ thống
                    </Link>
                    {' '}có thể được gửi đến Google. Chúng tôi sẽ sử dụng thông tin đó để khắc phục vấn đề và cải thiện dịch vụ, theo{' '}
                    <Link href="/privacy" className="underline hover:text-burgundy dark:hover:text-gold transition-colors">
                      Chính sách quyền riêng tư
                    </Link>
                    {' '}và{' '}
                    <Link href="/terms" className="underline hover:text-burgundy dark:hover:text-gold transition-colors">
                      Điều khoản dịch vụ
                    </Link>
                    {' '}của chúng tôi. Có thể chúng tôi sẽ email cho bạn khi có thông tin khác hoặc nội dung cập nhật. Hãy truy cập trang{' '}
                    <Link href="/help/legal" className="underline hover:text-burgundy dark:hover:text-gold transition-colors">
                      Trợ giúp về Pháp lý
                    </Link>
                    {' '}để yêu cầu thay đổi nội dung vì lý do pháp lý.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <Link href="/">
                <Button variant="ghost" type="button">
                  Hủy
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !formData.subject || !formData.message || !consentChecked}
                icon={isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Send className="w-4 h-4" />}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi phản hồi'}
              </Button>
            </div>
          </motion.form>
        </div>
      </main>
    </div>
  );
}

