/**
 * ✅ Envelope3D - Phong bì 3D Premium
 * 
 * Component phong bì 3D đẹp mắt với khả năng tùy chỉnh cao:
 * - 3D rendering với CSS transforms
 * - Hỗ trợ nhiều màu sắc và gradients
 * - Hỗ trợ 100+ họa tiết (patterns)
 * - Nhiều kiểu mở (flip, slide, pop-up)
 * - Animation mượt mà với Framer Motion
 * - Responsive và tối ưu hiệu suất
 * 
 * @author Echo eCard Team
 * @version 2.0.0
 */

'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, Crown, Flower2, Sparkles, Mail, RotateCcw } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';
import { 
  ENVELOPE_PATTERNS,
  getEnvelopePatternStyle,
  type EnvelopePatternPreset,
} from '@/lib/design-presets';

// ────────────────────────────────────────────────────────────────────────────────
// TYPES & INTERFACES
// ────────────────────────────────────────────────────────────────────────────────

export type SealDesign = 'heart' | 'star' | 'crown' | 'flower' | 'sparkle' | 'mail';
export type OpenStyle = 'flip' | 'slide' | 'pop-up';

export interface Envelope3DProps {
  /** Màu sắc chính của phong bì */
  color?: string;
  /** Họa tiết phong bì (pattern ID hoặc 'solid') */
  pattern?: string;
  /** Màu accent cho pattern */
  patternColor?: string;
  /** Độ đậm của pattern (0-1) */
  patternIntensity?: number;
  /** Texture URL (nếu có) */
  texture?: string | null;
  /** URL ảnh tem */
  stampUrl?: string | null;
  /** Thiết kế con dấu */
  sealDesign?: SealDesign;
  /** Màu con dấu */
  sealColor?: string;
  /** Trạng thái mở/đóng */
  isOpen?: boolean;
  /** Trạng thái lật (front/back) */
  isFlipped?: boolean;
  /** Kiểu mở (flip/slide/pop-up) */
  openStyle?: OpenStyle;
  /** Callback khi click vào seal */
  onSealClick?: () => void;
  /** Callback khi click vào phong bì */
  onClick?: () => void;
  /** Hiển thị controls */
  showControls?: boolean;
  /** Callback khi mở */
  onOpen?: () => void;
  /** Callback khi đóng */
  onClose?: () => void;
  /** Callback khi lật */
  onFlip?: () => void;
  /** Kích thước tùy chỉnh */
  size?: 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ────────────────────────────────────────────────────────────────────────────────

/**
 * Tạo màu sáng hơn từ hex color
 */
function lighten(hex: string, amt: number): string {
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c.split('').map((x) => x + x).join('') : c;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return hex;
  const num = parseInt(full, 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (num & 255) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Tạo màu tối hơn từ hex color
 */
function darken(hex: string, amt: number): string {
  return lighten(hex, -amt);
}

/**
 * Render icon cho seal design
 */
function SealIcon({ design, className }: { design: SealDesign; className?: string }) {
  const iconProps = { className: className || 'w-6 h-6', fill: 'currentColor' };
  switch (design) {
    case 'heart':
      return (
        <Heart {...iconProps} className={className || 'w-6 h-6'} fill="currentColor" />
      );
    case 'star':
      return (
        <Star {...iconProps} className={className || 'w-6 h-6'} fill="currentColor" />
      );
    case 'crown':
      return (
        <Crown {...iconProps} className={className || 'w-6 h-6'} fill="currentColor" />
      );
    case 'flower':
      return (
        <Flower2 {...iconProps} className={className || 'w-6 h-6'} fill="currentColor" />
      );
    case 'sparkle':
      return (
        <Sparkles {...iconProps} className={className || 'w-6 h-6'} fill="currentColor" />
      );
    case 'mail':
      return (
        <Mail {...iconProps} className={className || 'w-6 h-6'} fill="currentColor" />
      );
    default:
      return <Heart {...iconProps} className={className || 'w-6 h-6'} fill="currentColor" />;
  }
}

// ────────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ────────────────────────────────────────────────────────────────────────────────

export default function Envelope3D({
  color = '#f8bbd0',
  pattern = 'solid',
  patternColor = '#5d4037',
  patternIntensity = 0.15,
  texture = null,
  stampUrl = null,
  sealDesign = 'heart',
  sealColor = '#c62828',
  isOpen = false,
  isFlipped = false,
  openStyle = 'flip',
  onSealClick,
  onClick,
  showControls = false,
  onOpen,
  onClose,
  onFlip,
  size = 'md',
  className = '',
}: Envelope3DProps) {
  // ──────────────────────────────────────────────────────────────────────────────
  // STATE & MEMOS
  // ──────────────────────────────────────────────────────────────────────────────

  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [internalIsFlipped, setInternalIsFlipped] = useState(isFlipped);

  // Sync với props
  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setInternalIsFlipped(isFlipped);
  }, [isFlipped]);

  // Tính toán màu sắc
  const baseColor = color || '#f8bbd0';
  const lighter = useMemo(() => lighten(baseColor, 30), [baseColor]);
  const darker = useMemo(() => darken(baseColor, 20), [baseColor]);

  // Resolve texture URL
  const textureUrl = useMemo(() => {
    if (!texture) return null;
    return resolveImageUrl(texture);
  }, [texture]);

  // Resolve stamp URL
  const stampImg = useMemo(() => {
    if (!stampUrl) return null;
    return resolveImageUrl(stampUrl);
  }, [stampUrl]);

  // Pattern styles
  const patternStyles = useMemo(() => {
    if (pattern === 'solid') {
      return {};
    }
    // ✅ Đảm bảo patternColor là string, nếu không có thì dùng màu mặc định
    const bgColor = patternColor || '#5d4037';
    const styles = getEnvelopePatternStyle(pattern, bgColor);
    // ✅ Áp dụng intensity nếu có
    if (patternIntensity !== undefined && patternIntensity < 1) {
      return {
        ...styles,
        opacity: patternIntensity,
      };
    }
    return styles;
  }, [pattern, patternColor, patternIntensity]);

  // Size variants
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm':
        return 'w-[240px] sm:w-[280px]';
      case 'lg':
        return 'w-[360px] sm:w-[420px]';
      default:
        return 'w-[280px] sm:w-[340px]';
    }
  }, [size]);

  // ──────────────────────────────────────────────────────────────────────────────
  // HANDLERS
  // ──────────────────────────────────────────────────────────────────────────────

  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSealClick) {
      onSealClick();
    } else if (!internalIsOpen) {
      handleToggleOpen();
    }
  };

  const handleToggleOpen = () => {
    const newState = !internalIsOpen;
    setInternalIsOpen(newState);
    if (newState && onOpen) onOpen();
    if (!newState && onClose) onClose();
  };

  const handleFlip = () => {
    const newState = !internalIsFlipped;
    setInternalIsFlipped(newState);
    if (onFlip) onFlip();
  };

  // ──────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────────────

  return (
    <div 
      className={`relative ${sizeClasses} aspect-[4/3] mx-auto select-none ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Shadow */}
      <div 
        className="absolute inset-0 rounded-lg"
        style={{ 
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3), 0 10px 20px -5px rgba(0,0,0,0.2)',
        }}
      />

      {/* 3D Container */}
      <div 
        className="absolute inset-0"
        style={{ 
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{ 
            transformStyle: 'preserve-3d',
          }}
          animate={{ 
            rotateY: internalIsFlipped ? 180 : 0,
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 25,
          }}
        >
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* FRONT SIDE - Mặt trước: Tem + Địa chỉ */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div
            className="absolute inset-0 rounded-lg overflow-hidden"
            style={{
              backgroundColor: baseColor,
              transform: 'rotateY(0deg)',
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
                  opacity: 0.3,
                }}
              />
            )}

            {/* Pattern overlay */}
            {pattern !== 'solid' && (
              <div 
                className="absolute inset-0"
                style={{
                  ...patternStyles,
                  backgroundRepeat: 'repeat',
                  opacity: patternIntensity,
                }}
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

            {/* ✅ Tem ở góc trên bên phải */}
            {stampImg && (
              <div 
                className="absolute top-3 right-3"
                style={{ zIndex: 10 }}
              >
                <div className="relative">
                  {/* Tem với viền răng cưa */}
                  <div className="w-14 h-18 sm:w-16 sm:h-20 overflow-hidden shadow-lg" style={{
                    background: 'white',
                    border: '2px dashed #333',
                    borderRadius: '2px',
                    padding: '2px',
                  }}>
                    <img
                      src={stampImg}
                      alt="Stamp"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Postmark/Cancellation mark - 3 đường sóng */}
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2" style={{ zIndex: 11 }}>
                    <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                      <path d="M0,6 Q5,2 10,6 T20,6 T30,6 T40,6" stroke="#666" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M0,8 Q5,4 10,8 T20,8 T30,8 T40,8" stroke="#666" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10" stroke="#666" strokeWidth="1.5" fill="none" opacity="0.6"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ Địa chỉ ở dưới bên trái (5 dòng) */}
            <div 
              className="absolute bottom-8 left-6"
              style={{ zIndex: 5 }}
            >
              <div className="space-y-1.5">
                {/* 5 dòng địa chỉ với độ dài khác nhau */}
                <div className="h-0.5 bg-gray-700 rounded" style={{ width: '120px', opacity: 0.7 }}></div>
                <div className="h-0.5 bg-gray-700 rounded" style={{ width: '140px', opacity: 0.7 }}></div>
                <div className="h-0.5 bg-gray-700 rounded" style={{ width: '100px', opacity: 0.7 }}></div>
                <div className="h-0.5 bg-gray-700 rounded" style={{ width: '110px', opacity: 0.7 }}></div>
                <div className="h-0.5 bg-gray-700 rounded" style={{ width: '90px', opacity: 0.7 }}></div>
              </div>
            </div>

            {/* Inner border */}
            <div 
              className="absolute inset-2 rounded border border-white/20 pointer-events-none" 
              style={{ zIndex: 5 }} 
            />
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* BACK SIDE - Mặt sau: Con dấu sáp */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
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
                  opacity: 0.3,
                }}
              />
            )}

            {/* Pattern overlay */}
            {pattern !== 'solid' && (
              <div 
                className="absolute inset-0"
                style={{
                  ...patternStyles,
                  backgroundRepeat: 'repeat',
                  opacity: patternIntensity,
                }}
              />
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* BODY - Phần thân phong bì (chỉ hiển thị khi đóng) */}
            {/* ─────────────────────────────────────────────────────────────── */}
            {!internalIsOpen && (
              <>
                {/* Body chính - Phần giữa không bị gấp */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{
                    width: '40%', // ✅ Phần giữa không bị che bởi nắp bên
                    height: '100%',
                    backgroundColor: baseColor,
                    zIndex: 2,
                  }}
                >
                  {/* Texture cho body */}
                  {textureUrl && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${textureUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.3,
                      }}
                    />
                  )}
                  {/* Pattern cho body */}
                  {pattern !== 'solid' && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        ...patternStyles,
                        backgroundRepeat: 'repeat',
                        opacity: patternIntensity * 0.8,
                      }}
                    />
                  )}
                </div>

                {/* ✅ NẮP BÊN TRÁI - Gấp vào trong tạo hình V (giống Figma) */}
                <div
                  className="absolute left-0 top-0"
                  style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: baseColor,
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)',
                    zIndex: 8,
                    transform: 'perspective(800px) rotateY(-25deg)',
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Texture cho nắp trái */}
                  {textureUrl && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${textureUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                        opacity: 0.3,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)',
                      }}
                    />
                  )}
                  {/* Pattern cho nắp trái */}
                  {pattern !== 'solid' && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        ...patternStyles,
                        backgroundRepeat: 'repeat',
                        opacity: patternIntensity * 0.8,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)',
                      }}
                    />
                  )}
                  {/* Nếp gấp sâu ở cạnh trong nắp trái (tạo hình V) - Rất rõ ràng */}
                  <div 
                    className="absolute right-0 top-0 bottom-0"
                    style={{
                      width: '8px',
                      background: `linear-gradient(to left, ${darken(baseColor, 60)} 0%, ${darken(baseColor, 50)} 30%, ${darken(baseColor, 40)} 60%, transparent 100%)`,
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)',
                      boxShadow: `inset 5px 0 12px rgba(0,0,0,0.5), -5px 0 10px rgba(0,0,0,0.4)`,
                      zIndex: 1,
                    }}
                  />
                  {/* Highlight ở cạnh ngoài */}
                  <div 
                    className="absolute left-0 top-0 bottom-0"
                    style={{
                      width: '3px',
                      background: `linear-gradient(to right, ${lighten(baseColor, 20)} 0%, transparent 100%)`,
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)',
                      zIndex: 2,
                    }}
                  />
                </div>

                {/* ✅ NẮP BÊN PHẢI - Gấp vào trong tạo hình V (giống Figma) */}
                <div
                  className="absolute right-0 top-0"
                  style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: baseColor,
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
                    zIndex: 8,
                    transform: 'perspective(800px) rotateY(25deg)',
                    transformOrigin: 'right center',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Texture cho nắp phải */}
                  {textureUrl && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${textureUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'right center',
                        opacity: 0.3,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
                      }}
                    />
                  )}
                  {/* Pattern cho nắp phải */}
                  {pattern !== 'solid' && (
                    <div 
                      className="absolute inset-0"
                      style={{
                        ...patternStyles,
                        backgroundRepeat: 'repeat',
                        opacity: patternIntensity * 0.8,
                        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
                      }}
                    />
                  )}
                  {/* Nếp gấp sâu ở cạnh trong nắp phải (tạo hình V) - Rất rõ ràng */}
                  <div 
                    className="absolute left-0 top-0 bottom-0"
                    style={{
                      width: '8px',
                      background: `linear-gradient(to right, ${darken(baseColor, 60)} 0%, ${darken(baseColor, 50)} 30%, ${darken(baseColor, 40)} 60%, transparent 100%)`,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
                      boxShadow: `inset -5px 0 12px rgba(0,0,0,0.5), 5px 0 10px rgba(0,0,0,0.4)`,
                      zIndex: 1,
                    }}
                  />
                  {/* Highlight ở cạnh ngoài */}
                  <div 
                    className="absolute right-0 top-0 bottom-0"
                    style={{
                      width: '3px',
                      background: `linear-gradient(to left, ${lighten(baseColor, 20)} 0%, transparent 100%)`,
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 100%)',
                      zIndex: 2,
                    }}
                  />
                </div>

                {/* ✅ Nếp gấp ở góc dưới body */}
                <div 
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    height: '3px',
                    background: `linear-gradient(to top, ${darken(baseColor, 30)} 0%, ${darken(baseColor, 20)} 50%, transparent 100%)`,
                    boxShadow: `inset 0 -2px 6px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.15)`,
                    zIndex: 5,
                  }}
                />
              </>
            )}

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* FLAP - Nắp phong bì (có thể mở/đóng) */}
            {/* ─────────────────────────────────────────────────────────────── */}
            <motion.div
              className="absolute top-0 left-0 right-0"
              style={{
                height: '55%',
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
                zIndex: internalIsOpen ? 1 : 10,
              }}
              animate={{
                rotateX: internalIsOpen ? -170 : 0,
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 20,
              }}
            >
              {/* Mặt ngoài nắp */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${lighter} 0%, ${baseColor} 50%, ${darker} 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateX(180deg)',
                }}
              >
                {/* Texture cho nắp */}
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
                {/* Pattern cho nắp */}
                {pattern !== 'solid' && (
                  <div
                    className="absolute inset-0"
                    style={{
                      ...patternStyles,
                      backgroundRepeat: 'repeat',
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      opacity: patternIntensity,
                    }}
                  />
                )}
                
                {/* ✅ Nếp gấp ở cạnh trái nắp (khi đóng) - Tăng độ rõ ràng */}
                {!internalIsOpen && (
                  <>
                    <div 
                      className="absolute left-0 top-0 bottom-0"
                      style={{
                        width: '4px',
                        background: `linear-gradient(to right, ${darken(baseColor, 35)} 0%, ${darken(baseColor, 25)} 60%, transparent 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)',
                        boxShadow: `inset -3px 0 8px rgba(0,0,0,0.3), 3px 0 6px rgba(0,0,0,0.2)`,
                        zIndex: 6,
                      }}
                    />
                    <div 
                      className="absolute right-0 top-0 bottom-0"
                      style={{
                        width: '4px',
                        background: `linear-gradient(to left, ${darken(baseColor, 35)} 0%, ${darken(baseColor, 25)} 60%, transparent 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 100%)',
                        boxShadow: `inset 3px 0 8px rgba(0,0,0,0.3), -3px 0 6px rgba(0,0,0,0.2)`,
                        zIndex: 6,
                      }}
                    />
                    {/* ✅ Nếp gấp ở cạnh trên nắp - Tăng độ rõ ràng */}
                    <div 
                      className="absolute top-0 left-0 right-0"
                      style={{
                        height: '4px',
                        background: `linear-gradient(to bottom, ${darken(baseColor, 30)} 0%, ${darken(baseColor, 20)} 60%, transparent 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        boxShadow: `inset 0 -3px 8px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.15)`,
                        zIndex: 6,
                      }}
                    />
                    {/* ✅ Nếp gấp chính ở đường gấp tam giác (cạnh dưới nắp) - Rất rõ ràng */}
                    <div 
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: '4px',
                        background: `linear-gradient(to bottom, transparent 0%, ${darken(baseColor, 40)} 30%, ${darken(baseColor, 35)} 50%, ${darken(baseColor, 30)} 70%, transparent 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        boxShadow: `0 3px 10px rgba(0,0,0,0.35), inset 0 2px 4px rgba(0,0,0,0.2)`,
                        zIndex: 6,
                      }}
                    />
                    {/* ✅ Highlight ở đường gấp tam giác (tạo độ sâu) */}
                    <div 
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: '2px',
                        background: `linear-gradient(to bottom, ${lighten(baseColor, 25)} 0%, ${lighten(baseColor, 15)} 50%, transparent 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        zIndex: 7,
                        transform: 'translateY(-2px)',
                        opacity: 0.6,
                      }}
                    />
                    {/* ✅ Shadow sâu hơn ở đường gấp */}
                    <div 
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        height: '6px',
                        background: `linear-gradient(to top, rgba(0,0,0,0.15) 0%, transparent 100%)`,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        zIndex: 4,
                        transform: 'translateY(4px)',
                        filter: 'blur(2px)',
                      }}
                    />
                  </>
                )}
              </div>
              
              {/* Mặt trong nắp (màu trắng - chỉ hiển thị khi mở) */}
              {internalIsOpen && (
                <div
                  className="absolute inset-0"
                  style={{
                    transform: 'rotateX(0deg)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundColor: '#ffffff',
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    }}
                  />
                </div>
              )}
            </motion.div>

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* SEAL - Con dấu sáp (chỉ hiển thị khi đóng) */}
            {/* ─────────────────────────────────────────────────────────────── */}
            {!internalIsOpen && (
              <motion.div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ zIndex: 15 }}
                onClick={handleSealClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Seal shadow */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,.25), rgba(0,0,0,.15) 35%, rgba(0,0,0,.28) 65%)',
                    transform: 'scale(1.1)',
                    filter: 'blur(4px)',
                  }}
                />
                
                {/* Seal */}
                <div 
                  className="relative w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${lighten(sealColor, 40)}, ${sealColor} 48%, ${darken(sealColor, 20)} 72%)`,
                    boxShadow: 'inset 0 0 14px rgba(0,0,0,.35), 0 10px 24px rgba(0,0,0,.22)',
                  }}
                >
                  <SealIcon design={sealDesign} className="w-7 h-7 text-white/90" />
                </div>
              </motion.div>
            )}

            {/* ─────────────────────────────────────────────────────────────── */}
            {/* BODY LINER - Phần body bên trong (màu trắng khi mở) */}
            {/* ─────────────────────────────────────────────────────────────── */}
            {internalIsOpen && (
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '45%',
                  backgroundColor: '#ffffff',
                  zIndex: 2,
                }}
              />
            )}
            
            {/* Inner border */}
            <div 
              className="absolute inset-2 rounded border border-white/10 pointer-events-none" 
              style={{ zIndex: 5 }} 
            />
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* CONTROLS */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {showControls && (
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleOpen}
            className="px-4 py-2 rounded-lg bg-white border border-rose-200 shadow-md text-rose-500 font-medium text-sm hover:bg-rose-50 transition flex items-center gap-2"
          >
            {internalIsOpen ? '✉️ Đóng' : '💌 Mở'}
          </button>
          <button
            type="button"
            onClick={handleFlip}
            className="px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-md text-gray-500 font-medium text-sm hover:bg-gray-50 transition flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Lật
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ────────────────────────────────────────────────────────────────────────────────

export { SealIcon, type SealDesign, type OpenStyle };

