// app/help/legal/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scale, FileText, Mail, AlertCircle, CheckCircle, Clock, Send, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function LegalHelpPage() {
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    email: user?.email || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs = [
    {
      q: 'Làm thế nào để yêu cầu xóa nội dung vi phạm?',
      a: 'Nếu bạn phát hiện nội dung vi phạm quyền của mình hoặc pháp luật, vui lòng gửi yêu cầu xóa đến legal@echo-vintage.com với thông tin: URL của nội dung, lý do yêu cầu xóa, và bằng chứng (nếu có). Chúng tôi sẽ xem xét và phản hồi trong vòng 7 ngày làm việc.'
    },
    {
      q: 'Tôi muốn khiếu nại về việc xử lý dữ liệu cá nhân?',
      a: 'Bạn có thể gửi khiếu nại đến privacy@echo-vintage.com. Chúng tôi cam kết xử lý mọi khiếu nại một cách nghiêm túc và phản hồi trong thời gian hợp lý.'
    },
    {
      q: 'Làm thế nào để yêu cầu truy cập hoặc chỉnh sửa dữ liệu cá nhân?',
      a: 'Bạn có thể truy cập và chỉnh sửa hầu hết thông tin cá nhân trong phần Cài đặt của tài khoản. Đối với các yêu cầu phức tạp hơn, vui lòng liên hệ privacy@echo-vintage.com.'
    },
    {
      q: 'Tôi muốn xóa tài khoản và dữ liệu của mình?',
      a: 'Bạn có thể xóa tài khoản trong phần Cài đặt > Thông tin tài khoản. Hoặc gửi yêu cầu đến privacy@echo-vintage.com. Lưu ý: Việc xóa tài khoản là không thể hoàn tác và tất cả dữ liệu sẽ bị xóa vĩnh viễn.'
    },
    {
      q: 'Echo có tuân thủ GDPR/CCPA không?',
      a: 'Chúng tôi cam kết tuân thủ các quy định về bảo vệ dữ liệu cá nhân, bao gồm GDPR (cho người dùng EU) và các quy định tương tự. Bạn có thể thực hiện các quyền của mình theo quy định tại Chính sách quyền riêng tư.'
    },
    {
      q: 'Làm thế nào để báo cáo vi phạm bản quyền?',
      a: 'Nếu bạn tin rằng nội dung trên Echo vi phạm bản quyền của bạn, vui lòng gửi thông báo DMCA đến legal@echo-vintage.com với đầy đủ thông tin theo quy định pháp luật.'
    }
  ];

  const requestTypes = [
    {
      id: 'content_removal',
      icon: FileText,
      title: 'Yêu cầu xóa nội dung',
      description: 'Yêu cầu xóa nội dung vi phạm quyền hoặc pháp luật',
      email: 'legal@echo-vintage.com',
      subject: 'Yêu cầu xóa nội dung'
    },
    {
      id: 'privacy_complaint',
      icon: Scale,
      title: 'Khiếu nại về quyền riêng tư',
      description: 'Khiếu nại về cách chúng tôi xử lý dữ liệu cá nhân',
      email: 'privacy@echo-vintage.com',
      subject: 'Khiếu nại quyền riêng tư'
    },
    {
      id: 'data_access',
      icon: CheckCircle,
      title: 'Yêu cầu truy cập dữ liệu',
      description: 'Yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân',
      email: 'privacy@echo-vintage.com',
      subject: 'Yêu cầu truy cập dữ liệu'
    },
    {
      id: 'copyright',
      icon: AlertCircle,
      title: 'Báo cáo vi phạm bản quyền',
      description: 'Báo cáo nội dung vi phạm quyền sở hữu trí tuệ',
      email: 'legal@echo-vintage.com',
      subject: 'Báo cáo vi phạm bản quyền'
    }
  ];

  const handleOpenForm = (typeId: string) => {
    setSelectedRequestType(typeId);
    setShowRequestForm(true);
    const type = requestTypes.find(t => t.id === typeId);
    if (type) {
      setFormData({
        subject: type.subject,
        message: '',
        email: user?.email || ''
      });
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestType) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/legal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_type: selectedRequestType,
          subject: formData.subject,
          message: formData.message,
          email: formData.email
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Không thể gửi yêu cầu');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setShowRequestForm(false);
        setIsSubmitted(false);
        setFormData({ subject: '', message: '', email: user?.email || '' });
        setSelectedRequestType(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting legal request:', error);
      alert(error.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-light dark:bg-ink">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link 
              href="/help"
              className="inline-flex items-center gap-2 text-ink/60 dark:text-cream-light/60 hover:text-burgundy dark:hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-elegant">Quay lại Trợ giúp</span>
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-burgundy flex items-center justify-center">
                <Scale className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold text-ink dark:text-cream-light mb-2">
                  Trợ giúp về Pháp lý
                </h1>
                <p className="text-ink/60 dark:text-cream-light/60">
                  Hướng dẫn về các vấn đề pháp lý và cách yêu cầu thay đổi nội dung
                </p>
              </div>
            </div>
          </motion.div>

          {/* Request Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-cream-light mb-6">
              Các loại yêu cầu pháp lý
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requestTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + (index * 0.1) }}
                    className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-burgundy/10 dark:bg-burgundy/20 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-burgundy dark:text-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-ink dark:text-cream-light mb-2">
                          {type.title}
                        </h3>
                        <p className="text-sm text-ink/70 dark:text-cream-light/70 mb-4">
                          {type.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleOpenForm(type.id)}
                            icon={<Send className="w-4 h-4" />}
                          >
                            Gửi yêu cầu
                          </Button>
                          <a
                            href={`mailto:${type.email}?subject=${encodeURIComponent(type.subject)}`}
                            className="inline-flex items-center gap-2 text-sm text-ink/60 dark:text-cream-light/60 hover:text-burgundy dark:hover:text-gold transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            Hoặc email
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-cream-light mb-6">
              Câu hỏi thường gặp
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                  className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl p-6"
                >
                  <h3 className="font-display font-semibold text-ink dark:text-cream-light mb-3 flex items-start gap-2">
                    <span className="text-burgundy dark:text-gold">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-ink/80 dark:text-cream-light/80 ml-6 flex items-start gap-2">
                    <span className="text-gold">A:</span>
                    <span>{faq.a}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Process Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl p-8 mb-12"
          >
            <h2 className="font-display text-2xl font-semibold text-ink dark:text-cream-light mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-burgundy dark:text-gold" />
              Quy trình xử lý yêu cầu
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-burgundy dark:bg-gold flex items-center justify-center flex-shrink-0 text-cream-light dark:text-ink font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-ink dark:text-cream-light mb-1">Gửi yêu cầu</h4>
                  <p className="text-sm text-ink/70 dark:text-cream-light/70">
                    Gửi email với đầy đủ thông tin và bằng chứng (nếu có)
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-burgundy dark:bg-gold flex items-center justify-center flex-shrink-0 text-cream-light dark:text-ink font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-ink dark:text-cream-light mb-1">Xác nhận nhận được</h4>
                  <p className="text-sm text-ink/70 dark:text-cream-light/70">
                    Chúng tôi sẽ xác nhận đã nhận được yêu cầu trong vòng 2 ngày làm việc
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-burgundy dark:bg-gold flex items-center justify-center flex-shrink-0 text-cream-light dark:text-ink font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-ink dark:text-cream-light mb-1">Xem xét và xử lý</h4>
                  <p className="text-sm text-ink/70 dark:text-cream-light/70">
                    Chúng tôi sẽ xem xét yêu cầu và xử lý trong vòng 7-14 ngày làm việc
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-burgundy dark:bg-gold flex items-center justify-center flex-shrink-0 text-cream-light dark:text-ink font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-ink dark:text-cream-light mb-1">Phản hồi</h4>
                  <p className="text-sm text-ink/70 dark:text-cream-light/70">
                    Chúng tôi sẽ thông báo kết quả xử lý qua email
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Important Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-burgundy/10 dark:bg-burgundy/20 border border-burgundy/20 dark:border-burgundy/30 rounded-xl p-6"
          >
            <h3 className="font-display font-semibold text-ink dark:text-cream-light mb-4">
              Tài liệu pháp lý liên quan
            </h3>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy">
                <Button variant="ghost" size="sm">
                  Chính sách quyền riêng tư
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="ghost" size="sm">
                  Điều khoản dịch vụ
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="ghost" size="sm">
                  Trung tâm trợ giúp
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Legal Request Form Modal */}
      <AnimatePresence>
        {showRequestForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !isSubmitting && setShowRequestForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cream-light dark:bg-ink rounded-xl shadow-elevated p-6 max-w-2xl w-full border border-gold/30 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-ink dark:text-cream-light">
                  {selectedRequestType && requestTypes.find(t => t.id === selectedRequestType)?.title}
                </h2>
                <button
                  onClick={() => setShowRequestForm(false)}
                  disabled={isSubmitting}
                  className="p-2 rounded-lg hover:bg-ink/10 dark:hover:bg-cream-light/10 transition-colors"
                >
                  <X className="w-5 h-5 text-ink dark:text-cream-light" />
                </button>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink dark:text-cream-light mb-2">
                    Yêu cầu đã được gửi thành công!
                  </h3>
                  <p className="text-ink/60 dark:text-cream-light/60">
                    Chúng tôi sẽ xem xét và phản hồi trong vòng 7-14 ngày làm việc.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-6">
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
                      className="w-full px-4 py-3 rounded-xl border border-gold/20 dark:border-gold/30 bg-cream-light dark:bg-ink text-ink dark:text-cream-light placeholder:text-ink/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-display font-semibold text-ink dark:text-cream-light mb-2">
                      Nội dung chi tiết
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={8}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mô tả chi tiết yêu cầu của bạn, bao gồm URL (nếu có), bằng chứng, và bất kỳ thông tin liên quan nào..."
                      className="w-full px-4 py-3 rounded-xl border border-gold/20 dark:border-gold/30 bg-cream-light dark:bg-ink text-ink dark:text-cream-light placeholder:text-ink/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40 resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-display font-semibold text-ink dark:text-cream-light mb-2">
                      Email liên hệ
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gold/20 dark:border-gold/30 bg-cream-light dark:bg-ink text-ink dark:text-cream-light placeholder:text-ink/40 dark:placeholder:text-cream-light/40 focus:outline-none focus:ring-2 focus:ring-gold/30 dark:focus:ring-gold/40"
                    />
                    <p className="mt-2 text-sm text-ink/50 dark:text-cream-light/50">
                      Chúng tôi sẽ sử dụng email này để liên hệ với bạn về yêu cầu này
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={() => setShowRequestForm(false)}
                      disabled={isSubmitting}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting || !formData.subject || !formData.message || !formData.email}
                      icon={isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Send className="w-4 h-4" />}
                    >
                      {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

