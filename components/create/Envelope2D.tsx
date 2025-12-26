// components/create/Envelope2D.tsx
'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RotateCcw, Star, Sparkles, Crown, Flower2, Mail, Lock } from 'lucide-react';

// ✅ Ảnh từ DB/Supabase có thể là "bucket/path" hoặc "storage/v1/..." nên phải resolve đúng
import { resolveImageUrl } from '@/lib/utils';

// ✅ Import envelope patterns từ hệ thống mới
import { 
  ENVELOPE_PATTERNS as NEW_ENVELOPE_PATTERNS,
  getEnvelopePatternStyle,
  type DesignTier,
} from '@/lib/design-presets';

export type EnvelopeSide = 'front' | 'back';
export type SealDesign = 'heart' | 'star' | 'crown' | 'flower' | 'sparkle' | 'initial' | 'mail';
export type EnvelopePattern = 
  | 'solid' 
  | 'floral' 
  | 'damask' 
  | 'geometric' 
  | 'lace' 
  | 'vintage' 
  | 'dots' 
  | 'stripes'
  | 'parchment'
  | 'fabric'
  | 'leather'
  | 'metallic'
  | 'embossed'
  | 'woven'
  | 'marble'
  | 'woodgrain'
  | 'quilted'
  | 'brocade'
  | 'velvet';

export interface Envelope2DProps {
  color: string;
  pattern?: EnvelopePattern | string; // ✅ Hỗ trợ cả legacy patterns và pattern IDs mới
  patternColor?: string; // Màu accent cho pattern
  patternIntensity?: number; // Độ đậm của pattern (0-1)
  texture?: string | null;
  linerPattern?: string | null; // URL hoặc pattern type cho liner
  linerPatternType?: EnvelopePattern | string | null; // ✅ Hỗ trợ cả legacy patterns và pattern IDs mới
  linerColor?: string; // Màu cho liner pattern
  stampUrl?: string | null;
  sealDesign?: SealDesign;
  sealColor?: string;
  isOpen?: boolean;
  side?: EnvelopeSide;
  showControls?: boolean;
  onToggleOpen?: () => void;
  onFlip?: () => void;
  /** Callback khi mở phong bì - để hiện template full screen */
  onOpenComplete?: () => void;
}

export const SEAL_DESIGNS: { id: SealDesign; name: string; color: string }[] = [
  { id: 'heart', name: 'Trái tim', color: '#c62828' },
  { id: 'star', name: 'Ngôi sao', color: '#f9a825' },
  { id: 'crown', name: 'Vương miện', color: '#6a1b9a' },
  { id: 'flower', name: 'Hoa', color: '#d81b60' },
  { id: 'sparkle', name: 'Lấp lánh', color: '#00897b' },
  { id: 'initial', name: 'Chữ cái', color: '#1565c0' },
  { id: 'mail', name: 'Thư', color: '#5d4037' },
];

// ✅ Export envelope patterns từ hệ thống mới (100+ mẫu)
export const ENVELOPE_PATTERNS: { id: EnvelopePattern | string; name: string; preview: string; tier?: DesignTier }[] = [
  // Legacy patterns để tương thích ngược
  { id: 'solid', name: 'Trơn', preview: '', tier: 'free' },
  { id: 'floral', name: 'Hoa lá', preview: '🌸', tier: 'free' },
  { id: 'damask', name: 'Damask', preview: '🏛️', tier: 'free' },
  { id: 'geometric', name: 'Hình học', preview: '◆', tier: 'free' },
  { id: 'lace', name: 'Ren', preview: '🪡', tier: 'free' },
  { id: 'vintage', name: 'Cổ điển', preview: '📜', tier: 'free' },
  { id: 'dots', name: 'Chấm bi', preview: '●', tier: 'free' },
  { id: 'stripes', name: 'Sọc', preview: '║', tier: 'free' },
  { id: 'parchment', name: 'Giấy cổ', preview: '📜', tier: 'free' },
  { id: 'fabric', name: 'Vải', preview: '🧵', tier: 'premium' },
  { id: 'leather', name: 'Da', preview: '👜', tier: 'premium' },
  { id: 'metallic', name: 'Kim loại', preview: '✨', tier: 'premium' },
  { id: 'embossed', name: 'Nổi', preview: '🔲', tier: 'premium' },
  { id: 'woven', name: 'Dệt', preview: '🧶', tier: 'premium' },
  { id: 'marble', name: 'Đá cẩm thạch', preview: '💎', tier: 'pro' },
  { id: 'woodgrain', name: 'Gỗ', preview: '🪵', tier: 'premium' },
  { id: 'quilted', name: 'Chần bông', preview: '🛏️', tier: 'pro' },
  { id: 'brocade', name: 'Gấm', preview: '👑', tier: 'pro' },
  { id: 'velvet', name: 'Nhung', preview: '🟣' },
];

// CSS patterns cho từng loại họa tiết
export function getPatternCSS(pattern: EnvelopePattern, baseColor: string, accentColor: string, intensity: number = 0.15): string {
  const accent = encodeURIComponent(accentColor);
  const opacity = Math.max(0, Math.min(1, intensity)); // Clamp 0-1
  const opacityStr = opacity.toFixed(2);
  
  switch (pattern) {
    case 'floral':
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${accent}' fill-opacity='${opacityStr}'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10-10c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm-10 30c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm30-10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
    case 'damask':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${accent}' fill-opacity='${(opacity * 0.8).toFixed(2)}' fill-rule='evenodd'%3E%3Cpath d='M0 20L20 0v20H0zm20 0L40 0v20H20zm0 0v20L0 20h20zm0 0h20L20 40V20z'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'geometric':
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${accent}' fill-opacity='${opacityStr}' fill-rule='evenodd'%3E%3Cpath d='M10 0l10 10-10 10L0 10z'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'lace':
      return `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${accent}' stroke-opacity='${opacityStr}' stroke-width='1'%3E%3Ccircle cx='24' cy='24' r='8'/%3E%3Ccircle cx='24' cy='24' r='16'/%3E%3Ccircle cx='0' cy='0' r='8'/%3E%3Ccircle cx='48' cy='0' r='8'/%3E%3Ccircle cx='0' cy='48' r='8'/%3E%3Ccircle cx='48' cy='48' r='8'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'vintage':
      return `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${accent}' fill-opacity='${(opacity * 0.67).toFixed(2)}'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
    case 'dots':
      return `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${accent}' fill-opacity='${opacityStr}' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='2'/%3E%3Ccircle cx='13' cy='13' r='2'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'stripes':
      const stripeOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return `repeating-linear-gradient(45deg, transparent, transparent 8px, ${accentColor}${stripeOpacity} 8px, ${accentColor}${stripeOpacity} 10px)`;
    case 'parchment':
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3Cpath d='M0 0 L20 5 L40 0 L60 8 L80 2 L100 0 L100 100 L80 95 L60 100 L40 92 L20 98 L0 100 Z' fill='${accent}' fill-opacity='${(opacity * 0.33).toFixed(2)}'/%3E%3C/svg%3E")`;
    case 'fabric':
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='${accent}' stroke-opacity='${(opacity * 0.8).toFixed(2)}' stroke-width='0.5' fill='none'%3E%3Cpath d='M0 0 L60 0 M0 10 L60 10 M0 20 L60 20 M0 30 L60 30 M0 40 L60 40 M0 50 L60 50 M0 60 L60 60'/%3E%3Cpath d='M0 0 L0 60 M10 0 L10 60 M20 0 L20 60 M30 0 L30 60 M40 0 L40 60 M50 0 L50 60 M60 0 L60 60'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'leather':
      return `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cpath d='M0 0 Q20 10 40 0 T80 0' stroke='${accent}' stroke-opacity='${(opacity * 0.53).toFixed(2)}' stroke-width='1'/%3E%3Cpath d='M0 20 Q20 30 40 20 T80 20' stroke='${accent}' stroke-opacity='${(opacity * 0.53).toFixed(2)}' stroke-width='1'/%3E%3Cpath d='M0 40 Q20 50 40 40 T80 40' stroke='${accent}' stroke-opacity='${(opacity * 0.53).toFixed(2)}' stroke-width='1'/%3E%3Cpath d='M0 60 Q20 70 40 60 T80 60' stroke='${accent}' stroke-opacity='${(opacity * 0.53).toFixed(2)}' stroke-width='1'/%3E%3Cpath d='M0 0 Q10 20 0 40 Q10 60 0 80' stroke='${accent}' stroke-opacity='${(opacity * 0.53).toFixed(2)}' stroke-width='1'/%3E%3Cpath d='M40 0 Q50 20 40 40 Q50 60 40 80' stroke='${accent}' stroke-opacity='${(opacity * 0.53).toFixed(2)}' stroke-width='1'/%3E%3Cpath d='M80 0 Q70 20 80 40 Q70 60 80 80' stroke='${accent}' stroke-opacity='${(opacity * 0.53).toFixed(2)}' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'metallic':
      const metallicOpacity = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return `repeating-linear-gradient(135deg, ${baseColor} 0px, ${accentColor}${metallicOpacity} 2px, ${baseColor} 4px, ${accentColor}${Math.round(opacity * 0.75 * 255).toString(16).padStart(2, '0')} 6px)`;
    case 'embossed':
      return `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${accent}' stroke-opacity='${(opacity * 1.33).toFixed(2)}' stroke-width='0.5'%3E%3Ccircle cx='25' cy='25' r='20'/%3E%3Ccircle cx='25' cy='25' r='15'/%3E%3Ccircle cx='25' cy='25' r='10'/%3E%3Ccircle cx='25' cy='25' r='5'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'woven':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${accent}' stroke-opacity='${opacityStr}' stroke-width='1'%3E%3Cpath d='M0 0 L40 40 M0 10 L40 30 M0 20 L40 20 M0 30 L40 10 M0 40 L40 0'/%3E%3Cpath d='M0 0 L40 40 M10 0 L30 40 M20 0 L20 40 M30 0 L10 40 M40 0 L0 40'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'marble':
      return `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cfilter id='marble'%3E%3CfeTurbulence baseFrequency='0.04' numOctaves='3'/%3E%3CfeDisplacementMap in='SourceGraphic' scale='8'/%3E%3C/filter%3E%3C/defs%3E%3Cg fill='${accent}' fill-opacity='${(opacity * 0.53).toFixed(2)}' filter='url(%23marble)'%3E%3Cpath d='M0 0 Q30 20 60 0 T120 0 L120 120 Q90 100 60 120 T0 120 Z'/%3E%3Cpath d='M0 40 Q40 60 80 40 T160 40'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'woodgrain':
      return `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${accent}' stroke-opacity='${(opacity * 0.8).toFixed(2)}' stroke-width='0.5'%3E%3Cpath d='M0 0 Q20 5 40 0 Q60 5 80 0 Q100 5 100 0'/%3E%3Cpath d='M0 20 Q20 25 40 20 Q60 25 80 20 Q100 25 100 20'/%3E%3Cpath d='M0 40 Q20 45 40 40 Q60 45 80 40 Q100 45 100 40'/%3E%3Cpath d='M0 60 Q20 65 40 60 Q60 65 80 60 Q100 65 100 60'/%3E%3Cpath d='M0 80 Q20 85 40 80 Q60 85 80 80 Q100 85 100 80'/%3E%3Cpath d='M0 100 Q20 105 40 100 Q60 105 80 100 Q100 105 100 100'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'quilted':
      return `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='${accent}' stroke-opacity='${opacityStr}' stroke-width='1'%3E%3Cpath d='M0 0 L30 30 L0 60 M30 0 L60 30 L30 60 M60 0 L30 30 L60 60'/%3E%3Cpath d='M0 30 L60 30 M30 0 L30 60'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'brocade':
      return `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${accent}' fill-opacity='${(opacity * 0.67).toFixed(2)}'%3E%3Cpath d='M40 0 L50 20 L70 20 L55 35 L60 55 L40 45 L20 55 L25 35 L10 20 L30 20 Z'/%3E%3Cpath d='M40 20 L45 30 L55 30 L48 38 L50 48 L40 42 L30 48 L32 38 L25 30 L35 30 Z'/%3E%3C/g%3E%3C/svg%3E")`;
    case 'velvet':
      return `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='velvet' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='${accent}' stop-opacity='${(opacity * 1.33).toFixed(2)}'/%3E%3Cstop offset='50%25' stop-color='${accent}' stop-opacity='${(opacity * 0.33).toFixed(2)}'/%3E%3Cstop offset='100%25' stop-color='${accent}' stop-opacity='${opacityStr}'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='40' height='40' fill='url(%23velvet)'/%3E%3Cpath d='M0 0 L40 40 M0 40 L40 0' stroke='${accent}' stroke-opacity='${(opacity * 0.67).toFixed(2)}' stroke-width='0.5'/%3E%3C/svg%3E")`;
    default:
      return 'none';
  }
}

export const DEMO_ENVELOPE_PROPS: Envelope2DProps = {
  color: '#c9a86c',
  pattern: 'floral',
  linerPattern: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
  stampUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=150&q=80',
  sealDesign: 'heart',
  sealColor: '#c62828',
  isOpen: false,
  side: 'back', // Mặc định là mặt sau để thấy nút mở
};

/**
 * Resolve asset URL coming from DB/admin.
 * - Hỗ trợ absolute URL, data/blob
 * - Hỗ trợ Supabase public storage path/bucket
 * - Chặn javascript: URL
 */
function resolveAssetUrl(input?: string | null): string | null {
  return resolveImageUrl(input);
}

function shade(hex: string, amt: number) {
  const c = (hex ?? '#c9a86c').replace('#', '');
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return hex;
  const num = parseInt(full, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (num & 255) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// Seal icon renderer
function SealIcon({ design, className }: { design: SealDesign; className?: string }) {
  const iconProps = { className: className || 'w-5 h-5', fill: 'currentColor' };
  switch (design) {
    case 'heart':
      return <Heart {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'crown':
      return <Crown {...iconProps} />;
    case 'flower':
      return <Flower2 {...iconProps} />;
    case 'sparkle':
      return <Sparkles {...iconProps} />;
    case 'mail':
      return <Mail {...iconProps} />;
    case 'initial':
      return <span className="text-white font-serif font-bold text-lg">L</span>;
    default:
      return <Heart {...iconProps} />;
  }
}

export default function Envelope2D({
  color = '#c9a86c',
  pattern = 'solid',
  patternColor,
  patternIntensity = 0.15,
  texture,
  linerPattern,
  linerPatternType,
  linerColor = '#ffffff',
  stampUrl,
  sealDesign = 'heart',
  sealColor = '#c62828',
  isOpen = false,
  side = 'front',
  showControls = false,
  onToggleOpen,
  onFlip,
  onOpenComplete,
}: Envelope2DProps) {
  const [stampError, setStampError] = useState(false);
  const [linerError, setLinerError] = useState(false);

  const textureUrl = useMemo(() => resolveAssetUrl(texture), [texture]);
  const linerUrl = useMemo(() => resolveAssetUrl(linerPattern), [linerPattern]);
  const stampImg = useMemo(() => resolveAssetUrl(stampUrl), [stampUrl]);

  const baseColor = color || '#c9a86c';
  const darker = useMemo(() => shade(baseColor, -30), [baseColor]);
  const lighter = useMemo(() => shade(baseColor, 25), [baseColor]);
  const darkest = useMemo(() => shade(baseColor, -50), [baseColor]);
  
  // ✅ Sử dụng getEnvelopePatternStyle từ design-presets để hỗ trợ tất cả 100+ patterns
  const patternStyles = useMemo(
    () => {
      if (!pattern || pattern === 'solid' || pattern === 'env-solid') {
        return { backgroundImage: 'none' };
      }
      
      // Nếu là pattern cũ (solid, floral, etc.), vẫn dùng getPatternCSS để tương thích
      const legacyPatterns: EnvelopePattern[] = ['floral', 'damask', 'geometric', 'lace', 'vintage', 'dots', 'stripes', 'parchment', 'fabric', 'leather', 'metallic', 'embossed', 'woven', 'marble', 'woodgrain', 'quilted', 'brocade', 'velvet'];
      
      if (legacyPatterns.includes(pattern as EnvelopePattern)) {
        // Dùng getPatternCSS cho patterns cũ
        const accentColor = patternColor || darkest;
        const patternCSS = getPatternCSS(pattern as EnvelopePattern, baseColor, accentColor, patternIntensity);
        return { backgroundImage: patternCSS };
      }
      
      // Dùng getEnvelopePatternStyle cho patterns mới từ design-presets
      // Pattern có thể là bất kỳ string nào (env-khung-vien, env-song-nhat, etc.)
      return getEnvelopePatternStyle(pattern as string, baseColor);
    },
    [pattern, baseColor, patternColor, patternIntensity, darkest]
  );
  
  // Liner pattern CSS (nếu có linerPatternType)
  const linerPatternStyles = useMemo(() => {
    if (!linerPatternType || linerPatternType === 'solid' || linerPatternType === 'env-solid') {
      return null;
    }
    
    const legacyPatterns: EnvelopePattern[] = ['floral', 'damask', 'geometric', 'lace', 'vintage', 'dots', 'stripes', 'parchment', 'fabric', 'leather', 'metallic', 'embossed', 'woven', 'marble', 'woodgrain', 'quilted', 'brocade', 'velvet'];
    
    if (legacyPatterns.includes(linerPatternType as EnvelopePattern)) {
      const linerAccent = shade(linerColor, -30);
      const patternCSS = getPatternCSS(linerPatternType as EnvelopePattern, linerColor, linerAccent, 0.2);
      return { backgroundImage: patternCSS };
    }
    
    // Dùng getEnvelopePatternStyle cho patterns mới
    return getEnvelopePatternStyle(linerPatternType as string, linerColor);
  }, [linerPatternType, linerColor]);
  
  // Texture overlay based on pattern type
  const textureOverlay = useMemo(() => {
    switch (pattern) {
      case 'parchment':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence baseFrequency='0.04' numOctaves='5'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.6'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        };
      case 'fabric':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fabric'%3E%3CfeTurbulence baseFrequency='0.1' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fabric)' opacity='0.5'/%3E%3C/svg%3E")`,
          opacity: 0.3,
        };
      case 'leather':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence baseFrequency='0.03' numOctaves='4'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23leather)' opacity='0.5'/%3E%3C/svg%3E")`,
          opacity: 0.35,
        };
      case 'metallic':
        return {
          backgroundImage: `repeating-linear-gradient(135deg, transparent 0px, rgba(255,255,255,0.1) 1px, transparent 2px, rgba(0,0,0,0.1) 3px)`,
          opacity: 0.6,
        };
      case 'velvet':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='velvet'%3E%3CfeTurbulence baseFrequency='0.2' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23velvet)' opacity='0.4'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        };
      case 'woodgrain':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='wood'%3E%3CfeTurbulence baseFrequency='0.02 0.5' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23wood)' opacity='0.5'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        };
      default:
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
        };
    }
  }, [pattern]);
  
  // Seal colors
  const sealBase = sealColor || '#c62828';
  const sealLight = useMemo(() => shade(sealBase, 40), [sealBase]);
  const sealDark = useMemo(() => shade(sealBase, -40), [sealBase]);

  const canFlip = typeof onFlip === 'function';
  const canToggle = typeof onToggleOpen === 'function';

  // Khi animation mở hoàn tất, gọi callback
  const handleFlapAnimationComplete = () => {
    if (isOpen && onOpenComplete) {
      onOpenComplete();
    }
  };

  return (
    <div className="relative w-[280px] sm:w-[340px] aspect-[4/3] mx-auto select-none">
      {/* Shadow */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{ boxShadow: '0 10px 30px -5px rgba(0,0,0,0.3)' }}
      />

      {/* 3D Container */}
      <div className="absolute inset-0" style={{ perspective: '800px' }}>
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: side === 'back' ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 25 }}
        >
          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* FRONT SIDE - Mặt trước: Tem + Địa chỉ (không có nắp/seal) */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: baseColor,
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Texture overlay */}
            {textureUrl && (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${textureUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            
            {/* Texture overlay based on pattern */}
            <div 
              className="absolute inset-0"
              style={{
                ...textureOverlay,
                backgroundSize: pattern === 'parchment' || pattern === 'leather' || pattern === 'woodgrain' ? 'cover' : 'auto',
                backgroundRepeat: pattern === 'metallic' ? 'repeat' : 'repeat',
              }}
            />

            {/* Pattern overlay - Họa tiết hoa văn */}
            {pattern !== 'solid' && (
              <div 
                className="absolute inset-0"
                style={{
                  ...patternStyles,
                  backgroundRepeat: 'repeat',
                }}
              />
            )}

            {/* Gradient nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* STAMP - Tem thư (Góc phải trên mặt trước) */}
            {/* ─────────────────────────────────────────────────────────────── */}
            {stampImg && !stampError && (
              <div className="absolute top-4 right-4" style={{ zIndex: 15 }}>
                {/* Stamp frame with perforated edges */}
                <div 
                  className="relative bg-white p-1.5 shadow-lg"
                  style={{
                    clipPath: `polygon(
                      0% 4%, 4% 4%, 4% 0%, 12% 0%, 12% 4%, 20% 4%, 20% 0%, 28% 0%, 28% 4%, 36% 4%, 36% 0%, 44% 0%, 44% 4%, 52% 4%, 52% 0%, 60% 0%, 60% 4%, 68% 4%, 68% 0%, 76% 0%, 76% 4%, 84% 4%, 84% 0%, 92% 0%, 92% 4%, 96% 4%, 96% 0%, 100% 0%,
                      100% 4%, 96% 4%, 96% 12%, 100% 12%, 100% 20%, 96% 20%, 96% 28%, 100% 28%, 100% 36%, 96% 36%, 96% 44%, 100% 44%, 100% 52%, 96% 52%, 96% 60%, 100% 60%, 100% 68%, 96% 68%, 96% 76%, 100% 76%, 100% 84%, 96% 84%, 96% 92%, 100% 92%, 100% 100%,
                      96% 100%, 96% 96%, 92% 96%, 92% 100%, 84% 100%, 84% 96%, 76% 96%, 76% 100%, 68% 100%, 68% 96%, 60% 96%, 60% 100%, 52% 100%, 52% 96%, 44% 96%, 44% 100%, 36% 100%, 36% 96%, 28% 96%, 28% 100%, 20% 100%, 20% 96%, 12% 96%, 12% 100%, 4% 100%, 4% 96%, 0% 96%,
                      0% 92%, 4% 92%, 4% 84%, 0% 84%, 0% 76%, 4% 76%, 4% 68%, 0% 68%, 0% 60%, 4% 60%, 4% 52%, 0% 52%, 0% 44%, 4% 44%, 4% 36%, 0% 36%, 0% 28%, 4% 28%, 4% 20%, 0% 20%, 0% 12%, 4% 12%, 4% 4%
                    )`,
                  }}
                >
                  <div className="w-12 h-16 sm:w-14 sm:h-[72px] overflow-hidden">
                    <img
                      src={stampImg}
                      alt="Stamp"
                      className="w-full h-full object-cover"
                      onError={() => setStampError(true)}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                {/* Postmark overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-25"
                  style={{
                    transform: 'rotate(-18deg) translate(-30%, -15%)',
                  }}
                >
                  <div className="w-20 h-20 rounded-full border-2 border-gray-700 flex items-center justify-center">
                    <div className="text-[6px] text-gray-700 text-center leading-tight font-mono">
                      <div>VIỆT NAM</div>
                      <div>POST</div>
                      <div>2025</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* ADDRESS LINES - Dòng địa chỉ */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <div className="absolute bottom-6 left-6 right-16 space-y-2" style={{ zIndex: 5 }}>
              <div className="h-0.5 bg-black/15 rounded-full" />
              <div className="h-0.5 bg-black/12 rounded-full w-4/5" />
              <div className="h-0.5 bg-black/10 rounded-full w-3/5" />
            </div>

            {/* Decorative corner */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 opacity-10 rounded-tl-sm" 
              style={{ borderColor: darkest }} 
            />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 opacity-10 rounded-br-sm" 
              style={{ borderColor: darkest }} 
            />

            {/* Inner border */}
            <div 
              className="absolute inset-2 rounded border border-white/10 pointer-events-none" 
              style={{ zIndex: 25 }} 
            />
          </div>

          {/* ══════════════════════════════════════════════════════════════════ */}
          {/* BACK SIDE - Mặt sau: Nắp phong bì + Seal để mở */}
          {/* ══════════════════════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              backgroundColor: baseColor,
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Texture overlay */}
            {textureUrl && (
              <div 
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${textureUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            
            {/* Texture overlay based on pattern */}
            <div 
              className="absolute inset-0"
              style={{
                ...textureOverlay,
                backgroundSize: pattern === 'parchment' || pattern === 'leather' || pattern === 'woodgrain' ? 'cover' : 'auto',
                backgroundRepeat: pattern === 'metallic' ? 'repeat' : 'repeat',
              }}
            />

            {/* Pattern overlay - Họa tiết hoa văn */}
            {pattern !== 'solid' && (
              <div 
                className="absolute inset-0"
                style={{
                  ...patternStyles,
                  backgroundRepeat: 'repeat',
                }}
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-black/10" />
            
            {/* ─────────────────────────────────────────────────────────────── */}
            {/* ENVELOPE BODY - Các nếp gấp */}
            {/* ─────────────────────────────────────────────────────────────── */}
            
            {/* Nếp gấp TRÁI */}
            <div
              className="absolute top-0 left-0 h-full"
              style={{
                width: '50%',
                background: `linear-gradient(to right, ${darker} 0%, ${darkest} 100%)`,
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                zIndex: 2,
              }}
            />
            
            {/* Nếp gấp PHẢI */}
            <div
              className="absolute top-0 right-0 h-full"
              style={{
                width: '50%',
                background: `linear-gradient(to left, ${darker} 0%, ${darkest} 100%)`,
                clipPath: 'polygon(100% 0, 0 50%, 100% 100%)',
                zIndex: 2,
              }}
            />
            
            {/* Nếp gấp DƯỚI */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: '55%',
                background: `linear-gradient(to top, ${lighter} 0%, ${baseColor} 100%)`,
                clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                zIndex: 3,
              }}
            />
            
            {/* Highlight trên nếp dưới */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{
                height: '55%',
                background: 'linear-gradient(to top, rgba(255,255,255,0.15) 0%, transparent 40%)',
                clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
                zIndex: 4,
              }}
            />

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* FLAP - Nắp phong bì (tam giác chỉ xuống từ trên) */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <motion.div
              className="absolute top-0 left-0 right-0"
              style={{
                height: '55%',
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                zIndex: isOpen ? 1 : 10,
              }}
              animate={{
                rotateX: isOpen ? -170 : 0,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              onAnimationComplete={handleFlapAnimationComplete}
            >
              {/* Mặt ngoài nắp */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${lighter} 0%, ${baseColor} 50%, ${darker} 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  backfaceVisibility: 'hidden',
                }}
              >
                {textureUrl && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${textureUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'top center',
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      opacity: 0.5,
                    }}
                  />
                )}
                {/* Highlight trên */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, transparent 30%)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
                {/* Shadow ở đỉnh tam giác */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 30%)',
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                />
              </div>
              
              {/* Mặt trong nắp (liner pattern) */}
              <div
                className="absolute inset-0"
                style={{
                  transform: 'rotateX(180deg)',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, ${shade(linerColor || baseColor, 15)} 0%, ${shade(linerColor || baseColor, 25)} 100%)`,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  }}
                >
                  {/* Liner pattern từ type (ưu tiên) */}
                  {linerPatternType && linerPatternStyles && (
                    <div
                      className="absolute"
                      style={{
                        inset: '5%',
                        ...linerPatternStyles,
                        backgroundRepeat: 'repeat',
                        backgroundSize: linerPatternStyles.backgroundSize || 'auto',
                        clipPath: 'polygon(0 0, 100% 0, 50% 90%)',
                        opacity: 0.8,
                      }}
                    />
                  )}
                  {/* Liner pattern từ URL */}
                  {!linerPatternType && linerUrl && !linerError && (
                    <div
                      className="absolute"
                      style={{
                        inset: '5%',
                        backgroundImage: `url(${linerUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        clipPath: 'polygon(0 0, 100% 0, 50% 90%)',
                      }}
                    >
                      <img src={linerUrl} alt="" className="hidden" onError={() => setLinerError(true)} />
                    </div>
                  )}
                  {/* Fallback pattern nếu không có gì */}
                  {!linerPatternType && (!linerUrl || linerError) && (
                    <div
                      className="absolute"
                      style={{
                        inset: '5%',
                        background: `repeating-linear-gradient(45deg, ${shade(linerColor || baseColor, 5)}30, ${shade(linerColor || baseColor, 5)}30 5px, transparent 5px, transparent 10px)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 90%)',
                      }}
                    />
                  )}
                </div>
              </div>
            </motion.div>

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* WAX SEAL - Con dấu sáp (Ở giữa nắp phong bì - dịch sang trái) */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  className="absolute"
                  style={{ 
                    zIndex: 20,
                    left: '43%', /* Căn giữa vùng nắp phong bì */
                    top: '43%',  /* Dịch lên trên để căn giữa vùng nắp */
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                >
                  {/* Seal shadow */}
                  <div 
                    className="absolute inset-0 rounded-full blur-sm"
                    style={{
                      background: 'rgba(0,0,0,0.4)',
                      transform: 'translate(2px, 3px)',
                    }}
                  />
                  {/* Main seal */}
                  <div
                    className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${sealLight} 0%, ${sealBase} 50%, ${sealDark} 100%)`,
                      boxShadow: `
                        inset 0 -3px 8px rgba(0,0,0,0.5), 
                        inset 0 3px 6px rgba(255,255,255,0.2), 
                        0 4px 12px rgba(0,0,0,0.4)
                      `,
                    }}
                  >
                    {/* Decorative border */}
                    <div 
                      className="absolute inset-1 rounded-full border border-white/20"
                    />
                    {/* Inner ring */}
                    <div 
                      className="absolute inset-2 rounded-full"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${sealLight}40 0%, transparent 70%)`,
                      }}
                    />
                    {/* Icon */}
                    <div className="text-white/90 relative z-10">
                      <SealIcon design={sealDesign} className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>
                  {/* Wax drips */}
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-2 rounded-b-full"
                    style={{ background: `linear-gradient(to bottom, ${sealBase}, ${sealDark})` }}
                  />
                  <div
                    className="absolute -bottom-0.5 left-1/4 w-1.5 h-1 rounded-b-full"
                    style={{ background: `linear-gradient(to bottom, ${sealBase}, ${sealDark})` }}
                  />
                  <div
                    className="absolute -bottom-0.5 right-1/4 w-2 h-1.5 rounded-b-full"
                    style={{ background: `linear-gradient(to bottom, ${sealBase}, ${sealDark})` }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Label */}
            <div className="absolute bottom-4 left-0 right-0 text-center" style={{ zIndex: 5 }}>
              <span className="text-[8px] uppercase tracking-[0.2em] text-black/25 font-medium">
                ✦ With Love ✦
              </span>
            </div>
            
            <div className="absolute inset-2 rounded border border-white/10 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* CONTROLS */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {showControls && (canFlip || canToggle) && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {canToggle && (
            <button
              type="button"
              onClick={onToggleOpen}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-200 shadow text-rose-500 font-medium text-sm hover:bg-rose-50 transition"
            >
              {isOpen ? '✉️ Đóng' : '💌 Mở'}
            </button>
          )}
          {canFlip && (
            <button
              type="button"
              onClick={onFlip}
              className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 shadow text-gray-500 font-medium text-sm hover:bg-gray-50 transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Lật
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function Envelope2DDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [side, setSide] = useState<EnvelopeSide>('back'); // Bắt đầu ở mặt sau để thấy seal
  const [showTemplate, setShowTemplate] = useState(false);
  const [selectedSeal, setSelectedSeal] = useState<SealDesign>('heart');
  const [selectedSealColor, setSelectedSealColor] = useState('#c62828');
  const [selectedPattern, setSelectedPattern] = useState<EnvelopePattern | string>('floral');

  const handleOpenComplete = () => {
    // Khi mở xong, hiện template full screen
    setShowTemplate(true);
  };

  return (
    <div className="min-h-[520px] bg-gradient-to-br from-amber-50 to-rose-50 p-6 flex flex-col items-center justify-center relative">
      {/* Pattern Selector */}
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2 text-center">Họa tiết phong bì:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {ENVELOPE_PATTERNS.map((pat) => (
            <button
              key={pat.id}
              onClick={() => setSelectedPattern(pat.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedPattern === pat.id 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'bg-white text-gray-600 hover:bg-amber-50 border border-gray-200'
              }`}
              title={pat.name}
            >
              {pat.preview && <span className="mr-1">{pat.preview}</span>}
              {pat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Seal Design Selector */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2 text-center">Chọn mẫu con dấu:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SEAL_DESIGNS.map((seal) => (
            <button
              key={seal.id}
              onClick={() => {
                setSelectedSeal(seal.id);
                setSelectedSealColor(seal.color);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                selectedSeal === seal.id 
                  ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                  : 'hover:scale-105'
              }`}
              style={{ 
                background: `radial-gradient(circle at 30% 30%, ${shade(seal.color, 40)} 0%, ${seal.color} 50%, ${shade(seal.color, -40)} 100%)`,
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}
              title={seal.name}
            >
              <div className="text-white/90">
                <SealIcon design={seal.id} className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <Envelope2D
        {...DEMO_ENVELOPE_PROPS}
        isOpen={isOpen}
        side={side}
        pattern={selectedPattern as EnvelopePattern}
        sealDesign={selectedSeal}
        sealColor={selectedSealColor}
        showControls
        onToggleOpen={() => {
          if (isOpen) {
            setShowTemplate(false);
          }
          setIsOpen(!isOpen);
        }}
        onFlip={() => setSide(s => s === 'front' ? 'back' : 'front')}
        onOpenComplete={handleOpenComplete}
      />

      {/* Template Full Screen Overlay */}
      <AnimatePresence>
        {showTemplate && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setShowTemplate(false);
              setIsOpen(false);
            }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-8"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">💌 Thiệp của bạn</h2>
                <p className="text-gray-600 mb-6">
                  Đây là nơi hiển thị template card đã chọn
                </p>
                <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">Template Card Preview</span>
                </div>
                <button
                  onClick={() => {
                    setShowTemplate(false);
                    setIsOpen(false);
                  }}
                  className="mt-6 px-6 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
