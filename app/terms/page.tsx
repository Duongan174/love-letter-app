// app/terms/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, AlertTriangle, Ban, Shield, CheckCircle } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function TermsPage() {
  const sections = [
    {
      id: 'acceptance',
      title: '1. Chấp nhận điều khoản',
      icon: CheckCircle,
      content: (
        <div className="space-y-4">
          <p>
            Bằng việc truy cập và sử dụng dịch vụ Echo - Nền tảng thiệp điện tử cao cấp, 
            bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản dịch vụ này. 
            Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, 
            bạn không được phép sử dụng dịch vụ của chúng tôi.
          </p>
        </div>
      )
    },
    {
      id: 'description',
      title: '2. Mô tả dịch vụ',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>
            Echo cung cấp nền tảng cho phép người dùng tạo, tùy chỉnh và gửi thiệp điện tử với các tính năng:
          </p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 dark:text-cream-light/80 ml-4">
            <li>Tạo thiệp điện tử với nhiều mẫu thiết kế</li>
            <li>Tùy chỉnh nội dung, màu sắc, hình ảnh và nhạc nền</li>
            <li>Gửi thiệp qua link, QR code, email hoặc Facebook Messenger</li>
            <li>Lưu trữ và quản lý thiệp đã tạo</li>
            <li>Các tính năng tương tác 3D và hiệu ứng đặc biệt</li>
          </ul>
        </div>
      )
    },
    {
      id: 'account',
      title: '3. Tài khoản người dùng',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">3.1. Đăng ký tài khoản</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Để sử dụng một số tính năng của dịch vụ, bạn cần đăng ký tài khoản. 
              Bạn cam kết cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">3.2. Bảo mật tài khoản</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Bạn chịu trách nhiệm duy trì tính bảo mật của mật khẩu và tài khoản của mình. 
              Bạn đồng ý thông báo ngay lập tức cho chúng tôi về bất kỳ việc sử dụng trái phép nào.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">3.3. Độ tuổi</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Bạn phải từ 13 tuổi trở lên để sử dụng dịch vụ. Nếu bạn dưới 18 tuổi, 
              bạn cần có sự đồng ý của phụ huynh hoặc người giám hộ.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'user-content',
      title: '4. Nội dung người dùng',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">4.1. Quyền sở hữu</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Bạn giữ quyền sở hữu đối với nội dung bạn tạo và tải lên dịch vụ. 
              Tuy nhiên, bằng việc sử dụng dịch vụ, bạn cấp cho Echo quyền sử dụng, 
              lưu trữ và hiển thị nội dung đó để cung cấp dịch vụ.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">4.2. Nội dung cấm</h4>
            <p className="text-ink/80 dark:text-cream-light/80 mb-2">
              Bạn không được tạo, tải lên hoặc chia sẻ nội dung:
            </p>
            <ul className="list-disc list-inside space-y-2 text-ink/80 dark:text-cream-light/80 ml-4">
              <li>Vi phạm quyền sở hữu trí tuệ của người khác</li>
              <li>Chứa nội dung bất hợp pháp, độc hại, đe dọa, lạm dụng, quấy rối</li>
              <li>Chứa thông tin cá nhân của người khác mà không có sự đồng ý</li>
              <li>Chứa virus, mã độc hoặc các thành phần có hại khác</li>
              <li>Vi phạm pháp luật hoặc quy định hiện hành</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'prohibited-uses',
      title: '5. Sử dụng bị cấm',
      icon: Ban,
      content: (
        <div className="space-y-4">
          <p>Bạn không được sử dụng dịch vụ để:</p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 dark:text-cream-light/80 ml-4">
            <li>Vi phạm bất kỳ luật pháp hoặc quy định nào</li>
            <li>Gửi spam, thư rác hoặc nội dung không mong muốn</li>
            <li>Thu thập thông tin cá nhân của người dùng khác</li>
            <li>Can thiệp hoặc phá vỡ hoạt động của dịch vụ</li>
            <li>Sử dụng bot, script hoặc công cụ tự động để truy cập dịch vụ</li>
            <li>Thực hiện bất kỳ hoạt động nào có thể gây hại cho dịch vụ hoặc người dùng khác</li>
          </ul>
        </div>
      )
    },
    {
      id: 'payment',
      title: '6. Thanh toán và phí dịch vụ',
      icon: Scale,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">6.1. Phí dịch vụ</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Một số tính năng của Echo có thể yêu cầu thanh toán. 
              Chúng tôi sẽ thông báo rõ ràng về các khoản phí trước khi bạn thanh toán.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">6.2. Hoàn tiền</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Chính sách hoàn tiền sẽ được áp dụng theo quy định tại thời điểm mua. 
              Vui lòng liên hệ bộ phận hỗ trợ để biết thêm chi tiết.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">6.3. Tym (Đơn vị tiền tệ)</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Tym là đơn vị tiền tệ trong hệ thống. Bạn có thể mua Tym hoặc nhận Tym thông qua mã khuyến mãi. 
              Tym không thể hoàn lại thành tiền mặt và chỉ có giá trị trong hệ thống Echo.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'intellectual-property',
      title: '7. Sở hữu trí tuệ',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p>
            Tất cả nội dung, tính năng và chức năng của dịch vụ Echo, bao gồm nhưng không giới hạn ở 
            thiết kế, logo, văn bản, đồ họa, hình ảnh, video, âm thanh, phần mềm và mã nguồn, 
            đều thuộc sở hữu của Echo hoặc các nhà cung cấp nội dung của chúng tôi và được bảo vệ bởi 
            luật bản quyền, nhãn hiệu và các luật sở hữu trí tuệ khác.
          </p>
          <p>
            Bạn không được sao chép, sửa đổi, phân phối, bán hoặc cho thuê bất kỳ phần nào của dịch vụ 
            mà không có sự cho phép bằng văn bản của chúng tôi.
          </p>
        </div>
      )
    },
    {
      id: 'termination',
      title: '8. Chấm dứt dịch vụ',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">8.1. Chấm dứt bởi bạn</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Bạn có thể chấm dứt tài khoản của mình bất cứ lúc nào bằng cách xóa tài khoản trong phần cài đặt 
              hoặc liên hệ với bộ phận hỗ trợ.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">8.2. Chấm dứt bởi chúng tôi</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Chúng tôi có quyền đình chỉ hoặc chấm dứt quyền truy cập của bạn vào dịch vụ ngay lập tức, 
              không cần thông báo trước, nếu bạn vi phạm các Điều khoản dịch vụ này.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'disclaimer',
      title: '9. Từ chối trách nhiệm',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4">
          <p>
            Dịch vụ được cung cấp "như hiện tại" và "như có sẵn". Chúng tôi không đảm bảo rằng dịch vụ sẽ 
            không bị gián đoạn, không có lỗi, an toàn hoặc đáp ứng nhu cầu của bạn.
          </p>
          <p>
            Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, 
            bao gồm nhưng không giới hạn ở thiệt hại trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả.
          </p>
        </div>
      )
    },
    {
      id: 'changes',
      title: '10. Thay đổi điều khoản',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>
            Chúng tôi có quyền sửa đổi các Điều khoản dịch vụ này bất cứ lúc nào. 
            Chúng tôi sẽ thông báo cho bạn về các thay đổi quan trọng bằng cách đăng các điều khoản mới trên trang này 
            và cập nhật ngày "Cập nhật lần cuối".
          </p>
          <p>
            Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi có hiệu lực được coi là bạn đã chấp nhận các điều khoản mới.
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      title: '11. Liên hệ',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>
            Nếu bạn có câu hỏi về các Điều khoản dịch vụ này, vui lòng liên hệ với chúng tôi:
          </p>
          <div className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl p-6">
            <p className="font-semibold text-ink dark:text-cream-light mb-2">Echo - Vintage E-Card</p>
            <p className="text-ink/80 dark:text-cream-light/80 mb-1">
              Email: <a href="mailto:legal@echo-vintage.com" className="text-burgundy dark:text-gold hover:underline">legal@echo-vintage.com</a>
            </p>
            <p className="text-ink/80 dark:text-cream-light/80">
              Hotline: <a href="tel:19001234" className="text-burgundy dark:text-gold hover:underline">1900 1234</a>
            </p>
          </div>
        </div>
      )
    }
  ];

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
              href="/"
              className="inline-flex items-center gap-2 text-ink/60 dark:text-cream-light/60 hover:text-burgundy dark:hover:text-gold transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-elegant">Quay lại trang chủ</span>
            </Link>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-burgundy flex items-center justify-center">
                <Scale className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold text-ink dark:text-cream-light mb-2">
                  Điều khoản dịch vụ
                </h1>
                <p className="text-ink/60 dark:text-cream-light/60">
                  Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Content Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl shadow-vintage p-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6 text-burgundy dark:text-gold" />
                    <h2 className="font-display text-2xl font-semibold text-ink dark:text-cream-light">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-ink/80 dark:text-cream-light/80 leading-relaxed">
                    {section.content}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 p-6 bg-burgundy/10 dark:bg-burgundy/20 border border-burgundy/20 dark:border-burgundy/30 rounded-xl text-center"
          >
            <p className="text-sm text-ink/70 dark:text-cream-light/70">
              Bằng việc sử dụng dịch vụ Echo, bạn đã đọc và đồng ý với các Điều khoản dịch vụ này.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

