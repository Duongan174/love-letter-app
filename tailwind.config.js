/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // === VINTAGE COLOR PALETTE ===
      colors: {
        // Primary - Burgundy (Wine Red)
        burgundy: {
          DEFAULT: '#722F37',
          50: '#FAF5F6',
          100: '#F2E4E5',
          200: '#E5C9CC',
          300: '#D4A4A9',
          400: '#B86B73',
          500: '#722F37',
          600: '#5A252C',
          700: '#451C22',
          800: '#301418',
          900: '#1B0B0E',
        },
        // Accent - Gold
        gold: {
          DEFAULT: '#C9A962',
          50: '#FBF8F0',
          100: '#F5EDD9',
          200: '#EBDBB3',
          300: '#DFC98D',
          400: '#D4BA7D',
          500: '#C9A962',
          600: '#A68B4B',
          700: '#836D3B',
          800: '#60502B',
          900: '#3D331C',
        },
        // Neutral - Cream/Paper
        cream: {
          DEFAULT: '#F5F0E8',
          light: '#FFFCF7',
          dark: '#E8DFD0',
        },
        // Aged Paper
        paper: {
          DEFAULT: '#E8DFD0',
          aged: '#D9CDB8',
          parchment: '#F8F4EC',
        },
        // Forest Green (Secondary accent)
        forest: {
          DEFAULT: '#2D4A3E',
          light: '#3D5F50',
          dark: '#1F3329',
        },
        // Ink (Text)
        ink: {
          DEFAULT: '#2C2416',
          light: '#4A3F2F',
          muted: '#6B5D4A',
        },
        // Sepia
        sepia: {
          DEFAULT: '#704214',
          light: '#8B5A2B',
          dark: '#553208',
        },
      },

      // === TYPOGRAPHY (Đã cập nhật hỗ trợ tiếng Việt) ===
      fontFamily: {
        vn: ['Be Vietnam Pro', 'sans-serif'], // Font tiếng Việt mới thêm
        display: ['Playfair Display', 'Be Vietnam Pro', 'serif'], // Đã cập nhật
        elegant: ['EB Garamond', 'Be Vietnam Pro', 'serif'], // Đã cập nhật
        body: ['Be Vietnam Pro', 'Lexend', 'sans-serif'], // Đã cập nhật
        script: ['Dancing Script', 'cursive'], // Đã cập nhật
        
        // Các font gốc vẫn giữ nguyên
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        modern: ['Lexend', 'system-ui', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        playfair: ['Playfair Display', 'Georgia', 'serif'],
        lexend: ['Lexend', 'system-ui', 'sans-serif'],
      },

      // === FONT SIZES ===
      fontSize: {
        'display-2xl': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['4rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '0' }],
        'display-md': ['2.25rem', { lineHeight: '1.25' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3' }],
      },

      // === SPACING ===
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // === BORDER RADIUS ===
      borderRadius: {
        'elegant': '0.25rem',
        'soft': '0.75rem',
        'vintage': '0.375rem',
      },

      // === SHADOWS ===
      boxShadow: {
        'vintage': '0 4px 20px rgba(114, 47, 55, 0.1), 0 2px 8px rgba(0,0,0,0.05)',
        'vintage-lg': '0 8px 32px rgba(114, 47, 55, 0.12), 0 2px 8px rgba(0,0,0,0.08)',
        'elevated': '0 12px 48px rgba(114, 47, 55, 0.15), 0 4px 16px rgba(0,0,0,0.1)',
        'gold-glow': '0 0 20px rgba(201, 169, 98, 0.3)',
        'inner-vintage': 'inset 0 2px 4px rgba(44, 36, 22, 0.1)',
      },

      // === BACKGROUND IMAGE ===
      backgroundImage: {
        'gold-shimmer': 'linear-gradient(135deg, #D4BA7D 0%, #C9A962 50%, #A68B4B 100%)',
        'burgundy-gradient': 'linear-gradient(135deg, #8B4049 0%, #722F37 50%, #5A252C 100%)',
        'vintage-gradient': 'linear-gradient(180deg, #FFFCF7 0%, #F5F0E8 30%, #E8DFD0 100%)',
        'paper-texture': `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      },

      // === ANIMATIONS ===
      animation: {
        'fade-vintage': 'fadeInVintage 0.6s ease-out forwards',
        'scale-elegant': 'scaleElegant 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'gold-shimmer': 'goldShimmer 3s linear infinite',
        'float': 'gentleFloat 4s ease-in-out infinite',
        'rotate-slow': 'rotateSpark 8s linear infinite',
        'blob': 'blob 12s infinite ease-in-out',
      },

      keyframes: {
        fadeInVintage: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleElegant: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        goldShimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        rotateSpark: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
      },

      // === TRANSITIONS ===
      transitionTimingFunction: {
        'elegant': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
} 