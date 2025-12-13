import './globals.css';
import type { Metadata } from 'next';
// Import phông chữ từ Google Fonts
import { Dancing_Script, Inter } from 'next/font/google';

// Khai báo phông chữ viết tay (Dancing Script)
const dancingScript = Dancing_Script({ 
  subsets: ['vietnamese'], // Quan trọng: Chọn subset tiếng Việt
  variable: '--font-handwriting', // Đặt tên biến CSS
  display: 'swap',
});

// Phông chữ hệ thống mặc định
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vintage E-Card: Thiệp Kỷ Niệm',
  description: 'Nền tảng tạo và gửi thư tay điện tử mang phong cách hoài cổ.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Thêm class font-serif (mặc định) và biến phông chữ vào thẻ body
    <html lang="vi" className={`${inter.className} ${dancingScript.variable}`}>
      <body>{children}</body>
    </html>
  );
}