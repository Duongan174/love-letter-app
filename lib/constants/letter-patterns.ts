/**
 * ✅ LETTER PATTERNS - 100+ Họa tiết cho giấy viết thư
 * Các pattern phù hợp cho nền giấy viết: tinh tế, nhẹ nhàng, không làm rối mắt
 * Hỗ trợ Free/Pro tier
 */

export type PatternTier = 'free' | 'pro' | 'premium';

export interface LetterPattern {
  id: string;
  name: string;
  nameEn: string;
  preview: string;
  category: string;
  tier: PatternTier;
  /** SVG pattern string hoặc CSS pattern */
  svgPattern?: string;
  cssPattern?: string;
  backgroundSize?: string;
}

// ============================================
// 📝 BASIC LINES (12 patterns)
// ============================================
const BASIC_LINES: LetterPattern[] = [
  { id: 'solid', name: 'Trơn', nameEn: 'Solid', preview: '■', category: 'basic', tier: 'free' },
  { id: 'lined', name: 'Kẻ ngang', nameEn: 'Lined', preview: '═', category: 'basic', tier: 'free',
    cssPattern: 'repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.08) 31px, rgba(0,0,0,0.08) 32px)' },
  { id: 'lined-wide', name: 'Kẻ ngang rộng', nameEn: 'Wide Lined', preview: '━', category: 'basic', tier: 'free',
    cssPattern: 'repeating-linear-gradient(0deg, transparent, transparent 47px, rgba(0,0,0,0.06) 47px, rgba(0,0,0,0.06) 48px)' },
  { id: 'lined-narrow', name: 'Kẻ ngang hẹp', nameEn: 'Narrow Lined', preview: '―', category: 'basic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(0,0,0,0.08) 23px, rgba(0,0,0,0.08) 24px)' },
  { id: 'grid', name: 'Lưới', nameEn: 'Grid', preview: '▦', category: 'basic', tier: 'free',
    cssPattern: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
    backgroundSize: '24px 24px' },
  { id: 'grid-fine', name: 'Lưới mịn', nameEn: 'Fine Grid', preview: '▤', category: 'basic', tier: 'pro',
    cssPattern: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)',
    backgroundSize: '16px 16px' },
  { id: 'dotted', name: 'Chấm bi', nameEn: 'Dotted', preview: '●', category: 'basic', tier: 'free',
    cssPattern: 'radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)',
    backgroundSize: '20px 20px' },
  { id: 'dotted-sparse', name: 'Chấm thưa', nameEn: 'Sparse Dots', preview: '○', category: 'basic', tier: 'pro',
    cssPattern: 'radial-gradient(circle, rgba(0,0,0,0.06) 2px, transparent 2px)',
    backgroundSize: '32px 32px' },
  { id: 'diagonal-lines', name: 'Sọc chéo', nameEn: 'Diagonal Lines', preview: '╱', category: 'basic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.04) 10px, rgba(0,0,0,0.04) 11px)' },
  { id: 'cross-hatch', name: 'Gạch chéo', nameEn: 'Cross Hatch', preview: '╳', category: 'basic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 11px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 11px)' },
  { id: 'dashed', name: 'Nét đứt', nameEn: 'Dashed', preview: '┈', category: 'basic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(0deg, transparent, transparent 30px, rgba(0,0,0,0.08) 30px, rgba(0,0,0,0.08) 31px), repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(255,255,255,1) 4px, rgba(255,255,255,1) 8px)' },
  { id: 'margin', name: 'Lề đỏ', nameEn: 'Red Margin', preview: '┃', category: 'basic', tier: 'free',
    cssPattern: 'linear-gradient(90deg, transparent 60px, rgba(255,0,0,0.1) 60px, rgba(255,0,0,0.1) 62px, transparent 62px), repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.08) 31px, rgba(0,0,0,0.08) 32px)' },
];

// ============================================
// 🌸 FLORAL (15 patterns)
// ============================================
const FLORAL: LetterPattern[] = [
  { id: 'floral', name: 'Hoa lá nhẹ', nameEn: 'Light Floral', preview: '🌸', category: 'floral', tier: 'free',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%23000' fill-opacity='0.05'><path d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10-10c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm-10 30c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm30-10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/></g></svg>` },
  { id: 'roses', name: 'Hoa hồng', nameEn: 'Roses', preview: '🌹', category: 'floral', tier: 'free',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%23E91E63' fill-opacity='0.06'><circle cx='30' cy='30' r='8'/><circle cx='30' cy='20' r='4'/><circle cx='40' cy='30' r='4'/><circle cx='30' cy='40' r='4'/><circle cx='20' cy='30' r='4'/><circle cx='37' cy='23' r='3'/><circle cx='37' cy='37' r='3'/><circle cx='23' cy='37' r='3'/><circle cx='23' cy='23' r='3'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'sakura', name: 'Hoa anh đào', nameEn: 'Sakura', preview: '🌸', category: 'floral', tier: 'free',
    svgPattern: `<svg width='70' height='70' xmlns='http://www.w3.org/2000/svg'><g fill='%23FFACC7' fill-opacity='0.12'><ellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(0 35 35)'/><ellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(72 35 35)'/><ellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(144 35 35)'/><ellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(216 35 35)'/><ellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(288 35 35)'/><circle cx='35' cy='35' r='5' fill='%23FFD4E0'/></g></svg>`, backgroundSize: '70px 70px' },
  { id: 'daisy', name: 'Hoa cúc', nameEn: 'Daisy', preview: '🌼', category: 'floral', tier: 'pro',
    svgPattern: `<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'><g fill='%23FFF' fill-opacity='0.9' stroke='%23FFD700' stroke-opacity='0.2' stroke-width='0.5'><ellipse cx='25' cy='13' rx='4' ry='8'/><ellipse cx='25' cy='37' rx='4' ry='8'/><ellipse cx='13' cy='25' rx='8' ry='4'/><ellipse cx='37' cy='25' rx='8' ry='4'/><ellipse cx='17' cy='17' rx='4' ry='8' transform='rotate(45 17 17)'/><ellipse cx='33' cy='33' rx='4' ry='8' transform='rotate(45 33 33)'/><ellipse cx='17' cy='33' rx='4' ry='8' transform='rotate(-45 17 33)'/><ellipse cx='33' cy='17' rx='4' ry='8' transform='rotate(-45 33 17)'/><circle cx='25' cy='25' r='5' fill='%23FFD700' fill-opacity='0.3'/></g></svg>`, backgroundSize: '50px 50px' },
  { id: 'tulip', name: 'Hoa tulip', nameEn: 'Tulip', preview: '🌷', category: 'floral', tier: 'pro',
    svgPattern: `<svg width='40' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%23FF69B4' fill-opacity='0.1'><ellipse cx='20' cy='18' rx='8' ry='12'/><ellipse cx='14' cy='20' rx='6' ry='10' transform='rotate(-20 14 20)'/><ellipse cx='26' cy='20' rx='6' ry='10' transform='rotate(20 26 20)'/><path d='M18 30 L20 55 L22 30' fill='%234CAF50' fill-opacity='0.08'/></g></svg>`, backgroundSize: '40px 60px' },
  { id: 'lavender', name: 'Oải hương', nameEn: 'Lavender', preview: '💜', category: 'floral', tier: 'pro',
    svgPattern: `<svg width='30' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%239C27B0' fill-opacity='0.08'><ellipse cx='15' cy='10' rx='4' ry='5'/><ellipse cx='15' cy='18' rx='4' ry='5'/><ellipse cx='15' cy='26' rx='4' ry='5'/><ellipse cx='15' cy='34' rx='4' ry='5'/><ellipse cx='15' cy='42' rx='4' ry='5'/><ellipse cx='15' cy='50' rx='3' ry='4'/><path d='M14 55 L15 75 L16 55' fill='%234CAF50' fill-opacity='0.06'/></g></svg>`, backgroundSize: '30px 80px' },
  { id: 'wildflower', name: 'Hoa dại', nameEn: 'Wildflower', preview: '🌺', category: 'floral', tier: 'pro',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.08'><circle cx='20' cy='20' r='8' fill='%23FF69B4'/><circle cx='60' cy='30' r='6' fill='%23FFD700'/><circle cx='40' cy='60' r='7' fill='%239C27B0'/><circle cx='70' cy='70' r='5' fill='%23FF6B6B'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'peony', name: 'Mẫu đơn', nameEn: 'Peony', preview: '🌺', category: 'floral', tier: 'premium',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%23F48FB1' fill-opacity='0.1'><circle cx='40' cy='40' r='15'/><ellipse cx='40' cy='22' rx='8' ry='12'/><ellipse cx='40' cy='58' rx='8' ry='12'/><ellipse cx='22' cy='40' rx='12' ry='8'/><ellipse cx='58' cy='40' rx='12' ry='8'/><ellipse cx='28' cy='28' rx='8' ry='10' transform='rotate(45 28 28)'/><ellipse cx='52' cy='52' rx='8' ry='10' transform='rotate(45 52 52)'/><ellipse cx='28' cy='52' rx='8' ry='10' transform='rotate(-45 28 52)'/><ellipse cx='52' cy='28' rx='8' ry='10' transform='rotate(-45 52 28)'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'lotus', name: 'Hoa sen', nameEn: 'Lotus', preview: '🪷', category: 'floral', tier: 'premium',
    svgPattern: `<svg width='70' height='50' xmlns='http://www.w3.org/2000/svg'><g fill='%23F8BBD0' fill-opacity='0.12'><ellipse cx='35' cy='35' rx='8' ry='15'/><ellipse cx='25' cy='38' rx='6' ry='12' transform='rotate(-20 25 38)'/><ellipse cx='45' cy='38' rx='6' ry='12' transform='rotate(20 45 38)'/><ellipse cx='18' cy='42' rx='5' ry='10' transform='rotate(-35 18 42)'/><ellipse cx='52' cy='42' rx='5' ry='10' transform='rotate(35 52 42)'/></g></svg>`, backgroundSize: '70px 50px' },
  { id: 'magnolia', name: 'Hoa mộc lan', nameEn: 'Magnolia', preview: '🌸', category: 'floral', tier: 'premium',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%23FFF5EE' fill-opacity='0.9' stroke='%23F8BBD0' stroke-opacity='0.2' stroke-width='0.5'><ellipse cx='40' cy='25' rx='10' ry='18'/><ellipse cx='25' cy='45' rx='10' ry='18' transform='rotate(-60 25 45)'/><ellipse cx='55' cy='45' rx='10' ry='18' transform='rotate(60 55 45)'/><circle cx='40' cy='45' r='8' fill='%23FFE0B2' fill-opacity='0.3'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'hibiscus', name: 'Dâm bụt', nameEn: 'Hibiscus', preview: '🌺', category: 'floral', tier: 'pro',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%23E91E63' fill-opacity='0.08'><ellipse cx='30' cy='15' rx='8' ry='12'/><ellipse cx='30' cy='45' rx='8' ry='12'/><ellipse cx='15' cy='30' rx='12' ry='8'/><ellipse cx='45' cy='30' rx='12' ry='8'/><ellipse cx='20' cy='20' rx='7' ry='10' transform='rotate(45 20 20)'/><circle cx='30' cy='30' r='6' fill='%23FFD700' fill-opacity='0.15'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'sunflower', name: 'Hướng dương', nameEn: 'Sunflower', preview: '🌻', category: 'floral', tier: 'pro',
    svgPattern: `<svg width='70' height='70' xmlns='http://www.w3.org/2000/svg'><g><g fill='%23FFD700' fill-opacity='0.1'><ellipse cx='35' cy='18' rx='6' ry='12'/><ellipse cx='35' cy='52' rx='6' ry='12'/><ellipse cx='18' cy='35' rx='12' ry='6'/><ellipse cx='52' cy='35' rx='12' ry='6'/><ellipse cx='23' cy='23' rx='6' ry='10' transform='rotate(45 23 23)'/><ellipse cx='47' cy='47' rx='6' ry='10' transform='rotate(45 47 47)'/><ellipse cx='23' cy='47' rx='6' ry='10' transform='rotate(-45 23 47)'/><ellipse cx='47' cy='23' rx='6' ry='10' transform='rotate(-45 47 23)'/></g><circle cx='35' cy='35' r='10' fill='%238B4513' fill-opacity='0.1'/></g></svg>`, backgroundSize: '70px 70px' },
  { id: 'cherry-blossom-branch', name: 'Cành anh đào', nameEn: 'Cherry Branch', preview: '🌸', category: 'floral', tier: 'premium',
    svgPattern: `<svg width='100' height='60' xmlns='http://www.w3.org/2000/svg'><g><path d='M0 50 Q30 40 50 45 T100 35' stroke='%238B4513' stroke-opacity='0.1' stroke-width='2' fill='none'/><g fill='%23FFB7C5' fill-opacity='0.15'><circle cx='25' cy='42' r='6'/><circle cx='50' cy='45' r='5'/><circle cx='75' cy='38' r='6'/><circle cx='15' cy='48' r='4'/><circle cx='85' cy='32' r='5'/></g></g></svg>`, backgroundSize: '100px 60px' },
  { id: 'vine', name: 'Dây leo', nameEn: 'Vine', preview: '🌿', category: 'floral', tier: 'pro',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g stroke='%234CAF50' stroke-opacity='0.1' stroke-width='1.5' fill='none'><path d='M0 40 Q20 20 40 40 T80 40'/><path d='M40 0 Q20 20 40 40 T40 80'/></g><g fill='%234CAF50' fill-opacity='0.08'><ellipse cx='20' cy='30' rx='6' ry='4' transform='rotate(-30 20 30)'/><ellipse cx='60' cy='30' rx='6' ry='4' transform='rotate(30 60 30)'/><ellipse cx='30' cy='60' rx='6' ry='4' transform='rotate(20 30 60)'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'wisteria', name: 'Tử đằng', nameEn: 'Wisteria', preview: '💜', category: 'floral', tier: 'premium',
    svgPattern: `<svg width='40' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='%239C27B0' fill-opacity='0.08'><ellipse cx='20' cy='15' rx='8' ry='6'/><ellipse cx='20' cy='28' rx='7' ry='5'/><ellipse cx='20' cy='40' rx='6' ry='5'/><ellipse cx='20' cy='51' rx='5' ry='4'/><ellipse cx='20' cy='61' rx='4' ry='4'/><ellipse cx='20' cy='70' rx='3' ry='3'/><ellipse cx='20' cy='78' rx='2' ry='2'/></g></svg>`, backgroundSize: '40px 100px' },
];

// ============================================
// 💕 ROMANTIC (12 patterns)
// ============================================
const ROMANTIC: LetterPattern[] = [
  { id: 'hearts', name: 'Trái tim', nameEn: 'Hearts', preview: '💕', category: 'romantic', tier: 'free',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M20 35l-2.5-2.3C9.5 25.2 4 20.1 4 14c0-5 3.9-9 8.6-9 2.8 0 5.4 1.3 7.4 3.5C21.9 6.3 24.5 5 27.4 5 32.1 5 36 9 36 14c0 6.1-5.5 11.2-13.5 18.7L20 35z' fill='%23FF69B4' fill-opacity='0.08'/></svg>`, backgroundSize: '40px 40px' },
  { id: 'hearts-outline', name: 'Tim viền', nameEn: 'Heart Outline', preview: '♡', category: 'romantic', tier: 'free',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M20 35l-2.5-2.3C9.5 25.2 4 20.1 4 14c0-5 3.9-9 8.6-9 2.8 0 5.4 1.3 7.4 3.5C21.9 6.3 24.5 5 27.4 5 32.1 5 36 9 36 14c0 6.1-5.5 11.2-13.5 18.7L20 35z' fill='none' stroke='%23FF69B4' stroke-opacity='0.12' stroke-width='1.5'/></svg>`, backgroundSize: '40px 40px' },
  { id: 'hearts-scattered', name: 'Tim rải', nameEn: 'Scattered Hearts', preview: '💗', category: 'romantic', tier: 'pro',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%23FF69B4' fill-opacity='0.08'><path d='M15 20l-1.5-1.4C8.7 14.6 5 11.5 5 7.8c0-3 2.3-5.4 5.2-5.4 1.7 0 3.2.8 4.4 2.1C15.8 3.2 17.4 2.4 19 2.4c2.9 0 5.2 2.4 5.2 5.4 0 3.7-3.7 6.8-8.7 10.8L15 20z' transform='translate(5,10)'/><path d='M15 20l-1.5-1.4C8.7 14.6 5 11.5 5 7.8c0-3 2.3-5.4 5.2-5.4 1.7 0 3.2.8 4.4 2.1C15.8 3.2 17.4 2.4 19 2.4c2.9 0 5.2 2.4 5.2 5.4 0 3.7-3.7 6.8-8.7 10.8L15 20z' transform='translate(45,50) scale(0.8)'/><path d='M15 20l-1.5-1.4C8.7 14.6 5 11.5 5 7.8c0-3 2.3-5.4 5.2-5.4 1.7 0 3.2.8 4.4 2.1C15.8 3.2 17.4 2.4 19 2.4c2.9 0 5.2 2.4 5.2 5.4 0 3.7-3.7 6.8-8.7 10.8L15 20z' transform='translate(55,15) scale(0.6)'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'love-arrows', name: 'Mũi tên tình yêu', nameEn: 'Cupid Arrows', preview: '💘', category: 'romantic', tier: 'pro',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g stroke='%23FF69B4' stroke-opacity='0.1' stroke-width='1.5' fill='none'><line x1='5' y1='55' x2='55' y2='5'/><polygon points='55,5 45,5 55,15' fill='%23FF69B4' fill-opacity='0.08'/><path d='M20 40l-1.5-1.4C13.7 34.6 10 31.5 10 27.8c0-3 2.3-5.4 5.2-5.4 1.7 0 3.2.8 4.4 2.1 1.2-1.3 2.8-2.1 4.4-2.1 2.9 0 5.2 2.4 5.2 5.4 0 3.7-3.7 6.8-8.7 10.8L20 40z' fill='%23FF69B4' fill-opacity='0.1'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'kisses', name: 'Nụ hôn', nameEn: 'Kisses', preview: '💋', category: 'romantic', tier: 'pro',
    svgPattern: `<svg width='50' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='%23FF1744' fill-opacity='0.08'><ellipse cx='18' cy='20' rx='12' ry='8'/><ellipse cx='32' cy='20' rx='12' ry='8'/><path d='M25 15 Q25 25 25 28'/></g></svg>`, backgroundSize: '50px 40px' },
  { id: 'bow', name: 'Nơ', nameEn: 'Bow', preview: '🎀', category: 'romantic', tier: 'pro',
    svgPattern: `<svg width='50' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='%23FF69B4' fill-opacity='0.1'><ellipse cx='15' cy='20' rx='12' ry='8'/><ellipse cx='35' cy='20' rx='12' ry='8'/><rect x='23' y='16' width='4' height='8' rx='1'/><path d='M25 28 L22 38 M25 28 L28 38' stroke='%23FF69B4' stroke-opacity='0.08' stroke-width='2'/></g></svg>`, backgroundSize: '50px 40px' },
  { id: 'love-letter', name: 'Thư tình', nameEn: 'Love Letter', preview: '💌', category: 'romantic', tier: 'premium',
    svgPattern: `<svg width='50' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='%23FFF' fill-opacity='0.8' stroke='%23FF69B4' stroke-opacity='0.15' stroke-width='1'><rect x='5' y='8' width='40' height='28' rx='2'/><path d='M5 10 L25 24 L45 10' fill='none'/><path d='M25 18l-1-0.9C21.5 15 19 13.2 19 11c0-1.7 1.3-3 2.9-3 .9 0 1.8.4 2.4 1.2.6-.8 1.5-1.2 2.4-1.2 1.6 0 2.9 1.3 2.9 3 0 2.2-2.5 4-5.1 6.1L25 18z' fill='%23FF69B4' fill-opacity='0.2'/></g></svg>`, backgroundSize: '50px 40px' },
  { id: 'ring', name: 'Nhẫn', nameEn: 'Ring', preview: '💍', category: 'romantic', tier: 'premium',
    svgPattern: `<svg width='40' height='50' xmlns='http://www.w3.org/2000/svg'><g><circle cx='20' cy='32' r='10' fill='none' stroke='%23FFD700' stroke-opacity='0.15' stroke-width='3'/><path d='M15 22 L20 12 L25 22' fill='%2300CED1' fill-opacity='0.15'/></g></svg>`, backgroundSize: '40px 50px' },
  { id: 'roses-romantic', name: 'Hồng lãng mạn', nameEn: 'Romantic Roses', preview: '🌹', category: 'romantic', tier: 'premium',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%23C62828' fill-opacity='0.08'><circle cx='30' cy='25' r='10'/><ellipse cx='20' cy='30' rx='6' ry='8'/><ellipse cx='40' cy='30' rx='6' ry='8'/><ellipse cx='25' cy='38' rx='5' ry='7'/><ellipse cx='35' cy='38' rx='5' ry='7'/></g><g fill='%234CAF50' fill-opacity='0.06'><ellipse cx='15' cy='50' rx='8' ry='4' transform='rotate(-20 15 50)'/><ellipse cx='45' cy='50' rx='8' ry='4' transform='rotate(20 45 50)'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'wedding-bells', name: 'Chuông cưới', nameEn: 'Wedding Bells', preview: '🔔', category: 'romantic', tier: 'premium',
    svgPattern: `<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'><g fill='%23FFD700' fill-opacity='0.1'><path d='M25 5 L25 10 M22 45 L28 45 M15 40 Q15 25 25 15 Q35 25 35 40 Z'/><circle cx='25' cy='42' r='3'/></g></svg>`, backgroundSize: '50px 50px' },
  { id: 'dove', name: 'Bồ câu', nameEn: 'Dove', preview: '🕊', category: 'romantic', tier: 'premium',
    svgPattern: `<svg width='60' height='50' xmlns='http://www.w3.org/2000/svg'><g fill='%23fff' fill-opacity='0.8' stroke='%23ccc' stroke-opacity='0.15' stroke-width='0.5'><ellipse cx='30' cy='30' rx='15' ry='10'/><ellipse cx='42' cy='28' rx='12' ry='6' transform='rotate(-10 42 28)'/><circle cx='18' cy='28' r='6'/><ellipse cx='15' cy='26' rx='3' ry='2'/></g></svg>`, backgroundSize: '60px 50px' },
  { id: 'infinity', name: 'Vô cực', nameEn: 'Infinity', preview: '∞', category: 'romantic', tier: 'pro',
    svgPattern: `<svg width='60' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M10 20 C10 10 20 10 30 20 C40 30 50 30 50 20 C50 10 40 10 30 20 C20 30 10 30 10 20' fill='none' stroke='%23FF69B4' stroke-opacity='0.1' stroke-width='2'/></svg>`, backgroundSize: '60px 40px' },
];

// ============================================
// ⭐ CELESTIAL (10 patterns)
// ============================================
const CELESTIAL: LetterPattern[] = [
  { id: 'stars', name: 'Ngôi sao', nameEn: 'Stars', preview: '⭐', category: 'celestial', tier: 'free',
    svgPattern: `<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'><polygon points='25,2 32,18 50,18 36,29 41,46 25,36 9,46 14,29 0,18 18,18' fill='%23FFD700' fill-opacity='0.1'/></svg>`, backgroundSize: '50px 50px' },
  { id: 'sparkles', name: 'Lấp lánh', nameEn: 'Sparkles', preview: '✨', category: 'celestial', tier: 'free',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M20 0l2 8 8-2-8 2 2 8-2-8-8 2 8-2-2-8z' fill='%23FFD700' fill-opacity='0.12'/></svg>`, backgroundSize: '40px 40px' },
  { id: 'moon-stars', name: 'Trăng sao', nameEn: 'Moon Stars', preview: '🌙', category: 'celestial', tier: 'pro',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g><path d='M50 40 A20 20 0 1 1 50 60 A15 15 0 1 0 50 40' fill='%23FFE082' fill-opacity='0.1'/><polygon points='20,15 22,20 27,20 23,23 24,28 20,25 16,28 17,23 13,20 18,20' fill='%23FFD700' fill-opacity='0.1'/><polygon points='70,60 71,63 74,63 72,65 73,68 70,66 67,68 68,65 66,63 69,63' fill='%23FFD700' fill-opacity='0.08'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'constellation', name: 'Chòm sao', nameEn: 'Constellation', preview: '✦', category: 'celestial', tier: 'pro',
    svgPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='%23fff' fill-opacity='0.3' stroke='%23FFD700' stroke-opacity='0.1' stroke-width='0.5'><circle cx='20' cy='20' r='2'/><circle cx='50' cy='30' r='1.5'/><circle cx='80' cy='25' r='2'/><circle cx='30' cy='60' r='1.5'/><circle cx='70' cy='70' r='2'/><circle cx='45' cy='85' r='1.5'/><line x1='20' y1='20' x2='50' y2='30'/><line x1='50' y1='30' x2='80' y2='25'/><line x1='50' y1='30' x2='30' y2='60'/><line x1='30' y1='60' x2='70' y2='70'/><line x1='70' y1='70' x2='45' y2='85'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'galaxy', name: 'Thiên hà', nameEn: 'Galaxy', preview: '🌌', category: 'celestial', tier: 'premium',
    cssPattern: 'radial-gradient(ellipse at 30% 40%, rgba(138,43,226,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(0,191,255,0.06) 0%, transparent 40%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 30%)' },
  { id: 'northern-lights', name: 'Bắc cực quang', nameEn: 'Northern Lights', preview: '🌌', category: 'celestial', tier: 'premium',
    cssPattern: 'linear-gradient(180deg, rgba(34,211,238,0.05) 0%, rgba(139,92,246,0.08) 50%, rgba(236,72,153,0.05) 100%)' },
  { id: 'shooting-star', name: 'Sao băng', nameEn: 'Shooting Star', preview: '💫', category: 'celestial', tier: 'pro',
    svgPattern: `<svg width='80' height='40' xmlns='http://www.w3.org/2000/svg'><g><polygon points='70,10 72,14 76,14 73,17 74,21 70,18 66,21 67,17 64,14 68,14' fill='%23FFD700' fill-opacity='0.15'/><line x1='10' y1='35' x2='65' y2='12' stroke='%23FFD700' stroke-opacity='0.1' stroke-width='1.5'/></g></svg>`, backgroundSize: '80px 40px' },
  { id: 'sun-rays', name: 'Tia nắng', nameEn: 'Sun Rays', preview: '☀️', category: 'celestial', tier: 'pro',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g stroke='%23FFD700' stroke-opacity='0.08' stroke-width='1.5' fill='none'><circle cx='30' cy='30' r='10'/><line x1='30' y1='5' x2='30' y2='15'/><line x1='30' y1='45' x2='30' y2='55'/><line x1='5' y1='30' x2='15' y2='30'/><line x1='45' y1='30' x2='55' y2='30'/><line x1='12' y1='12' x2='19' y2='19'/><line x1='41' y1='41' x2='48' y2='48'/><line x1='12' y1='48' x2='19' y2='41'/><line x1='41' y1='19' x2='48' y2='12'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'crescent', name: 'Trăng khuyết', nameEn: 'Crescent', preview: '🌛', category: 'celestial', tier: 'pro',
    svgPattern: `<svg width='40' height='50' xmlns='http://www.w3.org/2000/svg'><path d='M30 25 A15 15 0 1 1 30 35 A12 12 0 1 0 30 25' fill='%23FFE082' fill-opacity='0.1'/></svg>`, backgroundSize: '40px 50px' },
  { id: 'starfield', name: 'Trường sao', nameEn: 'Starfield', preview: '✧', category: 'celestial', tier: 'premium',
    svgPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='%23000' fill-opacity='0.05'><circle cx='10' cy='15' r='1'/><circle cx='45' cy='8' r='0.5'/><circle cx='80' cy='20' r='1.2'/><circle cx='25' cy='40' r='0.8'/><circle cx='60' cy='35' r='1'/><circle cx='90' cy='50' r='0.6'/><circle cx='15' cy='70' r='1'/><circle cx='50' cy='65' r='0.7'/><circle cx='75' cy='80' r='1.1'/><circle cx='35' cy='90' r='0.5'/><circle cx='85' cy='95' r='0.8'/></g></svg>`, backgroundSize: '100px 100px' },
];

// ============================================
// 🦋 NATURE (12 patterns)
// ============================================
const NATURE: LetterPattern[] = [
  { id: 'butterflies', name: 'Bướm', nameEn: 'Butterflies', preview: '🦋', category: 'nature', tier: 'free',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%239C27B0' fill-opacity='0.07'><ellipse cx='25' cy='40' rx='12' ry='18' transform='rotate(-30 25 40)'/><ellipse cx='55' cy='40' rx='12' ry='18' transform='rotate(30 55 40)'/><ellipse cx='30' cy='55' rx='8' ry='12' transform='rotate(-30 30 55)'/><ellipse cx='50' cy='55' rx='8' ry='12' transform='rotate(30 50 55)'/><circle cx='40' cy='40' r='3'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'leaves', name: 'Lá cây', nameEn: 'Leaves', preview: '🍃', category: 'nature', tier: 'free',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><path d='M30 5c-10 15-5 35 0 50 5-15 10-35 0-50z' fill='%234CAF50' fill-opacity='0.08'/><path d='M15 20c10 10 25 10 30 25-15-5-25-10-30-25z' fill='%234CAF50' fill-opacity='0.05'/></svg>`, backgroundSize: '60px 60px' },
  { id: 'feathers', name: 'Lông vũ', nameEn: 'Feathers', preview: '🪶', category: 'nature', tier: 'pro',
    svgPattern: `<svg width='50' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23795548' stroke-opacity='0.1' stroke-width='0.5'><path d='M25 5 Q30 20 25 40 Q20 60 25 75'/><path d='M25 15 Q35 25 25 25'/><path d='M25 25 Q15 30 25 35'/><path d='M25 35 Q35 40 25 45'/><path d='M25 45 Q15 50 25 55'/><path d='M25 55 Q35 60 25 65'/></g></svg>`, backgroundSize: '50px 80px' },
  { id: 'dragonfly', name: 'Chuồn chuồn', nameEn: 'Dragonfly', preview: '🪻', category: 'nature', tier: 'pro',
    svgPattern: `<svg width='60' height='50' xmlns='http://www.w3.org/2000/svg'><g fill='%2300BCD4' fill-opacity='0.08' stroke='%2300BCD4' stroke-opacity='0.1' stroke-width='0.5'><ellipse cx='30' cy='25' rx='25' ry='8' transform='rotate(-15 30 25)'/><ellipse cx='30' cy='25' rx='25' ry='8' transform='rotate(15 30 25)'/><ellipse cx='30' cy='30' rx='3' ry='15'/></g></svg>`, backgroundSize: '60px 50px' },
  { id: 'bee', name: 'Ong', nameEn: 'Bee', preview: '🐝', category: 'nature', tier: 'pro',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g><ellipse cx='20' cy='22' rx='8' ry='10' fill='%23FFD700' fill-opacity='0.1'/><rect x='14' y='18' width='12' height='3' fill='%23000' fill-opacity='0.05'/><rect x='14' y='24' width='12' height='3' fill='%23000' fill-opacity='0.05'/><ellipse cx='15' cy='15' rx='6' ry='4' fill='%23fff' fill-opacity='0.3' transform='rotate(-30 15 15)'/><ellipse cx='25' cy='15' rx='6' ry='4' fill='%23fff' fill-opacity='0.3' transform='rotate(30 25 15)'/></g></svg>`, backgroundSize: '40px 40px' },
  { id: 'ladybug', name: 'Bọ rùa', nameEn: 'Ladybug', preview: '🐞', category: 'nature', tier: 'pro',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g><circle cx='20' cy='22' r='12' fill='%23F44336' fill-opacity='0.1'/><line x1='20' y1='10' x2='20' y2='34' stroke='%23000' stroke-opacity='0.05' stroke-width='1'/><circle cx='14' cy='18' r='2' fill='%23000' fill-opacity='0.08'/><circle cx='26' cy='18' r='2' fill='%23000' fill-opacity='0.08'/><circle cx='16' cy='26' r='1.5' fill='%23000' fill-opacity='0.08'/><circle cx='24' cy='26' r='1.5' fill='%23000' fill-opacity='0.08'/><circle cx='20' cy='10' r='4' fill='%23000' fill-opacity='0.05'/></g></svg>`, backgroundSize: '40px 40px' },
  { id: 'birds', name: 'Chim', nameEn: 'Birds', preview: '🐦', category: 'nature', tier: 'pro',
    svgPattern: `<svg width='60' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23000' stroke-opacity='0.08' stroke-width='1.5'><path d='M10 25 Q20 15 30 25'/><path d='M30 25 Q40 15 50 25'/></g></svg>`, backgroundSize: '60px 40px' },
  { id: 'clouds', name: 'Mây', nameEn: 'Clouds', preview: '☁️', category: 'nature', tier: 'free',
    svgPattern: `<svg width='100' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%2390CAF9' fill-opacity='0.1'><ellipse cx='30' cy='40' rx='20' ry='12'/><ellipse cx='50' cy='35' rx='15' ry='10'/><ellipse cx='65' cy='42' rx='18' ry='11'/></g></svg>`, backgroundSize: '100px 60px' },
  { id: 'raindrops', name: 'Giọt mưa', nameEn: 'Raindrops', preview: '💧', category: 'nature', tier: 'pro',
    svgPattern: `<svg width='40' height='50' xmlns='http://www.w3.org/2000/svg'><path d='M20 5 Q25 20 20 35 Q15 20 20 5' fill='%232196F3' fill-opacity='0.08'/></svg>`, backgroundSize: '40px 50px' },
  { id: 'snowflakes', name: 'Tuyết', nameEn: 'Snowflakes', preview: '❄️', category: 'nature', tier: 'free',
    svgPattern: `<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'><g stroke='%2364B5F6' stroke-opacity='0.15' stroke-width='1.5' fill='none'><line x1='25' y1='5' x2='25' y2='45'/><line x1='5' y1='25' x2='45' y2='25'/><line x1='11' y1='11' x2='39' y2='39'/><line x1='39' y1='11' x2='11' y2='39'/><circle cx='25' cy='25' r='3'/></g></svg>`, backgroundSize: '50px 50px' },
  { id: 'waves', name: 'Sóng', nameEn: 'Waves', preview: '🌊', category: 'nature', tier: 'free',
    svgPattern: `<svg width='100' height='20' xmlns='http://www.w3.org/2000/svg'><path d='M0 10 Q25 0 50 10 T100 10' stroke='%232196F3' stroke-opacity='0.1' stroke-width='2' fill='none'/></svg>`, backgroundSize: '100px 20px' },
  { id: 'palm-leaves', name: 'Lá cọ', nameEn: 'Palm Leaves', preview: '🌴', category: 'nature', tier: 'premium',
    svgPattern: `<svg width='80' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='%234CAF50' fill-opacity='0.06'><path d='M40 95 Q35 70 20 50 Q10 40 5 30 Q15 35 25 40 Q35 50 40 70 Z'/><path d='M40 95 Q45 70 60 50 Q70 40 75 30 Q65 35 55 40 Q45 50 40 70 Z'/><path d='M40 95 Q40 60 40 30 Q35 20 30 10 Q40 15 40 25 Q40 20 50 10 Q45 20 40 30 Z'/></g></svg>`, backgroundSize: '80px 100px' },
];

// ============================================
// 🎭 DECORATIVE (15 patterns)
// ============================================
const DECORATIVE: LetterPattern[] = [
  { id: 'lace', name: 'Ren', nameEn: 'Lace', preview: '🪡', category: 'decorative', tier: 'free',
    svgPattern: `<svg width='48' height='48' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23000' stroke-opacity='0.06' stroke-width='1'><circle cx='24' cy='24' r='10'/><circle cx='24' cy='24' r='18'/><circle cx='0' cy='0' r='6'/><circle cx='48' cy='0' r='6'/><circle cx='0' cy='48' r='6'/><circle cx='48' cy='48' r='6'/></g></svg>`, backgroundSize: '48px 48px' },
  { id: 'vintage', name: 'Cổ điển', nameEn: 'Vintage', preview: '📜', category: 'decorative', tier: 'free',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%23000' fill-opacity='0.03'><path d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/></g></svg>` },
  { id: 'diamonds', name: 'Kim cương', nameEn: 'Diamonds', preview: '💎', category: 'decorative', tier: 'free',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%232196F3' stroke-opacity='0.1' stroke-width='1.5'/><path d='M20 10L30 20L20 30L10 20Z' fill='%232196F3' fill-opacity='0.05'/></svg>`, backgroundSize: '40px 40px' },
  { id: 'confetti', name: 'Confetti', nameEn: 'Confetti', preview: '🎊', category: 'decorative', tier: 'free',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.12'><rect x='10' y='5' width='4' height='8' fill='%23FF6B6B' transform='rotate(25 12 9)'/><rect x='45' y='15' width='3' height='6' fill='%234ECDC4' transform='rotate(-15 46 18)'/><rect x='25' y='35' width='4' height='8' fill='%23FFE66D' transform='rotate(45 27 39)'/><rect x='5' y='40' width='3' height='6' fill='%23A855F7' transform='rotate(-30 6 43)'/><rect x='50' y='45' width='4' height='8' fill='%23F472B6' transform='rotate(20 52 49)'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'geometric', name: 'Hình học', nameEn: 'Geometric', preview: '◆', category: 'decorative', tier: 'free',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23000' stroke-opacity='0.06' stroke-width='1'><polygon points='30,5 55,30 30,55 5,30'/><polygon points='30,15 45,30 30,45 15,30'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'art-deco', name: 'Art Deco', nameEn: 'Art Deco', preview: '🏛', category: 'decorative', tier: 'pro',
    svgPattern: `<svg width='60' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23B8860B' stroke-opacity='0.1' stroke-width='1'><path d='M30 0 L30 80'/><path d='M10 20 L30 40 L50 20'/><path d='M10 60 L30 40 L50 60'/><circle cx='30' cy='40' r='8'/></g></svg>`, backgroundSize: '60px 80px' },
  { id: 'moroccan', name: 'Moroccan', nameEn: 'Moroccan', preview: '🕌', category: 'decorative', tier: 'pro',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23008B8B' stroke-opacity='0.08' stroke-width='1'><path d='M30 0 Q45 15 30 30 Q15 15 30 0'/><path d='M30 30 Q45 45 30 60 Q15 45 30 30'/><path d='M0 30 Q15 45 30 30 Q15 15 0 30'/><path d='M60 30 Q45 15 30 30 Q45 45 60 30'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'damask', name: 'Damask', nameEn: 'Damask', preview: '👑', category: 'decorative', tier: 'premium',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%23000' fill-opacity='0.04'><path d='M40 10 Q50 20 40 30 Q30 20 40 10'/><path d='M40 50 Q50 60 40 70 Q30 60 40 50'/><path d='M10 40 Q20 50 10 60 Q0 50 10 40'/><path d='M70 40 Q80 50 70 60 Q60 50 70 40'/><circle cx='40' cy='40' r='5'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'filigree', name: 'Chạm khắc', nameEn: 'Filigree', preview: '🎨', category: 'decorative', tier: 'premium',
    svgPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23B8860B' stroke-opacity='0.08' stroke-width='0.5'><path d='M50 10 C30 30 30 70 50 90'/><path d='M50 10 C70 30 70 70 50 90'/><path d='M10 50 C30 30 70 30 90 50'/><path d='M10 50 C30 70 70 70 90 50'/><circle cx='50' cy='50' r='10'/><circle cx='50' cy='50' r='20'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'paisley', name: 'Paisley', nameEn: 'Paisley', preview: '🎭', category: 'decorative', tier: 'premium',
    svgPattern: `<svg width='60' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%23800080' fill-opacity='0.05'><path d='M30 10 Q50 30 30 70 Q20 50 30 10'/><circle cx='30' cy='25' r='5'/></g></svg>`, backgroundSize: '60px 80px' },
  { id: 'arabesque', name: 'Arabesque', nameEn: 'Arabesque', preview: '🌀', category: 'decorative', tier: 'premium',
    svgPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23006400' stroke-opacity='0.08' stroke-width='0.8'><path d='M40 5 Q60 25 40 40 Q20 25 40 5'/><path d='M40 75 Q60 55 40 40 Q20 55 40 75'/><path d='M5 40 Q25 60 40 40 Q25 20 5 40'/><path d='M75 40 Q55 20 40 40 Q55 60 75 40'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'celtic', name: 'Celtic', nameEn: 'Celtic', preview: '☘️', category: 'decorative', tier: 'premium',
    svgPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23228B22' stroke-opacity='0.08' stroke-width='1.5'><circle cx='30' cy='30' r='15'/><path d='M15 30 A15 15 0 0 1 30 15'/><path d='M30 15 A15 15 0 0 1 45 30'/><path d='M45 30 A15 15 0 0 1 30 45'/><path d='M30 45 A15 15 0 0 1 15 30'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'greek-key', name: 'Hoa văn Hy Lạp', nameEn: 'Greek Key', preview: '🏛', category: 'decorative', tier: 'pro',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='%23B8860B' stroke-opacity='0.1' stroke-width='1.5'><path d='M0 20 L10 20 L10 10 L30 10 L30 30 L20 30 L20 20 L40 20'/></g></svg>`, backgroundSize: '40px 40px' },
  { id: 'chevron', name: 'Chevron', nameEn: 'Chevron', preview: '▼', category: 'decorative', tier: 'pro',
    svgPattern: `<svg width='40' height='24' xmlns='http://www.w3.org/2000/svg'><path d='M0 0 L20 12 L40 0 L40 12 L20 24 L0 12 Z' fill='%23000' fill-opacity='0.03'/></svg>`, backgroundSize: '40px 24px' },
  { id: 'herringbone', name: 'Xương cá', nameEn: 'Herringbone', preview: '≋', category: 'decorative', tier: 'pro',
    svgPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='%23000' fill-opacity='0.04'><path d='M0 0 L10 20 L0 40 L5 40 L15 20 L5 0 Z'/><path d='M20 0 L30 20 L20 40 L25 40 L35 20 L25 0 Z'/></g></svg>`, backgroundSize: '40px 40px' },
];

// ============================================
// 🎨 ARTISTIC (10 patterns)
// ============================================
const ARTISTIC: LetterPattern[] = [
  { id: 'watercolor', name: 'Màu nước', nameEn: 'Watercolor', preview: '🎨', category: 'artistic', tier: 'free',
    cssPattern: 'radial-gradient(ellipse at 20% 30%, rgba(255,182,193,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(173,216,230,0.12) 0%, transparent 45%), radial-gradient(ellipse at 60% 70%, rgba(221,160,221,0.1) 0%, transparent 55%), radial-gradient(ellipse at 30% 80%, rgba(255,218,185,0.12) 0%, transparent 50%)' },
  { id: 'brush-strokes', name: 'Nét cọ', nameEn: 'Brush Strokes', preview: '🖌️', category: 'artistic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(45deg, transparent 0px, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)' },
  { id: 'splatter', name: 'Vẩy màu', nameEn: 'Splatter', preview: '💦', category: 'artistic', tier: 'pro',
    svgPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.06'><circle cx='20' cy='30' r='8' fill='%23FF6B6B'/><circle cx='70' cy='20' r='5' fill='%234ECDC4'/><circle cx='50' cy='70' r='6' fill='%23FFE66D'/><circle cx='85' cy='60' r='4' fill='%23A855F7'/><circle cx='30' cy='80' r='3' fill='%23F472B6'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'ink-wash', name: 'Thủy mặc', nameEn: 'Ink Wash', preview: '🖋️', category: 'artistic', tier: 'premium',
    cssPattern: 'radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.03) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(0,0,0,0.02) 0%, transparent 50%)' },
  { id: 'marble', name: 'Cẩm thạch', nameEn: 'Marble', preview: '🪨', category: 'artistic', tier: 'premium',
    cssPattern: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(220,220,220,0.3) 50%, rgba(255,255,255,0.8) 100%), repeating-linear-gradient(45deg, transparent 0px, transparent 10px, rgba(180,180,180,0.05) 10px, rgba(180,180,180,0.05) 20px)' },
  { id: 'paper-texture', name: 'Vân giấy', nameEn: 'Paper Texture', preview: '📄', category: 'artistic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.01) 1px, rgba(0,0,0,0.01) 2px), repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(0,0,0,0.01) 1px, rgba(0,0,0,0.01) 2px)' },
  { id: 'linen', name: 'Vải lanh', nameEn: 'Linen', preview: '🧵', category: 'artistic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 4px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 5px), repeating-linear-gradient(90deg, transparent 0px, transparent 4px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 5px)' },
  { id: 'canvas', name: 'Vải canvas', nameEn: 'Canvas', preview: '🖼️', category: 'artistic', tier: 'pro',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px), repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)' },
  { id: 'parchment', name: 'Da thuộc', nameEn: 'Parchment', preview: '📜', category: 'artistic', tier: 'premium',
    cssPattern: 'radial-gradient(ellipse at 50% 50%, rgba(255,248,220,0.5) 0%, rgba(255,235,180,0.3) 100%)' },
  { id: 'vintage-paper', name: 'Giấy cũ', nameEn: 'Vintage Paper', preview: '📰', category: 'artistic', tier: 'premium',
    cssPattern: 'linear-gradient(rgba(255,250,240,0.8), rgba(255,245,230,0.9)), repeating-linear-gradient(0deg, transparent 0px, transparent 30px, rgba(139,90,43,0.02) 30px, rgba(139,90,43,0.02) 31px)' },
];

// ============================================
// EXPORT ALL PATTERNS
// ============================================
export const LETTER_PATTERNS: LetterPattern[] = [
  ...BASIC_LINES,
  ...FLORAL,
  ...ROMANTIC,
  ...CELESTIAL,
  ...NATURE,
  ...DECORATIVE,
  ...ARTISTIC,
];

// Categories for UI
export const LETTER_PATTERN_CATEGORIES = [
  { id: 'basic', name: 'Cơ bản', nameEn: 'Basic', icon: '📝' },
  { id: 'floral', name: 'Hoa lá', nameEn: 'Floral', icon: '🌸' },
  { id: 'romantic', name: 'Lãng mạn', nameEn: 'Romantic', icon: '💕' },
  { id: 'celestial', name: 'Thiên thể', nameEn: 'Celestial', icon: '⭐' },
  { id: 'nature', name: 'Thiên nhiên', nameEn: 'Nature', icon: '🦋' },
  { id: 'decorative', name: 'Trang trí', nameEn: 'Decorative', icon: '🎭' },
  { id: 'artistic', name: 'Nghệ thuật', nameEn: 'Artistic', icon: '🎨' },
];

/**
 * Get letter patterns by category
 */
export function getLetterPatternsByCategory(category: string): LetterPattern[] {
  return LETTER_PATTERNS.filter(p => p.category === category);
}

/**
 * Get free letter patterns only
 */
export function getFreeLetterPatterns(): LetterPattern[] {
  return LETTER_PATTERNS.filter(p => p.tier === 'free');
}

/**
 * Build CSS background from pattern
 */
export function buildLetterPatternCSS(pattern: LetterPattern): { backgroundImage?: string; backgroundSize?: string } {
  if (pattern.cssPattern) {
    return {
      backgroundImage: pattern.cssPattern,
      backgroundSize: pattern.backgroundSize,
    };
  }
  
  if (pattern.svgPattern) {
    const encoded = encodeURIComponent(pattern.svgPattern);
    return {
      backgroundImage: `url("data:image/svg+xml,${encoded}")`,
      backgroundSize: pattern.backgroundSize || '60px 60px',
    };
  }
  
  return {};
}

