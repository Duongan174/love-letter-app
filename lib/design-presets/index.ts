/**
 * ✅ Design Presets - Main Export
 * Hệ thống thiết kế hoàn chỉnh cho Echo eCard
 * 
 * Bao gồm:
 * - 120+ Gradient Presets
 * - 100+ Letter Patterns
 * - 100+ Envelope Patterns
 * - Tier System (free/premium/pro/exclusive)
 */

// Types
export * from './types';

// Presets
export { default as GRADIENT_PRESETS, GRADIENT_PRESETS as gradients } from './gradients';
export { default as LETTER_PATTERNS, LETTER_PATTERNS as letterPatterns } from './letter-patterns';
export { default as ENVELOPE_PATTERNS, ENVELOPE_PATTERNS as envelopePatterns } from './envelope-patterns';
export { LINER_PATTERNS, LINER_PATTERNS as linerPatterns } from './liner-patterns';

// Re-export helper functions
import { 
  createGradientCSS, 
  createPatternCSS, 
  canAccessTier, 
  filterByTier, 
  filterByCategory,
  type DesignTier,
  type DesignCategory,
  type GradientPreset,
  type PatternPreset,
  type EnvelopePatternPreset
} from './types';

import GRADIENT_PRESETS from './gradients';
import LETTER_PATTERNS from './letter-patterns';
import ENVELOPE_PATTERNS from './envelope-patterns';
import { LINER_PATTERNS } from './liner-patterns';

/**
 * Lấy tất cả gradients theo tier
 */
export function getGradientsByTier(userTier: DesignTier = 'free'): GradientPreset[] {
  return filterByTier(GRADIENT_PRESETS, userTier);
}

/**
 * Lấy tất cả letter patterns theo tier
 */
export function getLetterPatternsByTier(userTier: DesignTier = 'free'): PatternPreset[] {
  return filterByTier(LETTER_PATTERNS, userTier);
}

/**
 * Lấy tất cả envelope patterns theo tier
 */
export function getEnvelopePatternsByTier(userTier: DesignTier = 'free'): EnvelopePatternPreset[] {
  return filterByTier(ENVELOPE_PATTERNS, userTier);
}

/**
 * Lấy tất cả liner patterns theo tier
 */
export function getLinerPatternsByTier(userTier: DesignTier = 'free'): PatternPreset[] {
  return filterByTier(LINER_PATTERNS, userTier);
}

/**
 * Lấy gradients theo category
 */
export function getGradientsByCategory(category: DesignCategory): GradientPreset[] {
  return filterByCategory(GRADIENT_PRESETS, category);
}

/**
 * Lấy letter patterns theo category
 */
export function getLetterPatternsByCategory(category: DesignCategory): PatternPreset[] {
  return filterByCategory(LETTER_PATTERNS, category);
}

/**
 * Lấy envelope patterns theo category
 */
export function getEnvelopePatternsByCategory(category: DesignCategory): EnvelopePatternPreset[] {
  return filterByCategory(ENVELOPE_PATTERNS, category);
}

/**
 * Lấy liner patterns theo category
 */
export function getLinerPatternsByCategory(category: DesignCategory): PatternPreset[] {
  return filterByCategory(LINER_PATTERNS, category);
}

/**
 * Tìm gradient theo ID
 */
export function findGradientById(id: string): GradientPreset | undefined {
  return GRADIENT_PRESETS.find(g => g.id === id);
}

/**
 * Tìm letter pattern theo ID
 */
export function findLetterPatternById(id: string): PatternPreset | undefined {
  return LETTER_PATTERNS.find(p => p.id === id);
}

/**
 * Tìm envelope pattern theo ID
 */
export function findEnvelopePatternById(id: string): EnvelopePatternPreset | undefined {
  return ENVELOPE_PATTERNS.find(p => p.id === id);
}

/**
 * Tìm liner pattern theo ID
 */
export function findLinerPatternById(id: string): PatternPreset | undefined {
  return LINER_PATTERNS.find(p => p.id === id);
}

/**
 * Lấy CSS cho gradient
 */
export function getGradientCSS(gradientId: string): string {
  const gradient = findGradientById(gradientId);
  if (!gradient) return '#ffffff';
  return createGradientCSS(gradient);
}

/**
 * Lấy CSS styles cho letter pattern
 */
export function getLetterPatternStyles(patternId: string, bgColor: string): React.CSSProperties {
  const pattern = findLetterPatternById(patternId);
  if (!pattern) return { backgroundColor: bgColor };
  return createPatternCSS(pattern, bgColor);
}

/**
 * Lấy CSS styles cho envelope pattern
 */
export function getEnvelopePatternStyles(patternId: string, bgColor: string): React.CSSProperties {
  const pattern = findEnvelopePatternById(patternId);
  if (!pattern) return { backgroundColor: bgColor };
  return createPatternCSS(pattern, bgColor);
}

/**
 * Lấy CSS styles cho liner pattern
 */
export function getLinerPatternStyles(patternId: string, bgColor: string): React.CSSProperties {
  const pattern = findLinerPatternById(patternId);
  if (!pattern) return { backgroundColor: bgColor };
  const styles = createPatternCSS(pattern, bgColor);
  // Áp dụng opacity nếu có
  if (pattern.opacity !== undefined) {
    return { ...styles, opacity: pattern.opacity };
  }
  return styles;
}

/**
 * Thống kê số lượng presets
 */
export const PRESET_COUNTS = {
  gradients: GRADIENT_PRESETS.length,
  letterPatterns: LETTER_PATTERNS.length,
  envelopePatterns: ENVELOPE_PATTERNS.length,
  linerPatterns: LINER_PATTERNS.length,
  total: GRADIENT_PRESETS.length + LETTER_PATTERNS.length + ENVELOPE_PATTERNS.length + LINER_PATTERNS.length,
  
  // By tier
  freeGradients: GRADIENT_PRESETS.filter(g => g.tier === 'free').length,
  premiumGradients: GRADIENT_PRESETS.filter(g => g.tier === 'premium').length,
  proGradients: GRADIENT_PRESETS.filter(g => g.tier === 'pro').length,
  exclusiveGradients: GRADIENT_PRESETS.filter(g => g.tier === 'exclusive').length,
  
  freeLetterPatterns: LETTER_PATTERNS.filter(p => p.tier === 'free').length,
  premiumLetterPatterns: LETTER_PATTERNS.filter(p => p.tier === 'premium').length,
  proLetterPatterns: LETTER_PATTERNS.filter(p => p.tier === 'pro').length,
  
  freeEnvelopePatterns: ENVELOPE_PATTERNS.filter(p => p.tier === 'free').length,
  premiumEnvelopePatterns: ENVELOPE_PATTERNS.filter(p => p.tier === 'premium').length,
  proEnvelopePatterns: ENVELOPE_PATTERNS.filter(p => p.tier === 'pro').length,
  
  freeLinerPatterns: LINER_PATTERNS.filter(p => p.tier === 'free').length,
  premiumLinerPatterns: LINER_PATTERNS.filter(p => p.tier === 'premium').length,
  proLinerPatterns: LINER_PATTERNS.filter(p => p.tier === 'pro').length,
};

/**
 * Categories cho UI filtering
 */
export const GRADIENT_CATEGORIES = [
  { id: 'sunset', name: 'Sunset & Warm', nameVi: 'Hoàng hôn & Ấm' },
  { id: 'romantic', name: 'Romantic & Rose', nameVi: 'Lãng mạn & Hoa hồng' },
  { id: 'elegant', name: 'Purple & Lavender', nameVi: 'Tím & Oải hương' },
  { id: 'ocean', name: 'Ocean & Blue', nameVi: 'Đại dương & Xanh' },
  { id: 'nature', name: 'Nature & Green', nameVi: 'Thiên nhiên & Xanh lá' },
  { id: 'pastel', name: 'Pastel & Soft', nameVi: 'Pastel & Nhẹ nhàng' },
  { id: 'metallic', name: 'Metallic & Luxury', nameVi: 'Kim loại & Sang trọng' },
  { id: 'seasonal', name: 'Seasonal & Festive', nameVi: 'Theo mùa & Lễ hội' },
  { id: 'minimal', name: 'Minimal & Clean', nameVi: 'Tối giản & Sạch sẽ' },
  { id: 'vibrant', name: 'Vibrant & Bold', nameVi: 'Rực rỡ & Nổi bật' },
] as const;

export const LETTER_PATTERN_CATEGORIES = [
  { id: 'minimalist', name: 'Basic & Minimal', nameVi: 'Cơ bản & Tối giản' },
  { id: 'floral', name: 'Floral & Botanical', nameVi: 'Hoa & Thực vật' },
  { id: 'romantic_pattern', name: 'Romantic & Hearts', nameVi: 'Lãng mạn & Trái tim' },
  { id: 'abstract_pattern', name: 'Stars & Celestial', nameVi: 'Sao & Thiên thể' },
  { id: 'nature_pattern', name: 'Winter & Snow', nameVi: 'Mùa đông & Tuyết' },
  { id: 'festive', name: 'Festive & Celebration', nameVi: 'Lễ hội & Kỷ niệm' },
  { id: 'geometric', name: 'Geometric & Abstract', nameVi: 'Hình học & Trừu tượng' },
] as const;

export const ENVELOPE_PATTERN_CATEGORIES = [
  { id: 'elegant_pattern', name: 'Classic & Elegant', nameVi: 'Cổ điển & Trang nhã' },
  { id: 'floral', name: 'Floral & Botanical', nameVi: 'Hoa & Thực vật' },
  { id: 'geometric', name: 'Geometric', nameVi: 'Hình học' },
  { id: 'festive', name: 'Festive', nameVi: 'Lễ hội' },
  { id: 'nature_pattern', name: 'Nature & Texture', nameVi: 'Thiên nhiên & Vân' },
  { id: 'abstract_pattern', name: 'Abstract', nameVi: 'Trừu tượng' },
  { id: 'minimalist', name: 'Modern & Minimal', nameVi: 'Hiện đại & Tối giản' },
  { id: 'playful', name: 'Playful', nameVi: 'Vui nhộn' },
] as const;

export const LINER_PATTERN_CATEGORIES = [
  { id: 'floral', name: 'Watercolor Floral', nameVi: 'Hoa nước màu' },
  { id: 'romantic_pattern', name: 'Romantic & Vintage', nameVi: 'Lãng mạn & Cổ điển' },
  { id: 'nature_pattern', name: 'Botanical Garden', nameVi: 'Vườn thực vật' },
  { id: 'abstract_pattern', name: 'Artistic & Abstract', nameVi: 'Nghệ thuật & Trừu tượng' },
  { id: 'elegant_pattern', name: 'Elegant & Sophisticated', nameVi: 'Trang nhã & Tinh tế' },
  { id: 'vintage_pattern', name: 'Vintage & Classic', nameVi: 'Cổ điển & Vintage' },
] as const;

export { createGradientCSS, createPatternCSS, canAccessTier, filterByTier, filterByCategory };

// Adapters for existing components
export * from './adapters';

