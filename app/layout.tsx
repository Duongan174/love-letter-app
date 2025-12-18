// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers'; // Đảm bảo import đúng

export const metadata: Metadata = {
  title: 'Echo | Gửi Trọn Yêu Thương',
  description: 'Nền tảng gửi thiệp điện tử và kết nối cảm xúc.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 👇 THÊM: data-scroll-behavior="smooth" để sửa lỗi warning
    <html lang="vi" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Lexend:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased bg-gray-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}