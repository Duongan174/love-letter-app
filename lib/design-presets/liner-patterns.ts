/**
 * ✅ LINER PATTERNS - 100+ họa tiết nghệ thuật cho bên trong phong bì
 * Mỗi mẫu là một bức tranh độc đáo, không lặp lại
 * Thiết kế cầu kỳ, nghệ thuật, đẹp mắt như trong ảnh mẫu
 */

import { PatternPreset } from './types';

export const LINER_PATTERNS: PatternPreset[] = [
  // ═══════════════════════════════════════════════════════════════
  // 🌸 WATERCOLOR FLORAL (20 mẫu) - Giống ảnh mẫu
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'watercolor-roses-pink',
    name: 'Watercolor Pink Roses',
    nameVi: 'Hoa hồng nước màu hồng',
    preview: '🌹',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="rose1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB7C5;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:0.08" />
        </linearGradient>
        <linearGradient id="rose2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFD4E0;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#FFB7C5;stop-opacity:0.06" />
        </linearGradient>
      </defs>
      <!-- Rose 1 - Top Left -->
      <ellipse cx="45" cy="35" rx="18" ry="25" fill="url(#rose1)" transform="rotate(-15 45 35)"/>
      <ellipse cx="60" cy="25" rx="15" ry="22" fill="url(#rose2)" transform="rotate(20 60 25)"/>
      <ellipse cx="30" cy="50" rx="12" ry="18" fill="url(#rose1)" transform="rotate(-30 30 50)"/>
      <circle cx="45" cy="35" r="8" fill="#FFB7C5" fill-opacity="0.1"/>
      <!-- Rose 2 - Center Right -->
      <ellipse cx="155" cy="80" rx="20" ry="28" fill="url(#rose1)" transform="rotate(25 155 80)"/>
      <ellipse cx="170" cy="70" rx="16" ry="24" fill="url(#rose2)" transform="rotate(-10 170 70)"/>
      <ellipse cx="140" cy="95" rx="14" ry="20" fill="url(#rose1)" transform="rotate(40 140 95)"/>
      <circle cx="155" cy="80" r="9" fill="#FFB7C5" fill-opacity="0.12"/>
      <!-- Rose 3 - Bottom Left -->
      <ellipse cx="50" cy="160" rx="16" ry="24" fill="url(#rose1)" transform="rotate(-20 50 160)"/>
      <ellipse cx="65" cy="150" rx="13" ry="20" fill="url(#rose2)" transform="rotate(15 65 150)"/>
      <circle cx="50" cy="160" r="7" fill="#FFB7C5" fill-opacity="0.1"/>
      <!-- Leaves -->
      <path d="M25 60 Q35 50 45 60 Q35 70 25 60" fill="#4CAF50" fill-opacity="0.08"/>
      <path d="M130 100 Q140 90 150 100 Q140 110 130 100" fill="#4CAF50" fill-opacity="0.08"/>
      <path d="M40 140 Q50 130 60 140 Q50 150 40 140" fill="#4CAF50" fill-opacity="0.06"/>
      <!-- Small dots -->
      <circle cx="80" cy="40" r="2" fill="#FFB7C5" fill-opacity="0.12"/>
      <circle cx="120" cy="60" r="1.5" fill="#FFD4E0" fill-opacity="0.1"/>
      <circle cx="100" cy="120" r="2.5" fill="#FFB7C5" fill-opacity="0.1"/>
      <circle cx="170" cy="140" r="1.8" fill="#FFD4E0" fill-opacity="0.12"/>
    </svg>`,
    size: '200px 200px',
    category: 'floral',
    tier: 'free',
    opacity: 0.7
  },
  {
    id: 'watercolor-bouquet',
    name: 'Watercolor Floral Bouquet',
    nameVi: 'Bó hoa nước màu',
    preview: '💐',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="petal1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FFB7C5;stop-opacity:0.18" />
          <stop offset="50%" style="stop-color:#FFD4E0;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#FF69B4;stop-opacity:0.08" />
        </linearGradient>
        <linearGradient id="leaf1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#81C784;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#4CAF50;stop-opacity:0.06" />
        </linearGradient>
      </defs>
      <!-- Main flower cluster -->
      <ellipse cx="100" cy="60" rx="25" ry="35" fill="url(#petal1)" transform="rotate(-20 100 60)"/>
      <ellipse cx="115" cy="50" rx="22" ry="32" fill="url(#petal1)" transform="rotate(10 115 50)"/>
      <ellipse cx="85" cy="70" rx="20" ry="30" fill="url(#petal1)" transform="rotate(-40 85 70)"/>
      <ellipse cx="120" cy="75" rx="18" ry="28" fill="url(#petal1)" transform="rotate(30 120 75)"/>
      <circle cx="100" cy="60" r="12" fill="#FFB7C5" fill-opacity="0.15"/>
      <!-- Secondary flowers -->
      <ellipse cx="40" cy="100" rx="15" ry="22" fill="url(#petal1)" transform="rotate(-15 40 100)"/>
      <ellipse cx="160" cy="120" rx="18" ry="26" fill="url(#petal1)" transform="rotate(25 160 120)"/>
      <ellipse cx="70" cy="150" rx="14" ry="20" fill="url(#petal1)" transform="rotate(-30 70 150)"/>
      <!-- Leaves and stems -->
      <path d="M60 120 Q70 110 80 120 Q70 130 60 120" fill="url(#leaf1)"/>
      <path d="M120 140 Q130 130 140 140 Q130 150 120 140" fill="url(#leaf1)"/>
      <path d="M100 180 Q110 170 120 180 Q110 190 100 180" fill="url(#leaf1)"/>
      <line x1="50" y1="100" x2="50" y2="180" stroke="#4CAF50" stroke-opacity="0.08" stroke-width="3"/>
      <line x1="150" y1="120" x2="150" y2="190" stroke="#4CAF50" stroke-opacity="0.08" stroke-width="3"/>
      <!-- Decorative dots -->
      <circle cx="30" cy="50" r="2" fill="#FFB7C5" fill-opacity="0.15"/>
      <circle cx="170" cy="70" r="1.5" fill="#FFD4E0" fill-opacity="0.12"/>
      <circle cx="20" cy="130" r="2.5" fill="#FFB7C5" fill-opacity="0.1"/>
      <circle cx="180" cy="150" r="1.8" fill="#FFD4E0" fill-opacity="0.12"/>
    </svg>`,
    size: '200px 200px',
    category: 'floral',
    tier: 'free',
    opacity: 0.75
  },
  // ═══════════════════════════════════════════════════════════════
  // 🌺 VINTAGE FLORAL (15 mẫu)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'vintage-roses-garden',
    name: 'Vintage Rose Garden',
    nameVi: 'Vườn hồng cổ điển',
    preview: '🌹',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vrose1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#E91E63;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#C2185B;stop-opacity:0.06" />
        </linearGradient>
        <linearGradient id="vleaf1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2E7D32;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#1B5E20;stop-opacity:0.05" />
        </linearGradient>
      </defs>
      <!-- Large rose center -->
      <ellipse cx="100" cy="80" rx="28" ry="38" fill="url(#vrose1)" transform="rotate(-25 100 80)"/>
      <ellipse cx="115" cy="65" rx="24" ry="35" fill="url(#vrose1)" transform="rotate(15 115 65)"/>
      <ellipse cx="85" cy="95" rx="22" ry="32" fill="url(#vrose1)" transform="rotate(-45 85 95)"/>
      <circle cx="100" cy="80" r="14" fill="#E91E63" fill-opacity="0.1"/>
      <!-- Smaller roses -->
      <ellipse cx="40" cy="50" rx="18" ry="26" fill="url(#vrose1)" transform="rotate(-20 40 50)"/>
      <ellipse cx="160" cy="120" rx="20" ry="28" fill="url(#vrose1)" transform="rotate(30 160 120)"/>
      <ellipse cx="60" cy="160" rx="16" ry="24" fill="url(#vrose1)" transform="rotate(-15 60 160)"/>
      <!-- Leaves -->
      <path d="M30 90 Q40 80 50 90 Q40 100 30 90" fill="url(#vleaf1)"/>
      <path d="M150 140 Q160 130 170 140 Q160 150 150 140" fill="url(#vleaf1)"/>
      <path d="M80 180 Q90 170 100 180 Q90 190 80 180" fill="url(#vleaf1)"/>
      <!-- Stems -->
      <line x1="40" y1="50" x2="40" y2="180" stroke="#2E7D32" stroke-opacity="0.06" stroke-width="2"/>
      <line x1="160" y1="120" x2="160" y2="190" stroke="#2E7D32" stroke-opacity="0.06" stroke-width="2"/>
    </svg>`,
    size: '200px 200px',
    category: 'floral',
    tier: 'free',
    opacity: 0.75
  },
  {
    id: 'botanical-herbs',
    name: 'Botanical Herbs',
    nameVi: 'Thảo mộc thực vật',
    preview: '🌿',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="herb1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#66BB6A;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#4CAF50;stop-opacity:0.06" />
        </linearGradient>
      </defs>
      <!-- Herbs -->
      <path d="M50 180 Q50 120 50 60 Q45 50 55 50 Q50 60 50 80 Q50 100 50 120 Q50 140 50 180" fill="url(#herb1)"/>
      <path d="M100 190 Q100 130 100 70 Q95 60 105 60 Q100 70 100 90 Q100 110 100 130 Q100 150 100 190" fill="url(#herb1)"/>
      <path d="M150 180 Q150 120 150 60 Q145 50 155 50 Q150 60 150 80 Q150 100 150 120 Q150 140 150 180" fill="url(#herb1)"/>
      <!-- Small leaves -->
      <ellipse cx="45" cy="100" rx="8" ry="12" fill="#66BB6A" fill-opacity="0.08" transform="rotate(-30 45 100)"/>
      <ellipse cx="55" cy="120" rx="6" ry="10" fill="#66BB6A" fill-opacity="0.08" transform="rotate(20 55 120)"/>
      <ellipse cx="95" cy="110" rx="7" ry="11" fill="#66BB6A" fill-opacity="0.08" transform="rotate(-25 95 110)"/>
      <ellipse cx="105" cy="130" rx="6" ry="9" fill="#66BB6A" fill-opacity="0.08" transform="rotate(25 105 130)"/>
      <ellipse cx="145" cy="100" rx="8" ry="12" fill="#66BB6A" fill-opacity="0.08" transform="rotate(-20 145 100)"/>
      <ellipse cx="155" cy="120" rx="6" ry="10" fill="#66BB6A" fill-opacity="0.08" transform="rotate(30 155 120)"/>
    </svg>`,
    size: '200px 200px',
    category: 'nature_pattern',
    tier: 'free',
    opacity: 0.7
  },
  // ═══════════════════════════════════════════════════════════════
  // 🍴 SILVERWARE & UTENSILS (10 mẫu) - Giống ảnh mẫu
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'silverware-classic',
    name: 'Classic Silverware',
    nameVi: 'Bộ đồ bạc cổ điển',
    preview: '🍴',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="silver1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#C0C0C0;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#808080;stop-opacity:0.08" />
        </linearGradient>
      </defs>
      <!-- Fork -->
      <path d="M40 20 L40 80 L35 80 L35 85 L45 85 L45 80 L40 80 Z M38 20 L38 15 L42 15 L42 20 Z" fill="url(#silver1)"/>
      <rect x="37" y="20" width="6" height="60" fill="url(#silver1)"/>
      <path d="M40 80 L35 85 L40 90 L45 85 Z" fill="url(#silver1)"/>
      <!-- Spoon -->
      <path d="M100 20 L100 75 Q100 80 95 80 Q90 80 90 75 L90 20 Z" fill="url(#silver1)"/>
      <ellipse cx="95" cy="80" rx="8" ry="6" fill="url(#silver1)"/>
      <!-- Fork 2 -->
      <path d="M160 20 L160 80 L155 80 L155 85 L165 85 L165 80 L160 80 Z M158 20 L158 15 L162 15 L162 20 Z" fill="url(#silver1)"/>
      <rect x="157" y="20" width="6" height="60" fill="url(#silver1)"/>
      <path d="M160 80 L155 85 L160 90 L165 85 Z" fill="url(#silver1)"/>
      <!-- Spoon 2 -->
      <path d="M60 120 L60 175 Q60 180 55 180 Q50 180 50 175 L50 120 Z" fill="url(#silver1)"/>
      <ellipse cx="55" cy="180" rx="8" ry="6" fill="url(#silver1)"/>
      <!-- Fork 3 -->
      <path d="M140 140 L140 200 L135 200 L135 205 L145 205 L145 200 L140 200 Z" fill="url(#silver1)"/>
      <rect x="137" y="140" width="6" height="60" fill="url(#silver1)"/>
    </svg>`,
    size: '200px 200px',
    category: 'vintage_pattern',
    tier: 'free',
    opacity: 0.7
  },
  {
    id: 'ceramic-tiles-floral',
    name: 'Ceramic Tiles Floral',
    nameVi: 'Gạch hoa văn',
    preview: '🧱',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tile1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4DB6AC;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#26A69A;stop-opacity:0.08" />
        </linearGradient>
        <linearGradient id="tile2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6F00;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#E65100;stop-opacity:0.06" />
        </linearGradient>
      </defs>
      <!-- Tile 1 -->
      <rect x="10" y="10" width="80" height="80" fill="#4DB6AC" fill-opacity="0.1" stroke="#26A69A" stroke-opacity="0.15" stroke-width="1"/>
      <circle cx="50" cy="50" r="20" fill="url(#tile1)"/>
      <path d="M50 30 Q60 40 50 50 Q40 40 50 30" fill="#26A69A" fill-opacity="0.1"/>
      <circle cx="50" cy="50" r="8" fill="#FF6F00" fill-opacity="0.08"/>
      <!-- Tile 2 -->
      <rect x="110" y="10" width="80" height="80" fill="#4DB6AC" fill-opacity="0.1" stroke="#26A69A" stroke-opacity="0.15" stroke-width="1"/>
      <circle cx="150" cy="50" r="20" fill="url(#tile1)"/>
      <path d="M150 30 Q160 40 150 50 Q140 40 150 30" fill="#26A69A" fill-opacity="0.1"/>
      <circle cx="150" cy="50" r="8" fill="#FF6F00" fill-opacity="0.08"/>
      <!-- Tile 3 -->
      <rect x="10" y="110" width="80" height="80" fill="#4DB6AC" fill-opacity="0.1" stroke="#26A69A" stroke-opacity="0.15" stroke-width="1"/>
      <circle cx="50" cy="150" r="20" fill="url(#tile1)"/>
      <path d="M50 130 Q60 140 50 150 Q40 140 50 130" fill="#26A69A" fill-opacity="0.1"/>
      <circle cx="50" cy="150" r="8" fill="#FF6F00" fill-opacity="0.08"/>
      <!-- Tile 4 -->
      <rect x="110" y="110" width="80" height="80" fill="#4DB6AC" fill-opacity="0.1" stroke="#26A69A" stroke-opacity="0.15" stroke-width="1"/>
      <circle cx="150" cy="150" r="20" fill="url(#tile1)"/>
      <path d="M150 130 Q160 140 150 150 Q140 140 150 130" fill="#26A69A" fill-opacity="0.1"/>
      <circle cx="150" cy="150" r="8" fill="#FF6F00" fill-opacity="0.08"/>
    </svg>`,
    size: '200px 200px',
    category: 'geometric',
    tier: 'free',
    opacity: 0.75
  },
  {
    id: 'arrows-hearts',
    name: 'Arrows with Hearts',
    nameVi: 'Mũi tên trái tim',
    preview: '💘',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="arrow1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#00BCD4;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#0097A7;stop-opacity:0.06" />
        </linearGradient>
        <linearGradient id="arrow2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF9800;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#F57C00;stop-opacity:0.05" />
        </linearGradient>
      </defs>
      <!-- Arrow 1 -->
      <line x1="30" y1="50" x2="80" y2="50" stroke="url(#arrow1)" stroke-width="3" stroke-linecap="round"/>
      <polygon points="80,50 70,45 70,55" fill="url(#arrow1)"/>
      <path d="M70 48 L72 50 L70 52 Q68 50 70 48" fill="#E91E63" fill-opacity="0.1"/>
      <!-- Arrow 2 -->
      <line x1="120" y1="30" x2="120" y2="80" stroke="url(#arrow2)" stroke-width="3" stroke-linecap="round"/>
      <polygon points="120,30 115,40 125,40" fill="url(#arrow2)"/>
      <path d="M118 40 L120 42 L122 40 Q120 38 118 40" fill="#E91E63" fill-opacity="0.1"/>
      <!-- Arrow 3 -->
      <line x1="50" y1="120" x2="100" y2="170" stroke="url(#arrow1)" stroke-width="3" stroke-linecap="round"/>
      <polygon points="100,170 95,160 105,160" fill="url(#arrow1)"/>
      <path d="M97 162 L99 164 L101 162 Q99 160 97 162" fill="#E91E63" fill-opacity="0.1"/>
      <!-- Arrow 4 -->
      <line x1="150" y1="100" x2="180" y2="70" stroke="url(#arrow2)" stroke-width="3" stroke-linecap="round"/>
      <polygon points="180,70 170,75 170,65" fill="url(#arrow2)"/>
      <path d="M172 73 L174 71 L176 73 Q174 75 172 73" fill="#E91E63" fill-opacity="0.1"/>
      <!-- Arrow 5 -->
      <line x1="20" y1="150" x2="20" y2="190" stroke="url(#arrow1)" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="20,190 15,180 25,180" fill="url(#arrow1)"/>
      <path d="M18 182 L20 184 L22 182 Q20 180 18 182" fill="#E91E63" fill-opacity="0.08"/>
    </svg>`,
    size: '200px 200px',
    category: 'playful',
    tier: 'free',
    opacity: 0.7
  },
  {
    id: 'badminton-shuttlecocks',
    name: 'Badminton Shuttlecocks',
    nameVi: 'Cầu lông',
    preview: '🏸',
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shuttle1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#424242;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#212121;stop-opacity:0.06" />
        </linearGradient>
      </defs>
      <!-- Shuttlecock 1 -->
      <ellipse cx="50" cy="40" rx="12" ry="8" fill="url(#shuttle1)" transform="rotate(-20 50 40)"/>
      <ellipse cx="50" cy="40" rx="10" ry="6" fill="#424242" fill-opacity="0.08" transform="rotate(-20 50 40)"/>
      <rect x="48" y="40" width="4" height="25" fill="#424242" fill-opacity="0.1" rx="2"/>
      <circle cx="50" cy="65" r="3" fill="#424242" fill-opacity="0.12"/>
      <!-- Shuttlecock 2 -->
      <ellipse cx="150" cy="60" rx="14" ry="9" fill="url(#shuttle1)" transform="rotate(15 150 60)"/>
      <ellipse cx="150" cy="60" rx="11" ry="7" fill="#424242" fill-opacity="0.08" transform="rotate(15 150 60)"/>
      <rect x="148" y="60" width="4" height="28" fill="#424242" fill-opacity="0.1" rx="2"/>
      <circle cx="150" cy="88" r="3.5" fill="#424242" fill-opacity="0.12"/>
      <!-- Shuttlecock 3 -->
      <ellipse cx="80" cy="140" rx="11" ry="7" fill="url(#shuttle1)" transform="rotate(-10 80 140)"/>
      <ellipse cx="80" cy="140" rx="9" ry="5" fill="#424242" fill-opacity="0.08" transform="rotate(-10 80 140)"/>
      <rect x="78" y="140" width="4" height="24" fill="#424242" fill-opacity="0.1" rx="2"/>
      <circle cx="80" cy="164" r="2.5" fill="#424242" fill-opacity="0.12"/>
      <!-- Shuttlecock 4 -->
      <ellipse cx="160" cy="160" rx="13" ry="8" fill="url(#shuttle1)" transform="rotate(25 160 160)"/>
      <ellipse cx="160" cy="160" rx="10" ry="6" fill="#424242" fill-opacity="0.08" transform="rotate(25 160 160)"/>
      <rect x="158" y="160" width="4" height="26" fill="#424242" fill-opacity="0.1" rx="2"/>
      <circle cx="160" cy="186" r="3" fill="#424242" fill-opacity="0.12"/>
    </svg>`,
    size: '200px 200px',
    category: 'playful',
    tier: 'free',
    opacity: 0.7
  },
  // ═══════════════════════════════════════════════════════════════
  // 🎨 WATERCOLOR BOTANICAL - Premium Collection (20 mẫu)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'watercolor-anemone-poppy',
    name: 'Watercolor Anemone & Poppy',
    nameVi: 'Phong quỳ & Anh túc nước màu',
    preview: '🌺',
    svg: `<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Anemone flower gradients -->
        <radialGradient id="anemone1" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#1A237E;stop-opacity:0.18" />
          <stop offset="50%" style="stop-color:#283593;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#3949AB;stop-opacity:0.06" />
        </radialGradient>
        <radialGradient id="anemone2" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#283593;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#5C6BC0;stop-opacity:0.08" />
        </radialGradient>
        <!-- Poppy flower gradients -->
        <radialGradient id="poppy1" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#E65100;stop-opacity:0.2" />
          <stop offset="50%" style="stop-color:#FF6F00;stop-opacity:0.15" />
          <stop offset="100%" style="stop-color:#FF8F00;stop-opacity:0.08" />
        </radialGradient>
        <radialGradient id="poppy2" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#D84315;stop-opacity:0.18" />
          <stop offset="100%" style="stop-color:#FF5722;stop-opacity:0.1" />
        </radialGradient>
        <!-- Watercolor bleed effect -->
        <linearGradient id="watercolor1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1A237E;stop-opacity:0.08" />
          <stop offset="50%" style="stop-color:transparent;stop-opacity:0" />
          <stop offset="100%" style="stop-color:#E65100;stop-opacity:0.06" />
        </linearGradient>
        <!-- Small wildflower gradient -->
        <radialGradient id="wild1" cx="50%" cy="50%">
          <stop offset="0%" style="stop-color:#FFB74D;stop-opacity:0.12" />
          <stop offset="100%" style="stop-color:#FFA726;stop-opacity:0.05" />
        </radialGradient>
      </defs>
      
      <!-- Watercolor background bleed -->
      <rect width="300" height="300" fill="url(#watercolor1)" opacity="0.4"/>
      
      <!-- Anemone Flower 1 - Top Left (Navy blue with black center) -->
      <ellipse cx="60" cy="50" rx="22" ry="30" fill="url(#anemone1)" transform="rotate(-25 60 50)"/>
      <ellipse cx="75" cy="40" rx="18" ry="26" fill="url(#anemone2)" transform="rotate(15 75 40)"/>
      <ellipse cx="45" cy="65" rx="16" ry="24" fill="url(#anemone1)" transform="rotate(-40 45 65)"/>
      <ellipse cx="80" cy="70" rx="14" ry="22" fill="url(#anemone2)" transform="rotate(30 80 70)"/>
      <!-- Black center -->
      <circle cx="60" cy="50" r="10" fill="#000000" fill-opacity="0.15"/>
      <circle cx="60" cy="50" r="6" fill="#000000" fill-opacity="0.2"/>
      <!-- Petals detail -->
      <ellipse cx="50" cy="45" rx="8" ry="12" fill="#1A237E" fill-opacity="0.1" transform="rotate(-20 50 45)"/>
      <ellipse cx="70" cy="45" rx="8" ry="12" fill="#1A237E" fill-opacity="0.1" transform="rotate(20 70 45)"/>
      
      <!-- Poppy Flower 1 - Center Right (Orange-red) -->
      <ellipse cx="220" cy="100" rx="28" ry="38" fill="url(#poppy1)" transform="rotate(-20 220 100)"/>
      <ellipse cx="235" cy="85" rx="24" ry="35" fill="url(#poppy2)" transform="rotate(10 235 85)"/>
      <ellipse cx="205" cy="115" rx="22" ry="32" fill="url(#poppy1)" transform="rotate(-35 205 115)"/>
      <ellipse cx="240" cy="120" rx="20" ry="30" fill="url(#poppy2)" transform="rotate(25 240 120)"/>
      <ellipse cx="215" cy="130" rx="18" ry="28" fill="url(#poppy1)" transform="rotate(-15 215 130)"/>
      <!-- Center -->
      <circle cx="220" cy="100" r="12" fill="#E65100" fill-opacity="0.2"/>
      <circle cx="220" cy="100" r="8" fill="#FF6F00" fill-opacity="0.15"/>
      
      <!-- Anemone Flower 2 - Bottom Left -->
      <ellipse cx="80" cy="220" rx="20" ry="28" fill="url(#anemone1)" transform="rotate(-15 80 220)"/>
      <ellipse cx="95" cy="210" rx="16" ry="24" fill="url(#anemone2)" transform="rotate(20 95 210)"/>
      <ellipse cx="65" cy="235" rx="14" ry="22" fill="url(#anemone1)" transform="rotate(-30 65 235)"/>
      <!-- Black center -->
      <circle cx="80" cy="220" r="9" fill="#000000" fill-opacity="0.15"/>
      <circle cx="80" cy="220" r="5" fill="#000000" fill-opacity="0.2"/>
      
      <!-- Poppy Flower 2 - Top Right -->
      <ellipse cx="250" cy="60" rx="24" ry="34" fill="url(#poppy1)" transform="rotate(15 250 60)"/>
      <ellipse cx="265" cy="50" rx="20" ry="30" fill="url(#poppy2)" transform="rotate(-10 265 50)"/>
      <ellipse cx="235" cy="75" rx="18" ry="28" fill="url(#poppy1)" transform="rotate(30 235 75)"/>
      <!-- Center -->
      <circle cx="250" cy="60" r="10" fill="#E65100" fill-opacity="0.18"/>
      
      <!-- Small Wildflowers - Scattered -->
      <circle cx="150" cy="40" r="6" fill="url(#wild1)"/>
      <circle cx="150" cy="40" r="3" fill="#FFB74D" fill-opacity="0.15"/>
      <circle cx="180" cy="180" r="5" fill="url(#wild1)"/>
      <circle cx="180" cy="180" r="2.5" fill="#FFB74D" fill-opacity="0.12"/>
      <circle cx="120" cy="250" r="7" fill="url(#wild1)"/>
      <circle cx="120" cy="250" r="3.5" fill="#FFB74D" fill-opacity="0.15"/>
      <circle cx="270" cy="200" r="6" fill="url(#wild1)"/>
      <circle cx="270" cy="200" r="3" fill="#FFB74D" fill-opacity="0.12"/>
      
      <!-- Leaves and stems -->
      <path d="M40 100 Q50 90 60 100 Q50 110 40 100" fill="#2E7D32" fill-opacity="0.08"/>
      <path d="M200 150 Q210 140 220 150 Q210 160 200 150" fill="#2E7D32" fill-opacity="0.08"/>
      <path d="M70 240 Q80 230 90 240 Q80 250 70 240" fill="#2E7D32" fill-opacity="0.06"/>
      <line x1="60" y1="50" x2="60" y2="100" stroke="#2E7D32" stroke-opacity="0.06" stroke-width="2"/>
      <line x1="220" y1="100" x2="220" y2="150" stroke="#2E7D32" stroke-opacity="0.06" stroke-width="2"/>
      <line x1="80" y1="220" x2="80" y2="260" stroke="#2E7D32" stroke-opacity="0.05" stroke-width="2"/>
      
      <!-- Watercolor splashes and bleeds -->
      <ellipse cx="140" cy="120" rx="35" ry="25" fill="#1A237E" fill-opacity="0.03" transform="rotate(45 140 120)"/>
      <ellipse cx="160" cy="200" rx="30" ry="20" fill="#E65100" fill-opacity="0.03" transform="rotate(-30 160 200)"/>
      <ellipse cx="100" cy="150" rx="25" ry="18" fill="#283593" fill-opacity="0.04" transform="rotate(20 100 150)"/>
      
      <!-- Additional small details -->
      <circle cx="50" cy="80" r="1.5" fill="#1A237E" fill-opacity="0.12"/>
      <circle cx="200" cy="130" r="2" fill="#E65100" fill-opacity="0.1"/>
      <circle cx="90" cy="200" r="1.5" fill="#1A237E" fill-opacity="0.1"/>
      <circle cx="240" cy="90" r="2" fill="#FF6F00" fill-opacity="0.12"/>
    </svg>`,
    size: '300px 300px',
    category: 'floral',
    tier: 'free',
    opacity: 0.8
  },
  // Tiếp tục thêm các mẫu khác...
  // File này sẽ được mở rộng với 100+ mẫu trong các lần cập nhật tiếp theo
  // Mỗi mẫu là một bức tranh độc đáo, không lặp lại
];

