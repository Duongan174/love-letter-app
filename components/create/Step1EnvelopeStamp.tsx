// components/create/Step1EnvelopeStamp.tsx
// Layout mới: Canva-style sidebar + Panel + Preview
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Envelope2D, { type SealDesign } from './Envelope2D';
import { 
  Palette, Mail, LayoutTemplate, Sparkles, Loader2, RotateCw,
  Layers, Image as ImageIcon, X
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { resolveImageUrl } from '@/lib/utils';
import { getLetterPatternStyles } from '@/lib/design-presets';

// ✅ Import envelope patterns từ hệ thống mới (100+ mẫu)
import { 
  ENVELOPE_PATTERNS as NEW_ENVELOPE_PATTERNS,
  getEnvelopePatternStyle,
} from '@/lib/design-presets';

// Convert sang format cũ để tương thích
const ENVELOPE_PATTERNS = NEW_ENVELOPE_PATTERNS.map(p => ({
  id: p.id,
  name: p.nameVi,
  preview: p.preview,
  tier: p.tier,
  category: p.category,
}));

// Seal designs
const SEAL_DESIGNS = [
  { id: 'heart' as SealDesign, name: 'Trái tim', color: '#c62828' },
  { id: 'star' as SealDesign, name: 'Ngôi sao', color: '#f57f17' },
  { id: 'crown' as SealDesign, name: 'Vương miện', color: '#f9a825' },
  { id: 'flower' as SealDesign, name: 'Hoa', color: '#e91e63' },
  { id: 'sparkle' as SealDesign, name: 'Lấp lánh', color: '#9c27b0' },
  { id: 'mail' as SealDesign, name: 'Thư', color: '#1976d2' },
];

type EnvelopePattern = string;
type EnvelopeSide = 'front' | 'back';
type SidebarSection = 'colors' | 'patterns' | 'seal' | 'stamp' | 'backgrounds' | null;

// Helper function
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

// ✅ Bộ màu gợi ý 2025 - Có phân loại
const COLOR_PRESETS = [
  // 🎨 Phổ biến
  { name: 'Peach Fuzz', base: '#FFB59E', pattern: '#E89A80', intensity: 0.18, category: 'popular' },
  { name: 'Tranquil Blue', base: '#7FB3D3', pattern: '#5A9BC4', intensity: 0.2, category: 'popular' },
  { name: 'Sage Green', base: '#9CAF88', pattern: '#7A9A6A', intensity: 0.22, category: 'popular' },
  { name: 'Warm Terracotta', base: '#C97D60', pattern: '#A85D45', intensity: 0.2, category: 'popular' },
  // 💖 Lãng mạn
  { name: 'Soft Lavender', base: '#B8A9C9', pattern: '#9B8BAF', intensity: 0.18, category: 'romantic' },
  { name: 'Dusty Rose', base: '#D4A5A5', pattern: '#B88A8A', intensity: 0.2, category: 'romantic' },
  { name: 'Blush Pink', base: '#E8B4B8', pattern: '#D49AA0', intensity: 0.2, category: 'romantic' },
  { name: 'Vintage Coral', base: '#E89A80', pattern: '#D47A60', intensity: 0.2, category: 'romantic' },
  // 🌿 Tự nhiên
  { name: 'Butter Yellow', base: '#F5D76E', pattern: '#E8C85A', intensity: 0.15, category: 'nature' },
  { name: 'Muted Teal', base: '#6B9A8A', pattern: '#4F7A6B', intensity: 0.22, category: 'nature' },
  { name: 'Soft Mint', base: '#A8D5BA', pattern: '#8BC4A0', intensity: 0.18, category: 'nature' },
  { name: 'Sage Blue', base: '#7A9A9A', pattern: '#5A7A7A', intensity: 0.2, category: 'nature' },
  // 🎉 Lễ hội
  { name: 'Creamy Beige', base: '#E8DCC6', pattern: '#D4C4A8', intensity: 0.12, category: 'festive' },
  { name: 'Warm Taupe', base: '#A08B7A', pattern: '#7A6A5A', intensity: 0.18, category: 'festive' },
  { name: 'Periwinkle', base: '#9B9FD4', pattern: '#7A7FB8', intensity: 0.18, category: 'festive' },
  { name: 'Warm Gray', base: '#8B8680', pattern: '#6B6660', intensity: 0.15, category: 'festive' },
  { name: 'Pale Gold', base: '#F4E4BC', pattern: '#E8D4A0', intensity: 0.12, category: 'festive' },
  { name: 'Dusty Blue', base: '#8FA8B8', pattern: '#6B8494', intensity: 0.2, category: 'festive' },
  { name: 'Mauve', base: '#C4A5C4', pattern: '#A885A8', intensity: 0.18, category: 'festive' },
  { name: 'Apricot', base: '#FFC8A3', pattern: '#E8A880', intensity: 0.18, category: 'festive' },
];

// ✅ Gradient presets
const GRADIENT_PRESETS = [
  { id: 'sunset-gold', name: 'Hoàng hôn vàng', colors: ['#fef3c7', '#fce7f3', '#fdf2f8'], direction: '135deg' },
  { id: 'peach-cream', name: 'Đào kem', colors: ['#fff1e6', '#ffe4e6', '#fdf2f8'], direction: '135deg' },
  { id: 'golden-rose', name: 'Vàng hồng', colors: ['#fef9c3', '#fecdd3', '#fce7f3'], direction: '135deg' },
  { id: 'warm-blush', name: 'Ấm áp', colors: ['#fef3c7', '#fda4af', '#fce7f3'], direction: '120deg' },
  { id: 'rose-garden', name: 'Vườn hồng', colors: ['#fce7f3', '#fbcfe8', '#f9a8d4'], direction: '135deg' },
  { id: 'soft-pink', name: 'Hồng nhẹ', colors: ['#fff1f2', '#fce7f3', '#fdf4ff'], direction: '135deg' },
  { id: 'cherry-blossom', name: 'Anh đào', colors: ['#fdf2f8', '#fbcfe8', '#fce7f3'], direction: '180deg' },
  { id: 'cotton-candy', name: 'Kẹo bông', colors: ['#fce7f3', '#e9d5ff', '#ddd6fe'], direction: '135deg' },
  { id: 'lavender-mist', name: 'Oải hương', colors: ['#f5f3ff', '#ede9fe', '#ddd6fe'], direction: '135deg' },
  { id: 'purple-dream', name: 'Tím mộng mơ', colors: ['#fdf4ff', '#f5f3ff', '#ede9fe'], direction: '135deg' },
  { id: 'violet-pink', name: 'Tím hồng', colors: ['#f5f3ff', '#fce7f3', '#fbcfe8'], direction: '120deg' },
  { id: 'mystic-purple', name: 'Tím huyền bí', colors: ['#ede9fe', '#e9d5ff', '#f3e8ff'], direction: '135deg' },
  { id: 'ocean-breeze', name: 'Gió biển', colors: ['#ecfeff', '#cffafe', '#a5f3fc'], direction: '135deg' },
  { id: 'sky-blue', name: 'Xanh trời', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd'], direction: '180deg' },
  { id: 'mint-ocean', name: 'Bạc hà biển', colors: ['#ecfeff', '#d1fae5', '#a7f3d0'], direction: '135deg' },
  { id: 'blue-purple', name: 'Xanh tím', colors: ['#e0f2fe', '#ede9fe', '#f5f3ff'], direction: '135deg' },
  { id: 'spring-meadow', name: 'Đồng cỏ', colors: ['#ecfdf5', '#d1fae5', '#a7f3d0'], direction: '135deg' },
  { id: 'mint-fresh', name: 'Bạc hà', colors: ['#f0fdf4', '#dcfce7', '#bbf7d0'], direction: '135deg' },
  { id: 'sage-calm', name: 'Xanh dịu', colors: ['#f0fdf4', '#ecfdf5', '#d1fae5'], direction: '180deg' },
  { id: 'forest-mist', name: 'Sương rừng', colors: ['#ecfdf5', '#f0f9ff', '#e0f2fe'], direction: '135deg' },
  { id: 'honey-gold', name: 'Vàng mật ong', colors: ['#fffbeb', '#fef3c7', '#fde68a'], direction: '135deg' },
  { id: 'champagne', name: 'Champagne', colors: ['#fefce8', '#fef9c3', '#fef08a'], direction: '135deg' },
  { id: 'warm-sand', name: 'Cát ấm', colors: ['#fffbeb', '#fef3c7', '#fed7aa'], direction: '135deg' },
  { id: 'amber-glow', name: 'Hổ phách', colors: ['#fef3c7', '#fde68a', '#fcd34d'], direction: '180deg' },
  { id: 'rainbow-soft', name: 'Cầu vồng nhẹ', colors: ['#fef3c7', '#fce7f3', '#ddd6fe', '#bae6fd'], direction: '135deg' },
  { id: 'aurora', name: 'Cực quang', colors: ['#ecfdf5', '#cffafe', '#ddd6fe', '#fce7f3'], direction: '120deg' },
  { id: 'unicorn', name: 'Kỳ lân', colors: ['#fce7f3', '#e9d5ff', '#bae6fd', '#a7f3d0'], direction: '135deg' },
  { id: 'pastel-dream', name: 'Pastel mơ', colors: ['#fff1f2', '#fdf4ff', '#f0f9ff', '#ecfdf5'], direction: '135deg' },
  { id: 'vintage-cream', name: 'Kem vintage', colors: ['#fefce8', '#fef7ed', '#fef2f2'], direction: '135deg' },
  { id: 'antique-rose', name: 'Hồng cổ điển', colors: ['#fef2f2', '#fce7f3', '#fdf4ff'], direction: '135deg' },
  { id: 'ivory-blush', name: 'Ngà hồng', colors: ['#fffbf5', '#fff1f2', '#fce7f3'], direction: '180deg' },
  { id: 'parchment', name: 'Da thuộc', colors: ['#fefce8', '#fef3c7', '#fed7aa'], direction: '135deg' },
  { id: 'pure-white', name: 'Trắng tinh', colors: ['#ffffff', '#fafafa', '#f5f5f5'], direction: '180deg' },
  { id: 'soft-gray', name: 'Xám nhẹ', colors: ['#fafafa', '#f5f5f5', '#e5e5e5'], direction: '180deg' },
  { id: 'cream-white', name: 'Trắng kem', colors: ['#fffbf5', '#fefce8', '#fef7ed'], direction: '180deg' },
  { id: 'snow', name: 'Tuyết', colors: ['#ffffff', '#f0f9ff', '#ecfeff'], direction: '135deg' },
];

function createGradientCSS(preset: typeof GRADIENT_PRESETS[0]): string {
  const stops = preset.colors.map((color, i) => {
    const percent = (i / (preset.colors.length - 1)) * 100;
    return `${color} ${percent}%`;
  }).join(', ');
  return `linear-gradient(${preset.direction}, ${stops})`;
}

const PAGE_COLORS = [
  '#ffffff', '#fefefe', '#fafafa', '#fffef7', '#fdf8f0',
  '#fff8e1', '#fff3e0', '#ffe0b2', '#ffccbc', '#ffecb3',
  '#f8bbd0', '#fce4ec', '#fff0f5', '#ffe4e6', '#fdf2f8',
  '#e1bee7', '#f3e5f5', '#ede7f6', '#e8eaf6', '#f5f3ff',
  '#c5cae9', '#b3e5fc', '#b2ebf2', '#e0f7fa', '#e3f2fd',
  '#b2dfdb', '#c8e6c9', '#dcedc8', '#e8f5e9', '#f1f8e9',
  '#f5f5dc', '#faf0e6', '#faebd7', '#ffe4c4', '#f0ead6',
];

// ✅ Sidebar Menu Items
const SIDEBAR_ITEMS = [
  { id: 'colors' as SidebarSection, icon: Palette, label: 'Màu sắc' },
  { id: 'patterns' as SidebarSection, icon: Sparkles, label: 'Họa tiết' },
  { id: 'seal' as SidebarSection, icon: Mail, label: 'Con dấu' },
  { id: 'stamp' as SidebarSection, icon: LayoutTemplate, label: 'Tem thư' },
  { id: 'backgrounds' as SidebarSection, icon: Layers, label: 'Màu nền' },
];

// ✅ Background Selector Component
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
  const [activeTab, setActiveTab] = useState<'gradients' | 'colors'>('gradients');
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

  const isGradient = currentColor.includes('gradient');

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
            </div>

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
                          onPatternChange('solid');
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

            {activeTab === 'colors' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-amber-900/70">Màu đơn sắc ({PAGE_COLORS.length} màu)</label>
                <div className="grid grid-cols-7 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                  {PAGE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        onColorChange(color);
                        onPatternChange('solid');
                      }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Step1EnvelopeStampProps {
  selectedEnvelope: any;
  onSelectEnvelope: (env: any) => void;
  envelope: any;
  liner: string | null;
  selectedStamp: any;
  onSelectStamp: (stamp: any) => void;
  coverBackground?: string;
  coverPattern?: string;
  photoBackground?: string;
  photoPattern?: string;
  signatureBackground?: string;
  signaturePattern?: string;
  letterBackground?: string;
  letterPattern?: string;
  letterContainerBackground?: string;
  onUpdateBackgrounds?: (data: {
    coverBackground?: string;
    coverPattern?: string;
    photoBackground?: string;
    photoPattern?: string;
    signatureBackground?: string;
    signaturePattern?: string;
    letterBackground?: string;
    letterPattern?: string;
    letterContainerBackground?: string;
  }) => void;
}

export default function Step1EnvelopeStamp({
  selectedEnvelope,
  onSelectEnvelope,
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
  letterBackground = '#ffffff',
  letterPattern = 'solid',
  letterContainerBackground = 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))',
  onUpdateBackgrounds,
}: Step1EnvelopeStampProps) {
  // Envelope customization state
  const [selectedPattern, setSelectedPattern] = useState<EnvelopePattern>('solid');
  const [selectedSeal, setSelectedSeal] = useState<SealDesign>('heart');
  const [selectedSealColor, setSelectedSealColor] = useState('#c62828');
  const [envelopeSide, setEnvelopeSide] = useState<EnvelopeSide>('front');
  const [isOpen, setIsOpen] = useState(false);
  const [defaultEnvelopeFromDB, setDefaultEnvelopeFromDB] = useState<any>(null);
  const [loadingDefault, setLoadingDefault] = useState(true);
  
  // New customization states
  const [envelopeBaseColor, setEnvelopeBaseColor] = useState(selectedEnvelope?.color || '#f8bbd0');
  const [patternColor, setPatternColor] = useState('#5d4037');
  const [patternIntensity, setPatternIntensity] = useState(0.15);
  
  // ✅ Canva-style sidebar state
  const [activeSection, setActiveSection] = useState<SidebarSection>('colors');

  // Stamps state
  const [stamps, setStamps] = useState<any[]>([]);
  const [loadingStamps, setLoadingStamps] = useState(true);

  // Load default envelope from database if none selected
  useEffect(() => {
    const loadDefaultEnvelope = async () => {
      if (!selectedEnvelope && loadingDefault) {
        try {
          const { data, error } = await supabase
            .from('envelopes')
            .select('*')
            .order('points_required', { ascending: true })
            .limit(1)
            .single();
          
          if (data && !error) {
            setDefaultEnvelopeFromDB(data);
            setEnvelopeBaseColor(data.color || '#f8bbd0');
            onSelectEnvelope({
              ...data,
              color: data.color || envelopeBaseColor,
              pattern: selectedPattern,
              patternColor,
              patternIntensity,
              sealDesign: selectedSeal,
              sealColor: selectedSealColor,
            });
          }
        } catch {
          // Silently handle error
        }
        setLoadingDefault(false);
      } else {
        setLoadingDefault(false);
      }
    };
    loadDefaultEnvelope();
  }, []);

  // Load stamps
  useEffect(() => {
    supabase.from('stamps').select('*').order('points_required').then(({ data }) => {
      setStamps(data || []);
      setLoadingStamps(false);
    });
  }, []);

  // Default envelope - use selected or default from DB
  const defaultEnvelope = selectedEnvelope || defaultEnvelopeFromDB || {
    id: null,
    color: envelopeBaseColor,
    texture: null,
    liner_pattern: null,
    stamp_url: null,
    points_required: 0,
  };

  // Update base color when envelope changes
  const prevColorRef = useRef<string>('');
  const isUpdatingFromEffectRef = useRef(false);

  useEffect(() => {
    const newColor = selectedEnvelope?.color || defaultEnvelopeFromDB?.color;
    if (newColor && newColor !== prevColorRef.current) {
      setEnvelopeBaseColor((currentColor: string) => {
        if (newColor !== currentColor) {
          prevColorRef.current = newColor;
          isUpdatingFromEffectRef.current = true;
          setTimeout(() => {
            isUpdatingFromEffectRef.current = false;
          }, 0);
          return newColor;
        }
        return currentColor;
      });
    }
  }, [selectedEnvelope?.color, defaultEnvelopeFromDB?.color]);

  // When customization changes, update the envelope
  const prevUpdateRef = useRef<string>('');

  useEffect(() => {
    if (isUpdatingFromEffectRef.current) {
      return;
    }
    
    if (defaultEnvelope && defaultEnvelope.id) {
      const updateSignature = JSON.stringify({
        color: envelopeBaseColor,
        pattern: selectedPattern,
        patternColor,
        patternIntensity,
        sealDesign: selectedSeal,
        sealColor: selectedSealColor,
        envelopeId: defaultEnvelope.id,
      });
      
      const currentSelectedColor = selectedEnvelope?.color;
      const shouldUpdate = updateSignature !== prevUpdateRef.current && 
                          (currentSelectedColor !== envelopeBaseColor || !currentSelectedColor);
      
      if (shouldUpdate) {
        prevUpdateRef.current = updateSignature;
        onSelectEnvelope({
          ...defaultEnvelope,
          color: envelopeBaseColor,
          pattern: selectedPattern,
          patternColor,
          patternIntensity,
          sealDesign: selectedSeal,
          sealColor: selectedSealColor,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPattern, selectedSeal, selectedSealColor, envelopeBaseColor, patternColor, patternIntensity, defaultEnvelope?.id, selectedEnvelope?.color]);

  // Handle background changes
  const handleBackgroundChange = (type: 'cover' | 'photo' | 'signature' | 'letter' | 'letterContainer', color?: string, pattern?: string) => {
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
    } else if (type === 'letter') {
      if (color !== undefined) updates.letterBackground = color;
      if (pattern !== undefined) updates.letterPattern = pattern;
    } else if (type === 'letterContainer') {
      if (color !== undefined) updates.letterContainerBackground = color;
    }
    
    onUpdateBackgrounds(updates);
  };

  // ✅ Get background style giống card viewer
  const coverBgStyle = getLetterPatternStyles(coverPattern, coverBackground);

  // ✅ Render Panel Content based on active section
  const renderPanelContent = () => {
    switch (activeSection) {
      case 'colors':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 pb-4 border-b border-gray-200 mb-4">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Màu nền phong bì</h3>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <input
                    type="color"
                    value={envelopeBaseColor}
                    onChange={(e) => setEnvelopeBaseColor(e.target.value)}
                    className="w-16 h-16 rounded-xl border-3 border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                    style={{ borderColor: envelopeBaseColor + '40' }}
                  />
                  <div className="absolute inset-0 rounded-xl border-2 border-white pointer-events-none"></div>
                </motion.div>
                <input
                  type="text"
                  value={envelopeBaseColor}
                  onChange={(e) => setEnvelopeBaseColor(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 text-sm font-mono focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  placeholder="#f8bbd0"
                />
              </div>
            </div>
            <div className="flex-shrink-0 mb-4">
              <h3 className="text-base font-bold text-gray-900 mb-1">Bộ màu gợi ý</h3>
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Chọn màu phong bì bạn yêu thích để bắt đầu thiết kế
              </p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="space-y-2 pr-2">
                {COLOR_PRESETS.map((preset, idx) => {
                  const isSelected = envelopeBaseColor === preset.base;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        setEnvelopeBaseColor(preset.base);
                        setPatternColor(preset.pattern);
                        setPatternIntensity(preset.intensity);
                      }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all group shadow-sm hover:shadow-lg flex items-center gap-3 relative ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-200 ring-offset-2 shadow-lg bg-amber-50/50'
                          : 'border-gray-200 hover:border-amber-300'
                      }`}
                      style={{ 
                        borderColor: isSelected ? '#f59e0b' : (preset.base + '40'),
                        boxShadow: isSelected ? '0 0 0 4px rgba(245, 158, 11, 0.15), 0 4px 12px rgba(245, 158, 11, 0.2)' : undefined
                      }}
                    >
                      <div 
                        className={`w-12 h-12 rounded-lg flex-shrink-0 relative overflow-hidden shadow-inner ${
                          isSelected ? 'ring-2 ring-amber-400' : ''
                        }`}
                        style={{ backgroundColor: preset.base }}
                      />
                      <div className="flex-1 text-left">
                        <div className={`font-medium ${isSelected ? 'text-amber-700 font-semibold' : 'text-gray-700 group-hover:text-gray-900'}`}>
                          {preset.name}
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {preset.base}
                        </div>
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'patterns':
        return (
          <div className="space-y-6 h-full flex flex-col">
            <div className="flex-shrink-0">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Họa tiết phong bì ({ENVELOPE_PATTERNS.length} mẫu)</h3>
              <p className="text-xs text-gray-500 mb-3">Chọn họa tiết để trang trí phong bì</p>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <div className="space-y-2">
                {ENVELOPE_PATTERNS.map((pat) => (
                  <motion.button
                    key={pat.id}
                    onClick={() => setSelectedPattern(pat.id as EnvelopePattern)}
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 relative ${
                      selectedPattern === pat.id 
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg ring-2 ring-amber-300 ring-offset-1' 
                        : 'bg-white text-gray-700 hover:bg-amber-50 border-2 border-gray-200 hover:border-amber-300 shadow-sm hover:shadow-md'
                    }`}
                    style={{
                      boxShadow: selectedPattern === pat.id ? '0 0 0 3px rgba(245, 158, 11, 0.1)' : undefined
                    }}
                    title={pat.name}
                  >
                    {pat.preview && <span className="text-xl flex-shrink-0">{pat.preview}</span>}
                    <span className="flex-1 text-left">{pat.name}</span>
                    {selectedPattern === pat.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <span className="text-white text-xs">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
            
            {selectedPattern !== 'solid' && (
              <div className="flex-shrink-0 pt-4 border-t border-gray-200 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-3">Màu họa tiết</h3>
                  <div className="flex items-center gap-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative"
                    >
                      <input
                        type="color"
                        value={patternColor}
                        onChange={(e) => setPatternColor(e.target.value)}
                        className="w-14 h-14 rounded-xl border-3 border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-all"
                        style={{ borderColor: patternColor + '40' }}
                      />
                      <div className="absolute inset-0 rounded-xl border-2 border-white pointer-events-none"></div>
                    </motion.div>
                    <input
                      type="text"
                      value={patternColor}
                      onChange={(e) => setPatternColor(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 text-sm font-mono focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      placeholder="#5d4037"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold text-gray-800">Độ đậm họa tiết</h3>
                    <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      {Math.round(patternIntensity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={patternIntensity}
                    onChange={(e) => setPatternIntensity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-gray-200 via-amber-200 to-amber-400 rounded-full appearance-none cursor-pointer accent-amber-600 shadow-inner"
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'seal':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Con dấu sáp</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-wrap gap-3">
                {SEAL_DESIGNS.map((seal) => (
                  <motion.button
                    key={seal.id}
                    onClick={() => {
                      setSelectedSeal(seal.id);
                      setSelectedSealColor(seal.color);
                    }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      selectedSeal === seal.id 
                        ? 'ring-4 ring-offset-2 ring-amber-400 scale-110 shadow-xl' 
                        : 'hover:shadow-xl'
                    }`}
                    style={{ 
                      background: `radial-gradient(circle at 30% 30%, ${shade(seal.color, 40)} 0%, ${seal.color} 50%, ${shade(seal.color, -40)} 100%)`,
                    }}
                    title={seal.name}
                  >
                    <span className="text-white text-sm font-bold drop-shadow-lg">{seal.name.charAt(0)}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'stamp':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Bộ sưu tập tem</h3>
              <p className="text-xs text-gray-500 mb-3">Chọn tem thư cho phong bì của bạn</p>
            </div>
            {loadingStamps ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-amber-600" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <div className="space-y-2">
                  {stamps.map((stamp) => {
                    const isSelected = selectedStamp?.id === stamp.id;
                    return (
                      <button
                        key={stamp.id}
                        onClick={() => onSelectStamp(stamp)}
                        className={`
                        w-full px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 relative
                        ${isSelected 
                          ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-white shadow-lg ring-2 ring-amber-200 ring-offset-1' 
                          : 'border-amber-100 bg-white hover:border-amber-300 hover:shadow-md'
                        }
                      `}
                      style={{
                        boxShadow: isSelected ? '0 0 0 3px rgba(245, 158, 11, 0.1)' : undefined
                      }}
                      >
                        <div className="w-12 h-12 object-contain p-1 flex-shrink-0">
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
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-amber-900">{stamp.name}</p>
                          <span className={`text-xs font-bold ${stamp.points_required > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                            {stamp.points_required === 0 ? 'Miễn phí' : `${stamp.points_required} Tym`}
                          </span>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                          >
                            <span className="text-white text-xs font-bold">✓</span>
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'backgrounds':
        if (!onUpdateBackgrounds) return null;
        return (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex-shrink-0">
              <h3 className="text-base font-semibold text-gray-800 mb-3">Màu nền các trang</h3>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
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
              label="Trang văn bản"
              currentColor={letterBackground}
              currentPattern={letterPattern}
              onColorChange={(color) => handleBackgroundChange('letter', color)}
              onPatternChange={(pattern) => handleBackgroundChange('letter', undefined, pattern)}
            />
            <BackgroundSelector
              label="Nền container"
              currentColor={letterContainerBackground}
              currentPattern="solid"
              onColorChange={(color) => handleBackgroundChange('letterContainer', color)}
              onPatternChange={() => {}}
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden w-full">
      {/* ✅ Left Sidebar - Canva Style - Luôn sát bên trái, bắt đầu từ dưới header */}
      <div className="w-20 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-2 flex-shrink-0 fixed left-0 top-16 bottom-0 z-10">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(isActive ? null : item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                w-14 h-16 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all relative
                ${isActive 
                  ? 'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-700 border-2 border-amber-400 shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                }
              `}
              title={item.label}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-amber-500 to-amber-600 rounded-r-full"
                  initial={false}
                />
              )}
              <Icon 
                className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`}
                strokeWidth={isActive ? 2.5 : 1.5}
              />
              <span className={`text-[10px] font-bold leading-tight ${isActive ? 'text-amber-800' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ✅ Middle Panel - Content Panel */}
      <AnimatePresence mode="wait">
        {activeSection && (
          <motion.div
            key={activeSection}
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white border-r border-gray-200 overflow-hidden flex-shrink-0 flex flex-col fixed left-20 top-16 bottom-0 z-10"
          >
            <div className="w-[280px] h-full flex flex-col overflow-hidden">
              <div className="flex-shrink-0 p-4 pb-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    {SIDEBAR_ITEMS.find(item => item.id === activeSection)?.label}
                  </h2>
                  <button
                    onClick={() => setActiveSection(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                    title="Đóng"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 pt-4">
                  {renderPanelContent()}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Right Preview Area - Full bleed background, không còn khoảng trắng */}
      <div 
        className="flex-1 min-h-screen transition-all duration-300 relative overflow-hidden" 
        style={{ 
          marginLeft: activeSection ? '300px' : '80px',
          width: activeSection ? 'calc(100% - 300px)' : 'calc(100% - 80px)',
          backgroundColor: coverBgStyle.backgroundColor || coverBackground,
          backgroundImage: coverBgStyle.backgroundImage 
            ? `
              radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.02) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 50%),
              ${coverBgStyle.backgroundImage}
            `
            : `
              radial-gradient(ellipse at 20% 30%, rgba(0,0,0,0.02) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, rgba(0,0,0,0.02) 0%, transparent 50%)
            `,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Ambient shadow và texture overlay */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5" />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grain' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Ccircle cx='25' cy='25' r='0.5' fill='%23000'/%3E%3Ccircle cx='75' cy='75' r='0.5' fill='%23000'/%3E%3Ccircle cx='50' cy='10' r='0.5' fill='%23000'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grain)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
            }}
          />
        </div>

        {/* Editor Canvas - Envelope container */}
        <div className="w-full h-full relative z-10 flex flex-col">
            {/* Toggle Button - Fixed top */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                {/* Toggle Switch - Rõ ràng hơn */}
                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-full px-1 py-1 shadow-lg border border-amber-200/50">
                  <button
                    onClick={() => setEnvelopeSide('front')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      envelopeSide === 'front'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-amber-700'
                    }`}
                  >
                    Mặt trước
                  </button>
                  <button
                    onClick={() => setEnvelopeSide('back')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      envelopeSide === 'back'
                        ? 'bg-amber-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-amber-700'
                    }`}
                  >
                    Mặt sau
                  </button>
                </div>
              </div>
              
            {/* Envelope Container - Chiếm toàn bộ không gian với padding responsive */}
            <div className="relative w-full flex-1 flex items-center justify-center z-10" style={{ padding: 'clamp(24px, 5vh, 64px)' }}>
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                style={{ 
                  perspective: '1200px',
                  width: '100%',
                  height: '100%',
                  maxWidth: '100%',
                  maxHeight: '100%'
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsOpen(v => !v);
                  }
                }}
                onClick={() => setIsOpen(v => !v)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {/* Ambient Shadow - Tạo chiều sâu nhẹ */}
                <div className="absolute inset-0 -z-10 pointer-events-none">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.03) 0%, transparent 70%)'
                    }}
                  />
                </div>
                
                {/* Envelope với 3D flip animation - Scale theo container, chiếm tối đa không gian */}
                <motion.div
                  animate={{ 
                    rotateY: envelopeSide === 'back' ? 180 : 0,
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                  className="flex items-center justify-center"
                >
                  <div 
                    className="w-full h-full flex items-center justify-center" 
                    style={{ 
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  >
                    <Envelope2D
                      color={envelopeBaseColor}
                      pattern={selectedPattern}
                      patternColor={patternColor}
                      patternIntensity={patternIntensity}
                      texture={defaultEnvelope.texture ?? defaultEnvelope.thumbnail}
                      stampUrl={selectedStamp?.image_url}
                      sealDesign={selectedSeal}
                      sealColor={selectedSealColor}
                      isOpen={isOpen}
                      side={envelopeSide}
                      onToggleOpen={() => setIsOpen(v => !v)}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Hint text - Fixed bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
              <p className="text-xs text-gray-500 text-center bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                {isOpen ? 'Nhấn để đóng phong bì' : 'Nhấn để mở phong bì'}
              </p>
            </div>
          </div>
      </div>
    </div>
  );
}
