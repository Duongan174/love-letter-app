// File: app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

// Import 9 phông chữ bạn muốn giữ lại
import { 
  Dancing_Script, 
  Lexend, 
  Pacifico, 
  Lobster,
  Arizonia, 
  Vibes,
  Charm,
  Kaushan_Script,
  Pinyon_Script
} from 'next/font/google';


// Khai báo các biến phông chữ
// 1. Phông chữ hỗ trợ 'vietnamese' (Giữ nguyên khai báo subsets)
const dancingScript = Dancing_Script({ variable: '--font-dancing', subsets: ['vietnamese'], display: 'swap' });
const lexend = Lexend({ variable: '--font-lexend', subsets: ['vietnamese'], display: 'swap' });
const pacifico = Pacifico({ variable: '--font-pacifico', subsets: ['vietnamese'], weight: '400', display: 'swap' });
const lobster = Lobster({ variable: '--font-lobster', subsets: ['vietnamese'], weight: '400', display: 'swap' });


// 2. Phông chữ chỉ có 'latin' (Bỏ hoàn toàn tham số subsets để TypeScript không kiểm tra)
// Chúng ta chấp nhận rủi ro nhỏ về lỗi phông cho 5 phông này
const arizonia = Arizonia({ variable: '--font-arizonia', weight: '400', display: 'swap' }); 
const vibes = Vibes({ variable: '--font-vibes', weight: '400', display: 'swap' });
const charm = Charm({ variable: '--font-charm', weight: '400', display: 'swap' });
const kaushan = Kaushan_Script({ variable: '--font-kaushan', weight: '400', display: 'swap' });
const pinyon = Pinyon_Script({ variable: '--font-pinyon', weight: '400', display: 'swap' });


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
    <html 
      lang="vi" 
      className={`${inter.className} 
        ${dancingScript.variable} 
        ${lexend.variable} 
        ${pacifico.variable}
        ${lobster.variable}
        ${arizonia.variable} 
        ${vibes.variable}
        ${charm.variable}
        ${kaushan.variable}
        ${pinyon.variable}
      `}
    >
      <body>{children}</body>
    </html>
  );
}