/**
 * ✅ Design Presets - Type Definitions
 * Hệ thống thiết kế cho Echo eCard
 * 
 * Tier System:
 * - free: Miễn phí cho tất cả người dùng
 * - premium: Yêu cầu tài khoản premium
 * - pro: Yêu cầu tài khoản pro hoặc mua riêng
 * - exclusive: Giới hạn đặc biệt (sự kiện, VIP)
 */

export type DesignTier = 'free' | 'premium' | 'pro' | 'exclusive';

export type DesignCategory = 
  // Gradient categories
  | 'sunset' | 'ocean' | 'nature' | 'romantic' | 'elegant' | 'pastel' 
  | 'vibrant' | 'vintage' | 'minimal' | 'seasonal' | 'abstract' | 'metallic'
  // Pattern categories
  | 'floral' | 'geometric' | 'abstract_pattern' | 'nature_pattern' | 'romantic_pattern'
  | 'minimalist' | 'vintage_pattern' | 'festive' | 'elegant_pattern' | 'playful';

export interface GradientPreset {
  id: string;
  name: string;
  nameVi: string;
  colors: string[];
  direction: string;
  category: DesignCategory;
  tier: DesignTier;
  tags?: string[];
}

export interface PatternPreset {
  id: string;
  name: string;
  nameVi: string;
  preview: string;
  svg: string;
  size: string;
  category: DesignCategory;
  tier: DesignTier;
  tags?: string[];
  opacity?: number;
}

export interface EnvelopePatternPreset extends PatternPreset {
  applyToFront: boolean;
  applyToBack: boolean;
  applyToFlap: boolean;
  applyToLiner: boolean;
}

/**
 * Helper function để tạo CSS gradient từ preset
 */
export function createGradientCSS(preset: GradientPreset): string {
  const stops = preset.colors.map((color, i) => {
    const percent = (i / (preset.colors.length - 1)) * 100;
    return `${color} ${percent}%`;
  }).join(', ');
  return `linear-gradient(${preset.direction}, ${stops})`;
}

/**
 * Helper function để tạo CSS pattern từ preset
 * ✅ Sửa: Tách shorthand `background` thành các properties riêng biệt để tránh conflict với `backgroundSize`
 */
export function createPatternCSS(preset: PatternPreset, bgColor: string): React.CSSProperties {
  const isGradient = bgColor.includes('gradient');
  const svgUrl = `url("data:image/svg+xml,${encodeURIComponent(preset.svg)}")`;
  
  if (isGradient) {
    // ✅ Tách `background` thành `backgroundImage` và không dùng shorthand để tránh conflict với `backgroundSize`
    return {
      backgroundImage: `${svgUrl}, ${bgColor}`,
      backgroundSize: `${preset.size}, cover`, // Size cho pattern và gradient
    };
  }
  
  return {
    backgroundImage: svgUrl,
    backgroundSize: preset.size,
    backgroundColor: bgColor,
  };
}

/**
 * Helper function để kiểm tra tier access
 */
export function canAccessTier(userTier: DesignTier, requiredTier: DesignTier): boolean {
  const tierOrder: DesignTier[] = ['free', 'premium', 'pro', 'exclusive'];
  return tierOrder.indexOf(userTier) >= tierOrder.indexOf(requiredTier);
}

/**
 * Filter presets by tier
 */
export function filterByTier<T extends { tier: DesignTier }>(
  presets: T[],
  userTier: DesignTier
): T[] {
  return presets.filter(p => canAccessTier(userTier, p.tier));
}

/**
 * Filter presets by category
 */
export function filterByCategory<T extends { category: DesignCategory }>(
  presets: T[],
  category: DesignCategory
): T[] {
  return presets.filter(p => p.category === category);
}

