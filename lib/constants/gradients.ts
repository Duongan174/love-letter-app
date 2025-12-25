/**
 * ✅ GRADIENT PRESETS - 120+ Gradient đẹp mắt
 * Tổ chức theo categories và hỗ trợ Free/Pro tier
 */

export type GradientTier = 'free' | 'pro' | 'premium';

export interface GradientPreset {
  id: string;
  name: string;
  nameEn: string;
  colors: string[];
  direction: string;
  category: string;
  tier: GradientTier;
}

// ============================================
// 🌅 SUNSET & WARM (12 gradients)
// ============================================
const SUNSET_WARM: GradientPreset[] = [
  { id: 'sunset-gold', name: 'Hoàng hôn vàng', nameEn: 'Sunset Gold', colors: ['#fef3c7', '#fce7f3', '#fdf2f8'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'peach-cream', name: 'Đào kem', nameEn: 'Peach Cream', colors: ['#fff1e6', '#ffe4e6', '#fdf2f8'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'golden-rose', name: 'Vàng hồng', nameEn: 'Golden Rose', colors: ['#fef9c3', '#fecdd3', '#fce7f3'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'warm-blush', name: 'Ấm áp', nameEn: 'Warm Blush', colors: ['#fef3c7', '#fda4af', '#fce7f3'], direction: '120deg', category: 'sunset', tier: 'free' },
  { id: 'tropical-sunset', name: 'Hoàng hôn nhiệt đới', nameEn: 'Tropical Sunset', colors: ['#fde68a', '#fb923c', '#f472b6'], direction: '135deg', category: 'sunset', tier: 'pro' },
  { id: 'mango-tango', name: 'Xoài tango', nameEn: 'Mango Tango', colors: ['#fef08a', '#fdba74', '#fca5a5'], direction: '135deg', category: 'sunset', tier: 'pro' },
  { id: 'coral-reef', name: 'San hô', nameEn: 'Coral Reef', colors: ['#fed7aa', '#fda4af', '#f9a8d4'], direction: '180deg', category: 'sunset', tier: 'pro' },
  { id: 'apricot-dream', name: 'Mơ hạnh nhân', nameEn: 'Apricot Dream', colors: ['#ffedd5', '#fecaca', '#fce7f3'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'tangerine-sky', name: 'Quýt trời', nameEn: 'Tangerine Sky', colors: ['#fef3c7', '#fdba74', '#fbbf24'], direction: '135deg', category: 'sunset', tier: 'pro' },
  { id: 'sahara-dusk', name: 'Hoàng hôn Sahara', nameEn: 'Sahara Dusk', colors: ['#fde68a', '#f59e0b', '#d97706', '#92400e'], direction: '135deg', category: 'sunset', tier: 'premium' },
  { id: 'autumn-ember', name: 'Than hồng mùa thu', nameEn: 'Autumn Ember', colors: ['#fef3c7', '#fcd34d', '#fb923c', '#ea580c'], direction: '180deg', category: 'sunset', tier: 'premium' },
  { id: 'fire-opal', name: 'Ngọc lửa', nameEn: 'Fire Opal', colors: ['#fff7ed', '#fed7aa', '#fb923c', '#ea580c'], direction: '135deg', category: 'sunset', tier: 'premium' },
];

// ============================================
// 🌸 PINK & ROSE (15 gradients)
// ============================================
const PINK_ROSE: GradientPreset[] = [
  { id: 'rose-garden', name: 'Vườn hồng', nameEn: 'Rose Garden', colors: ['#fce7f3', '#fbcfe8', '#f9a8d4'], direction: '135deg', category: 'pink', tier: 'free' },
  { id: 'soft-pink', name: 'Hồng nhẹ', nameEn: 'Soft Pink', colors: ['#fff1f2', '#fce7f3', '#fdf4ff'], direction: '135deg', category: 'pink', tier: 'free' },
  { id: 'cherry-blossom', name: 'Anh đào', nameEn: 'Cherry Blossom', colors: ['#fdf2f8', '#fbcfe8', '#fce7f3'], direction: '180deg', category: 'pink', tier: 'free' },
  { id: 'cotton-candy', name: 'Kẹo bông', nameEn: 'Cotton Candy', colors: ['#fce7f3', '#e9d5ff', '#ddd6fe'], direction: '135deg', category: 'pink', tier: 'free' },
  { id: 'strawberry-milk', name: 'Sữa dâu', nameEn: 'Strawberry Milk', colors: ['#fff1f2', '#fecdd3', '#fda4af'], direction: '180deg', category: 'pink', tier: 'pro' },
  { id: 'blush-petal', name: 'Cánh hoa hồng', nameEn: 'Blush Petal', colors: ['#fdf2f8', '#f9a8d4', '#ec4899'], direction: '135deg', category: 'pink', tier: 'pro' },
  { id: 'flamingo', name: 'Hồng hạc', nameEn: 'Flamingo', colors: ['#fce7f3', '#f472b6', '#db2777'], direction: '135deg', category: 'pink', tier: 'pro' },
  { id: 'peony', name: 'Hoa mẫu đơn', nameEn: 'Peony', colors: ['#fdf2f8', '#fbcfe8', '#f9a8d4', '#f472b6'], direction: '180deg', category: 'pink', tier: 'pro' },
  { id: 'ballet-slipper', name: 'Giày ballet', nameEn: 'Ballet Slipper', colors: ['#fff1f2', '#ffe4e6', '#fecdd3'], direction: '135deg', category: 'pink', tier: 'free' },
  { id: 'romantic-pink', name: 'Hồng lãng mạn', nameEn: 'Romantic Pink', colors: ['#fdf2f8', '#f9a8d4', '#ec4899', '#be185d'], direction: '135deg', category: 'pink', tier: 'premium' },
  { id: 'rose-quartz', name: 'Thạch anh hồng', nameEn: 'Rose Quartz', colors: ['#fce7f3', '#f472b6', '#ec4899', '#db2777'], direction: '180deg', category: 'pink', tier: 'premium' },
  { id: 'pink-champagne', name: 'Sâm panh hồng', nameEn: 'Pink Champagne', colors: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6'], direction: '135deg', category: 'pink', tier: 'premium' },
  { id: 'sakura-bloom', name: 'Hoa anh đào nở', nameEn: 'Sakura Bloom', colors: ['#fff1f2', '#fce7f3', '#f9a8d4'], direction: '45deg', category: 'pink', tier: 'pro' },
  { id: 'rose-petal', name: 'Cánh hồng rơi', nameEn: 'Rose Petal', colors: ['#fff5f5', '#fed7d7', '#feb2b2', '#fc8181'], direction: '180deg', category: 'pink', tier: 'pro' },
  { id: 'dusty-rose', name: 'Hồng bụi', nameEn: 'Dusty Rose', colors: ['#fdf2f8', '#e8b4b8', '#d4a4a8'], direction: '135deg', category: 'pink', tier: 'pro' },
];

// ============================================
// 💜 PURPLE & LAVENDER (15 gradients)
// ============================================
const PURPLE_LAVENDER: GradientPreset[] = [
  { id: 'lavender-mist', name: 'Oải hương', nameEn: 'Lavender Mist', colors: ['#f5f3ff', '#ede9fe', '#ddd6fe'], direction: '135deg', category: 'purple', tier: 'free' },
  { id: 'purple-dream', name: 'Tím mộng mơ', nameEn: 'Purple Dream', colors: ['#fdf4ff', '#f5f3ff', '#ede9fe'], direction: '135deg', category: 'purple', tier: 'free' },
  { id: 'violet-pink', name: 'Tím hồng', nameEn: 'Violet Pink', colors: ['#f5f3ff', '#fce7f3', '#fbcfe8'], direction: '120deg', category: 'purple', tier: 'free' },
  { id: 'mystic-purple', name: 'Tím huyền bí', nameEn: 'Mystic Purple', colors: ['#ede9fe', '#e9d5ff', '#f3e8ff'], direction: '135deg', category: 'purple', tier: 'free' },
  { id: 'amethyst', name: 'Thạch anh tím', nameEn: 'Amethyst', colors: ['#f5f3ff', '#c4b5fd', '#a78bfa'], direction: '135deg', category: 'purple', tier: 'pro' },
  { id: 'grape-fizz', name: 'Nho sủi', nameEn: 'Grape Fizz', colors: ['#ede9fe', '#a78bfa', '#8b5cf6'], direction: '180deg', category: 'purple', tier: 'pro' },
  { id: 'wisteria', name: 'Hoa tử đằng', nameEn: 'Wisteria', colors: ['#f5f3ff', '#e9d5ff', '#d8b4fe', '#c084fc'], direction: '135deg', category: 'purple', tier: 'pro' },
  { id: 'lilac-breeze', name: 'Gió tử đinh hương', nameEn: 'Lilac Breeze', colors: ['#faf5ff', '#e9d5ff', '#d8b4fe'], direction: '135deg', category: 'purple', tier: 'free' },
  { id: 'royal-purple', name: 'Hoàng gia tím', nameEn: 'Royal Purple', colors: ['#f5f3ff', '#a78bfa', '#7c3aed', '#6d28d9'], direction: '135deg', category: 'purple', tier: 'premium' },
  { id: 'plum-velvet', name: 'Nhung mận', nameEn: 'Plum Velvet', colors: ['#faf5ff', '#d8b4fe', '#a855f7', '#7e22ce'], direction: '180deg', category: 'purple', tier: 'premium' },
  { id: 'violet-galaxy', name: 'Thiên hà tím', nameEn: 'Violet Galaxy', colors: ['#ede9fe', '#c4b5fd', '#8b5cf6', '#6d28d9', '#4c1d95'], direction: '135deg', category: 'purple', tier: 'premium' },
  { id: 'orchid', name: 'Lan tím', nameEn: 'Orchid', colors: ['#fdf4ff', '#f0abfc', '#e879f9'], direction: '135deg', category: 'purple', tier: 'pro' },
  { id: 'ultraviolet', name: 'Tia cực tím', nameEn: 'Ultraviolet', colors: ['#f5f3ff', '#ddd6fe', '#a78bfa', '#7c3aed'], direction: '180deg', category: 'purple', tier: 'premium' },
  { id: 'heather', name: 'Thạch nam', nameEn: 'Heather', colors: ['#faf5ff', '#ede9fe', '#c4b5fd'], direction: '135deg', category: 'purple', tier: 'free' },
  { id: 'mauve-magic', name: 'Phép thuật hồng tím', nameEn: 'Mauve Magic', colors: ['#fdf4ff', '#e9d5ff', '#f0abfc', '#e879f9'], direction: '135deg', category: 'purple', tier: 'pro' },
];

// ============================================
// 💙 BLUE & TEAL (15 gradients)
// ============================================
const BLUE_TEAL: GradientPreset[] = [
  { id: 'ocean-breeze', name: 'Gió biển', nameEn: 'Ocean Breeze', colors: ['#ecfeff', '#cffafe', '#a5f3fc'], direction: '135deg', category: 'blue', tier: 'free' },
  { id: 'sky-blue', name: 'Xanh trời', nameEn: 'Sky Blue', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd'], direction: '180deg', category: 'blue', tier: 'free' },
  { id: 'mint-ocean', name: 'Bạc hà biển', nameEn: 'Mint Ocean', colors: ['#ecfeff', '#d1fae5', '#a7f3d0'], direction: '135deg', category: 'blue', tier: 'free' },
  { id: 'blue-purple', name: 'Xanh tím', nameEn: 'Blue Purple', colors: ['#e0f2fe', '#ede9fe', '#f5f3ff'], direction: '135deg', category: 'blue', tier: 'free' },
  { id: 'caribbean-sea', name: 'Biển Caribbean', nameEn: 'Caribbean Sea', colors: ['#ecfeff', '#67e8f9', '#22d3ee'], direction: '135deg', category: 'blue', tier: 'pro' },
  { id: 'deep-ocean', name: 'Đại dương sâu', nameEn: 'Deep Ocean', colors: ['#e0f2fe', '#7dd3fc', '#38bdf8', '#0284c7'], direction: '180deg', category: 'blue', tier: 'pro' },
  { id: 'frozen-lake', name: 'Hồ đóng băng', nameEn: 'Frozen Lake', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc'], direction: '135deg', category: 'blue', tier: 'pro' },
  { id: 'azure', name: 'Xanh azure', nameEn: 'Azure', colors: ['#f0f9ff', '#bae6fd', '#38bdf8'], direction: '135deg', category: 'blue', tier: 'pro' },
  { id: 'sapphire', name: 'Ngọc bích', nameEn: 'Sapphire', colors: ['#eff6ff', '#93c5fd', '#3b82f6', '#1d4ed8'], direction: '135deg', category: 'blue', tier: 'premium' },
  { id: 'midnight-blue', name: 'Xanh nửa đêm', nameEn: 'Midnight Blue', colors: ['#e0f2fe', '#3b82f6', '#1e40af', '#1e3a8a'], direction: '180deg', category: 'blue', tier: 'premium' },
  { id: 'teal-lagoon', name: 'Đầm xanh ngọc', nameEn: 'Teal Lagoon', colors: ['#f0fdfa', '#99f6e4', '#2dd4bf', '#14b8a6'], direction: '135deg', category: 'blue', tier: 'pro' },
  { id: 'aquamarine', name: 'Ngọc lam', nameEn: 'Aquamarine', colors: ['#ecfeff', '#a5f3fc', '#67e8f9', '#22d3ee'], direction: '180deg', category: 'blue', tier: 'pro' },
  { id: 'electric-blue', name: 'Xanh điện', nameEn: 'Electric Blue', colors: ['#dbeafe', '#60a5fa', '#3b82f6', '#2563eb'], direction: '135deg', category: 'blue', tier: 'premium' },
  { id: 'ice-crystal', name: 'Tinh thể băng', nameEn: 'Ice Crystal', colors: ['#f0f9ff', '#e0f2fe', '#cffafe', '#a5f3fc'], direction: '45deg', category: 'blue', tier: 'free' },
  { id: 'pacific-dream', name: 'Giấc mơ Thái Bình Dương', nameEn: 'Pacific Dream', colors: ['#ecfeff', '#67e8f9', '#06b6d4', '#0891b2'], direction: '135deg', category: 'blue', tier: 'premium' },
];

// ============================================
// 🌿 GREEN & NATURE (15 gradients)
// ============================================
const GREEN_NATURE: GradientPreset[] = [
  { id: 'spring-meadow', name: 'Đồng cỏ xuân', nameEn: 'Spring Meadow', colors: ['#ecfdf5', '#d1fae5', '#a7f3d0'], direction: '135deg', category: 'green', tier: 'free' },
  { id: 'mint-fresh', name: 'Bạc hà tươi', nameEn: 'Mint Fresh', colors: ['#f0fdf4', '#dcfce7', '#bbf7d0'], direction: '135deg', category: 'green', tier: 'free' },
  { id: 'sage-calm', name: 'Xanh dịu', nameEn: 'Sage Calm', colors: ['#f0fdf4', '#ecfdf5', '#d1fae5'], direction: '180deg', category: 'green', tier: 'free' },
  { id: 'forest-mist', name: 'Sương rừng', nameEn: 'Forest Mist', colors: ['#ecfdf5', '#f0f9ff', '#e0f2fe'], direction: '135deg', category: 'green', tier: 'free' },
  { id: 'emerald-glow', name: 'Ngọc lục bảo', nameEn: 'Emerald Glow', colors: ['#d1fae5', '#6ee7b7', '#34d399'], direction: '135deg', category: 'green', tier: 'pro' },
  { id: 'tropical-forest', name: 'Rừng nhiệt đới', nameEn: 'Tropical Forest', colors: ['#ecfdf5', '#86efac', '#22c55e', '#16a34a'], direction: '180deg', category: 'green', tier: 'pro' },
  { id: 'bamboo-grove', name: 'Rừng tre', nameEn: 'Bamboo Grove', colors: ['#f0fdf4', '#bbf7d0', '#86efac'], direction: '135deg', category: 'green', tier: 'pro' },
  { id: 'jade', name: 'Ngọc bích xanh', nameEn: 'Jade', colors: ['#ecfdf5', '#6ee7b7', '#10b981', '#059669'], direction: '135deg', category: 'green', tier: 'premium' },
  { id: 'enchanted-forest', name: 'Rừng huyền bí', nameEn: 'Enchanted Forest', colors: ['#dcfce7', '#4ade80', '#22c55e', '#15803d', '#166534'], direction: '180deg', category: 'green', tier: 'premium' },
  { id: 'tea-garden', name: 'Vườn trà', nameEn: 'Tea Garden', colors: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac'], direction: '135deg', category: 'green', tier: 'pro' },
  { id: 'eucalyptus', name: 'Bạch đàn', nameEn: 'Eucalyptus', colors: ['#ecfdf5', '#a7f3d0', '#6ee7b7'], direction: '135deg', category: 'green', tier: 'free' },
  { id: 'fern-forest', name: 'Rừng dương xỉ', nameEn: 'Fern Forest', colors: ['#f0fdf4', '#86efac', '#4ade80', '#22c55e'], direction: '180deg', category: 'green', tier: 'pro' },
  { id: 'olive-branch', name: 'Cành ô liu', nameEn: 'Olive Branch', colors: ['#fefce8', '#ecfdf5', '#d1fae5'], direction: '135deg', category: 'green', tier: 'free' },
  { id: 'moss-garden', name: 'Vườn rêu', nameEn: 'Moss Garden', colors: ['#f7fee7', '#d9f99d', '#a3e635'], direction: '135deg', category: 'green', tier: 'pro' },
  { id: 'rainforest', name: 'Rừng mưa', nameEn: 'Rainforest', colors: ['#ecfdf5', '#34d399', '#10b981', '#047857', '#065f46'], direction: '180deg', category: 'green', tier: 'premium' },
];

// ============================================
// ☀️ GOLD & AMBER (12 gradients)
// ============================================
const GOLD_AMBER: GradientPreset[] = [
  { id: 'honey-gold', name: 'Vàng mật ong', nameEn: 'Honey Gold', colors: ['#fffbeb', '#fef3c7', '#fde68a'], direction: '135deg', category: 'gold', tier: 'free' },
  { id: 'champagne', name: 'Champagne', nameEn: 'Champagne', colors: ['#fefce8', '#fef9c3', '#fef08a'], direction: '135deg', category: 'gold', tier: 'free' },
  { id: 'warm-sand', name: 'Cát ấm', nameEn: 'Warm Sand', colors: ['#fffbeb', '#fef3c7', '#fed7aa'], direction: '135deg', category: 'gold', tier: 'free' },
  { id: 'amber-glow', name: 'Hổ phách', nameEn: 'Amber Glow', colors: ['#fef3c7', '#fde68a', '#fcd34d'], direction: '180deg', category: 'gold', tier: 'free' },
  { id: 'golden-hour', name: 'Giờ vàng', nameEn: 'Golden Hour', colors: ['#fffbeb', '#fcd34d', '#f59e0b'], direction: '135deg', category: 'gold', tier: 'pro' },
  { id: 'sunflower', name: 'Hướng dương', nameEn: 'Sunflower', colors: ['#fefce8', '#fde047', '#facc15', '#eab308'], direction: '135deg', category: 'gold', tier: 'pro' },
  { id: 'caramel', name: 'Caramel', nameEn: 'Caramel', colors: ['#fffbeb', '#fcd34d', '#f59e0b', '#d97706'], direction: '180deg', category: 'gold', tier: 'pro' },
  { id: 'liquid-gold', name: 'Vàng lỏng', nameEn: 'Liquid Gold', colors: ['#fef3c7', '#fbbf24', '#f59e0b', '#d97706'], direction: '135deg', category: 'gold', tier: 'premium' },
  { id: 'marigold', name: 'Cúc vạn thọ', nameEn: 'Marigold', colors: ['#fefce8', '#fde68a', '#fbbf24'], direction: '135deg', category: 'gold', tier: 'pro' },
  { id: 'tuscan-sun', name: 'Mặt trời Tuscan', nameEn: 'Tuscan Sun', colors: ['#fffbeb', '#fcd34d', '#f59e0b', '#b45309'], direction: '135deg', category: 'gold', tier: 'premium' },
  { id: 'wheat-field', name: 'Cánh đồng lúa mì', nameEn: 'Wheat Field', colors: ['#fefce8', '#fef9c3', '#fde68a', '#fcd34d'], direction: '180deg', category: 'gold', tier: 'pro' },
  { id: 'bronze-shimmer', name: 'Đồng lấp lánh', nameEn: 'Bronze Shimmer', colors: ['#fef3c7', '#f59e0b', '#d97706', '#92400e'], direction: '135deg', category: 'gold', tier: 'premium' },
];

// ============================================
// 🌈 RAINBOW & MULTI (12 gradients)
// ============================================
const RAINBOW_MULTI: GradientPreset[] = [
  { id: 'rainbow-soft', name: 'Cầu vồng nhẹ', nameEn: 'Soft Rainbow', colors: ['#fef3c7', '#fce7f3', '#ddd6fe', '#bae6fd'], direction: '135deg', category: 'rainbow', tier: 'free' },
  { id: 'aurora', name: 'Cực quang', nameEn: 'Aurora', colors: ['#ecfdf5', '#cffafe', '#ddd6fe', '#fce7f3'], direction: '120deg', category: 'rainbow', tier: 'free' },
  { id: 'unicorn', name: 'Kỳ lân', nameEn: 'Unicorn', colors: ['#fce7f3', '#e9d5ff', '#bae6fd', '#a7f3d0'], direction: '135deg', category: 'rainbow', tier: 'free' },
  { id: 'pastel-dream', name: 'Pastel mơ', nameEn: 'Pastel Dream', colors: ['#fff1f2', '#fdf4ff', '#f0f9ff', '#ecfdf5'], direction: '135deg', category: 'rainbow', tier: 'free' },
  { id: 'prism', name: 'Lăng kính', nameEn: 'Prism', colors: ['#fce7f3', '#e9d5ff', '#bae6fd', '#d1fae5', '#fef3c7'], direction: '180deg', category: 'rainbow', tier: 'pro' },
  { id: 'holographic', name: 'Holographic', nameEn: 'Holographic', colors: ['#fce7f3', '#ddd6fe', '#bae6fd', '#a7f3d0', '#fef3c7', '#fecdd3'], direction: '135deg', category: 'rainbow', tier: 'pro' },
  { id: 'northern-lights', name: 'Bắc cực quang', nameEn: 'Northern Lights', colors: ['#22d3ee', '#a78bfa', '#f472b6', '#fb7185'], direction: '135deg', category: 'rainbow', tier: 'premium' },
  { id: 'candy-shop', name: 'Tiệm kẹo', nameEn: 'Candy Shop', colors: ['#fda4af', '#f9a8d4', '#d8b4fe', '#a5b4fc'], direction: '135deg', category: 'rainbow', tier: 'pro' },
  { id: 'fairy-dust', name: 'Bụi tiên', nameEn: 'Fairy Dust', colors: ['#fbcfe8', '#e9d5ff', '#c4b5fd', '#a5b4fc', '#93c5fd'], direction: '180deg', category: 'rainbow', tier: 'pro' },
  { id: 'dreamscape', name: 'Cảnh mơ', nameEn: 'Dreamscape', colors: ['#fdf2f8', '#ede9fe', '#e0f2fe', '#d1fae5', '#fef9c3'], direction: '135deg', category: 'rainbow', tier: 'pro' },
  { id: 'opal', name: 'Ngọc mắt mèo', nameEn: 'Opal', colors: ['#fff1f2', '#fce7f3', '#e9d5ff', '#bae6fd', '#a7f3d0'], direction: '45deg', category: 'rainbow', tier: 'premium' },
  { id: 'galaxy-swirl', name: 'Xoáy thiên hà', nameEn: 'Galaxy Swirl', colors: ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'], direction: '135deg', category: 'rainbow', tier: 'premium' },
];

// ============================================
// 🎀 VINTAGE & CLASSIC (12 gradients)
// ============================================
const VINTAGE_CLASSIC: GradientPreset[] = [
  { id: 'vintage-cream', name: 'Kem vintage', nameEn: 'Vintage Cream', colors: ['#fefce8', '#fef7ed', '#fef2f2'], direction: '135deg', category: 'vintage', tier: 'free' },
  { id: 'antique-rose', name: 'Hồng cổ điển', nameEn: 'Antique Rose', colors: ['#fef2f2', '#fce7f3', '#fdf4ff'], direction: '135deg', category: 'vintage', tier: 'free' },
  { id: 'ivory-blush', name: 'Ngà hồng', nameEn: 'Ivory Blush', colors: ['#fffbf5', '#fff1f2', '#fce7f3'], direction: '180deg', category: 'vintage', tier: 'free' },
  { id: 'parchment', name: 'Da thuộc', nameEn: 'Parchment', colors: ['#fefce8', '#fef3c7', '#fed7aa'], direction: '135deg', category: 'vintage', tier: 'free' },
  { id: 'sepia-tone', name: 'Nâu sepia', nameEn: 'Sepia Tone', colors: ['#fffbeb', '#fcd34d', '#d97706', '#92400e'], direction: '180deg', category: 'vintage', tier: 'pro' },
  { id: 'aged-paper', name: 'Giấy cũ', nameEn: 'Aged Paper', colors: ['#fefce8', '#fde68a', '#fcd34d'], direction: '135deg', category: 'vintage', tier: 'pro' },
  { id: 'old-lace', name: 'Ren cổ', nameEn: 'Old Lace', colors: ['#fffbf5', '#fef7ed', '#fef3c7'], direction: '135deg', category: 'vintage', tier: 'free' },
  { id: 'victorian', name: 'Phong cách Victoria', nameEn: 'Victorian', colors: ['#fdf4ff', '#ede9fe', '#fce7f3', '#fef7ed'], direction: '135deg', category: 'vintage', tier: 'pro' },
  { id: 'renaissance', name: 'Phục hưng', nameEn: 'Renaissance', colors: ['#fffbeb', '#fcd34d', '#b45309', '#78350f'], direction: '180deg', category: 'vintage', tier: 'premium' },
  { id: 'baroque', name: 'Baroque', nameEn: 'Baroque', colors: ['#fef7ed', '#fcd34d', '#b45309'], direction: '135deg', category: 'vintage', tier: 'premium' },
  { id: 'art-deco', name: 'Art Deco', nameEn: 'Art Deco', colors: ['#fefce8', '#fbbf24', '#d97706'], direction: '135deg', category: 'vintage', tier: 'pro' },
  { id: 'retro-warm', name: 'Retro ấm', nameEn: 'Retro Warm', colors: ['#fff7ed', '#fed7aa', '#fdba74', '#fb923c'], direction: '180deg', category: 'vintage', tier: 'pro' },
];

// ============================================
// ⬜ NEUTRAL & MINIMAL (12 gradients)
// ============================================
const NEUTRAL_MINIMAL: GradientPreset[] = [
  { id: 'pure-white', name: 'Trắng tinh', nameEn: 'Pure White', colors: ['#ffffff', '#fafafa', '#f5f5f5'], direction: '180deg', category: 'neutral', tier: 'free' },
  { id: 'soft-gray', name: 'Xám nhẹ', nameEn: 'Soft Gray', colors: ['#fafafa', '#f5f5f5', '#e5e5e5'], direction: '180deg', category: 'neutral', tier: 'free' },
  { id: 'cream-white', name: 'Trắng kem', nameEn: 'Cream White', colors: ['#fffbf5', '#fefce8', '#fef7ed'], direction: '180deg', category: 'neutral', tier: 'free' },
  { id: 'snow', name: 'Tuyết', nameEn: 'Snow', colors: ['#ffffff', '#f0f9ff', '#ecfeff'], direction: '135deg', category: 'neutral', tier: 'free' },
  { id: 'silver-mist', name: 'Sương bạc', nameEn: 'Silver Mist', colors: ['#f8fafc', '#f1f5f9', '#e2e8f0'], direction: '135deg', category: 'neutral', tier: 'pro' },
  { id: 'pearl', name: 'Ngọc trai', nameEn: 'Pearl', colors: ['#ffffff', '#faf5ff', '#f5f3ff'], direction: '180deg', category: 'neutral', tier: 'pro' },
  { id: 'platinum', name: 'Bạch kim', nameEn: 'Platinum', colors: ['#f8fafc', '#e2e8f0', '#cbd5e1'], direction: '135deg', category: 'neutral', tier: 'pro' },
  { id: 'moonlight', name: 'Ánh trăng', nameEn: 'Moonlight', colors: ['#ffffff', '#f1f5f9', '#e0f2fe'], direction: '180deg', category: 'neutral', tier: 'pro' },
  { id: 'morning-fog', name: 'Sương sớm', nameEn: 'Morning Fog', colors: ['#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1'], direction: '135deg', category: 'neutral', tier: 'pro' },
  { id: 'charcoal-silk', name: 'Lụa than', nameEn: 'Charcoal Silk', colors: ['#f8fafc', '#94a3b8', '#64748b', '#475569'], direction: '180deg', category: 'neutral', tier: 'premium' },
  { id: 'elegant-gray', name: 'Xám sang trọng', nameEn: 'Elegant Gray', colors: ['#f1f5f9', '#cbd5e1', '#94a3b8'], direction: '135deg', category: 'neutral', tier: 'premium' },
  { id: 'minimalist', name: 'Tối giản', nameEn: 'Minimalist', colors: ['#ffffff', '#f8fafc', '#f1f5f9'], direction: '180deg', category: 'neutral', tier: 'free' },
];

// ============================================
// 🌺 EXOTIC & TROPICAL (12 gradients)
// ============================================
const EXOTIC_TROPICAL: GradientPreset[] = [
  { id: 'hibiscus', name: 'Hoa dâm bụt', nameEn: 'Hibiscus', colors: ['#fce7f3', '#f472b6', '#ec4899', '#be185d'], direction: '135deg', category: 'exotic', tier: 'pro' },
  { id: 'tropical-paradise', name: 'Thiên đường nhiệt đới', nameEn: 'Tropical Paradise', colors: ['#ecfdf5', '#6ee7b7', '#22d3ee', '#a855f7'], direction: '135deg', category: 'exotic', tier: 'premium' },
  { id: 'bird-of-paradise', name: 'Chim thiên đường', nameEn: 'Bird of Paradise', colors: ['#fef3c7', '#fb923c', '#f472b6', '#a855f7'], direction: '135deg', category: 'exotic', tier: 'premium' },
  { id: 'orchid-bloom', name: 'Lan nở', nameEn: 'Orchid Bloom', colors: ['#fdf4ff', '#f0abfc', '#e879f9', '#c026d3'], direction: '180deg', category: 'exotic', tier: 'pro' },
  { id: 'lagoon', name: 'Đầm phá', nameEn: 'Lagoon', colors: ['#ecfeff', '#22d3ee', '#06b6d4', '#0891b2'], direction: '135deg', category: 'exotic', tier: 'pro' },
  { id: 'bougainvillea', name: 'Hoa giấy', nameEn: 'Bougainvillea', colors: ['#fce7f3', '#f472b6', '#db2777', '#9d174d'], direction: '135deg', category: 'exotic', tier: 'premium' },
  { id: 'passion-fruit', name: 'Chanh dây', nameEn: 'Passion Fruit', colors: ['#fef3c7', '#fb923c', '#ea580c', '#9a3412'], direction: '180deg', category: 'exotic', tier: 'pro' },
  { id: 'jungle-fever', name: 'Sốt rừng xanh', nameEn: 'Jungle Fever', colors: ['#d1fae5', '#4ade80', '#22c55e', '#15803d'], direction: '135deg', category: 'exotic', tier: 'pro' },
  { id: 'maldives', name: 'Maldives', nameEn: 'Maldives', colors: ['#ecfeff', '#67e8f9', '#22d3ee', '#0ea5e9', '#0284c7'], direction: '180deg', category: 'exotic', tier: 'premium' },
  { id: 'plumeria', name: 'Hoa sứ', nameEn: 'Plumeria', colors: ['#fff7ed', '#fef3c7', '#fef08a', '#fcd34d'], direction: '135deg', category: 'exotic', tier: 'pro' },
  { id: 'papaya', name: 'Đu đủ', nameEn: 'Papaya', colors: ['#fff7ed', '#fdba74', '#fb923c', '#ea580c'], direction: '135deg', category: 'exotic', tier: 'pro' },
  { id: 'coral-island', name: 'Đảo san hô', nameEn: 'Coral Island', colors: ['#fff1f2', '#fda4af', '#fb7185', '#f43f5e'], direction: '180deg', category: 'exotic', tier: 'premium' },
];

// ============================================
// 🌙 NIGHT & DARK (10 gradients)
// ============================================
const NIGHT_DARK: GradientPreset[] = [
  { id: 'starry-night', name: 'Đêm sao', nameEn: 'Starry Night', colors: ['#1e3a5f', '#0f172a', '#020617'], direction: '180deg', category: 'night', tier: 'premium' },
  { id: 'midnight-bloom', name: 'Hoa nửa đêm', nameEn: 'Midnight Bloom', colors: ['#4c1d95', '#1e1b4b', '#0f0f23'], direction: '135deg', category: 'night', tier: 'premium' },
  { id: 'cosmic-dust', name: 'Bụi vũ trụ', nameEn: 'Cosmic Dust', colors: ['#581c87', '#3b0764', '#1e1b4b', '#0f172a'], direction: '180deg', category: 'night', tier: 'premium' },
  { id: 'nebula', name: 'Tinh vân', nameEn: 'Nebula', colors: ['#6366f1', '#8b5cf6', '#a855f7', '#581c87'], direction: '135deg', category: 'night', tier: 'premium' },
  { id: 'deep-space', name: 'Không gian sâu', nameEn: 'Deep Space', colors: ['#1e3a8a', '#1e1b4b', '#0c0a1f'], direction: '180deg', category: 'night', tier: 'premium' },
  { id: 'aurora-borealis', name: 'Cực quang', nameEn: 'Aurora Borealis', colors: ['#22d3ee', '#6366f1', '#a855f7', '#1e3a5f'], direction: '135deg', category: 'night', tier: 'premium' },
  { id: 'twilight', name: 'Chạng vạng', nameEn: 'Twilight', colors: ['#fce7f3', '#c026d3', '#6d28d9', '#1e1b4b'], direction: '180deg', category: 'night', tier: 'premium' },
  { id: 'moonlit-garden', name: 'Vườn ánh trăng', nameEn: 'Moonlit Garden', colors: ['#e0f2fe', '#a5b4fc', '#6366f1', '#3730a3'], direction: '135deg', category: 'night', tier: 'premium' },
  { id: 'milky-way', name: 'Dải ngân hà', nameEn: 'Milky Way', colors: ['#e0e7ff', '#a5b4fc', '#6366f1', '#4338ca', '#1e1b4b'], direction: '180deg', category: 'night', tier: 'premium' },
  { id: 'eclipse', name: 'Nhật thực', nameEn: 'Eclipse', colors: ['#f97316', '#dc2626', '#7f1d1d', '#1c1917'], direction: '135deg', category: 'night', tier: 'premium' },
];

// ============================================
// 🎨 SPECIAL & ARTISTIC (10 gradients)
// ============================================
const SPECIAL_ARTISTIC: GradientPreset[] = [
  { id: 'monet-garden', name: 'Vườn Monet', nameEn: 'Monet Garden', colors: ['#dbeafe', '#bbf7d0', '#fef08a', '#fce7f3'], direction: '45deg', category: 'artistic', tier: 'premium' },
  { id: 'van-gogh-sky', name: 'Bầu trời Van Gogh', nameEn: 'Van Gogh Sky', colors: ['#fef3c7', '#60a5fa', '#1d4ed8', '#1e3a8a'], direction: '180deg', category: 'artistic', tier: 'premium' },
  { id: 'watercolor-wash', name: 'Màu nước loang', nameEn: 'Watercolor Wash', colors: ['#fce7f3', '#e0f2fe', '#d1fae5', '#fef9c3'], direction: '135deg', category: 'artistic', tier: 'pro' },
  { id: 'impressionist', name: 'Ấn tượng', nameEn: 'Impressionist', colors: ['#fef08a', '#a7f3d0', '#a5f3fc', '#e9d5ff', '#fecdd3'], direction: '90deg', category: 'artistic', tier: 'premium' },
  { id: 'abstract-dream', name: 'Trừu tượng mơ', nameEn: 'Abstract Dream', colors: ['#f472b6', '#a78bfa', '#38bdf8', '#4ade80'], direction: '135deg', category: 'artistic', tier: 'premium' },
  { id: 'pop-art', name: 'Pop Art', nameEn: 'Pop Art', colors: ['#facc15', '#f472b6', '#22d3ee', '#4ade80'], direction: '180deg', category: 'artistic', tier: 'pro' },
  { id: 'bohemian', name: 'Bohemian', nameEn: 'Bohemian', colors: ['#fef3c7', '#f472b6', '#a855f7', '#6366f1'], direction: '135deg', category: 'artistic', tier: 'pro' },
  { id: 'zen-garden', name: 'Vườn thiền', nameEn: 'Zen Garden', colors: ['#f5f5f4', '#d6d3d1', '#a8a29e', '#78716c'], direction: '180deg', category: 'artistic', tier: 'pro' },
  { id: 'wabi-sabi', name: 'Wabi-Sabi', nameEn: 'Wabi-Sabi', colors: ['#faf5f0', '#e7e5e4', '#d6d3d1', '#a8a29e'], direction: '135deg', category: 'artistic', tier: 'pro' },
  { id: 'neon-dreams', name: 'Giấc mơ neon', nameEn: 'Neon Dreams', colors: ['#f0abfc', '#818cf8', '#22d3ee', '#4ade80', '#facc15'], direction: '180deg', category: 'artistic', tier: 'premium' },
];

// ============================================
// EXPORT ALL GRADIENTS
// ============================================
export const GRADIENT_PRESETS: GradientPreset[] = [
  ...SUNSET_WARM,
  ...PINK_ROSE,
  ...PURPLE_LAVENDER,
  ...GREEN_NATURE,
  ...BLUE_TEAL,
  ...GOLD_AMBER,
  ...RAINBOW_MULTI,
  ...VINTAGE_CLASSIC,
  ...NEUTRAL_MINIMAL,
  ...EXOTIC_TROPICAL,
  ...NIGHT_DARK,
  ...SPECIAL_ARTISTIC,
];

// Categories for UI organization
export const GRADIENT_CATEGORIES = [
  { id: 'sunset', name: 'Hoàng hôn & Ấm áp', nameEn: 'Sunset & Warm', icon: '🌅' },
  { id: 'pink', name: 'Hồng & Hoa hồng', nameEn: 'Pink & Rose', icon: '🌸' },
  { id: 'purple', name: 'Tím & Oải hương', nameEn: 'Purple & Lavender', icon: '💜' },
  { id: 'blue', name: 'Xanh dương & Ngọc', nameEn: 'Blue & Teal', icon: '💙' },
  { id: 'green', name: 'Xanh lá & Thiên nhiên', nameEn: 'Green & Nature', icon: '🌿' },
  { id: 'gold', name: 'Vàng & Hổ phách', nameEn: 'Gold & Amber', icon: '☀️' },
  { id: 'rainbow', name: 'Cầu vồng & Đa sắc', nameEn: 'Rainbow & Multi', icon: '🌈' },
  { id: 'vintage', name: 'Vintage & Cổ điển', nameEn: 'Vintage & Classic', icon: '🎀' },
  { id: 'neutral', name: 'Trung tính & Tối giản', nameEn: 'Neutral & Minimal', icon: '⬜' },
  { id: 'exotic', name: 'Nhiệt đới & Lạ', nameEn: 'Exotic & Tropical', icon: '🌺' },
  { id: 'night', name: 'Đêm & Tối', nameEn: 'Night & Dark', icon: '🌙' },
  { id: 'artistic', name: 'Nghệ thuật & Đặc biệt', nameEn: 'Special & Artistic', icon: '🎨' },
];

/**
 * Helper function to create CSS gradient string from preset
 */
export function createGradientCSS(preset: GradientPreset): string {
  const stops = preset.colors.map((color, i) => {
    const percent = (i / (preset.colors.length - 1)) * 100;
    return `${color} ${percent}%`;
  }).join(', ');
  return `linear-gradient(${preset.direction}, ${stops})`;
}

/**
 * Get gradients by tier
 */
export function getGradientsByTier(tier: GradientTier): GradientPreset[] {
  return GRADIENT_PRESETS.filter(g => g.tier === tier);
}

/**
 * Get gradients by category
 */
export function getGradientsByCategory(category: string): GradientPreset[] {
  return GRADIENT_PRESETS.filter(g => g.category === category);
}

/**
 * Get free gradients only
 */
export function getFreeGradients(): GradientPreset[] {
  return GRADIENT_PRESETS.filter(g => g.tier === 'free');
}

/**
 * Check if user can access gradient based on tier
 */
export function canAccessGradient(gradient: GradientPreset, userTier: GradientTier): boolean {
  const tierOrder: GradientTier[] = ['free', 'pro', 'premium'];
  return tierOrder.indexOf(gradient.tier) <= tierOrder.indexOf(userTier);
}

