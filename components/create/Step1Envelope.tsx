// components/create/Step1Envelope.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Envelope2D, { type SealDesign } from './Envelope2D';
import { Palette } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ✅ Import envelope patterns từ hệ thống mới (100+ mẫu)
import { 
  ENVELOPE_PATTERNS as NEW_ENVELOPE_PATTERNS,
  getEnvelopePatternStyle,
  ENVELOPE_PATTERN_CATEGORIES,
  type DesignTier,
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

// EnvelopePattern type
type EnvelopePattern = string;

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

interface Step1EnvelopeProps {
  selectedEnvelope: any;
  onSelectEnvelope: (env: any) => void;
}

type EnvelopeSide = 'front' | 'back';

export default function Step1Envelope({
  selectedEnvelope,
  onSelectEnvelope,
}: Step1EnvelopeProps) {
  // Envelope customization state
  const [selectedPattern, setSelectedPattern] = useState<EnvelopePattern>('solid');
  const [selectedSeal, setSelectedSeal] = useState<SealDesign>('heart');
  const [selectedSealColor, setSelectedSealColor] = useState('#c62828');
  const [envelopeSide, setEnvelopeSide] = useState<EnvelopeSide>('back');
  const [isOpen, setIsOpen] = useState(false);
  const [defaultEnvelopeFromDB, setDefaultEnvelopeFromDB] = useState<any>(null);
  const [loadingDefault, setLoadingDefault] = useState(true);
  
  // New customization states
  const [envelopeBaseColor, setEnvelopeBaseColor] = useState(selectedEnvelope?.color || '#f8bbd0');
  const [patternColor, setPatternColor] = useState('#5d4037');
  const [patternIntensity, setPatternIntensity] = useState(0.15);
  
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
            // Auto-select this envelope
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
  }, []); // Only run once on mount
  
  // Default envelope - use selected or default from DB
  const defaultEnvelope = selectedEnvelope || defaultEnvelopeFromDB || {
    id: null,
    color: envelopeBaseColor,
    texture: null,
    liner_pattern: null,
    stamp_url: null,
    points_required: 0,
  };
  
  // ✅ Bộ màu gợi ý 2025 - Đa dạng và phù hợp với phong bì vintage/elegant
  // Dựa trên xu hướng màu sắc năm 2025: Peach Fuzz (Pantone), Tranquil Blue, Sage Green, Warm Terracotta, etc.
  const COLOR_PRESETS = [
    // === Màu trending 2025 ===
    { name: 'Peach Fuzz', base: '#FFB59E', pattern: '#E89A80', intensity: 0.18 }, // Pantone Color of the Year 2025
    { name: 'Tranquil Blue', base: '#7FB3D3', pattern: '#5A9BC4', intensity: 0.2 }, // Calm & Serene
    { name: 'Sage Green', base: '#9CAF88', pattern: '#7A9A6A', intensity: 0.22 }, // Natural & Fresh
    { name: 'Warm Terracotta', base: '#C97D60', pattern: '#A85D45', intensity: 0.2 }, // Earthy & Warm
    { name: 'Soft Lavender', base: '#B8A9C9', pattern: '#9B8BAF', intensity: 0.18 }, // Elegant & Dreamy
    { name: 'Butter Yellow', base: '#F5D76E', pattern: '#E8C85A', intensity: 0.15 }, // Cheerful & Bright
    { name: 'Dusty Rose', base: '#D4A5A5', pattern: '#B88A8A', intensity: 0.2 }, // Romantic & Vintage
    { name: 'Muted Teal', base: '#6B9A8A', pattern: '#4F7A6B', intensity: 0.22 }, // Sophisticated
    
    // === Màu cổ điển cho phong bì ===
    { name: 'Creamy Beige', base: '#E8DCC6', pattern: '#D4C4A8', intensity: 0.12 }, // Classic Vintage
    { name: 'Blush Pink', base: '#E8B4B8', pattern: '#D49AA0', intensity: 0.2 }, // Soft & Feminine
    { name: 'Warm Taupe', base: '#A08B7A', pattern: '#7A6A5A', intensity: 0.18 }, // Timeless Elegance
    { name: 'Soft Mint', base: '#A8D5BA', pattern: '#8BC4A0', intensity: 0.18 }, // Fresh & Light
    { name: 'Vintage Coral', base: '#E89A80', pattern: '#D47A60', intensity: 0.2 }, // Warm & Inviting
    { name: 'Periwinkle', base: '#9B9FD4', pattern: '#7A7FB8', intensity: 0.18 }, // Dreamy & Calm
    { name: 'Warm Gray', base: '#8B8680', pattern: '#6B6660', intensity: 0.15 }, // Sophisticated Neutral
    { name: 'Pale Gold', base: '#F4E4BC', pattern: '#E8D4A0', intensity: 0.12 }, // Luxurious & Warm
    
    // === Màu bổ sung đa dạng ===
    { name: 'Dusty Blue', base: '#8FA8B8', pattern: '#6B8494', intensity: 0.2 }, // Serene & Calm
    { name: 'Mauve', base: '#C4A5C4', pattern: '#A885A8', intensity: 0.18 }, // Elegant Purple
    { name: 'Sage Blue', base: '#7A9A9A', pattern: '#5A7A7A', intensity: 0.2 }, // Tranquil & Peaceful
    { name: 'Apricot', base: '#FFC8A3', pattern: '#E8A880', intensity: 0.18 }, // Warm & Friendly
  ];
  
  // Update base color when envelope changes - chỉ khi giá trị thực sự khác
  // ✅ Sử dụng useRef để track giá trị trước đó, tránh vòng lặp vô hạn
  const prevColorRef = useRef<string>('');
  const isUpdatingFromEffectRef = useRef(false);
  
  useEffect(() => {
    const newColor = selectedEnvelope?.color || defaultEnvelopeFromDB?.color;
    // Chỉ set nếu có giá trị mới và khác với giá trị đã set trước đó
    // Sử dụng functional update để so sánh với giá trị hiện tại mà không cần dependency
    if (newColor && newColor !== prevColorRef.current) {
      setEnvelopeBaseColor((currentColor: string) => {
        // Chỉ update nếu thực sự khác
        if (newColor !== currentColor) {
          prevColorRef.current = newColor;
          isUpdatingFromEffectRef.current = true;
          // Reset flag sau một tick
          setTimeout(() => {
            isUpdatingFromEffectRef.current = false;
          }, 0);
          return newColor;
        }
        return currentColor;
      });
    }
  }, [selectedEnvelope?.color, defaultEnvelopeFromDB?.color]);

  // When customization changes or default envelope loads, update the envelope
  // ✅ Sử dụng useRef để track lần update trước, tránh vòng lặp vô hạn
  const prevUpdateRef = useRef<string>('');
  
  useEffect(() => {
    // Skip nếu đang update từ useEffect khác để tránh vòng lặp
    if (isUpdatingFromEffectRef.current) {
      return;
    }
    
    // Only update if we have a valid envelope (either selected or default from DB)
    if (defaultEnvelope && defaultEnvelope.id) {
      // Tạo signature để check xem có thay đổi thực sự không
      const updateSignature = JSON.stringify({
        color: envelopeBaseColor,
        pattern: selectedPattern,
        patternColor,
        patternIntensity,
        sealDesign: selectedSeal,
        sealColor: selectedSealColor,
        envelopeId: defaultEnvelope.id,
      });
      
      // Chỉ gọi onSelectEnvelope nếu có thay đổi thực sự
      // Và color trong selectedEnvelope khác với envelopeBaseColor (tránh vòng lặp)
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

  return (
    <div className="flex h-full gap-8 p-6">
      {/* Left Panel - Customization Only */}
      <div className="w-96 bg-white/80 backdrop-blur-xl rounded-2xl border border-amber-100/50 overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-amber-100/50 sticky top-0 bg-gradient-to-b from-white via-amber-50/30 to-white backdrop-blur-xl z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Tùy chỉnh phong bì
              </h3>
              <p className="text-xs text-gray-500">Thiết kế phong bì của bạn</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Color Presets */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
              Bộ màu gợi ý
            </p>
            <div className="grid grid-cols-4 gap-2.5">
              {COLOR_PRESETS.map((preset, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setEnvelopeBaseColor(preset.base);
                    setPatternColor(preset.pattern);
                    setPatternIntensity(preset.intensity);
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-amber-400 transition-all group shadow-sm hover:shadow-lg"
                  style={{ borderColor: preset.base + '40' }}
                >
                  <div 
                    className="w-full h-10 rounded-lg mb-2 relative overflow-hidden shadow-inner"
                    style={{ backgroundColor: preset.base }}
                  >
                    <div 
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${encodeURIComponent(preset.pattern)}' fill-opacity='0.3'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>
                  <div className="text-gray-700 group-hover:text-gray-900 text-[11px] font-medium">{preset.name}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Envelope Base Color */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
              Màu nền phong bì
            </p>
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

          {/* Pattern Selection - với scroll cho 100+ patterns */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
              Họa tiết phong bì
              <span className="text-xs font-normal text-gray-500">({ENVELOPE_PATTERNS.length} mẫu)</span>
            </p>
            <div className="max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl p-3 bg-gradient-to-b from-gray-50 to-white shadow-inner">
              <div className="grid grid-cols-4 gap-2">
                {ENVELOPE_PATTERNS.map((pat) => (
                  <motion.button
                    key={pat.id}
                    onClick={() => setSelectedPattern(pat.id as EnvelopePattern)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-3 py-3 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                      selectedPattern === pat.id 
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg ring-2 ring-amber-300 ring-offset-2' 
                        : 'bg-white text-gray-700 hover:bg-amber-50 border-2 border-gray-200 hover:border-amber-300 shadow-sm hover:shadow-md'
                    }`}
                    title={pat.name}
                  >
                    {pat.preview && <span className="text-lg">{pat.preview}</span>}
                    <span className="truncate w-full text-center text-[10px]">{pat.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Pattern Color */}
          {selectedPattern !== 'solid' && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                Màu họa tiết
              </p>
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
          )}

          {/* Pattern Intensity */}
          {selectedPattern !== 'solid' && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
                  Độ đậm họa tiết
                </p>
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
                style={{
                  background: `linear-gradient(to right, #e5e7eb 0%, #e5e7eb ${patternIntensity * 100}%, #fbbf24 ${patternIntensity * 100}%, #f59e0b 100%)`
                }}
              />
            </div>
          )}


          {/* Seal Selection */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></span>
              Con dấu sáp
            </p>
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
      </div>

      {/* Right Panel - Large Preview */}
      <div className="flex-1 flex flex-col">
        {/* Large Preview Section */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-amber-50/20 rounded-2xl border-2 border-gray-200/50 shadow-2xl p-12 flex items-center justify-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-rose-400 rounded-full blur-3xl"></div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full z-10"
          >
            <motion.div
              key={`${defaultEnvelope.id}-${envelopeBaseColor}-${selectedPattern}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800 mb-1">Xem trước phong bì</h4>
                <p className="text-sm text-gray-500">Nhấn vào con dấu để mở/đóng</p>
              </div>
              <div className="transform scale-125">
                <Envelope2D
                  color={envelopeBaseColor}
                  pattern={selectedPattern}
                  patternColor={patternColor}
                  patternIntensity={patternIntensity}
                  texture={defaultEnvelope.texture ?? defaultEnvelope.thumbnail}
                  stampUrl={defaultEnvelope.stamp_url || 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=150&q=80'}
                  sealDesign={selectedSeal}
                  sealColor={selectedSealColor}
                  isOpen={isOpen}
                  side={envelopeSide}
                  showControls
                  onToggleOpen={() => setIsOpen((v) => !v)}
                  onFlip={() => setEnvelopeSide((s) => (s === 'front' ? 'back' : 'front'))}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
