/**
 * ✅ GRADIENT PRESETS - 120+ mẫu gradient đẹp
 * Được phân loại theo phong cách và tier
 */

import { GradientPreset } from './types';

export const GRADIENT_PRESETS: GradientPreset[] = [
  // ═══════════════════════════════════════════════════════════════
  // 🌅 SUNSET & WARM (20 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'sunset-gold', name: 'Sunset Gold', nameVi: 'Hoàng hôn vàng', colors: ['#fef3c7', '#fce7f3', '#fdf2f8'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'peach-cream', name: 'Peach Cream', nameVi: 'Đào kem', colors: ['#fff1e6', '#ffe4e6', '#fdf2f8'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'golden-rose', name: 'Golden Rose', nameVi: 'Vàng hồng', colors: ['#fef9c3', '#fecdd3', '#fce7f3'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'warm-blush', name: 'Warm Blush', nameVi: 'Ấm áp', colors: ['#fef3c7', '#fda4af', '#fce7f3'], direction: '120deg', category: 'sunset', tier: 'free' },
  { id: 'coral-sunset', name: 'Coral Sunset', nameVi: 'San hô hoàng hôn', colors: ['#fed7aa', '#fecaca', '#fce7f3'], direction: '135deg', category: 'sunset', tier: 'free' },
  { id: 'amber-glow', name: 'Amber Glow', nameVi: 'Hổ phách', colors: ['#fef3c7', '#fde68a', '#fcd34d'], direction: '180deg', category: 'sunset', tier: 'free' },
  { id: 'california-sunset', name: 'California Sunset', nameVi: 'Hoàng hôn California', colors: ['#fbbf24', '#fb923c', '#f87171', '#c084fc'], direction: '135deg', category: 'sunset', tier: 'premium' },
  { id: 'sahara-dusk', name: 'Sahara Dusk', nameVi: 'Hoàng hôn Sahara', colors: ['#fde68a', '#fdba74', '#fb7185'], direction: '135deg', category: 'sunset', tier: 'premium' },
  { id: 'tropical-sunrise', name: 'Tropical Sunrise', nameVi: 'Bình minh nhiệt đới', colors: ['#fef08a', '#fda4af', '#c4b5fd'], direction: '120deg', category: 'sunset', tier: 'premium' },
  { id: 'mango-tango', name: 'Mango Tango', nameVi: 'Xoài sắc màu', colors: ['#fef3c7', '#fdba74', '#fb923c', '#fda4af'], direction: '135deg', category: 'sunset', tier: 'pro' },
  { id: 'desert-flame', name: 'Desert Flame', nameVi: 'Lửa sa mạc', colors: ['#fef9c3', '#fcd34d', '#f97316', '#dc2626'], direction: '135deg', category: 'sunset', tier: 'pro' },
  { id: 'autumn-blaze', name: 'Autumn Blaze', nameVi: 'Ngọn lửa thu', colors: ['#fef3c7', '#fbbf24', '#ea580c', '#b91c1c'], direction: '180deg', category: 'sunset', tier: 'pro' },
  { id: 'moroccan-spice', name: 'Moroccan Spice', nameVi: 'Gia vị Morocco', colors: ['#fde68a', '#f59e0b', '#dc2626', '#7c2d12'], direction: '135deg', category: 'sunset', tier: 'pro' },
  { id: 'fire-opal', name: 'Fire Opal', nameVi: 'Ngọc lửa', colors: ['#fffbeb', '#fcd34d', '#f97316', '#dc2626', '#7c2d12'], direction: '135deg', category: 'sunset', tier: 'exclusive' },
  { id: 'phoenix-rising', name: 'Phoenix Rising', nameVi: 'Phượng hoàng bay', colors: ['#fef08a', '#fb923c', '#ef4444', '#be123c', '#581c87'], direction: '135deg', category: 'sunset', tier: 'exclusive' },
  { id: 'honey-sunrise', name: 'Honey Sunrise', nameVi: 'Bình minh mật ong', colors: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d'], direction: '180deg', category: 'sunset', tier: 'free' },
  { id: 'apricot-dream', name: 'Apricot Dream', nameVi: 'Mơ mận hồng', colors: ['#fff7ed', '#fed7aa', '#fdba74', '#fb923c'], direction: '135deg', category: 'sunset', tier: 'premium' },
  { id: 'tangerine-fizz', name: 'Tangerine Fizz', nameVi: 'Quýt sủi bọt', colors: ['#fff7ed', '#fdba74', '#f97316'], direction: '135deg', category: 'sunset', tier: 'premium' },
  { id: 'papaya-whip', name: 'Papaya Whip', nameVi: 'Đu đủ kem', colors: ['#fef3c7', '#fde68a', '#fdba74', '#fda4af'], direction: '120deg', category: 'sunset', tier: 'free' },
  { id: 'golden-hour', name: 'Golden Hour', nameVi: 'Giờ vàng', colors: ['#fef9c3', '#fde68a', '#fbbf24', '#f59e0b'], direction: '135deg', category: 'sunset', tier: 'premium' },

  // ═══════════════════════════════════════════════════════════════
  // 🌸 ROMANTIC & ROSE (20 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'rose-garden', name: 'Rose Garden', nameVi: 'Vườn hồng', colors: ['#fce7f3', '#fbcfe8', '#f9a8d4'], direction: '135deg', category: 'romantic', tier: 'free' },
  { id: 'soft-pink', name: 'Soft Pink', nameVi: 'Hồng nhẹ', colors: ['#fff1f2', '#fce7f3', '#fdf4ff'], direction: '135deg', category: 'romantic', tier: 'free' },
  { id: 'cherry-blossom', name: 'Cherry Blossom', nameVi: 'Anh đào', colors: ['#fdf2f8', '#fbcfe8', '#fce7f3'], direction: '180deg', category: 'romantic', tier: 'free' },
  { id: 'cotton-candy', name: 'Cotton Candy', nameVi: 'Kẹo bông', colors: ['#fce7f3', '#e9d5ff', '#ddd6fe'], direction: '135deg', category: 'romantic', tier: 'free' },
  { id: 'ballet-slipper', name: 'Ballet Slipper', nameVi: 'Giày ballet', colors: ['#fff1f2', '#ffe4e6', '#fecdd3'], direction: '135deg', category: 'romantic', tier: 'free' },
  { id: 'rose-quartz', name: 'Rose Quartz', nameVi: 'Thạch anh hồng', colors: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4'], direction: '135deg', category: 'romantic', tier: 'premium' },
  { id: 'pink-champagne', name: 'Pink Champagne', nameVi: 'Champagne hồng', colors: ['#fef2f2', '#fce7f3', '#fde68a'], direction: '135deg', category: 'romantic', tier: 'premium' },
  { id: 'first-love', name: 'First Love', nameVi: 'Tình đầu', colors: ['#ffe4e6', '#fecdd3', '#fda4af', '#fb7185'], direction: '135deg', category: 'romantic', tier: 'premium' },
  { id: 'wedding-blush', name: 'Wedding Blush', nameVi: 'Hồng cưới', colors: ['#fffbeb', '#fff1f2', '#fce7f3'], direction: '180deg', category: 'romantic', tier: 'free' },
  { id: 'persian-rose', name: 'Persian Rose', nameVi: 'Hồng Ba Tư', colors: ['#fce7f3', '#f9a8d4', '#ec4899', '#be185d'], direction: '135deg', category: 'romantic', tier: 'pro' },
  { id: 'valentines-day', name: 'Valentine\'s Day', nameVi: 'Ngày Valentine', colors: ['#fecdd3', '#fb7185', '#e11d48', '#be123c'], direction: '135deg', category: 'romantic', tier: 'pro' },
  { id: 'dusty-rose', name: 'Dusty Rose', nameVi: 'Hồng phấn', colors: ['#fdf2f8', '#fce7f3', '#f5d0fe'], direction: '135deg', category: 'romantic', tier: 'free' },
  { id: 'peony-bloom', name: 'Peony Bloom', nameVi: 'Hoa mẫu đơn', colors: ['#fff1f2', '#fce7f3', '#fbcfe8', '#f0abfc'], direction: '120deg', category: 'romantic', tier: 'premium' },
  { id: 'blush-wine', name: 'Blush Wine', nameVi: 'Rượu hồng', colors: ['#fce7f3', '#f9a8d4', '#be185d', '#831843'], direction: '135deg', category: 'romantic', tier: 'pro' },
  { id: 'raspberry-cream', name: 'Raspberry Cream', nameVi: 'Mâm xôi kem', colors: ['#fdf2f8', '#f9a8d4', '#e879f9'], direction: '135deg', category: 'romantic', tier: 'premium' },
  { id: 'sakura-dream', name: 'Sakura Dream', nameVi: 'Giấc mơ Sakura', colors: ['#fff1f2', '#fce7f3', '#fbcfe8', '#fdf4ff'], direction: '180deg', category: 'romantic', tier: 'free' },
  { id: 'rouge-kiss', name: 'Rouge Kiss', nameVi: 'Nụ hôn son', colors: ['#fecdd3', '#fb7185', '#f43f5e'], direction: '135deg', category: 'romantic', tier: 'premium' },
  { id: 'pink-lemonade', name: 'Pink Lemonade', nameVi: 'Chanh hồng', colors: ['#fef9c3', '#fce7f3', '#fbcfe8'], direction: '135deg', category: 'romantic', tier: 'free' },
  { id: 'magnolia', name: 'Magnolia', nameVi: 'Hoa mộc lan', colors: ['#fefce8', '#fef7ed', '#fff1f2', '#fce7f3'], direction: '135deg', category: 'romantic', tier: 'premium' },
  { id: 'bougainvillea', name: 'Bougainvillea', nameVi: 'Hoa giấy', colors: ['#f9a8d4', '#e879f9', '#c026d3', '#a21caf'], direction: '135deg', category: 'romantic', tier: 'pro' },

  // ═══════════════════════════════════════════════════════════════
  // 💜 PURPLE & LAVENDER (18 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'lavender-mist', name: 'Lavender Mist', nameVi: 'Oải hương', colors: ['#f5f3ff', '#ede9fe', '#ddd6fe'], direction: '135deg', category: 'elegant', tier: 'free' },
  { id: 'purple-dream', name: 'Purple Dream', nameVi: 'Tím mộng mơ', colors: ['#fdf4ff', '#f5f3ff', '#ede9fe'], direction: '135deg', category: 'elegant', tier: 'free' },
  { id: 'violet-pink', name: 'Violet Pink', nameVi: 'Tím hồng', colors: ['#f5f3ff', '#fce7f3', '#fbcfe8'], direction: '120deg', category: 'elegant', tier: 'free' },
  { id: 'mystic-purple', name: 'Mystic Purple', nameVi: 'Tím huyền bí', colors: ['#ede9fe', '#e9d5ff', '#f3e8ff'], direction: '135deg', category: 'elegant', tier: 'free' },
  { id: 'wisteria', name: 'Wisteria', nameVi: 'Tử đằng', colors: ['#f5f3ff', '#ddd6fe', '#c4b5fd'], direction: '135deg', category: 'elegant', tier: 'free' },
  { id: 'grape-soda', name: 'Grape Soda', nameVi: 'Nho soda', colors: ['#ede9fe', '#c4b5fd', '#a78bfa', '#8b5cf6'], direction: '135deg', category: 'elegant', tier: 'premium' },
  { id: 'amethyst', name: 'Amethyst', nameVi: 'Thạch anh tím', colors: ['#f5f3ff', '#ddd6fe', '#a78bfa', '#7c3aed'], direction: '135deg', category: 'elegant', tier: 'premium' },
  { id: 'royal-purple', name: 'Royal Purple', nameVi: 'Tím hoàng gia', colors: ['#c4b5fd', '#8b5cf6', '#6d28d9', '#4c1d95'], direction: '135deg', category: 'elegant', tier: 'pro' },
  { id: 'plum-velvet', name: 'Plum Velvet', nameVi: 'Mận nhung', colors: ['#f3e8ff', '#d8b4fe', '#a855f7', '#7e22ce'], direction: '135deg', category: 'elegant', tier: 'pro' },
  { id: 'iris-bloom', name: 'Iris Bloom', nameVi: 'Hoa diên vĩ', colors: ['#ede9fe', '#c4b5fd', '#8b5cf6', '#6d28d9'], direction: '180deg', category: 'elegant', tier: 'premium' },
  { id: 'lilac-breeze', name: 'Lilac Breeze', nameVi: 'Gió tử đinh hương', colors: ['#fdf4ff', '#f3e8ff', '#e9d5ff'], direction: '135deg', category: 'elegant', tier: 'free' },
  { id: 'violet-dusk', name: 'Violet Dusk', nameVi: 'Tím hoàng hôn', colors: ['#fce7f3', '#e9d5ff', '#c4b5fd', '#a78bfa'], direction: '135deg', category: 'elegant', tier: 'premium' },
  { id: 'orchid-mist', name: 'Orchid Mist', nameVi: 'Sương lan', colors: ['#fdf4ff', '#f0abfc', '#e879f9'], direction: '135deg', category: 'elegant', tier: 'premium' },
  { id: 'hyacinth', name: 'Hyacinth', nameVi: 'Hoa dạ lan', colors: ['#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6'], direction: '135deg', category: 'elegant', tier: 'pro' },
  { id: 'purple-haze', name: 'Purple Haze', nameVi: 'Sương tím', colors: ['#f5f3ff', '#ede9fe', '#a78bfa', '#7c3aed'], direction: '135deg', category: 'elegant', tier: 'premium' },
  { id: 'cosmic-purple', name: 'Cosmic Purple', nameVi: 'Vũ trụ tím', colors: ['#ddd6fe', '#a78bfa', '#7c3aed', '#4c1d95', '#1e1b4b'], direction: '135deg', category: 'elegant', tier: 'exclusive' },
  { id: 'mauve-magic', name: 'Mauve Magic', nameVi: 'Ma thuật hồng tím', colors: ['#fce7f3', '#f5d0fe', '#e9d5ff', '#ddd6fe'], direction: '120deg', category: 'elegant', tier: 'free' },
  { id: 'purple-rain', name: 'Purple Rain', nameVi: 'Mưa tím', colors: ['#c4b5fd', '#8b5cf6', '#6d28d9', '#5b21b6'], direction: '180deg', category: 'elegant', tier: 'pro' },

  // ═══════════════════════════════════════════════════════════════
  // 💙 OCEAN & BLUE (20 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'ocean-breeze', name: 'Ocean Breeze', nameVi: 'Gió biển', colors: ['#ecfeff', '#cffafe', '#a5f3fc'], direction: '135deg', category: 'ocean', tier: 'free' },
  { id: 'sky-blue', name: 'Sky Blue', nameVi: 'Xanh trời', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd'], direction: '180deg', category: 'ocean', tier: 'free' },
  { id: 'mint-ocean', name: 'Mint Ocean', nameVi: 'Bạc hà biển', colors: ['#ecfeff', '#d1fae5', '#a7f3d0'], direction: '135deg', category: 'ocean', tier: 'free' },
  { id: 'blue-purple', name: 'Blue Purple', nameVi: 'Xanh tím', colors: ['#e0f2fe', '#ede9fe', '#f5f3ff'], direction: '135deg', category: 'ocean', tier: 'free' },
  { id: 'arctic-ice', name: 'Arctic Ice', nameVi: 'Băng Bắc Cực', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc'], direction: '135deg', category: 'ocean', tier: 'free' },
  { id: 'caribbean-sea', name: 'Caribbean Sea', nameVi: 'Biển Caribbean', colors: ['#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4'], direction: '135deg', category: 'ocean', tier: 'premium' },
  { id: 'deep-ocean', name: 'Deep Ocean', nameVi: 'Đại dương sâu', colors: ['#bae6fd', '#38bdf8', '#0284c7', '#0369a1'], direction: '180deg', category: 'ocean', tier: 'premium' },
  { id: 'pacific-blue', name: 'Pacific Blue', nameVi: 'Xanh Thái Bình Dương', colors: ['#cffafe', '#22d3ee', '#0891b2', '#0e7490'], direction: '135deg', category: 'ocean', tier: 'premium' },
  { id: 'aegean-sea', name: 'Aegean Sea', nameVi: 'Biển Aegean', colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#0284c7'], direction: '135deg', category: 'ocean', tier: 'premium' },
  { id: 'midnight-blue', name: 'Midnight Blue', nameVi: 'Xanh nửa đêm', colors: ['#bae6fd', '#3b82f6', '#1d4ed8', '#1e3a8a'], direction: '135deg', category: 'ocean', tier: 'pro' },
  { id: 'navy-royal', name: 'Navy Royal', nameVi: 'Xanh hải quân', colors: ['#dbeafe', '#60a5fa', '#2563eb', '#1e40af'], direction: '135deg', category: 'ocean', tier: 'pro' },
  { id: 'sapphire', name: 'Sapphire', nameVi: 'Ngọc bích xanh', colors: ['#bfdbfe', '#3b82f6', '#1d4ed8', '#1e3a8a', '#172554'], direction: '135deg', category: 'ocean', tier: 'exclusive' },
  { id: 'coral-reef', name: 'Coral Reef', nameVi: 'Rạn san hô', colors: ['#a5f3fc', '#67e8f9', '#06b6d4', '#fda4af'], direction: '120deg', category: 'ocean', tier: 'premium' },
  { id: 'maldives', name: 'Maldives', nameVi: 'Maldives', colors: ['#ecfeff', '#a5f3fc', '#22d3ee', '#14b8a6'], direction: '135deg', category: 'ocean', tier: 'premium' },
  { id: 'azure-coast', name: 'Azure Coast', nameVi: 'Bờ biển xanh', colors: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7'], direction: '135deg', category: 'ocean', tier: 'free' },
  { id: 'frozen-lake', name: 'Frozen Lake', nameVi: 'Hồ đóng băng', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#93c5fd'], direction: '180deg', category: 'ocean', tier: 'free' },
  { id: 'aquamarine', name: 'Aquamarine', nameVi: 'Ngọc biển', colors: ['#ecfeff', '#a5f3fc', '#2dd4bf', '#14b8a6'], direction: '135deg', category: 'ocean', tier: 'premium' },
  { id: 'deep-dive', name: 'Deep Dive', nameVi: 'Lặn sâu', colors: ['#38bdf8', '#0284c7', '#0369a1', '#075985', '#0c4a6e'], direction: '180deg', category: 'ocean', tier: 'pro' },
  { id: 'blue-lagoon', name: 'Blue Lagoon', nameVi: 'Đầm xanh', colors: ['#a5f3fc', '#67e8f9', '#22d3ee', '#2dd4bf'], direction: '135deg', category: 'ocean', tier: 'premium' },
  { id: 'ice-crystal', name: 'Ice Crystal', nameVi: 'Tinh thể băng', colors: ['#ffffff', '#f0f9ff', '#e0f2fe', '#bae6fd'], direction: '135deg', category: 'ocean', tier: 'free' },

  // ═══════════════════════════════════════════════════════════════
  // 🌿 NATURE & GREEN (18 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'spring-meadow', name: 'Spring Meadow', nameVi: 'Đồng cỏ xuân', colors: ['#ecfdf5', '#d1fae5', '#a7f3d0'], direction: '135deg', category: 'nature', tier: 'free' },
  { id: 'mint-fresh', name: 'Mint Fresh', nameVi: 'Bạc hà tươi', colors: ['#f0fdf4', '#dcfce7', '#bbf7d0'], direction: '135deg', category: 'nature', tier: 'free' },
  { id: 'sage-calm', name: 'Sage Calm', nameVi: 'Xanh xô thơm', colors: ['#f0fdf4', '#ecfdf5', '#d1fae5'], direction: '180deg', category: 'nature', tier: 'free' },
  { id: 'forest-mist', name: 'Forest Mist', nameVi: 'Sương rừng', colors: ['#ecfdf5', '#f0f9ff', '#e0f2fe'], direction: '135deg', category: 'nature', tier: 'free' },
  { id: 'emerald', name: 'Emerald', nameVi: 'Ngọc lục bảo', colors: ['#d1fae5', '#6ee7b7', '#34d399', '#10b981'], direction: '135deg', category: 'nature', tier: 'premium' },
  { id: 'jade-garden', name: 'Jade Garden', nameVi: 'Vườn ngọc', colors: ['#ecfdf5', '#a7f3d0', '#4ade80', '#22c55e'], direction: '135deg', category: 'nature', tier: 'premium' },
  { id: 'bamboo-forest', name: 'Bamboo Forest', nameVi: 'Rừng tre', colors: ['#f0fdf4', '#bbf7d0', '#86efac', '#4ade80'], direction: '180deg', category: 'nature', tier: 'premium' },
  { id: 'tropical-jungle', name: 'Tropical Jungle', nameVi: 'Rừng nhiệt đới', colors: ['#a7f3d0', '#4ade80', '#16a34a', '#166534'], direction: '135deg', category: 'nature', tier: 'pro' },
  { id: 'olive-grove', name: 'Olive Grove', nameVi: 'Vườn ô liu', colors: ['#d9f99d', '#bef264', '#a3e635', '#84cc16'], direction: '135deg', category: 'nature', tier: 'premium' },
  { id: 'eucalyptus', name: 'Eucalyptus', nameVi: 'Bạch đàn', colors: ['#ecfdf5', '#ccfbf1', '#99f6e4', '#5eead4'], direction: '135deg', category: 'nature', tier: 'free' },
  { id: 'rainforest', name: 'Rainforest', nameVi: 'Rừng mưa', colors: ['#86efac', '#22c55e', '#15803d', '#166534', '#14532d'], direction: '180deg', category: 'nature', tier: 'pro' },
  { id: 'moss-green', name: 'Moss Green', nameVi: 'Rêu xanh', colors: ['#d9f99d', '#bef264', '#84cc16', '#65a30d'], direction: '135deg', category: 'nature', tier: 'premium' },
  { id: 'fern-glade', name: 'Fern Glade', nameVi: 'Thung lũng dương xỉ', colors: ['#ecfdf5', '#d1fae5', '#6ee7b7', '#34d399'], direction: '135deg', category: 'nature', tier: 'free' },
  { id: 'spring-blossom', name: 'Spring Blossom', nameVi: 'Hoa xuân', colors: ['#dcfce7', '#bbf7d0', '#fbcfe8', '#fce7f3'], direction: '120deg', category: 'nature', tier: 'premium' },
  { id: 'tea-garden', name: 'Tea Garden', nameVi: 'Vườn trà', colors: ['#f0fdf4', '#dcfce7', '#d9f99d', '#bef264'], direction: '135deg', category: 'nature', tier: 'free' },
  { id: 'pine-forest', name: 'Pine Forest', nameVi: 'Rừng thông', colors: ['#d1fae5', '#6ee7b7', '#059669', '#047857', '#065f46'], direction: '135deg', category: 'nature', tier: 'pro' },
  { id: 'botanical', name: 'Botanical', nameVi: 'Thực vật học', colors: ['#ecfdf5', '#ccfbf1', '#a7f3d0', '#86efac', '#4ade80'], direction: '135deg', category: 'nature', tier: 'premium' },
  { id: 'avocado', name: 'Avocado', nameVi: 'Bơ xanh', colors: ['#f0fdf4', '#d9f99d', '#a3e635', '#65a30d'], direction: '135deg', category: 'nature', tier: 'premium' },

  // ═══════════════════════════════════════════════════════════════
  // 🌈 PASTEL & SOFT (15 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'rainbow-soft', name: 'Rainbow Soft', nameVi: 'Cầu vồng nhẹ', colors: ['#fef3c7', '#fce7f3', '#ddd6fe', '#bae6fd'], direction: '135deg', category: 'pastel', tier: 'free' },
  { id: 'aurora', name: 'Aurora', nameVi: 'Cực quang', colors: ['#ecfdf5', '#cffafe', '#ddd6fe', '#fce7f3'], direction: '120deg', category: 'pastel', tier: 'free' },
  { id: 'unicorn', name: 'Unicorn', nameVi: 'Kỳ lân', colors: ['#fce7f3', '#e9d5ff', '#bae6fd', '#a7f3d0'], direction: '135deg', category: 'pastel', tier: 'free' },
  { id: 'pastel-dream', name: 'Pastel Dream', nameVi: 'Pastel mơ', colors: ['#fff1f2', '#fdf4ff', '#f0f9ff', '#ecfdf5'], direction: '135deg', category: 'pastel', tier: 'free' },
  { id: 'candy-shop', name: 'Candy Shop', nameVi: 'Tiệm kẹo', colors: ['#fce7f3', '#fbcfe8', '#ddd6fe', '#c4b5fd', '#a5f3fc'], direction: '90deg', category: 'pastel', tier: 'premium' },
  { id: 'easter-egg', name: 'Easter Egg', nameVi: 'Trứng Phục sinh', colors: ['#fef08a', '#fce7f3', '#ddd6fe', '#a5f3fc', '#bbf7d0'], direction: '135deg', category: 'pastel', tier: 'premium' },
  { id: 'cotton-cloud', name: 'Cotton Cloud', nameVi: 'Mây bông', colors: ['#fdf4ff', '#fce7f3', '#f0f9ff', '#f5f3ff'], direction: '180deg', category: 'pastel', tier: 'free' },
  { id: 'bubblegum', name: 'Bubblegum', nameVi: 'Kẹo cao su', colors: ['#fbcfe8', '#f9a8d4', '#c4b5fd', '#a78bfa'], direction: '135deg', category: 'pastel', tier: 'premium' },
  { id: 'fairy-dust', name: 'Fairy Dust', nameVi: 'Bụi tiên', colors: ['#fce7f3', '#e9d5ff', '#c4b5fd', '#fde68a'], direction: '120deg', category: 'pastel', tier: 'premium' },
  { id: 'ice-cream', name: 'Ice Cream', nameVi: 'Kem que', colors: ['#fde68a', '#fce7f3', '#a5f3fc', '#bbf7d0'], direction: '135deg', category: 'pastel', tier: 'free' },
  { id: 'rainbow-sherbet', name: 'Rainbow Sherbet', nameVi: 'Kem cầu vồng', colors: ['#fef08a', '#fdba74', '#fda4af', '#c4b5fd', '#67e8f9'], direction: '90deg', category: 'pastel', tier: 'pro' },
  { id: 'baby-shower', name: 'Baby Shower', nameVi: 'Tiệc trẻ nhỏ', colors: ['#fff1f2', '#fce7f3', '#e0f2fe', '#ecfdf5'], direction: '135deg', category: 'pastel', tier: 'free' },
  { id: 'dreamy-clouds', name: 'Dreamy Clouds', nameVi: 'Mây mơ màng', colors: ['#f5f3ff', '#fce7f3', '#e0f2fe', '#f0fdf4'], direction: '135deg', category: 'pastel', tier: 'free' },
  { id: 'holographic', name: 'Holographic', nameVi: 'Holographic', colors: ['#fce7f3', '#c4b5fd', '#67e8f9', '#bbf7d0', '#fde68a', '#fda4af'], direction: '135deg', category: 'pastel', tier: 'pro' },
  { id: 'opalescent', name: 'Opalescent', nameVi: 'Ngọc trai', colors: ['#fff1f2', '#f5f3ff', '#e0f2fe', '#ecfdf5', '#fefce8'], direction: '120deg', category: 'pastel', tier: 'premium' },

  // ═══════════════════════════════════════════════════════════════
  // ✨ METALLIC & LUXURY (12 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'rose-gold', name: 'Rose Gold', nameVi: 'Vàng hồng', colors: ['#fdf2f8', '#e4a0aa', '#b97a84', '#8b5a5a'], direction: '135deg', category: 'metallic', tier: 'premium' },
  { id: 'champagne-gold', name: 'Champagne Gold', nameVi: 'Vàng champagne', colors: ['#fefce8', '#fef3c7', '#d4a574', '#b8860b'], direction: '135deg', category: 'metallic', tier: 'premium' },
  { id: 'silver-chrome', name: 'Silver Chrome', nameVi: 'Bạc chrome', colors: ['#f8fafc', '#e2e8f0', '#94a3b8', '#64748b'], direction: '135deg', category: 'metallic', tier: 'premium' },
  { id: 'bronze-age', name: 'Bronze Age', nameVi: 'Đồng cổ', colors: ['#fef7ed', '#d4a574', '#b87333', '#8b4513'], direction: '135deg', category: 'metallic', tier: 'pro' },
  { id: 'platinum', name: 'Platinum', nameVi: 'Bạch kim', colors: ['#f8fafc', '#f1f5f9', '#cbd5e1', '#94a3b8'], direction: '180deg', category: 'metallic', tier: 'pro' },
  { id: 'copper-penny', name: 'Copper Penny', nameVi: 'Xu đồng', colors: ['#fef7ed', '#fed7aa', '#f97316', '#c2410c'], direction: '135deg', category: 'metallic', tier: 'premium' },
  { id: 'gold-rush', name: 'Gold Rush', nameVi: 'Cơn sốt vàng', colors: ['#fef3c7', '#fcd34d', '#f59e0b', '#b45309'], direction: '135deg', category: 'metallic', tier: 'pro' },
  { id: 'diamond', name: 'Diamond', nameVi: 'Kim cương', colors: ['#ffffff', '#f8fafc', '#e2e8f0', '#cbd5e1', '#94a3b8'], direction: '135deg', category: 'metallic', tier: 'exclusive' },
  { id: 'black-gold', name: 'Black Gold', nameVi: 'Vàng đen', colors: ['#fef3c7', '#d4a574', '#78350f', '#1c1917'], direction: '135deg', category: 'metallic', tier: 'exclusive' },
  { id: 'steel-grey', name: 'Steel Grey', nameVi: 'Xám thép', colors: ['#f1f5f9', '#cbd5e1', '#64748b', '#475569'], direction: '180deg', category: 'metallic', tier: 'premium' },
  { id: 'mercury', name: 'Mercury', nameVi: 'Thủy ngân', colors: ['#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#1e293b'], direction: '135deg', category: 'metallic', tier: 'pro' },
  { id: 'titanium', name: 'Titanium', nameVi: 'Titan', colors: ['#f1f5f9', '#e2e8f0', '#94a3b8', '#64748b'], direction: '135deg', category: 'metallic', tier: 'premium' },

  // ═══════════════════════════════════════════════════════════════
  // 🎄 SEASONAL & FESTIVE (15 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'christmas-classic', name: 'Christmas Classic', nameVi: 'Giáng sinh cổ điển', colors: ['#dc2626', '#fef3c7', '#16a34a'], direction: '135deg', category: 'seasonal', tier: 'free' },
  { id: 'winter-wonderland', name: 'Winter Wonderland', nameVi: 'Xứ sở mùa đông', colors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#ffffff'], direction: '135deg', category: 'seasonal', tier: 'free' },
  { id: 'spring-bloom', name: 'Spring Bloom', nameVi: 'Mùa xuân nở hoa', colors: ['#fce7f3', '#bbf7d0', '#fef08a'], direction: '135deg', category: 'seasonal', tier: 'free' },
  { id: 'summer-vibes', name: 'Summer Vibes', nameVi: 'Hè sôi động', colors: ['#fef08a', '#fdba74', '#fb7185', '#a5f3fc'], direction: '135deg', category: 'seasonal', tier: 'free' },
  { id: 'autumn-leaves', name: 'Autumn Leaves', nameVi: 'Lá mùa thu', colors: ['#fef3c7', '#fdba74', '#f97316', '#dc2626'], direction: '135deg', category: 'seasonal', tier: 'free' },
  { id: 'halloween', name: 'Halloween', nameVi: 'Halloween', colors: ['#fb923c', '#f97316', '#1c1917', '#7c2d12'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'new-year-gold', name: 'New Year Gold', nameVi: 'Năm mới vàng', colors: ['#1c1917', '#fef3c7', '#fbbf24', '#f59e0b'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'lunar-new-year', name: 'Lunar New Year', nameVi: 'Tết Nguyên đán', colors: ['#dc2626', '#fef3c7', '#fbbf24'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'easter-pastel', name: 'Easter Pastel', nameVi: 'Phục sinh pastel', colors: ['#fef08a', '#fce7f3', '#ddd6fe', '#bbf7d0'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'mothers-day', name: 'Mother\'s Day', nameVi: 'Ngày của mẹ', colors: ['#fce7f3', '#f9a8d4', '#f472b6'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'fathers-day', name: 'Father\'s Day', nameVi: 'Ngày của cha', colors: ['#dbeafe', '#3b82f6', '#1e40af'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'thanksgiving', name: 'Thanksgiving', nameVi: 'Lễ Tạ ơn', colors: ['#fef3c7', '#f59e0b', '#b45309', '#78350f'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'hanukkah', name: 'Hanukkah', nameVi: 'Lễ Hanukkah', colors: ['#dbeafe', '#3b82f6', '#ffffff', '#f59e0b'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'diwali', name: 'Diwali', nameVi: 'Lễ Diwali', colors: ['#fef3c7', '#f59e0b', '#ea580c', '#dc2626'], direction: '135deg', category: 'seasonal', tier: 'premium' },
  { id: 'mid-autumn', name: 'Mid-Autumn', nameVi: 'Trung thu', colors: ['#fef3c7', '#fbbf24', '#f97316', '#7c2d12'], direction: '135deg', category: 'seasonal', tier: 'premium' },

  // ═══════════════════════════════════════════════════════════════
  // ⬜ MINIMAL & CLEAN (12 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'pure-white', name: 'Pure White', nameVi: 'Trắng tinh', colors: ['#ffffff', '#fafafa', '#f5f5f5'], direction: '180deg', category: 'minimal', tier: 'free' },
  { id: 'soft-gray', name: 'Soft Gray', nameVi: 'Xám nhẹ', colors: ['#fafafa', '#f5f5f5', '#e5e5e5'], direction: '180deg', category: 'minimal', tier: 'free' },
  { id: 'cream-white', name: 'Cream White', nameVi: 'Trắng kem', colors: ['#fffbf5', '#fefce8', '#fef7ed'], direction: '180deg', category: 'minimal', tier: 'free' },
  { id: 'snow', name: 'Snow', nameVi: 'Tuyết', colors: ['#ffffff', '#f0f9ff', '#ecfeff'], direction: '135deg', category: 'minimal', tier: 'free' },
  { id: 'ivory', name: 'Ivory', nameVi: 'Ngà voi', colors: ['#fffbf5', '#fefce8', '#fef3c7'], direction: '135deg', category: 'minimal', tier: 'free' },
  { id: 'pearl', name: 'Pearl', nameVi: 'Ngọc trai', colors: ['#ffffff', '#f8fafc', '#f1f5f9'], direction: '180deg', category: 'minimal', tier: 'free' },
  { id: 'cloud-white', name: 'Cloud White', nameVi: 'Trắng mây', colors: ['#ffffff', '#f9fafb', '#f3f4f6'], direction: '180deg', category: 'minimal', tier: 'free' },
  { id: 'parchment', name: 'Parchment', nameVi: 'Giấy da', colors: ['#fefce8', '#fef3c7', '#fed7aa'], direction: '135deg', category: 'minimal', tier: 'free' },
  { id: 'antique-white', name: 'Antique White', nameVi: 'Trắng cổ điển', colors: ['#fffbf5', '#fef7ed', '#fff1e6'], direction: '180deg', category: 'minimal', tier: 'free' },
  { id: 'linen', name: 'Linen', nameVi: 'Vải lanh', colors: ['#fefce8', '#fef9c3', '#fef08a'], direction: '135deg', category: 'minimal', tier: 'free' },
  { id: 'ash-gray', name: 'Ash Gray', nameVi: 'Xám tro', colors: ['#f9fafb', '#f3f4f6', '#e5e7eb', '#d1d5db'], direction: '180deg', category: 'minimal', tier: 'premium' },
  { id: 'charcoal-fade', name: 'Charcoal Fade', nameVi: 'Xám than mờ', colors: ['#f3f4f6', '#d1d5db', '#9ca3af', '#6b7280'], direction: '180deg', category: 'minimal', tier: 'premium' },

  // ═══════════════════════════════════════════════════════════════
  // 🎨 VIBRANT & BOLD (10 mẫu)
  // ═══════════════════════════════════════════════════════════════
  { id: 'neon-dreams', name: 'Neon Dreams', nameVi: 'Giấc mơ neon', colors: ['#f472b6', '#c084fc', '#22d3ee'], direction: '135deg', category: 'vibrant', tier: 'pro' },
  { id: 'electric-sunset', name: 'Electric Sunset', nameVi: 'Hoàng hôn điện', colors: ['#fbbf24', '#f97316', '#ef4444', '#ec4899'], direction: '135deg', category: 'vibrant', tier: 'pro' },
  { id: 'cyber-punk', name: 'Cyber Punk', nameVi: 'Cyber Punk', colors: ['#e879f9', '#8b5cf6', '#06b6d4'], direction: '135deg', category: 'vibrant', tier: 'pro' },
  { id: 'tropical-punch', name: 'Tropical Punch', nameVi: 'Cocktail nhiệt đới', colors: ['#f472b6', '#fb7185', '#fdba74', '#fbbf24'], direction: '135deg', category: 'vibrant', tier: 'premium' },
  { id: 'berry-blast', name: 'Berry Blast', nameVi: 'Berry nổ', colors: ['#f472b6', '#e879f9', '#c084fc', '#818cf8'], direction: '135deg', category: 'vibrant', tier: 'premium' },
  { id: 'citrus-burst', name: 'Citrus Burst', nameVi: 'Cam chanh', colors: ['#fbbf24', '#f97316', '#ef4444'], direction: '135deg', category: 'vibrant', tier: 'premium' },
  { id: 'galaxy', name: 'Galaxy', nameVi: 'Thiên hà', colors: ['#c084fc', '#8b5cf6', '#6366f1', '#3b82f6', '#1e3a8a'], direction: '135deg', category: 'vibrant', tier: 'pro' },
  { id: 'aurora-borealis', name: 'Aurora Borealis', nameVi: 'Cực quang Bắc', colors: ['#4ade80', '#22d3ee', '#818cf8', '#c084fc'], direction: '135deg', category: 'vibrant', tier: 'pro' },
  { id: 'fiesta', name: 'Fiesta', nameVi: 'Lễ hội', colors: ['#ef4444', '#f97316', '#fbbf24', '#4ade80', '#22d3ee', '#8b5cf6'], direction: '90deg', category: 'vibrant', tier: 'pro' },
  { id: 'pride', name: 'Pride', nameVi: 'Tự hào', colors: ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#8b5cf6'], direction: '180deg', category: 'vibrant', tier: 'pro' },
];

export default GRADIENT_PRESETS;

