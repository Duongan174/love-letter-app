// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';

// Load fonts bằng next/font để đảm bảo subset Vietnamese được tải đúng,
// tránh lỗi dấu khi font fallback hoặc thiếu glyph.
import {
  Be_Vietnam_Pro,
  Playfair_Display,
  Dancing_Script,
  Lexend,
  Cormorant_Garamond,
  EB_Garamond,
  Crimson_Pro,
} from 'next/font/google';

// Font nền tảng cho tiếng Việt (ưu tiên dùng cho nội dung tiếng Việt)
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-vn',
});

// Font display (heading) — có subset Vietnamese để không vỡ dấu
const playfair = Playfair_Display({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const cormorant = Cormorant_Garamond({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-heading',
});

const ebGaramond = EB_Garamond({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-elegant',
});

const crimsonPro = Crimson_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-body',
});

// Lexend thường dùng cho UI hiện đại — có subset Vietnamese
const lexend = Lexend({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-modern',
});

// Dancing Script có thể dùng trang trí, nhưng tiếng Việt dễ lỗi nếu glyph thiếu.
// Ở đây vẫn load, nhưng bạn nên dùng class .font-script-vn cho text tiếng Việt (fallback Be Vietnam Pro).
const dancingScript = Dancing_Script({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-script',
});

export const metadata: Metadata = {
  title: 'Echo | Gửi Trọn Yêu Thương',
  description: 'Nền tảng gửi thiệp điện tử và kết nối cảm xúc.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="vi"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        // Gắn biến font vào scope body để override :root fallback trong globals.css
        className={[
          beVietnamPro.variable,
          playfair.variable,
          cormorant.variable,
          ebGaramond.variable,
          crimsonPro.variable,
          lexend.variable,
          dancingScript.variable,
          'antialiased',
        ].join(' ')}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
