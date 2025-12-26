// lib/font-registry.ts
export type FontId = string;

export type FontItem = {
  id: FontId;
  label: string;
  googleFamily: string; // tên family trên Google Fonts
  subsets: Array<'latin' | 'vietnamese'>;
  // variable font thường chỉ cần "wght@300..900"
  axes?: string; // ví dụ: "wght@300..900"
  // fallback stack (luôn có VI-safe fallback cho EN fonts)
  fallback: string;
  category: 'calligraphy' | 'handwriting' | 'elegant' | 'script' | 'serif-elegant';
  isVNSafe: boolean; // Font có hỗ trợ đầy đủ tiếng Việt
};

// ✅ VI-Safe Fonts (50 fonts) - Calligraphy, Handwriting, Elegant cho tiếng Việt
export const VN_FONTS: FontItem[] = [
  // Calligraphy & Script (VI-safe)
  { id: 'dancing-script', label: 'Dancing Script', googleFamily: 'Dancing Script', subsets: ['vietnamese', 'latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", cursive', category: 'script', isVNSafe: true },
  { id: 'great-vibes', label: 'Great Vibes', googleFamily: 'Great Vibes', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", cursive', category: 'calligraphy', isVNSafe: true },
  { id: 'pacifico', label: 'Pacifico', googleFamily: 'Pacifico', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", cursive', category: 'handwriting', isVNSafe: true },
  { id: 'lobster', label: 'Lobster', googleFamily: 'Lobster', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", cursive', category: 'script', isVNSafe: true },
  { id: 'charmonman', label: 'Charmonman', googleFamily: 'Charmonman', subsets: ['vietnamese', 'latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", cursive', category: 'handwriting', isVNSafe: true },
  { id: 'sriracha', label: 'Sriracha', googleFamily: 'Sriracha', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", cursive', category: 'handwriting', isVNSafe: true },
  { id: 'itim', label: 'Itim', googleFamily: 'Itim', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", system-ui, sans-serif', category: 'handwriting', isVNSafe: true },
  { id: 'ma-shan-zheng', label: 'Ma Shan Zheng', googleFamily: 'Ma Shan Zheng', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", cursive', category: 'calligraphy', isVNSafe: true },
  { id: 'zhi-mang-xing', label: 'Zhi Mang Xing', googleFamily: 'Zhi Mang Xing', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", cursive', category: 'calligraphy', isVNSafe: true },
  { id: 'noto-sans', label: 'Noto Sans', googleFamily: 'Noto Sans', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Roboto, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  
  // Elegant Serif (VI-safe)
  { id: 'playfair-display', label: 'Playfair Display', googleFamily: 'Playfair Display', subsets: ['vietnamese', 'latin'], axes: 'wght@400..900', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'cormorant-garamond', label: 'Cormorant Garamond', googleFamily: 'Cormorant Garamond', subsets: ['vietnamese', 'latin'], axes: 'wght@300..700', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'eb-garamond', label: 'EB Garamond', googleFamily: 'EB Garamond', subsets: ['vietnamese', 'latin'], axes: 'wght@400..800', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'crimson-text', label: 'Crimson Text', googleFamily: 'Crimson Text', subsets: ['vietnamese', 'latin'], axes: 'wght@400..600', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'crimson-pro', label: 'Crimson Pro', googleFamily: 'Crimson Pro', subsets: ['vietnamese', 'latin'], axes: 'wght@200..900', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'libre-baskerville', label: 'Libre Baskerville', googleFamily: 'Libre Baskerville', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'baskervville', label: 'Baskervville', googleFamily: 'Baskervville', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'vollkorn', label: 'Vollkorn', googleFamily: 'Vollkorn', subsets: ['vietnamese', 'latin'], axes: 'wght@400..900', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'spectral', label: 'Spectral', googleFamily: 'Spectral', subsets: ['vietnamese', 'latin'], axes: 'wght@200..800', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'bree-serif', label: 'Bree Serif', googleFamily: 'Bree Serif', subsets: ['vietnamese', 'latin'], fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'merriweather', label: 'Merriweather', googleFamily: 'Merriweather', subsets: ['vietnamese', 'latin'], axes: 'wght@300..900', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'lora', label: 'Lora', googleFamily: 'Lora', subsets: ['vietnamese', 'latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", Georgia, serif', category: 'serif-elegant', isVNSafe: true },
  
  // Elegant Sans (VI-safe)
  { id: 'be-vietnam-pro', label: 'Be Vietnam Pro', googleFamily: 'Be Vietnam Pro', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'inter', label: 'Inter', googleFamily: 'Inter', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'lexend', label: 'Lexend', googleFamily: 'Lexend', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'work-sans', label: 'Work Sans', googleFamily: 'Work Sans', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'manrope', label: 'Manrope', googleFamily: 'Manrope', subsets: ['vietnamese', 'latin'], axes: 'wght@200..800', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'dm-sans', label: 'DM Sans', googleFamily: 'DM Sans', subsets: ['vietnamese', 'latin'], axes: 'wght@100..1000', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', googleFamily: 'Plus Jakarta Sans', subsets: ['vietnamese', 'latin'], axes: 'wght@200..800', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'outfit', label: 'Outfit', googleFamily: 'Outfit', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'sora', label: 'Sora', googleFamily: 'Sora', subsets: ['vietnamese', 'latin'], axes: 'wght@100..800', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'epilogue', label: 'Epilogue', googleFamily: 'Epilogue', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'figtree', label: 'Figtree', googleFamily: 'Figtree', subsets: ['vietnamese', 'latin'], axes: 'wght@300..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'space-grotesk', label: 'Space Grotesk', googleFamily: 'Space Grotesk', subsets: ['vietnamese', 'latin'], axes: 'wght@300..700', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'open-sans', label: 'Open Sans', googleFamily: 'Open Sans', subsets: ['vietnamese', 'latin'], axes: 'wght@300..800', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'lato', label: 'Lato', googleFamily: 'Lato', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'montserrat', label: 'Montserrat', googleFamily: 'Montserrat', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'poppins', label: 'Poppins', googleFamily: 'Poppins', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'quicksand', label: 'Quicksand', googleFamily: 'Quicksand', subsets: ['vietnamese', 'latin'], axes: 'wght@300..700', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'raleway', label: 'Raleway', googleFamily: 'Raleway', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'nunito', label: 'Nunito', googleFamily: 'Nunito', subsets: ['vietnamese', 'latin'], axes: 'wght@200..1000', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'source-sans-pro', label: 'Source Sans Pro', googleFamily: 'Source Sans Pro', subsets: ['vietnamese', 'latin'], axes: 'wght@200..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'ubuntu', label: 'Ubuntu', googleFamily: 'Ubuntu', subsets: ['vietnamese', 'latin'], axes: 'wght@300..700', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'roboto', label: 'Roboto', googleFamily: 'Roboto', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'noto-serif', label: 'Noto Serif', googleFamily: 'Noto Serif', subsets: ['vietnamese', 'latin'], axes: 'wght@400..900', fallback: 'Georgia, "Times New Roman", serif', category: 'serif-elegant', isVNSafe: true },
  { id: 'kanit', label: 'Kanit', googleFamily: 'Kanit', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'sarabun', label: 'Sarabun', googleFamily: 'Sarabun', subsets: ['vietnamese', 'latin'], axes: 'wght@100..800', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'prompt', label: 'Prompt', googleFamily: 'Prompt', subsets: ['vietnamese', 'latin'], axes: 'wght@100..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'mitr', label: 'Mitr', googleFamily: 'Mitr', subsets: ['vietnamese', 'latin'], axes: 'wght@200..600', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
  { id: 'rubik', label: 'Rubik', googleFamily: 'Rubik', subsets: ['vietnamese', 'latin'], axes: 'wght@300..900', fallback: 'system-ui, Segoe UI, Arial, sans-serif', category: 'elegant', isVNSafe: true },
];

// ✅ EN Decorative Fonts (50 fonts) - Calligraphy, Handwriting, Script (với VI-safe fallback)
export const EN_FONTS: FontItem[] = [
  // Calligraphy & Script (EN decorative, có VI fallback)
  { id: 'caveat', label: 'Caveat', googleFamily: 'Caveat', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'calligraphy', isVNSafe: false },
  { id: 'kalam', label: 'Kalam', googleFamily: 'Kalam', subsets: ['latin'], axes: 'wght@300..700', fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'handwriting', isVNSafe: false },
  { id: 'permanent-marker', label: 'Permanent Marker', googleFamily: 'Permanent Marker', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'handwriting', isVNSafe: false },
  { id: 'shadows-into-light', label: 'Shadows Into Light', googleFamily: 'Shadows Into Light', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'handwriting', isVNSafe: false },
  { id: 'amatic-sc', label: 'Amatic SC', googleFamily: 'Amatic SC', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'handwriting', isVNSafe: false },
  { id: 'indie-flower', label: 'Indie Flower', googleFamily: 'Indie Flower', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'handwriting', isVNSafe: false },
  { id: 'satisfy', label: 'Satisfy', googleFamily: 'Satisfy', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'script', isVNSafe: false },
  { id: 'allura', label: 'Allura', googleFamily: 'Allura', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'calligraphy', isVNSafe: false },
  { id: 'tangerine', label: 'Tangerine', googleFamily: 'Tangerine', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'calligraphy', isVNSafe: false },
  { id: 'sacramento', label: 'Sacramento', googleFamily: 'Sacramento', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'calligraphy', isVNSafe: false },
  { id: 'bad-script', label: 'Bad Script', googleFamily: 'Bad Script', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'handwriting', isVNSafe: false },
  { id: 'kaushan-script', label: 'Kaushan Script', googleFamily: 'Kaushan Script', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'script', isVNSafe: false },
  { id: 'yellowtail', label: 'Yellowtail', googleFamily: 'Yellowtail', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'script', isVNSafe: false },
  { id: 'lobster-two', label: 'Lobster Two', googleFamily: 'Lobster Two', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'script', isVNSafe: false },
  { id: 'dancing-script-en', label: 'Dancing Script', googleFamily: 'Dancing Script', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'script', isVNSafe: false },
  { id: 'pacifico-en', label: 'Pacifico', googleFamily: 'Pacifico', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", cursive', category: 'handwriting', isVNSafe: false },
  { id: 'comfortaa', label: 'Comfortaa', googleFamily: 'Comfortaa', subsets: ['latin'], axes: 'wght@300..700', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'handwriting', isVNSafe: false },
  { id: 'fredoka-one', label: 'Fredoka One', googleFamily: 'Fredoka One', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'handwriting', isVNSafe: false },
  { id: 'bebas-neue', label: 'Bebas Neue', googleFamily: 'Bebas Neue', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'anton', label: 'Anton', googleFamily: 'Anton', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'righteous', label: 'Righteous', googleFamily: 'Righteous', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'oswald', label: 'Oswald', googleFamily: 'Oswald', subsets: ['latin'], axes: 'wght@200..700', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'dosis', label: 'Dosis', googleFamily: 'Dosis', subsets: ['latin'], axes: 'wght@200..800', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'josefin-sans', label: 'Josefin Sans', googleFamily: 'Josefin Sans', subsets: ['latin'], axes: 'wght@100..700', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'josefin-slab', label: 'Josefin Slab', googleFamily: 'Josefin Slab', subsets: ['latin'], axes: 'wght@100..700', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'archivo', label: 'Archivo', googleFamily: 'Archivo', subsets: ['latin'], axes: 'wght@100..900', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'archivo-narrow', label: 'Archivo Narrow', googleFamily: 'Archivo Narrow', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'fira-sans', label: 'Fira Sans', googleFamily: 'Fira Sans', subsets: ['latin'], axes: 'wght@100..900', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  
  // Elegant Serif (EN decorative, có VI fallback)
  { id: 'playfair-display-en', label: 'Playfair Display', googleFamily: 'Playfair Display', subsets: ['latin'], axes: 'wght@400..900', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'cinzel', label: 'Cinzel', googleFamily: 'Cinzel', subsets: ['latin'], axes: 'wght@400..900', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'cinzel-decorative', label: 'Cinzel Decorative', googleFamily: 'Cinzel Decorative', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'alegreya', label: 'Alegreya', googleFamily: 'Alegreya', subsets: ['latin'], axes: 'wght@400..900', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'alegreya-sc', label: 'Alegreya SC', googleFamily: 'Alegreya SC', subsets: ['latin'], axes: 'wght@400..900', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'libre-baskerville-en', label: 'Libre Baskerville', googleFamily: 'Libre Baskerville', subsets: ['latin'], fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'crimson-text-en', label: 'Crimson Text', googleFamily: 'Crimson Text', subsets: ['latin'], axes: 'wght@400..600', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'lora-en', label: 'Lora', googleFamily: 'Lora', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'merriweather-en', label: 'Merriweather', googleFamily: 'Merriweather', subsets: ['latin'], axes: 'wght@300..900', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'roboto-slab', label: 'Roboto Slab', googleFamily: 'Roboto Slab', subsets: ['latin'], axes: 'wght@100..900', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'source-serif-pro', label: 'Source Serif Pro', googleFamily: 'Source Serif Pro', subsets: ['latin'], axes: 'wght@200..900', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'pt-serif', label: 'PT Serif', googleFamily: 'PT Serif', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'arvo', label: 'Arvo', googleFamily: 'Arvo', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", Georgia, serif', category: 'serif-elegant', isVNSafe: false },
  { id: 'pt-sans', label: 'PT Sans', googleFamily: 'PT Sans', subsets: ['latin'], axes: 'wght@400..700', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'raleway-en', label: 'Raleway', googleFamily: 'Raleway', subsets: ['latin'], axes: 'wght@100..900', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'lato-en', label: 'Lato', googleFamily: 'Lato', subsets: ['latin'], axes: 'wght@100..900', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'montserrat-en', label: 'Montserrat', googleFamily: 'Montserrat', subsets: ['latin'], axes: 'wght@100..900', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
  { id: 'poppins-en', label: 'Poppins', googleFamily: 'Poppins', subsets: ['latin'], axes: 'wght@100..900', fallback: '"Be Vietnam Pro", "Noto Sans", system-ui, sans-serif', category: 'elegant', isVNSafe: false },
];

// ✅ Core fonts để preload (3-6 font quan trọng nhất)
export const CORE_FONTS: FontId[] = [
  'be-vietnam-pro', // Font VN chính
  'dancing-script', // Font script đẹp
  'playfair-display', // Font display đẹp
  'great-vibes', // Font calligraphy
  'cormorant-garamond', // Font serif elegant
  'caveat', // Font handwriting
];

// ✅ Registry tổng hợp
export const FONT_REGISTRY: Record<FontId, FontItem> = Object.fromEntries(
  [...VN_FONTS, ...EN_FONTS].map(f => [f.id, f]),
);

// ✅ Helper để lấy font từ registry
export function getFontById(id: FontId): FontItem | undefined {
  return FONT_REGISTRY[id];
}

// ✅ Helper để lấy tất cả fonts
export function getAllFonts(): FontItem[] {
  return [...VN_FONTS, ...EN_FONTS];
}

// ✅ Helper để lấy fonts theo category
export function getFontsByCategory(category: FontItem['category']): FontItem[] {
  return getAllFonts().filter(f => f.category === category);
}

// ✅ Helper để lấy fonts VI-safe
export function getVNSafeFonts(): FontItem[] {
  return getAllFonts().filter(f => f.isVNSafe);
}
