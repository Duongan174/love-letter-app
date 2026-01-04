// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import ErrorBoundaryWrapper from '@/components/providers/ErrorBoundaryWrapper';
import { serverLogger } from '@/lib/server-logger';

// Load fonts bằng next/font để đảm bảo subset Vietnamese được tải đúng,
// tránh lỗi dấu khi font fallback hoặc thiếu glyph.
import {
  // Be_Vietnam_Pro, // ✅ Tạm thời comment do lỗi Turbopack, dùng Inter thay thế
  Playfair_Display,
  Dancing_Script,
  Lexend,
  Cormorant_Garamond,
  Crimson_Pro,
  Inter,
  Noto_Sans,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Quicksand,
  Raleway,
  Nunito,
  Pacifico,
  Lobster,
  Great_Vibes,
} from 'next/font/google';

// Tạm thời comment EB_Garamond do lỗi với Turbopack trong Next.js 16
// import { EB_Garamond } from 'next/font/google';

// Font nền tảng cho tiếng Việt (ưu tiên dùng cho nội dung tiếng Việt)
// Fix: Tạm thời comment Be_Vietnam_Pro do lỗi Turbopack, dùng Inter thay thế
// Inter có hỗ trợ tiếng Việt tốt và không gặp lỗi với Turbopack
// const beVietnamPro = Be_Vietnam_Pro({
//   subsets: ['latin'],
//   weight: ['300', '400', '500', '600', '700', '800'],
//   display: 'swap',
//   variable: '--font-vn',
// });
// Tạm thời dùng Inter làm fallback
const beVietnamPro = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-vn',
});

// Font display (heading) — có subset Vietnamese để không vỡ dấu
const playfair = Playfair_Display({
  subsets: ['vietnamese', 'latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-display',
  adjustFontFallback: true,
});

const cormorant = Cormorant_Garamond({
  subsets: ['vietnamese', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-heading',
  adjustFontFallback: true,
});

// Tạm thời sử dụng Cormorant_Garamond thay cho EB_Garamond do lỗi Turbopack
// Sẽ uncomment khi Next.js fix lỗi này
// const ebGaramond = EB_Garamond({
//   subsets: ['vietnamese', 'latin'],
//   weight: ['400', '500', '600', '700', '800'],
//   style: ['normal', 'italic'],
//   display: 'swap',
//   variable: '--font-elegant',
// });
const ebGaramond = cormorant; // Fallback tạm thời

const crimsonPro = Crimson_Pro({
  subsets: ['vietnamese', 'latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-body',
  adjustFontFallback: true,
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

// ─────────────────────────────────────────────────────────────────────────────
// Additional fonts for RichTextEditor (Google Docs-like experience)
// NOTE: Dùng subsets: ['latin'] để tránh build fail nếu font không có subset "vietnamese".
// Người dùng vẫn có thể nhập tiếng Việt, nhưng một số font decorative có thể fallback.
// ─────────────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-inter',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-notosans',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  variable: '--font-roboto',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-opensans',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  display: 'swap',
  variable: '--font-lato',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-quicksand',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-raleway',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito',
});

// Decorative fonts
const pacifico = Pacifico({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-pacifico',
});

const lobster = Lobster({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-lobster',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-greatvibes',
});

export const metadata: Metadata = {
  title: 'Echo | Gửi Trọn Yêu Thương',
  description: 'Nền tảng gửi thiệp điện tử và kết nối cảm xúc.',
  other: {
    // Preconnect to Google Fonts for faster font loading
    'preconnect-google-fonts': 'https://fonts.googleapis.com',
    'preconnect-google-fonts-static': 'https://fonts.gstatic.com',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // ✅ Log layout render (chỉ trong development)
  if (process.env.NODE_ENV === 'development') {
    serverLogger.debug('RootLayout rendering', {
      timestamp: new Date().toISOString(),
    });
  }

  return (
    <html
      lang="vi"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        {/* ✅ Preconnect to Google Fonts for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
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
          inter.variable,
          notoSans.variable,
          roboto.variable,
          openSans.variable,
          lato.variable,
          montserrat.variable,
          poppins.variable,
          quicksand.variable,
          raleway.variable,
          nunito.variable,
          pacifico.variable,
          lobster.variable,
          greatVibes.variable,
          'antialiased',
        ].join(' ')}
      >
        {/* ✅ Error Boundary wrapper (Client Component) để bắt lỗi từ client components */}
        <ErrorBoundaryWrapper>
          <Providers>{children}</Providers>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}
