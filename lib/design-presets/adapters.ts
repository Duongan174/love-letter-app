/**
 * ✅ Adapters for integrating new design presets with existing components
 * File này cung cấp các hàm helper để dễ dàng migrate từ format cũ sang mới
 */

import { GradientPreset, PatternPreset, EnvelopePatternPreset, createGradientCSS } from './types';
import GRADIENT_PRESETS from './gradients';
import LETTER_PATTERNS from './letter-patterns';
import ENVELOPE_PATTERNS from './envelope-patterns';
import { LINER_PATTERNS } from './liner-patterns';

/**
 * Convert gradient presets sang format cũ của RichTextEditor
 */
export function getGradientsForEditor(userTier: 'free' | 'premium' | 'pro' | 'exclusive' = 'free') {
  const tierOrder = ['free', 'premium', 'pro', 'exclusive'];
  const userTierIndex = tierOrder.indexOf(userTier);
  
  return GRADIENT_PRESETS
    .filter(g => tierOrder.indexOf(g.tier) <= userTierIndex)
    .map(g => ({
      id: g.id,
      name: g.nameVi,
      colors: g.colors,
      direction: g.direction,
      tier: g.tier,
      category: g.category,
    }));
}

/**
 * Convert letter patterns sang format cũ
 */
export function getLetterPatternsForEditor(userTier: 'free' | 'premium' | 'pro' | 'exclusive' = 'free') {
  const tierOrder = ['free', 'premium', 'pro', 'exclusive'];
  const userTierIndex = tierOrder.indexOf(userTier);
  
  return LETTER_PATTERNS
    .filter(p => tierOrder.indexOf(p.tier) <= userTierIndex)
    .map(p => ({
      id: p.id,
      name: p.nameVi,
      preview: p.preview,
      tier: p.tier,
      category: p.category,
    }));
}

/**
 * Convert envelope patterns sang format cho Envelope2D component
 */
export function getEnvelopePatternsForEnvelope(userTier: 'free' | 'premium' | 'pro' | 'exclusive' = 'free') {
  const tierOrder = ['free', 'premium', 'pro', 'exclusive'];
  const userTierIndex = tierOrder.indexOf(userTier);
  
  return ENVELOPE_PATTERNS
    .filter(p => tierOrder.indexOf(p.tier) <= userTierIndex)
    .map(p => ({
      id: p.id,
      name: p.nameVi,
      preview: p.preview,
      tier: p.tier,
      category: p.category,
      applyToFront: p.applyToFront,
      applyToBack: p.applyToBack,
      applyToFlap: p.applyToFlap,
      applyToLiner: p.applyToLiner,
    }));
}

/**
 * Tạo CSS gradient string từ gradient ID
 */
export function getGradientCSSById(gradientId: string): string {
  const gradient = GRADIENT_PRESETS.find(g => g.id === gradientId);
  if (!gradient) return '#ffffff';
  return createGradientCSS(gradient);
}

/**
 * Tạo pattern style object từ pattern ID
 */
export function getLetterPatternStyle(patternId: string, bgColor: string): React.CSSProperties {
  const pattern = LETTER_PATTERNS.find(p => p.id === patternId);
  
  // Nếu không tìm thấy pattern hoặc là solid
  if (!pattern || patternId === 'solid' || !pattern.svg) {
    const isGradient = bgColor.includes('gradient');
    if (isGradient) {
      return { background: bgColor };
    }
    return { backgroundColor: bgColor };
  }
  
  const isGradient = bgColor.includes('gradient');
  const svgUrl = `url("data:image/svg+xml,${encodeURIComponent(pattern.svg)}")`;
  
  if (isGradient) {
    return {
      background: `${svgUrl}, ${bgColor}`,
      backgroundSize: pattern.size,
    };
  }
  
  return {
    backgroundImage: svgUrl,
    backgroundSize: pattern.size,
    backgroundColor: bgColor,
  };
}

/**
 * Tạo pattern style object cho envelope từ pattern ID
 */
export function getEnvelopePatternStyle(patternId: string, bgColor: string): React.CSSProperties {
  // ✅ Đảm bảo bgColor là string
  const colorString = typeof bgColor === 'string' ? bgColor : (bgColor || '#5d4037');
  
  const pattern = ENVELOPE_PATTERNS.find(p => p.id === patternId);
  
  // Nếu không tìm thấy pattern hoặc là solid
  if (!pattern || patternId === 'env-solid' || !pattern.svg) {
    const isGradient = typeof colorString === 'string' && colorString.includes('gradient');
    if (isGradient) {
      return { background: colorString };
    }
    return { backgroundColor: colorString };
  }
  
  const isGradient = typeof colorString === 'string' && colorString.includes('gradient');
  const svgUrl = `url("data:image/svg+xml,${encodeURIComponent(pattern.svg)}")`;
  
  if (isGradient) {
    return {
      background: `${svgUrl}, ${colorString}`,
      backgroundSize: pattern.size,
    };
  }
  
  return {
    backgroundImage: svgUrl,
    backgroundSize: pattern.size,
    backgroundColor: colorString,
  };
}

/**
 * Helper function để lấy gradient preset theo ID
 */
export function findGradient(id: string): GradientPreset | undefined {
  return GRADIENT_PRESETS.find(g => g.id === id);
}

/**
 * Helper function để lấy letter pattern theo ID
 */
export function findLetterPattern(id: string): PatternPreset | undefined {
  return LETTER_PATTERNS.find(p => p.id === id);
}

/**
 * Helper function để lấy envelope pattern theo ID
 */
export function findEnvelopePattern(id: string): EnvelopePatternPreset | undefined {
  return ENVELOPE_PATTERNS.find(p => p.id === id);
}

/**
 * Helper function để lấy liner pattern theo ID
 */
export function findLinerPattern(id: string): PatternPreset | undefined {
  return LINER_PATTERNS.find(p => p.id === id);
}

/**
 * Tạo pattern style object cho liner từ pattern ID
 */
export function getLinerPatternStyle(patternId: string, bgColor: string): React.CSSProperties {
  const pattern = LINER_PATTERNS.find(p => p.id === patternId);
  
  // ✅ Debug log trong development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[getLinerPatternStyle]', {
      patternId,
      bgColor,
      patternFound: !!pattern,
      patternName: pattern?.nameVi,
      hasSvg: !!pattern?.svg,
      totalPatterns: LINER_PATTERNS.length,
      allIds: LINER_PATTERNS.map(p => p.id),
    });
  }
  
  // Nếu không tìm thấy pattern hoặc là solid
  if (!pattern || patternId === 'solid' || !pattern.svg) {
    const isGradient = bgColor.includes('gradient');
    if (isGradient) {
      return { background: bgColor };
    }
    return { backgroundColor: bgColor };
  }
  
  const isGradient = bgColor.includes('gradient');
  
  // ✅ Encode SVG và tạo data URL
  try {
    const encodedSvg = encodeURIComponent(pattern.svg);
    const svgUrl = `url("data:image/svg+xml,${encodedSvg}")`;
    
    // ✅ Debug: Kiểm tra SVG URL length
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[getLinerPatternStyle] SVG URL created:', {
        svgLength: pattern.svg.length,
        encodedLength: encodedSvg.length,
        svgUrlPreview: svgUrl.substring(0, 100) + '...',
      });
    }
    
    const baseStyle: React.CSSProperties = {
      backgroundImage: svgUrl,
      backgroundSize: pattern.size || '300px 300px',
      backgroundRepeat: 'repeat',
    };
    
    // ✅ Debug: Đảm bảo backgroundImage được set
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('[getLinerPatternStyle] Base style created:', {
        hasBackgroundImage: !!baseStyle.backgroundImage,
        backgroundImageLength: baseStyle.backgroundImage?.length,
        backgroundSize: baseStyle.backgroundSize,
      });
    }
    
    if (isGradient) {
      return {
        ...baseStyle,
        background: `${svgUrl}, ${bgColor}`,
      };
    }
    
    const finalStyle: React.CSSProperties = {
      ...baseStyle,
      backgroundColor: bgColor,
    };
    
    // ✅ Chỉ set opacity nếu pattern có opacity riêng (không override trong component)
    // Opacity sẽ được set trong Envelope2D component
    // if (pattern.opacity !== undefined) {
    //   finalStyle.opacity = pattern.opacity;
    // }
    
    return finalStyle;
  } catch (error) {
    console.error('[getLinerPatternStyle] Error encoding SVG:', error);
    return { backgroundColor: bgColor };
  }
}

/**
 * Convert liner patterns sang format cho UI
 */
export function getLinerPatternsForUI(userTier: 'free' | 'premium' | 'pro' | 'exclusive' = 'free') {
  const tierOrder = ['free', 'premium', 'pro', 'exclusive'];
  const userTierIndex = tierOrder.indexOf(userTier);
  
  // ✅ Debug: Log để kiểm tra
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Liner Patterns] Total patterns:', LINER_PATTERNS.length);
    console.log('[Liner Patterns] Patterns for tier', userTier, ':', 
      LINER_PATTERNS.filter(p => tierOrder.indexOf(p.tier) <= userTierIndex).length
    );
  }
  
  return LINER_PATTERNS
    .filter(p => tierOrder.indexOf(p.tier) <= userTierIndex)
    .map(p => ({
      id: p.id,
      name: p.nameVi,
      preview: p.preview,
      tier: p.tier,
      category: p.category,
    }));
}

/**
 * Group liner patterns by category for UI
 */
export function groupLinerPatternsByCategory() {
  const groups: Record<string, PatternPreset[]> = {};
  
  for (const pattern of LINER_PATTERNS) {
    if (!groups[pattern.category]) {
      groups[pattern.category] = [];
    }
    groups[pattern.category].push(pattern);
  }
  
  return groups;
}

/**
 * Group gradients by category for UI
 */
export function groupGradientsByCategory() {
  const groups: Record<string, GradientPreset[]> = {};
  
  for (const gradient of GRADIENT_PRESETS) {
    if (!groups[gradient.category]) {
      groups[gradient.category] = [];
    }
    groups[gradient.category].push(gradient);
  }
  
  return groups;
}

/**
 * Group letter patterns by category for UI
 */
export function groupLetterPatternsByCategory() {
  const groups: Record<string, PatternPreset[]> = {};
  
  for (const pattern of LETTER_PATTERNS) {
    if (!groups[pattern.category]) {
      groups[pattern.category] = [];
    }
    groups[pattern.category].push(pattern);
  }
  
  return groups;
}

/**
 * Group envelope patterns by category for UI
 */
export function groupEnvelopePatternsByCategory() {
  const groups: Record<string, EnvelopePatternPreset[]> = {};
  
  for (const pattern of ENVELOPE_PATTERNS) {
    if (!groups[pattern.category]) {
      groups[pattern.category] = [];
    }
    groups[pattern.category].push(pattern);
  }
  
  return groups;
}

/**
 * Kiểm tra tier access
 */
export function checkTierAccess(
  requiredTier: 'free' | 'premium' | 'pro' | 'exclusive',
  userTier: 'free' | 'premium' | 'pro' | 'exclusive' = 'free'
): boolean {
  const tierOrder = ['free', 'premium', 'pro', 'exclusive'];
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);
}

/**
 * Lấy tier badge color
 */
export function getTierBadgeColor(tier: 'free' | 'premium' | 'pro' | 'exclusive'): string {
  switch (tier) {
    case 'premium':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'pro':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'exclusive':
      return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

/**
 * Lấy tier label tiếng Việt
 */
export function getTierLabel(tier: 'free' | 'premium' | 'pro' | 'exclusive'): string {
  switch (tier) {
    case 'premium':
      return 'Premium';
    case 'pro':
      return 'Pro';
    case 'exclusive':
      return 'VIP';
    default:
      return 'Miễn phí';
  }
}

