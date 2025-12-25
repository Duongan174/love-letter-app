/**
 * ✅ ENVELOPE PATTERNS - 100+ Họa tiết cho phong bì
 * Các pattern phù hợp cho phong bì: mạnh mẽ hơn, trang trọng, có thể dùng cho cả mặt trong và ngoài
 * Hỗ trợ Free/Pro tier
 */

export type PatternTier = 'free' | 'pro' | 'premium';

export interface EnvelopePattern {
  id: string;
  name: string;
  nameEn: string;
  preview: string;
  category: string;
  tier: PatternTier;
  /** Cho mặt ngoài phong bì */
  outerPattern?: string;
  /** Cho mặt trong (liner) */
  linerPattern?: string;
  /** CSS pattern */
  cssPattern?: string;
  backgroundSize?: string;
  /** Intensity: nhẹ cho ngoài, đậm cho trong */
  intensity?: 'light' | 'medium' | 'bold';
}

// ============================================
// 🎯 CLASSIC TEXTURES (15 patterns)
// ============================================
const CLASSIC_TEXTURES: EnvelopePattern[] = [
  { id: 'env-solid', name: 'Trơn', nameEn: 'Solid', preview: '■', category: 'classic', tier: 'free', intensity: 'light' },
  { id: 'env-linen', name: 'Vải lanh', nameEn: 'Linen', preview: '🧵', category: 'classic', tier: 'free', intensity: 'light',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px), repeating-linear-gradient(90deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 4px)' },
  { id: 'env-kraft', name: 'Giấy kraft', nameEn: 'Kraft Paper', preview: '📦', category: 'classic', tier: 'free', intensity: 'medium',
    cssPattern: 'repeating-linear-gradient(45deg, transparent 0px, transparent 2px, rgba(139,90,43,0.04) 2px, rgba(139,90,43,0.04) 4px), repeating-linear-gradient(-45deg, transparent 0px, transparent 2px, rgba(139,90,43,0.03) 2px, rgba(139,90,43,0.03) 4px)' },
  { id: 'env-woven', name: 'Dệt', nameEn: 'Woven', preview: '🧶', category: 'classic', tier: 'pro', intensity: 'medium',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 5px, rgba(0,0,0,0.04) 5px, rgba(0,0,0,0.04) 6px), repeating-linear-gradient(90deg, transparent 0px, transparent 5px, rgba(0,0,0,0.04) 5px, rgba(0,0,0,0.04) 6px), repeating-linear-gradient(0deg, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 3px, transparent 3px)' },
  { id: 'env-ribbed', name: 'Gân nổi', nameEn: 'Ribbed', preview: '〰️', category: 'classic', tier: 'pro', intensity: 'medium',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.05) 3px, rgba(0,0,0,0.05) 4px)' },
  { id: 'env-laid', name: 'Giấy vân', nameEn: 'Laid Paper', preview: '📃', category: 'classic', tier: 'pro', intensity: 'light',
    cssPattern: 'repeating-linear-gradient(90deg, transparent 0px, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px), repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)' },
  { id: 'env-hammered', name: 'Đập búa', nameEn: 'Hammered', preview: '🔨', category: 'classic', tier: 'premium', intensity: 'medium',
    cssPattern: 'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 0%, transparent 20%), radial-gradient(circle at 60% 50%, rgba(0,0,0,0.02) 0%, transparent 15%), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.03) 0%, transparent 18%), radial-gradient(circle at 40% 70%, rgba(0,0,0,0.02) 0%, transparent 12%)' },
  { id: 'env-embossed', name: 'Dập nổi', nameEn: 'Embossed', preview: '🎀', category: 'classic', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><circle cx='20' cy='20' r='15' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='2'/></svg>`, backgroundSize: '40px 40px' },
  { id: 'env-cotton', name: 'Vải bông', nameEn: 'Cotton', preview: '☁️', category: 'classic', tier: 'pro', intensity: 'light',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px), repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px)' },
  { id: 'env-parchment', name: 'Da cừu', nameEn: 'Vellum', preview: '📜', category: 'classic', tier: 'premium', intensity: 'medium',
    cssPattern: 'radial-gradient(ellipse at 50% 50%, rgba(255,248,220,0.3) 0%, rgba(255,235,180,0.2) 100%)' },
  { id: 'env-textured-wave', name: 'Sóng vân', nameEn: 'Wave Texture', preview: '🌊', category: 'classic', tier: 'pro', intensity: 'light',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 11px, transparent 11px, transparent 20px)' },
  { id: 'env-felt', name: 'Nỉ', nameEn: 'Felt', preview: '🎩', category: 'classic', tier: 'pro', intensity: 'medium',
    cssPattern: 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '4px 4px' },
  { id: 'env-suede', name: 'Da lộn', nameEn: 'Suede', preview: '👞', category: 'classic', tier: 'premium', intensity: 'medium',
    cssPattern: 'radial-gradient(circle, rgba(0,0,0,0.025) 0.5px, transparent 0.5px)', backgroundSize: '3px 3px' },
  { id: 'env-silk', name: 'Lụa', nameEn: 'Silk', preview: '🧣', category: 'classic', tier: 'premium', intensity: 'light',
    cssPattern: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)' },
  { id: 'env-velvet', name: 'Nhung', nameEn: 'Velvet', preview: '👑', category: 'classic', tier: 'premium', intensity: 'bold',
    cssPattern: 'radial-gradient(circle, rgba(0,0,0,0.04) 0.5px, transparent 0.5px)', backgroundSize: '2px 2px' },
];

// ============================================
// 🎨 GEOMETRIC (15 patterns)
// ============================================
const GEOMETRIC: EnvelopePattern[] = [
  { id: 'env-stripes', name: 'Sọc', nameEn: 'Stripes', preview: '║', category: 'geometric', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='20' height='20' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' width='10' height='20' fill='rgba(0,0,0,0.04)'/></svg>`, backgroundSize: '20px 20px' },
  { id: 'env-diagonal-stripes', name: 'Sọc chéo', nameEn: 'Diagonal Stripes', preview: '╱', category: 'geometric', tier: 'free', intensity: 'medium',
    cssPattern: 'repeating-linear-gradient(45deg, transparent 0px, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' },
  { id: 'env-candy-stripe', name: 'Sọc kẹo', nameEn: 'Candy Stripe', preview: '🍬', category: 'geometric', tier: 'pro', intensity: 'bold',
    cssPattern: 'repeating-linear-gradient(45deg, rgba(255,182,193,0.2) 0px, rgba(255,182,193,0.2) 15px, rgba(255,255,255,0.8) 15px, rgba(255,255,255,0.8) 30px)' },
  { id: 'env-chevron', name: 'Chevron', nameEn: 'Chevron', preview: '▼', category: 'geometric', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='40' height='24' xmlns='http://www.w3.org/2000/svg'><path d='M0 0 L20 12 L40 0 L40 12 L20 24 L0 12 Z' fill='rgba(0,0,0,0.04)'/></svg>`, backgroundSize: '40px 24px' },
  { id: 'env-herringbone', name: 'Xương cá', nameEn: 'Herringbone', preview: '≋', category: 'geometric', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='rgba(0,0,0,0.05)'><path d='M0 0 L10 20 L0 40 L5 40 L15 20 L5 0 Z'/><path d='M20 0 L30 20 L20 40 L25 40 L35 20 L25 0 Z'/></g></svg>`, backgroundSize: '40px 40px' },
  { id: 'env-honeycomb', name: 'Tổ ong', nameEn: 'Honeycomb', preview: '🐝', category: 'geometric', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='56' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(255,193,7,0.15)' stroke-width='1'><path d='M28 2 L52 18 L52 50 L28 66 L4 50 L4 18 Z'/><path d='M28 34 L52 50 L52 82 L28 98 L4 82 L4 50 Z' transform='translate(0,32)'/></g></svg>`, backgroundSize: '56px 100px' },
  { id: 'env-triangles', name: 'Tam giác', nameEn: 'Triangles', preview: '▲', category: 'geometric', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><polygon points='20,0 40,40 0,40' fill='rgba(0,0,0,0.04)'/></svg>`, backgroundSize: '40px 40px' },
  { id: 'env-squares', name: 'Ô vuông', nameEn: 'Squares', preview: '▢', category: 'geometric', tier: 'free', intensity: 'light',
    outerPattern: `<svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><rect x='5' y='5' width='20' height='20' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/></svg>`, backgroundSize: '30px 30px' },
  { id: 'env-diamonds', name: 'Kim cương', nameEn: 'Diamonds', preview: '◆', category: 'geometric', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><path d='M15 0 L30 15 L15 30 L0 15 Z' fill='rgba(0,0,0,0.04)'/></svg>`, backgroundSize: '30px 30px' },
  { id: 'env-circles', name: 'Tròn', nameEn: 'Circles', preview: '○', category: 'geometric', tier: 'free', intensity: 'light',
    outerPattern: `<svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><circle cx='15' cy='15' r='10' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/></svg>`, backgroundSize: '30px 30px' },
  { id: 'env-polka-dots', name: 'Chấm bi lớn', nameEn: 'Polka Dots', preview: '●', category: 'geometric', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='30' height='30' xmlns='http://www.w3.org/2000/svg'><circle cx='15' cy='15' r='5' fill='rgba(0,0,0,0.06)'/></svg>`, backgroundSize: '30px 30px' },
  { id: 'env-scales', name: 'Vảy cá', nameEn: 'Scales', preview: '🐟', category: 'geometric', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='40' height='30' xmlns='http://www.w3.org/2000/svg'><ellipse cx='20' cy='25' rx='18' ry='12' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/><ellipse cx='0' cy='10' rx='18' ry='12' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/><ellipse cx='40' cy='10' rx='18' ry='12' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/></svg>`, backgroundSize: '40px 30px' },
  { id: 'env-quatrefoil', name: 'Bốn lá', nameEn: 'Quatrefoil', preview: '✤', category: 'geometric', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(0,0,0,0.06)' stroke-width='1'><circle cx='20' cy='10' r='8'/><circle cx='20' cy='30' r='8'/><circle cx='10' cy='20' r='8'/><circle cx='30' cy='20' r='8'/></g></svg>`, backgroundSize: '40px 40px' },
  { id: 'env-hexagons', name: 'Lục giác', nameEn: 'Hexagons', preview: '⬡', category: 'geometric', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='50' height='43' xmlns='http://www.w3.org/2000/svg'><polygon points='25,0 50,12.5 50,37.5 25,50 0,37.5 0,12.5' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1' transform='translate(0,-3.5)'/></svg>`, backgroundSize: '50px 43px' },
  { id: 'env-octagons', name: 'Bát giác', nameEn: 'Octagons', preview: '⬢', category: 'geometric', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><polygon points='12,0 28,0 40,12 40,28 28,40 12,40 0,28 0,12' fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'/></svg>`, backgroundSize: '40px 40px' },
];

// ============================================
// 🌿 BOTANICAL (12 patterns)
// ============================================
const BOTANICAL: EnvelopePattern[] = [
  { id: 'env-eucalyptus', name: 'Bạch đàn', nameEn: 'Eucalyptus', preview: '🌿', category: 'botanical', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='60' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%234CAF50' fill-opacity='0.1'><ellipse cx='30' cy='20' rx='12' ry='8' transform='rotate(-20 30 20)'/><ellipse cx='30' cy='40' rx='12' ry='8' transform='rotate(20 30 40)'/><ellipse cx='30' cy='60' rx='12' ry='8' transform='rotate(-20 30 60)'/><line x1='30' y1='10' x2='30' y2='75' stroke='%234CAF50' stroke-opacity='0.1' stroke-width='2'/></g></svg>`, backgroundSize: '60px 80px' },
  { id: 'env-fern', name: 'Dương xỉ', nameEn: 'Fern', preview: '🌿', category: 'botanical', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='50' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='%232E7D32' fill-opacity='0.08'><path d='M25 0 L25 100 M25 10 Q35 15 40 10 M25 10 Q15 15 10 10 M25 25 Q38 30 45 25 M25 25 Q12 30 5 25 M25 40 Q40 45 50 40 M25 40 Q10 45 0 40 M25 55 Q38 60 45 55 M25 55 Q12 60 5 55 M25 70 Q35 75 40 70 M25 70 Q15 75 10 70 M25 85 Q32 88 35 85 M25 85 Q18 88 15 85'/></g></svg>`, backgroundSize: '50px 100px' },
  { id: 'env-olive-branch', name: 'Cành ô liu', nameEn: 'Olive Branch', preview: '🫒', category: 'botanical', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='80' height='60' xmlns='http://www.w3.org/2000/svg'><g><path d='M5 30 Q40 20 75 30' stroke='%23556B2F' stroke-opacity='0.1' stroke-width='2' fill='none'/><g fill='%23556B2F' fill-opacity='0.1'><ellipse cx='20' cy='25' rx='8' ry='4' transform='rotate(-20 20 25)'/><ellipse cx='40' cy='22' rx='8' ry='4' transform='rotate(-10 40 22)'/><ellipse cx='60' cy='25' rx='8' ry='4' transform='rotate(10 60 25)'/></g></g></svg>`, backgroundSize: '80px 60px' },
  { id: 'env-tropical-leaves', name: 'Lá nhiệt đới', nameEn: 'Tropical Leaves', preview: '🌴', category: 'botanical', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='%23388E3C' fill-opacity='0.1'><path d='M50 90 Q45 60 30 40 Q20 30 10 25 Q25 35 35 50 Q45 65 50 90 Z'/><path d='M50 90 Q55 60 70 40 Q80 30 90 25 Q75 35 65 50 Q55 65 50 90 Z'/><path d='M50 90 Q50 50 50 20 Q45 10 40 5 Q50 15 50 25 Q50 15 60 5 Q55 10 50 20 Z'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'env-ivy', name: 'Thường xuân', nameEn: 'Ivy', preview: '🍃', category: 'botanical', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%232E7D32' fill-opacity='0.08'><path d='M30 10 L35 20 L45 15 L40 25 L50 30 L40 35 L45 45 L35 40 L30 50 L25 40 L15 45 L20 35 L10 30 L20 25 L15 15 L25 20 Z'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'env-ginkgo', name: 'Bạch quả', nameEn: 'Ginkgo', preview: '🍂', category: 'botanical', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='50' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%23FFC107' fill-opacity='0.12'><path d='M25 55 L25 35 Q15 25 10 10 Q25 20 25 35 Q25 20 40 10 Q35 25 25 35 Z'/></g></svg>`, backgroundSize: '50px 60px' },
  { id: 'env-monstera', name: 'Trầu bà', nameEn: 'Monstera', preview: '🪴', category: 'botanical', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%23388E3C' fill-opacity='0.1'><path d='M40 75 Q30 50 20 35 Q10 20 5 10 Q20 25 30 40 Q35 30 30 15 Q40 30 40 45 Q40 30 50 15 Q45 30 50 40 Q60 25 75 10 Q70 20 60 35 Q50 50 40 75 Z'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'env-bamboo', name: 'Tre', nameEn: 'Bamboo', preview: '🎋', category: 'botanical', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='40' height='80' xmlns='http://www.w3.org/2000/svg'><g stroke='%234CAF50' stroke-opacity='0.12' stroke-width='2' fill='none'><line x1='20' y1='0' x2='20' y2='80'/><line x1='10' y1='20' x2='30' y2='20'/><line x1='10' y1='50' x2='30' y2='50'/></g></svg>`, backgroundSize: '40px 80px' },
  { id: 'env-willow', name: 'Liễu', nameEn: 'Willow', preview: '🌳', category: 'botanical', tier: 'pro', intensity: 'light',
    outerPattern: `<svg width='60' height='100' xmlns='http://www.w3.org/2000/svg'><g stroke='%234CAF50' stroke-opacity='0.08' stroke-width='1' fill='none'><path d='M10 0 Q15 30 10 60 Q5 80 10 100'/><path d='M30 0 Q35 40 30 70 Q25 90 30 100'/><path d='M50 0 Q45 25 50 55 Q55 75 50 100'/></g></svg>`, backgroundSize: '60px 100px' },
  { id: 'env-magnolia-leaf', name: 'Lá mộc lan', nameEn: 'Magnolia Leaf', preview: '🌸', category: 'botanical', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='50' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='%232E7D32' fill-opacity='0.08'><ellipse cx='25' cy='40' rx='15' ry='30'/><line x1='25' y1='10' x2='25' y2='70' stroke='%232E7D32' stroke-opacity='0.1' stroke-width='1'/></g></svg>`, backgroundSize: '50px 80px' },
  { id: 'env-acacia', name: 'Keo', nameEn: 'Acacia', preview: '🌾', category: 'botanical', tier: 'pro', intensity: 'light',
    outerPattern: `<svg width='40' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='%234CAF50' fill-opacity='0.08'><ellipse cx='10' cy='15' rx='6' ry='3'/><ellipse cx='30' cy='15' rx='6' ry='3'/><ellipse cx='10' cy='25' rx='6' ry='3'/><ellipse cx='30' cy='25' rx='6' ry='3'/><ellipse cx='10' cy='35' rx='6' ry='3'/><ellipse cx='30' cy='35' rx='6' ry='3'/><ellipse cx='10' cy='45' rx='6' ry='3'/><ellipse cx='30' cy='45' rx='6' ry='3'/><line x1='20' y1='5' x2='20' y2='55' stroke='%234CAF50' stroke-opacity='0.1' stroke-width='1'/></g></svg>`, backgroundSize: '40px 60px' },
  { id: 'env-botanical-print', name: 'In thực vật', nameEn: 'Botanical Print', preview: '🌺', category: 'botanical', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.1'><ellipse cx='25' cy='30' rx='15' ry='8' fill='%234CAF50' transform='rotate(-30 25 30)'/><ellipse cx='75' cy='70' rx='15' ry='8' fill='%234CAF50' transform='rotate(30 75 70)'/><circle cx='50' cy='50' r='12' fill='%23E91E63'/><ellipse cx='80' cy='25' rx='12' ry='6' fill='%234CAF50' transform='rotate(15 80 25)'/><ellipse cx='20' cy='75' rx='12' ry='6' fill='%234CAF50' transform='rotate(-15 20 75)'/></g></svg>`, backgroundSize: '100px 100px' },
];

// ============================================
// 🎀 ELEGANT (15 patterns)
// ============================================
const ELEGANT: EnvelopePattern[] = [
  { id: 'env-damask', name: 'Damask', nameEn: 'Damask', preview: '👑', category: 'elegant', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='rgba(0,0,0,0.05)'><path d='M40 10 Q50 20 40 30 Q30 20 40 10'/><path d='M40 50 Q50 60 40 70 Q30 60 40 50'/><path d='M10 40 Q20 50 10 60 Q0 50 10 40'/><path d='M70 40 Q80 50 70 60 Q60 50 70 40'/><circle cx='40' cy='40' r='5'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'env-baroque', name: 'Baroque', nameEn: 'Baroque', preview: '🏰', category: 'elegant', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(184,134,11,0.12)' stroke-width='1'><path d='M50 10 C30 30 30 70 50 90'/><path d='M50 10 C70 30 70 70 50 90'/><path d='M10 50 C30 30 70 30 90 50'/><path d='M10 50 C30 70 70 70 90 50'/><circle cx='50' cy='50' r='15'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'env-fleur-de-lis', name: 'Hoa huệ', nameEn: 'Fleur de Lis', preview: '⚜️', category: 'elegant', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='50' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='rgba(184,134,11,0.1)'><path d='M25 5 C20 15 15 20 10 25 C15 25 20 30 25 35 C30 30 35 25 40 25 C35 20 30 15 25 5 Z'/><path d='M25 55 L25 35'/><path d='M20 50 L25 55 L30 50'/></g></svg>`, backgroundSize: '50px 60px' },
  { id: 'env-victorian', name: 'Victoria', nameEn: 'Victorian', preview: '🎭', category: 'elegant', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(0,0,0,0.06)' stroke-width='0.8'><rect x='10' y='10' width='60' height='60' rx='5'/><circle cx='40' cy='40' r='20'/><path d='M20 40 Q40 20 60 40 Q40 60 20 40'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'env-filigree', name: 'Chạm khắc', nameEn: 'Filigree', preview: '🎨', category: 'elegant', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(184,134,11,0.1)' stroke-width='0.5'><path d='M30 5 C20 15 15 30 30 30 C45 30 40 15 30 5'/><path d='M30 55 C20 45 15 30 30 30 C45 30 40 45 30 55'/><path d='M5 30 C15 20 30 15 30 30 C30 45 15 40 5 30'/><path d='M55 30 C45 20 30 15 30 30 C30 45 45 40 55 30'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'env-royal', name: 'Hoàng gia', nameEn: 'Royal', preview: '👸', category: 'elegant', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='rgba(128,0,128,0.06)'><path d='M30 5 L35 20 L50 20 L38 30 L43 45 L30 35 L17 45 L22 30 L10 20 L25 20 Z'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'env-art-nouveau', name: 'Art Nouveau', nameEn: 'Art Nouveau', preview: '🌸', category: 'elegant', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='60' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(0,128,0,0.08)' stroke-width='1'><path d='M30 5 Q40 20 30 40 Q20 60 30 75'/><path d='M10 40 Q25 35 30 40 Q35 45 50 40'/></g></svg>`, backgroundSize: '60px 80px' },
  { id: 'env-ornate', name: 'Trang trí', nameEn: 'Ornate', preview: '🎀', category: 'elegant', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(0,0,0,0.06)' stroke-width='0.8'><circle cx='25' cy='25' r='15'/><circle cx='25' cy='25' r='8'/><path d='M25 5 L25 45 M5 25 L45 25'/></g></svg>`, backgroundSize: '50px 50px' },
  { id: 'env-lace-elegant', name: 'Ren thanh lịch', nameEn: 'Elegant Lace', preview: '🪡', category: 'elegant', tier: 'pro', intensity: 'light',
    outerPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='0.5'><circle cx='20' cy='20' r='15'/><circle cx='20' cy='20' r='10'/><circle cx='20' cy='20' r='5'/><circle cx='0' cy='0' r='5'/><circle cx='40' cy='0' r='5'/><circle cx='0' cy='40' r='5'/><circle cx='40' cy='40' r='5'/></g></svg>`, backgroundSize: '40px 40px' },
  { id: 'env-scrollwork', name: 'Cuộn', nameEn: 'Scrollwork', preview: '📜', category: 'elegant', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='80' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(184,134,11,0.1)' stroke-width='1'><path d='M5 20 C15 10 25 10 35 20 C45 30 55 30 65 20 C75 10 85 10 95 20'/></g></svg>`, backgroundSize: '80px 40px' },
  { id: 'env-trellis', name: 'Giàn leo', nameEn: 'Trellis', preview: '🌿', category: 'elegant', tier: 'pro', intensity: 'light',
    outerPattern: `<svg width='40' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(0,0,0,0.05)' stroke-width='1'><path d='M0 0 L40 40 M40 0 L0 40'/></g></svg>`, backgroundSize: '40px 40px' },
  { id: 'env-arabesque', name: 'Arabesque', nameEn: 'Arabesque', preview: '🕌', category: 'elegant', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(0,100,100,0.08)' stroke-width='0.8'><path d='M30 5 Q45 20 30 30 Q15 20 30 5'/><path d='M30 55 Q45 40 30 30 Q15 40 30 55'/><path d='M5 30 Q20 45 30 30 Q20 15 5 30'/><path d='M55 30 Q40 15 30 30 Q40 45 55 30'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'env-pearl', name: 'Ngọc trai', nameEn: 'Pearl', preview: '🦪', category: 'elegant', tier: 'pro', intensity: 'light',
    cssPattern: 'radial-gradient(circle, rgba(255,255,255,0.4) 2px, transparent 2px)', backgroundSize: '20px 20px' },
  { id: 'env-satin', name: 'Satin', nameEn: 'Satin', preview: '✨', category: 'elegant', tier: 'pro', intensity: 'light',
    cssPattern: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 40%, rgba(255,255,255,0.1) 60%, transparent 100%)' },
  { id: 'env-brocade', name: 'Gấm', nameEn: 'Brocade', preview: '👘', category: 'elegant', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='rgba(184,134,11,0.08)'><path d='M30 15 L35 25 L45 25 L38 32 L40 42 L30 36 L20 42 L22 32 L15 25 L25 25 Z'/></g></svg>`, backgroundSize: '60px 60px' },
];

// ============================================
// 🎉 FESTIVE (12 patterns)
// ============================================
const FESTIVE: EnvelopePattern[] = [
  { id: 'env-confetti', name: 'Confetti', nameEn: 'Confetti', preview: '🎊', category: 'festive', tier: 'free', intensity: 'bold',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.15'><rect x='10' y='10' width='5' height='10' fill='%23FF6B6B' transform='rotate(25 12 15)'/><rect x='60' y='20' width='4' height='8' fill='%234ECDC4' transform='rotate(-15 62 24)'/><rect x='35' y='50' width='5' height='10' fill='%23FFE66D' transform='rotate(45 37 55)'/><rect x='15' y='60' width='4' height='8' fill='%23A855F7' transform='rotate(-30 17 64)'/><rect x='65' y='55' width='5' height='10' fill='%23F472B6' transform='rotate(20 67 60)'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'env-stars-festive', name: 'Sao lễ hội', nameEn: 'Festive Stars', preview: '⭐', category: 'festive', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill='rgba(255,215,0,0.15)'><polygon points='30,5 35,20 50,20 38,28 42,43 30,34 18,43 22,28 10,20 25,20'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'env-balloons', name: 'Bong bóng', nameEn: 'Balloons', preview: '🎈', category: 'festive', tier: 'pro', intensity: 'bold',
    outerPattern: `<svg width='60' height='80' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.12'><ellipse cx='20' cy='25' rx='12' ry='15' fill='%23FF6B6B'/><ellipse cx='40' cy='30' rx='10' ry='13' fill='%234ECDC4'/><path d='M20 40 L20 70 M40 43 L40 75' stroke='%23888' stroke-opacity='0.1' stroke-width='1'/></g></svg>`, backgroundSize: '60px 80px' },
  { id: 'env-ribbons', name: 'Dải ruy băng', nameEn: 'Ribbons', preview: '🎀', category: 'festive', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='80' height='40' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(255,105,180,0.15)' stroke-width='3'><path d='M0 20 Q20 5 40 20 Q60 35 80 20'/></g></svg>`, backgroundSize: '80px 40px' },
  { id: 'env-party', name: 'Tiệc', nameEn: 'Party', preview: '🥳', category: 'festive', tier: 'pro', intensity: 'bold',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.1'><circle cx='20' cy='20' r='8' fill='%23FF6B6B'/><circle cx='60' cy='30' r='6' fill='%234ECDC4'/><circle cx='40' cy='60' r='7' fill='%23FFE66D'/><polygon points='70,60 73,68 80,68 74,73 76,80 70,76 64,80 66,73 60,68 67,68' fill='%23A855F7'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'env-christmas', name: 'Giáng sinh', nameEn: 'Christmas', preview: '🎄', category: 'festive', tier: 'pro', intensity: 'bold',
    outerPattern: `<svg width='60' height='80' xmlns='http://www.w3.org/2000/svg'><g><polygon points='30,10 45,35 38,35 50,55 40,55 55,75 5,75 20,55 10,55 22,35 15,35' fill='%23228B22' fill-opacity='0.1'/><circle cx='30' cy='25' r='3' fill='%23FF0000' fill-opacity='0.15'/><circle cx='25' cy='45' r='3' fill='%23FFD700' fill-opacity='0.15'/><circle cx='40' cy='55' r='3' fill='%23FF0000' fill-opacity='0.15'/></g></svg>`, backgroundSize: '60px 80px' },
  { id: 'env-snowflakes', name: 'Hoa tuyết', nameEn: 'Snowflakes', preview: '❄️', category: 'festive', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'><g stroke='%2390CAF9' stroke-opacity='0.2' stroke-width='1.5' fill='none'><line x1='25' y1='5' x2='25' y2='45'/><line x1='5' y1='25' x2='45' y2='25'/><line x1='11' y1='11' x2='39' y2='39'/><line x1='39' y1='11' x2='11' y2='39'/></g></svg>`, backgroundSize: '50px 50px' },
  { id: 'env-hearts-festive', name: 'Tim lễ hội', nameEn: 'Festive Hearts', preview: '💕', category: 'festive', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='50' height='50' xmlns='http://www.w3.org/2000/svg'><path d='M25 42l-3-2.7C12 30.6 5 24.2 5 16.5c0-6 4.7-10.8 10.3-10.8 3.4 0 6.5 1.6 8.9 4.2 2.4-2.6 5.5-4.2 8.9-4.2 5.6 0 10.3 4.8 10.3 10.8 0 7.7-7 14.1-17 22.8L25 42z' fill='%23FF69B4' fill-opacity='0.12'/></svg>`, backgroundSize: '50px 50px' },
  { id: 'env-fireworks', name: 'Pháo hoa', nameEn: 'Fireworks', preview: '🎆', category: 'festive', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g stroke-width='1' fill='none'><g stroke='rgba(255,215,0,0.15)'><line x1='40' y1='20' x2='40' y2='5'/><line x1='40' y1='20' x2='55' y2='10'/><line x1='40' y1='20' x2='60' y2='20'/><line x1='40' y1='20' x2='55' y2='30'/><line x1='40' y1='20' x2='40' y2='35'/><line x1='40' y1='20' x2='25' y2='30'/><line x1='40' y1='20' x2='20' y2='20'/><line x1='40' y1='20' x2='25' y2='10'/></g><g stroke='rgba(255,105,180,0.12)'><line x1='60' y1='55' x2='60' y2='45'/><line x1='60' y1='55' x2='70' y2='50'/><line x1='60' y1='55' x2='75' y2='55'/><line x1='60' y1='55' x2='70' y2='60'/><line x1='60' y1='55' x2='60' y2='65'/><line x1='60' y1='55' x2='50' y2='60'/><line x1='60' y1='55' x2='45' y2='55'/><line x1='60' y1='55' x2='50' y2='50'/></g></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'env-spring', name: 'Mùa xuân', nameEn: 'Spring', preview: '🌷', category: 'festive', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.1'><circle cx='15' cy='20' r='6' fill='%23FF69B4'/><circle cx='45' cy='15' r='5' fill='%23FFE66D'/><circle cx='30' cy='45' r='7' fill='%234ECDC4'/><ellipse cx='50' cy='50' rx='5' ry='3' fill='%234CAF50'/><ellipse cx='10' cy='50' rx='5' ry='3' fill='%234CAF50'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'env-autumn', name: 'Mùa thu', nameEn: 'Autumn', preview: '🍂', category: 'festive', tier: 'pro', intensity: 'medium',
    outerPattern: `<svg width='60' height='60' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.12'><path d='M15 30 Q20 20 15 10 Q25 15 30 10 Q25 20 30 30 Q20 25 15 30' fill='%23FF8C00'/><path d='M45 50 Q50 40 45 30 Q55 35 60 30 Q55 40 60 50 Q50 45 45 50' fill='%23B8860B'/><path d='M35 15 Q38 10 35 5 Q42 8 45 5 Q42 10 45 15 Q38 12 35 15' fill='%23DC143C'/></g></svg>`, backgroundSize: '60px 60px' },
  { id: 'env-summer', name: 'Mùa hè', nameEn: 'Summer', preview: '🌻', category: 'festive', tier: 'pro', intensity: 'bold',
    outerPattern: `<svg width='70' height='70' xmlns='http://www.w3.org/2000/svg'><g><circle cx='35' cy='35' r='8' fill='%23FFD700' fill-opacity='0.15'/><g stroke='%23FFD700' stroke-opacity='0.12' stroke-width='2'><line x1='35' y1='10' x2='35' y2='20'/><line x1='35' y1='50' x2='35' y2='60'/><line x1='10' y1='35' x2='20' y2='35'/><line x1='50' y1='35' x2='60' y2='35'/><line x1='17' y1='17' x2='24' y2='24'/><line x1='46' y1='46' x2='53' y2='53'/><line x1='17' y1='53' x2='24' y2='46'/><line x1='46' y1='24' x2='53' y2='17'/></g></g></svg>`, backgroundSize: '70px 70px' },
];

// ============================================
// 🌊 ABSTRACT (12 patterns)
// ============================================
const ABSTRACT: EnvelopePattern[] = [
  { id: 'env-marble', name: 'Cẩm thạch', nameEn: 'Marble', preview: '🪨', category: 'abstract', tier: 'premium', intensity: 'medium',
    cssPattern: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(220,220,220,0.2) 50%, rgba(255,255,255,0.6) 100%), repeating-linear-gradient(45deg, transparent 0px, transparent 10px, rgba(180,180,180,0.06) 10px, rgba(180,180,180,0.06) 20px)' },
  { id: 'env-watercolor', name: 'Màu nước', nameEn: 'Watercolor', preview: '🎨', category: 'abstract', tier: 'pro', intensity: 'medium',
    cssPattern: 'radial-gradient(ellipse at 20% 30%, rgba(255,182,193,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(173,216,230,0.12) 0%, transparent 45%), radial-gradient(ellipse at 60% 70%, rgba(221,160,221,0.1) 0%, transparent 55%)' },
  { id: 'env-splatter', name: 'Vẩy màu', nameEn: 'Splatter', preview: '💦', category: 'abstract', tier: 'pro', intensity: 'bold',
    outerPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.08'><circle cx='20' cy='30' r='12' fill='%23FF6B6B'/><circle cx='75' cy='25' r='8' fill='%234ECDC4'/><circle cx='55' cy='70' r='10' fill='%23FFE66D'/><circle cx='85' cy='65' r='6' fill='%23A855F7'/><circle cx='35' cy='80' r='5' fill='%23F472B6'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'env-gradient-circles', name: 'Vòng gradient', nameEn: 'Gradient Circles', preview: '⭕', category: 'abstract', tier: 'pro', intensity: 'medium',
    cssPattern: 'radial-gradient(circle at 30% 40%, rgba(255,105,180,0.1) 0%, transparent 30%), radial-gradient(circle at 70% 60%, rgba(100,149,237,0.08) 0%, transparent 25%)' },
  { id: 'env-waves', name: 'Sóng', nameEn: 'Waves', preview: '🌊', category: 'abstract', tier: 'free', intensity: 'medium',
    outerPattern: `<svg width='100' height='30' xmlns='http://www.w3.org/2000/svg'><path d='M0 15 Q25 5 50 15 T100 15' stroke='%232196F3' stroke-opacity='0.12' stroke-width='2' fill='none'/></svg>`, backgroundSize: '100px 30px' },
  { id: 'env-swirl', name: 'Xoáy', nameEn: 'Swirl', preview: '🌀', category: 'abstract', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(138,43,226,0.08)' stroke-width='1.5'><path d='M40 40 Q50 30 60 40 Q50 50 40 40'/><path d='M40 40 Q30 30 40 20 Q50 30 40 40'/><path d='M40 40 Q30 50 20 40 Q30 30 40 40'/><path d='M40 40 Q50 50 40 60 Q30 50 40 40'/></g></svg>`, backgroundSize: '80px 80px' },
  { id: 'env-bokeh', name: 'Bokeh', nameEn: 'Bokeh', preview: '✨', category: 'abstract', tier: 'premium', intensity: 'light',
    outerPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.06'><circle cx='20' cy='30' r='15' fill='%23FFD700'/><circle cx='70' cy='20' r='10' fill='%23FF69B4'/><circle cx='50' cy='70' r='12' fill='%2300CED1'/><circle cx='85' cy='60' r='8' fill='%239370DB'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'env-brushstroke', name: 'Nét cọ', nameEn: 'Brushstroke', preview: '🖌️', category: 'abstract', tier: 'pro', intensity: 'medium',
    cssPattern: 'repeating-linear-gradient(60deg, transparent 0px, transparent 3px, rgba(0,0,0,0.03) 3px, rgba(0,0,0,0.03) 6px)' },
  { id: 'env-noise', name: 'Nhiễu', nameEn: 'Noise', preview: '📺', category: 'abstract', tier: 'pro', intensity: 'light',
    cssPattern: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px), repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px)' },
  { id: 'env-terrazzo', name: 'Terrazzo', nameEn: 'Terrazzo', preview: '🪨', category: 'abstract', tier: 'premium', intensity: 'bold',
    outerPattern: `<svg width='100' height='100' xmlns='http://www.w3.org/2000/svg'><g fill-opacity='0.1'><ellipse cx='20' cy='25' rx='8' ry='5' fill='%23FF6B6B' transform='rotate(30 20 25)'/><ellipse cx='70' cy='35' rx='10' ry='6' fill='%234ECDC4' transform='rotate(-20 70 35)'/><ellipse cx='45' cy='70' rx='12' ry='7' fill='%23FFE66D' transform='rotate(45 45 70)'/><ellipse cx='80' cy='75' rx='7' ry='4' fill='%23A855F7' transform='rotate(-10 80 75)'/><ellipse cx='15' cy='80' rx='9' ry='5' fill='%23F472B6' transform='rotate(15 15 80)'/><circle cx='55' cy='15' r='6' fill='%2390CAF9'/></g></svg>`, backgroundSize: '100px 100px' },
  { id: 'env-gradient-mesh', name: 'Lưới gradient', nameEn: 'Gradient Mesh', preview: '🌈', category: 'abstract', tier: 'premium', intensity: 'medium',
    cssPattern: 'radial-gradient(ellipse at 0% 0%, rgba(255,182,193,0.1) 0%, transparent 50%), radial-gradient(ellipse at 100% 0%, rgba(173,216,230,0.1) 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(221,160,221,0.1) 0%, transparent 50%), radial-gradient(ellipse at 0% 100%, rgba(152,251,152,0.1) 0%, transparent 50%)' },
  { id: 'env-organic', name: 'Hữu cơ', nameEn: 'Organic', preview: '🧬', category: 'abstract', tier: 'premium', intensity: 'medium',
    outerPattern: `<svg width='80' height='80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='rgba(76,175,80,0.08)' stroke-width='1'><path d='M20 10 Q30 30 20 50 Q10 70 20 80'/><path d='M40 5 Q50 25 40 45 Q30 65 40 85'/><path d='M60 0 Q70 20 60 40 Q50 60 60 80'/></g></svg>`, backgroundSize: '80px 80px' },
];

// ============================================
// EXPORT ALL PATTERNS
// ============================================
export const ENVELOPE_PATTERNS: EnvelopePattern[] = [
  ...CLASSIC_TEXTURES,
  ...GEOMETRIC,
  ...BOTANICAL,
  ...ELEGANT,
  ...FESTIVE,
  ...ABSTRACT,
];

// Categories for UI
export const ENVELOPE_PATTERN_CATEGORIES = [
  { id: 'classic', name: 'Cổ điển', nameEn: 'Classic', icon: '📜' },
  { id: 'geometric', name: 'Hình học', nameEn: 'Geometric', icon: '🎯' },
  { id: 'botanical', name: 'Thực vật', nameEn: 'Botanical', icon: '🌿' },
  { id: 'elegant', name: 'Sang trọng', nameEn: 'Elegant', icon: '🎀' },
  { id: 'festive', name: 'Lễ hội', nameEn: 'Festive', icon: '🎉' },
  { id: 'abstract', name: 'Trừu tượng', nameEn: 'Abstract', icon: '🌊' },
];

/**
 * Get envelope patterns by category
 */
export function getEnvelopePatternsByCategory(category: string): EnvelopePattern[] {
  return ENVELOPE_PATTERNS.filter(p => p.category === category);
}

/**
 * Get free envelope patterns only
 */
export function getFreeEnvelopePatterns(): EnvelopePattern[] {
  return ENVELOPE_PATTERNS.filter(p => p.tier === 'free');
}

/**
 * Build CSS background from envelope pattern
 */
export function buildEnvelopePatternCSS(pattern: EnvelopePattern, isLiner: boolean = false): { backgroundImage?: string; backgroundSize?: string } {
  // Use liner pattern if available and requested
  const svgPattern = isLiner && pattern.linerPattern ? pattern.linerPattern : pattern.outerPattern;
  
  if (pattern.cssPattern) {
    return {
      backgroundImage: pattern.cssPattern,
      backgroundSize: pattern.backgroundSize,
    };
  }
  
  if (svgPattern) {
    const encoded = encodeURIComponent(svgPattern);
    return {
      backgroundImage: `url("data:image/svg+xml,${encoded}")`,
      backgroundSize: pattern.backgroundSize || '60px 60px',
    };
  }
  
  return {};
}

/**
 * Get pattern intensity multiplier for inner/outer use
 */
export function getIntensityMultiplier(pattern: EnvelopePattern, isLiner: boolean): number {
  const baseMultiplier = pattern.intensity === 'bold' ? 1.5 : pattern.intensity === 'medium' ? 1 : 0.7;
  // Liner (inside) can be more intense
  return isLiner ? baseMultiplier * 1.3 : baseMultiplier;
}

