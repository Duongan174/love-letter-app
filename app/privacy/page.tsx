// app/privacy/page.tsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, Eye, FileText, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function PrivacyPage() {
  const sections = [
    {
      id: 'introduction',
      title: '1. Giới thiệu',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>
            Chào mừng bạn đến với Echo - Nền tảng thiệp điện tử cao cấp. Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. 
            Chính sách quyền riêng tư này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi sử dụng dịch vụ của chúng tôi.
          </p>
          <p>
            Bằng việc sử dụng dịch vụ Echo, bạn đồng ý với các thực hành được mô tả trong chính sách này. 
            Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ của chúng tôi.
          </p>
        </div>
      )
    },
    {
      id: 'data-collection',
      title: '2. Thông tin chúng tôi thu thập',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">2.1. Thông tin bạn cung cấp</h4>
            <ul className="list-disc list-inside space-y-2 text-ink/80 dark:text-cream-light/80 ml-4">
              <li>Thông tin đăng ký tài khoản (tên, email, mật khẩu)</li>
              <li>Thông tin trong thiệp bạn tạo (tên người nhận, nội dung, ảnh, chữ ký)</li>
              <li>Thông tin thanh toán (khi mua gói Tym hoặc dịch vụ premium)</li>
              <li>Phản hồi và ý kiến bạn gửi cho chúng tôi</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">2.2. Thông tin tự động thu thập</h4>
            <ul className="list-disc list-inside space-y-2 text-ink/80 dark:text-cream-light/80 ml-4">
              <li>Thông tin thiết bị (loại thiết bị, hệ điều hành, trình duyệt)</li>
              <li>Địa chỉ IP và vị trí địa lý (ở mức độ thành phố/quốc gia)</li>
              <li>Dữ liệu sử dụng (các trang bạn truy cập, thời gian sử dụng)</li>
              <li>Cookies và công nghệ theo dõi tương tự</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'data-usage',
      title: '3. Cách chúng tôi sử dụng thông tin',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p>Chúng tôi sử dụng thông tin thu thập được để:</p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 dark:text-cream-light/80 ml-4">
            <li>Cung cấp, duy trì và cải thiện dịch vụ của chúng tôi</li>
            <li>Xử lý và gửi thiệp điện tử theo yêu cầu của bạn</li>
            <li>Gửi thông báo về dịch vụ, cập nhật và thông tin quan trọng</li>
            <li>Hỗ trợ khách hàng và phản hồi yêu cầu của bạn</li>
            <li>Phát hiện, ngăn chặn và giải quyết các vấn đề kỹ thuật hoặc lạm dụng</li>
            <li>Phân tích xu hướng sử dụng để cải thiện trải nghiệm người dùng</li>
            <li>Tuân thủ các nghĩa vụ pháp lý và bảo vệ quyền lợi của chúng tôi</li>
          </ul>
        </div>
      )
    },
    {
      id: 'data-sharing',
      title: '4. Chia sẻ thông tin',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p>Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi có thể chia sẻ thông tin trong các trường hợp sau:</p>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">4.1. Nhà cung cấp dịch vụ</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Chúng tôi có thể chia sẻ thông tin với các nhà cung cấp dịch vụ bên thứ ba (như Google, Supabase) 
              để hỗ trợ hoạt động của dịch vụ, như lưu trữ dữ liệu, xử lý thanh toán, và phân tích.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">4.2. Yêu cầu pháp lý</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Chúng tôi có thể tiết lộ thông tin nếu được yêu cầu bởi pháp luật, quyết định tòa án, 
              hoặc cơ quan chính phủ có thẩm quyền.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ink dark:text-cream-light mb-2">4.3. Bảo vệ quyền lợi</h4>
            <p className="text-ink/80 dark:text-cream-light/80">
              Chúng tôi có thể chia sẻ thông tin để bảo vệ quyền, tài sản hoặc an toàn của Echo, 
              người dùng hoặc bên thứ ba.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'data-security',
      title: '5. Bảo mật dữ liệu',
      icon: Lock,
      content: (
        <div className="space-y-4">
          <p>
            Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ thông tin cá nhân của bạn 
            khỏi truy cập trái phép, mất mát, hủy hoại hoặc thay đổi.
          </p>
          <p>
            Tuy nhiên, không có phương thức truyền tải qua Internet hoặc lưu trữ điện tử nào là 100% an toàn. 
            Do đó, chúng tôi không thể đảm bảo tuyệt đối về tính bảo mật của thông tin.
          </p>
        </div>
      )
    },
    {
      id: 'your-rights',
      title: '6. Quyền của bạn',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p>Bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
          <ul className="list-disc list-inside space-y-2 text-ink/80 dark:text-cream-light/80 ml-4">
            <li><strong>Quyền truy cập:</strong> Bạn có thể yêu cầu xem thông tin cá nhân chúng tôi lưu trữ về bạn</li>
            <li><strong>Quyền chỉnh sửa:</strong> Bạn có thể cập nhật thông tin cá nhân trong tài khoản của mình</li>
            <li><strong>Quyền xóa:</strong> Bạn có thể yêu cầu xóa tài khoản và dữ liệu của mình</li>
            <li><strong>Quyền từ chối:</strong> Bạn có thể từ chối nhận email marketing từ chúng tôi</li>
            <li><strong>Quyền khiếu nại:</strong> Bạn có thể khiếu nại về cách chúng tôi xử lý dữ liệu của bạn</li>
          </ul>
          <p>
            Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: 
            <a href="mailto:privacy@echo-vintage.com" className="text-burgundy dark:text-gold hover:underline ml-1">
              privacy@echo-vintage.com
            </a>
          </p>
        </div>
      )
    },
    {
      id: 'cookies',
      title: '7. Cookies và công nghệ theo dõi',
      icon: Eye,
      content: (
        <div className="space-y-4">
          <p>
            Chúng tôi sử dụng cookies và công nghệ tương tự để cải thiện trải nghiệm của bạn, 
            phân tích cách bạn sử dụng dịch vụ, và cá nhân hóa nội dung.
          </p>
          <p>
            Bạn có thể kiểm soát cookies thông qua cài đặt trình duyệt của mình. 
            Tuy nhiên, việc tắt cookies có thể ảnh hưởng đến chức năng của một số tính năng.
          </p>
        </div>
      )
    },
    {
      id: 'children',
      title: '8. Trẻ em',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p>
            Dịch vụ của chúng tôi không dành cho trẻ em dưới 13 tuổi. 
            Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi.
          </p>
          <p>
            Nếu bạn là phụ huynh hoặc người giám hộ và phát hiện con bạn đã cung cấp thông tin cá nhân cho chúng tôi, 
            vui lòng liên hệ với chúng tôi để chúng tôi có thể xóa thông tin đó.
          </p>
        </div>
      )
    },
    {
      id: 'changes',
      title: '9. Thay đổi chính sách',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p>
            Chúng tôi có thể cập nhật Chính sách quyền riêng tư này theo thời gian. 
            Chúng tôi sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng chính sách mới trên trang này 
            và cập nhật ngày "Cập nhật lần cuối" ở phía dưới.
          </p>
          <p>
            Chúng tôi khuyến khích bạn xem lại Chính sách quyền riêng tư này định kỳ để nắm được cách chúng tôi bảo vệ thông tin của bạn.
          </p>
        </div>
      )
    },
    {
      id: 'contact',
      title: '10. Liên hệ',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <p>
            Nếu bạn có câu hỏi hoặc lo ngại về Chính sách quyền riêng tư này, 
            vui lòng liên hệ với chúng tôi:
          </p>
          <div className="bg-cream-light dark:bg-ink/50 border border-gold/20 dark:border-gold/30 rounded-xl p-6">
            <p className="font-semibold text-ink dark:text-cream-light mb-2">Echo - Vintage E-Card</p>
            <p className="text-ink/80 dark:text-cream-light/80 mb-1">
              Email: <a href="mailto:privacy@echo-vintage.com" className="text-burgundy dark:text-gold hover:underline">privacy@echo-vintage.com</a>
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
                <Shield className="w-8 h-8 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-4xl font-bold text-ink dark:text-cream-light mb-2">
                  Chính sách quyền riêng tư
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
              Bằng việc sử dụng dịch vụ Echo, bạn đã đọc và đồng ý với Chính sách quyền riêng tư này.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

