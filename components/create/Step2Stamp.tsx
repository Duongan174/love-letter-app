// components/create/Step2Stamp.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Envelope3D from './Envelope3D';
import { Loader2, Palette, Sparkles } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Step2StampProps {
  envelope: any;
  liner: string | null;
  selectedStamp: any;
  onSelectStamp: (stamp: any) => void;
  // ✅ Thêm props cho background colors
  coverBackground?: string;
  coverPattern?: string;
  photoBackground?: string;
  photoPattern?: string;
  signatureBackground?: string;
  signaturePattern?: string;
  onUpdateBackgrounds?: (data: {
    coverBackground?: string;
    coverPattern?: string;
    photoBackground?: string;
    photoPattern?: string;
    signatureBackground?: string;
    signaturePattern?: string;
  }) => void;
}

// ✅ Gradient presets đẹp mắt - kết hợp 2-3 màu hài hòa
const GRADIENT_PRESETS = [
  // 🌅 Sunset & Warm
  { id: 'sunset-gold', name: 'Hoàng hôn vàng', colors: ['#fef3c7', '#fce7f3', '#fdf2f8'], direction: '135deg' },
  { id: 'peach-cream', name: 'Đào kem', colors: ['#fff1e6', '#ffe4e6', '#fdf2f8'], direction: '135deg' },
  { id: 'golden-rose', name: 'Vàng hồng', colors: ['#fef9c3', '#fecdd3', '#fce7f3'], direction: '135deg' },
  { id: 'warm-blush', name: 'Ấm áp', colors: ['#fef3c7', '#fda4af', '#fce7f3'], direction: '120deg' },
  
  // 🌸 Pink & Rose
  { id: 'rose-garden', name: 'Vườn hồng', colors: ['#fce7f3', '#fbcfe8', '#f9a8d4'], direction: '135deg' },
  { id: 'soft-pink', name: 'Hồng nhẹ', colors: ['#fff1f2', '#fce7f3', '#fdf4ff'], direction: '135deg' },
  { id: 'cherry-blossom', name: 'Anh đào', colors: ['#fdf2f8', '#fbcfe8', '#fce7f3'], direction: '180deg' },
  { id: 'cotton-candy', name: 'Kẹo bông', colors: ['#fce7f3', '#e9d5ff', '#ddd6fe'], direction: '135deg' },
  
  // 💜 Purple & Lavender  
  { id: 'lavender-mist', name: 'Oải hương', colors: ['#f5f3ff', '#ede9fe', '#ddd6fe'], direction: '135deg' },
  { id: 'purple-dream', name: 'Tím mộng mơ', colors: ['#fdf4ff', '#f5f3ff', '#ede9fe'], direction: '135deg' },
  { id: 'violet-pink', name: 'Tím hồng', colors: ['#f5f3ff', '#fce7f3', '#fbcfe8'], direction: '120deg' },
  { id: 'mystic-purple', name: 'Tím huyền bí', colors: ['#ede9fe', '#e9d5ff', '#f3e8ff'], direction: '135deg' },
  
  // 💙 Blue & Teal
  { id: 'ocean-breeze', name: 'Gió biển', colors: ['#ecfeff', '#cffafe', '#a5f3fc'], direction: '135deg' },
  { id: 'sky-blue', name: 'Xanh trời', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd'], direction: '180deg' },
  { id: 'mint-ocean', name: 'Bạc hà biển', colors: ['#ecfeff', '#d1fae5', '#a7f3d0'], direction: '135deg' },
  { id: 'blue-purple', name: 'Xanh tím', colors: ['#e0f2fe', '#ede9fe', '#f5f3ff'], direction: '135deg' },
  
  // 🌿 Green & Nature
  { id: 'spring-meadow', name: 'Đồng cỏ', colors: ['#ecfdf5', '#d1fae5', '#a7f3d0'], direction: '135deg' },
  { id: 'mint-fresh', name: 'Bạc hà', colors: ['#f0fdf4', '#dcfce7', '#bbf7d0'], direction: '135deg' },
  { id: 'sage-calm', name: 'Xanh dịu', colors: ['#f0fdf4', '#ecfdf5', '#d1fae5'], direction: '180deg' },
  { id: 'forest-mist', name: 'Sương rừng', colors: ['#ecfdf5', '#f0f9ff', '#e0f2fe'], direction: '135deg' },
  
  // ☀️ Gold & Amber
  { id: 'honey-gold', name: 'Vàng mật ong', colors: ['#fffbeb', '#fef3c7', '#fde68a'], direction: '135deg' },
  { id: 'champagne', name: 'Champagne', colors: ['#fefce8', '#fef9c3', '#fef08a'], direction: '135deg' },
  { id: 'warm-sand', name: 'Cát ấm', colors: ['#fffbeb', '#fef3c7', '#fed7aa'], direction: '135deg' },
  { id: 'amber-glow', name: 'Hổ phách', colors: ['#fef3c7', '#fde68a', '#fcd34d'], direction: '180deg' },
  
  // 🌈 Rainbow & Special
  { id: 'rainbow-soft', name: 'Cầu vồng nhẹ', colors: ['#fef3c7', '#fce7f3', '#ddd6fe', '#bae6fd'], direction: '135deg' },
  { id: 'aurora', name: 'Cực quang', colors: ['#ecfdf5', '#cffafe', '#ddd6fe', '#fce7f3'], direction: '120deg' },
  { id: 'unicorn', name: 'Kỳ lân', colors: ['#fce7f3', '#e9d5ff', '#bae6fd', '#a7f3d0'], direction: '135deg' },
  { id: 'pastel-dream', name: 'Pastel mơ', colors: ['#fff1f2', '#fdf4ff', '#f0f9ff', '#ecfdf5'], direction: '135deg' },
  
  // 🎀 Vintage & Classic
  { id: 'vintage-cream', name: 'Kem vintage', colors: ['#fefce8', '#fef7ed', '#fef2f2'], direction: '135deg' },
  { id: 'antique-rose', name: 'Hồng cổ điển', colors: ['#fef2f2', '#fce7f3', '#fdf4ff'], direction: '135deg' },
  { id: 'ivory-blush', name: 'Ngà hồng', colors: ['#fffbf5', '#fff1f2', '#fce7f3'], direction: '180deg' },
  { id: 'parchment', name: 'Da thuộc', colors: ['#fefce8', '#fef3c7', '#fed7aa'], direction: '135deg' },
  
  // ⬜ Simple & Clean
  { id: 'pure-white', name: 'Trắng tinh', colors: ['#ffffff', '#fafafa', '#f5f5f5'], direction: '180deg' },
  { id: 'soft-gray', name: 'Xám nhẹ', colors: ['#fafafa', '#f5f5f5', '#e5e5e5'], direction: '180deg' },
  { id: 'cream-white', name: 'Trắng kem', colors: ['#fffbf5', '#fefce8', '#fef7ed'], direction: '180deg' },
  { id: 'snow', name: 'Tuyết', colors: ['#ffffff', '#f0f9ff', '#ecfeff'], direction: '135deg' },
];

// ✅ Helper function để tạo CSS gradient từ preset
function createGradientCSS(preset: typeof GRADIENT_PRESETS[0]): string {
  const stops = preset.colors.map((color, i) => {
    const percent = (i / (preset.colors.length - 1)) * 100;
    return `${color} ${percent}%`;
  }).join(', ');
  return `linear-gradient(${preset.direction}, ${stops})`;
}

// ✅ Bảng màu đơn sắc (backup)
const PAGE_COLORS = [
  '#ffffff', '#fefefe', '#fafafa', '#fffef7', '#fdf8f0',
  '#fff8e1', '#fff3e0', '#ffe0b2', '#ffccbc', '#ffecb3',
  '#f8bbd0', '#fce4ec', '#fff0f5', '#ffe4e6', '#fdf2f8',
  '#e1bee7', '#f3e5f5', '#ede7f6', '#e8eaf6', '#f5f3ff',
  '#c5cae9', '#b3e5fc', '#b2ebf2', '#e0f7fa', '#e3f2fd',
  '#b2dfdb', '#c8e6c9', '#dcedc8', '#e8f5e9', '#f1f8e9',
  '#f5f5dc', '#faf0e6', '#faebd7', '#ffe4c4', '#f0ead6',
];

// ✅ Patterns (dùng chung với letter patterns)
const PAGE_PATTERNS = [
  { id: 'solid', name: 'Trơn', preview: '■' },
  { id: 'lined', name: 'Kẻ ngang', preview: '═' },
  { id: 'dotted', name: 'Chấm bi', preview: '●' },
  { id: 'floral', name: 'Hoa lá', preview: '🌸' },
  { id: 'vintage', name: 'Cổ điển', preview: '📜' },
  { id: 'hearts', name: 'Trái tim', preview: '💕' },
  { id: 'stars', name: 'Ngôi sao', preview: '⭐' },
  { id: 'roses', name: 'Hoa hồng', preview: '🌹' },
  { id: 'butterflies', name: 'Bướm', preview: '🦋' },
  { id: 'leaves', name: 'Lá cây', preview: '🍃' },
  { id: 'snowflakes', name: 'Tuyết', preview: '❄️' },
  { id: 'sparkles', name: 'Lấp lánh', preview: '✨' },
  { id: 'waves', name: 'Sóng', preview: '🌊' },
  { id: 'lace', name: 'Ren', preview: '🪡' },
  { id: 'diamonds', name: 'Kim cương', preview: '💎' },
  { id: 'confetti', name: 'Confetti', preview: '🎊' },
  { id: 'clouds', name: 'Mây', preview: '☁️' },
  { id: 'sakura', name: 'Hoa anh đào', preview: '🌸' },
  { id: 'geometric', name: 'Hình học', preview: '◆' },
  { id: 'watercolor', name: 'Màu nước', preview: '🎨' },
];

// ✅ Helper function để get pattern style (giống RichTextEditor)
// Hỗ trợ cả gradient và solid color
function getPagePatternStyle(pattern: string, color: string): React.CSSProperties {
  // Nếu color là gradient, dùng background thay vì backgroundColor
  const isGradient = color.includes('gradient');
  const bgStyle: React.CSSProperties = isGradient 
    ? { background: color }
    : { backgroundColor: color };
  
  switch (pattern) {
    case 'lined':
      return {
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.08) 31px, rgba(0,0,0,0.08) 32px)`,
        ...(!isGradient && { backgroundColor: color }),
        ...(isGradient && { background: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.08) 31px, rgba(0,0,0,0.08) 32px), ${color}` }),
      };
    case 'dotted':
      return {
        backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)`,
        backgroundSize: '20px 20px',
        backgroundColor: color,
      };
    case 'floral':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10-10c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm-10 30c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm30-10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: color,
      };
    case 'vintage':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundColor: color,
      };
    case 'hearts':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 35l-2.5-2.3C9.5 25.2 4 20.1 4 14c0-5 3.9-9 8.6-9 2.8 0 5.4 1.3 7.4 3.5C21.9 6.3 24.5 5 27.4 5 32.1 5 36 9 36 14c0 6.1-5.5 11.2-13.5 18.7L20 35z' fill='%23FF69B4' fill-opacity='0.08'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
        backgroundColor: color,
      };
    case 'stars':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='25,2 32,18 50,18 36,29 41,46 25,36 9,46 14,29 0,18 18,18' fill='%23FFD700' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        backgroundSize: '50px 50px',
        backgroundColor: color,
      };
    case 'roses':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23E91E63' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Ccircle cx='30' cy='20' r='4'/%3E%3Ccircle cx='40' cy='30' r='4'/%3E%3Ccircle cx='30' cy='40' r='4'/%3E%3Ccircle cx='20' cy='30' r='4'/%3E%3Ccircle cx='37' cy='23' r='3'/%3E%3Ccircle cx='37' cy='37' r='3'/%3E%3Ccircle cx='23' cy='37' r='3'/%3E%3Ccircle cx='23' cy='23' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        backgroundColor: color,
      };
    case 'butterflies':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C27B0' fill-opacity='0.07'%3E%3Cellipse cx='25' cy='40' rx='12' ry='18' transform='rotate(-30 25 40)'/%3E%3Cellipse cx='55' cy='40' rx='12' ry='18' transform='rotate(30 55 40)'/%3E%3Cellipse cx='30' cy='55' rx='8' ry='12' transform='rotate(-30 30 55)'/%3E%3Cellipse cx='50' cy='55' rx='8' ry='12' transform='rotate(30 50 55)'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '80px 80px',
        backgroundColor: color,
      };
    case 'leaves':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-10 15-5 35 0 50 5-15 10-35 0-50z' fill='%234CAF50' fill-opacity='0.08'/%3E%3Cpath d='M15 20c10 10 25 10 30 25-15-5-25-10-30-25z' fill='%234CAF50' fill-opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        backgroundColor: color,
      };
    case 'snowflakes':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%2364B5F6' stroke-opacity='0.15' stroke-width='1.5' fill='none'%3E%3Cline x1='25' y1='5' x2='25' y2='45'/%3E%3Cline x1='5' y1='25' x2='45' y2='25'/%3E%3Cline x1='11' y1='11' x2='39' y2='39'/%3E%3Cline x1='39' y1='11' x2='11' y2='39'/%3E%3Ccircle cx='25' cy='25' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '50px 50px',
        backgroundColor: color,
      };
    case 'sparkles':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l2 8 8-2-8 2 2 8-2-8-8 2 8-2-2-8z' fill='%23FFD700' fill-opacity='0.12'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
        backgroundColor: color,
      };
    case 'waves':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 0 50 10 T100 10' stroke='%232196F3' stroke-opacity='0.1' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
        backgroundSize: '100px 20px',
        backgroundColor: color,
      };
    case 'lace':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-opacity='0.06' stroke-width='1'%3E%3Ccircle cx='24' cy='24' r='10'/%3E%3Ccircle cx='24' cy='24' r='18'/%3E%3Ccircle cx='0' cy='0' r='6'/%3E%3Ccircle cx='48' cy='0' r='6'/%3E%3Ccircle cx='0' cy='48' r='6'/%3E%3Ccircle cx='48' cy='48' r='6'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '48px 48px',
        backgroundColor: color,
      };
    case 'diamonds':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%232196F3' stroke-opacity='0.1' stroke-width='1.5'/%3E%3Cpath d='M20 10L30 20L20 30L10 20Z' fill='%232196F3' fill-opacity='0.05'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
        backgroundColor: color,
      };
    case 'confetti':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-opacity='0.12'%3E%3Crect x='10' y='5' width='4' height='8' fill='%23FF6B6B' transform='rotate(25 12 9)'/%3E%3Crect x='45' y='15' width='3' height='6' fill='%234ECDC4' transform='rotate(-15 46 18)'/%3E%3Crect x='25' y='35' width='4' height='8' fill='%23FFE66D' transform='rotate(45 27 39)'/%3E%3Crect x='5' y='40' width='3' height='6' fill='%23A855F7' transform='rotate(-30 6 43)'/%3E%3Crect x='50' y='45' width='4' height='8' fill='%23F472B6' transform='rotate(20 52 49)'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        backgroundColor: color,
      };
    case 'clouds':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='60' viewBox='0 0 100 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2390CAF9' fill-opacity='0.1'%3E%3Cellipse cx='30' cy='40' rx='20' ry='12'/%3E%3Cellipse cx='50' cy='35' rx='15' ry='10'/%3E%3Cellipse cx='65' cy='42' rx='18' ry='11'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '100px 60px',
        backgroundColor: color,
      };
    case 'sakura':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFACC7' fill-opacity='0.12'%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(0 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(72 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(144 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(216 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(288 35 35)'/%3E%3Ccircle cx='35' cy='35' r='5' fill='%23FFD4E0'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '70px 70px',
        backgroundColor: color,
      };
    case 'geometric':
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-opacity='0.06' stroke-width='1'%3E%3Cpolygon points='30,5 55,30 30,55 5,30'/%3E%3Cpolygon points='30,15 45,30 30,45 15,30'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
        backgroundColor: color,
      };
    case 'watercolor':
      return {
        backgroundImage: `
          radial-gradient(ellipse at 20% 30%, rgba(255,182,193,0.15) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(173,216,230,0.12) 0%, transparent 45%),
          radial-gradient(ellipse at 60% 70%, rgba(221,160,221,0.1) 0%, transparent 55%),
          radial-gradient(ellipse at 30% 80%, rgba(255,218,185,0.12) 0%, transparent 50%)
        `,
        backgroundColor: color,
      };
    default:
      // Solid pattern - hỗ trợ cả gradient và solid color
      if (isGradient) {
        return { background: color };
      }
      return { backgroundColor: color };
  }
}

// ✅ Background Selector Component - với Gradient Presets
function BackgroundSelector({
  label,
  currentColor,
  currentPattern,
  onColorChange,
  onPatternChange,
}: {
  label: string;
  currentColor: string;
  currentPattern: string;
  onColorChange: (color: string) => void;
  onPatternChange: (pattern: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'gradients' | 'colors' | 'patterns'>('gradients');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if current color is a gradient
  const isGradient = currentColor.includes('gradient');
  const currentGradient = GRADIENT_PRESETS.find(g => createGradientCSS(g) === currentColor);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2.5 bg-white text-amber-700 border border-amber-300 rounded-xl hover:bg-amber-50 transition-all shadow-sm hover:shadow-md text-sm font-medium w-full"
      >
        <Palette className="w-4 h-4" />
        <span className="flex-1 text-left">{label}</span>
        <div 
          className="w-8 h-8 rounded-lg border-2 border-amber-300 shadow-inner"
          style={{ background: currentColor }}
        />
      </button>
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 bg-white border border-amber-200/50 rounded-2xl shadow-2xl p-4 z-50 w-[360px]"
          >
            {/* Tabs */}
            <div className="flex gap-1 mb-3 bg-amber-50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('gradients')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'gradients' ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-600 hover:bg-amber-100/50'
                }`}
              >
                🎨 Gradient
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'colors' ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-600 hover:bg-amber-100/50'
                }`}
              >
                🎯 Đơn sắc
              </button>
              <button
                onClick={() => setActiveTab('patterns')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  activeTab === 'patterns' ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-600 hover:bg-amber-100/50'
                }`}
              >
                ✨ Họa tiết
              </button>
            </div>

            {/* Gradient Tab */}
            {activeTab === 'gradients' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-amber-900/70">Chọn gradient ({GRADIENT_PRESETS.length} mẫu)</label>
                <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1">
                  {GRADIENT_PRESETS.map((preset) => {
                    const gradientCSS = createGradientCSS(preset);
                    const isSelected = currentColor === gradientCSS;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          onColorChange(gradientCSS);
                          onPatternChange('solid'); // Reset pattern when using gradient
                        }}
                        className={`group relative rounded-xl border-2 transition-all hover:scale-105 ${
                          isSelected ? 'border-amber-500 ring-2 ring-amber-200 scale-105' : 'border-amber-200/30 hover:border-amber-300'
                        }`}
                        title={preset.name}
                      >
                        <div 
                          className="w-full aspect-square rounded-lg"
                          style={{ background: gradientCSS }}
                        />
                        <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center py-0.5 bg-white/80 rounded-b-lg truncate px-1">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-[10px]">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-amber-900/70">Màu đơn sắc ({PAGE_COLORS.length} màu)</label>
                <div className="grid grid-cols-7 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {PAGE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onColorChange(color)}
                      className={`w-9 h-9 rounded-lg border-2 transition hover:scale-110 ${
                        currentColor === color && !isGradient ? 'border-amber-500 ring-2 ring-amber-200/30 scale-110' : 'border-amber-200/20 hover:border-amber-300/50'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Patterns Tab */}
            {activeTab === 'patterns' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-amber-900/70">Họa tiết ({PAGE_PATTERNS.length} mẫu)</label>
                <div className="grid grid-cols-5 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
                  {PAGE_PATTERNS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onPatternChange(p.id)}
                      className={`p-2 rounded-xl border-2 transition flex flex-col items-center gap-1 hover:scale-105 ${
                        currentPattern === p.id ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-200/30 scale-105' : 'border-amber-200/30 hover:bg-amber-50/50'
                      }`}
                      title={p.name}
                    >
                      <span className="text-xl">{p.preview}</span>
                      <span className="text-[9px] text-amber-700/70 truncate w-full text-center font-medium">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Step2Stamp({
  envelope,
  liner,
  selectedStamp,
  onSelectStamp,
  coverBackground = '#fdf2f8',
  coverPattern = 'solid',
  photoBackground = '#fff8e1',
  photoPattern = 'solid',
  signatureBackground = '#fce4ec',
  signaturePattern = 'solid',
  onUpdateBackgrounds,
}: Step2StampProps) {
  const [stamps, setStamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('stamps').select('*').order('points_required').then(({ data }) => {
      setStamps(data || []);
      setLoading(false);
    });
  }, []);

  const handleBackgroundChange = (type: 'cover' | 'photo' | 'signature', color?: string, pattern?: string) => {
    if (!onUpdateBackgrounds) return;
    
    const updates: any = {};
    if (type === 'cover') {
      if (color !== undefined) updates.coverBackground = color;
      if (pattern !== undefined) updates.coverPattern = pattern;
    } else if (type === 'photo') {
      if (color !== undefined) updates.photoBackground = color;
      if (pattern !== undefined) updates.photoPattern = pattern;
    } else if (type === 'signature') {
      if (color !== undefined) updates.signatureBackground = color;
      if (pattern !== undefined) updates.signaturePattern = pattern;
    }
    
    onUpdateBackgrounds(updates);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3 tracking-tight" style={{ fontFamily: 'serif' }}>Chọn Tem Thư</h2>
        <p className="text-amber-700/70 text-sm">Chọn một con tem vintage cho phong bì của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Preview */}
        <div className="bg-gradient-to-br from-amber-50/50 via-white to-rose-50/30 rounded-2xl p-8 flex items-center justify-center min-h-[400px] border border-amber-200/50 shadow-xl">
          <Envelope3D
            color={envelope?.color || '#eee'}
            pattern={envelope?.pattern || 'solid'}
            texture={envelope?.texture ?? envelope?.thumbnail}
            stampUrl={selectedStamp?.image_url}
            sealDesign={envelope?.default_seal || 'heart'}
            sealColor={envelope?.default_seal_color || '#c62828'}
            isOpen={false}
            isFlipped={false}
          />
        </div>

        {/* Stamp Selection & Background Settings */}
        <div className="space-y-6">
          {/* Background Settings */}
          {onUpdateBackgrounds && (
            <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-2xl p-6 border border-amber-200/50 shadow-xl">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Màu nền các trang
              </h3>
              <div className="space-y-3">
                <BackgroundSelector
                  label="Trang bìa"
                  currentColor={coverBackground}
                  currentPattern={coverPattern}
                  onColorChange={(color) => handleBackgroundChange('cover', color)}
                  onPatternChange={(pattern) => handleBackgroundChange('cover', undefined, pattern)}
                />
                <BackgroundSelector
                  label="Trang ảnh"
                  currentColor={photoBackground}
                  currentPattern={photoPattern}
                  onColorChange={(color) => handleBackgroundChange('photo', color)}
                  onPatternChange={(pattern) => handleBackgroundChange('photo', undefined, pattern)}
                />
                <BackgroundSelector
                  label="Trang chữ ký"
                  currentColor={signatureBackground}
                  currentPattern={signaturePattern}
                  onColorChange={(color) => handleBackgroundChange('signature', color)}
                  onPatternChange={(pattern) => handleBackgroundChange('signature', undefined, pattern)}
                />
              </div>
            </div>
          )}

        {/* Stamp Selection */}
        <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-2xl p-6 border border-amber-200/50 shadow-xl">
          <h3 className="text-lg font-semibold text-amber-900 mb-4 uppercase tracking-wide">Bộ sưu tập tem</h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin w-8 h-8 text-amber-600" />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {stamps.map((stamp) => {
                const isSelected = selectedStamp?.id === stamp.id;
                return (
                  <button
                    key={stamp.id}
                    onClick={() => onSelectStamp(stamp)}
                    className={`
                      p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                      ${isSelected 
                        ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-white shadow-lg ring-2 ring-amber-200 scale-105' 
                        : 'border-amber-100 bg-white hover:border-amber-300 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="w-16 h-16 object-contain p-1">
                      {(() => {
                        const src = resolveImageUrl(stamp.image_url);
                        if (!src) return null;
                        return (
                          <img
                            src={src}
                            className="w-full h-full object-contain"
                            alt={stamp.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                            loading="lazy"
                            decoding="async"
                          />
                        );
                      })()}
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-medium text-amber-900 truncate max-w-[80px]">{stamp.name}</p>
                      <span className={`text-[10px] font-bold ${stamp.points_required > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                        {stamp.points_required === 0 ? 'Miễn phí' : `${stamp.points_required} Tym`}
                      </span>
                    </div>
                    
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
