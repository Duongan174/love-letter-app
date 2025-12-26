// lib/font-loader.ts
import { FONT_REGISTRY, type FontId } from './font-registry';

const loaded = new Set<string>();
const loading = new Map<string, Promise<void>>();

function buildGoogleCss2Url(font: { googleFamily: string; axes?: string; subsets: Array<'latin' | 'vietnamese'> }) {
  const family = encodeURIComponent(font.googleFamily.replace(/ /g, '+'));
  const axes = font.axes ? `:${encodeURIComponent(font.axes)}` : '';
  const subset = font.subsets.includes('vietnamese') ? 'latin,vietnamese' : 'latin';
  return `https://fonts.googleapis.com/css2?family=${family}${axes}&subset=${subset}&display=swap`;
}

/**
 * ✅ Load font on-demand từ Google Fonts (từng font riêng lẻ)
 * Tối ưu: chỉ load font cần thiết, không gom nhiều font vào 1 request
 */
export function ensureFontsLoaded(fontIds: FontId[]): void {
  if (typeof document === 'undefined') return;

  const valid = fontIds.filter(id => Boolean(FONT_REGISTRY[id]));
  if (valid.length === 0) return;

  // ✅ Load từng font riêng lẻ để tối ưu
  valid.forEach(fontId => {
    if (loaded.has(fontId)) return;
    if (loading.has(fontId)) return;

    const font = FONT_REGISTRY[fontId];
    if (!font) return;

    const href = buildGoogleCss2Url(font);
    
    // ✅ Chống duplicate theo href
    const existingLink = document.querySelector(`link[rel="stylesheet"][href="${CSS.escape(href)}"]`);
    if (existingLink) {
      loaded.add(fontId);
      return;
    }

    // ✅ Tạo promise để track loading state
    const loadPromise = new Promise<void>((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.crossOrigin = 'anonymous';

      link.onload = () => {
        loaded.add(fontId);
        loading.delete(fontId);
        resolve();
      };

      link.onerror = () => {
        loading.delete(fontId);
        resolve(); // Resolve để không block
      };

      document.head.appendChild(link);
    });

    loading.set(fontId, loadPromise);
  });
}

/**
 * ✅ Load single font (tối ưu cho lazy-load khi hover/visible)
 */
export function ensureFontLoaded(fontId: FontId): void {
  ensureFontsLoaded([fontId]);
}

/**
 * ✅ Preload fonts (dùng cho core fonts)
 */
export function preloadFonts(fontIds: FontId[]) {
  if (typeof document === 'undefined') return;

  const valid = fontIds.filter(id => Boolean(FONT_REGISTRY[id]));
  if (valid.length === 0) return;

  valid.forEach(fontId => {
    const font = FONT_REGISTRY[fontId];
    if (!font) return;

    // Preload font file (không phải CSS)
    // Google Fonts sẽ tự động serve font file từ CSS
    // Nên chỉ cần preload CSS là đủ
    const href = buildGoogleCss2Url(font);
    if (!href) return;

    const exists = document.querySelector(`link[rel="preload"][href="${CSS.escape(href)}"]`);
    if (exists) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
  });
}

