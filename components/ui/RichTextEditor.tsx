// components/ui/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Extension } from '@tiptap/core';
import { 
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
  Type, Palette, Sparkles, ChevronDown, Sticker, User, Lock, Crown
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ✅ Import new design presets system
import { 
  GRADIENT_PRESETS as NEW_GRADIENT_PRESETS,
  LETTER_PATTERNS as NEW_LETTER_PATTERNS,
  createGradientCSS as createNewGradientCSS,
  getLetterPatternStyle as getNewPatternStyle,
  LETTER_PATTERN_CATEGORIES,
  GRADIENT_CATEGORIES,
  type DesignTier,
} from '@/lib/design-presets';

// ✅ Import font registry và loader
import { getAllFonts, getFontById, VN_FONTS, EN_FONTS, type FontId } from '@/lib/font-registry';
import { ensureFontsLoaded, ensureFontLoaded } from '@/lib/font-loader';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  background?: string;
  pattern?: string;
  onBackgroundChange?: (color: string, pattern: string) => void;
  showToolbar?: boolean;
  showEditorContent?: boolean;
  onOpenStickerPalette?: () => void;
  onGetContent?: (getContent: () => { html: string; usedFonts: FontId[] }) => void; // ✅ Callback với usedFonts
  onUsedFontsChange?: (usedFonts: FontId[]) => void; // ✅ Callback khi usedFonts thay đổi
}

// ✅ Sử dụng font registry (100 fonts: 50 VN + 50 EN)
// Convert sang format cũ để tương thích với code hiện tại
const FONT_FAMILIES = getAllFonts().map(font => ({
  id: font.id,
  name: font.label,
  value: `'${font.googleFamily}', ${font.fallback}`, // Dùng tên Google Font thật
}));

const FONT_SIZES = [
  { label: 'Nhỏ', value: '14' },
  { label: 'Bình thường', value: '16' },
  { label: 'Lớn', value: '20' },
  { label: 'Rất lớn', value: '24' },
  { label: 'Cực lớn', value: '32' },
];

const TEXT_COLORS = [
  '#000000', '#333333', '#666666', '#8B4513', '#654321',
  '#C62828', '#D32F2F', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#00BCD4', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
];

const TEXT_EFFECTS = [
  { id: 'none', name: 'Không có', icon: '—' },
  { id: 'typewriter', name: 'Đánh máy', icon: '⌨️' },
  { id: 'fade', name: 'Fade In', icon: '✨' },
  { id: 'slide', name: 'Trượt lên', icon: '⬆️' },
  { id: 'glow', name: 'Phát sáng', icon: '💫' },
  { id: 'handwriting', name: 'Viết tay', icon: '✍️' },
];

// ✅ Sử dụng letter patterns từ hệ thống mới (100+ mẫu)
const LETTER_PATTERNS = NEW_LETTER_PATTERNS.map(p => ({
  id: p.id,
  name: p.nameVi,
  preview: p.preview,
  tier: p.tier,
  category: p.category,
}));

// ✅ Sử dụng gradient presets từ hệ thống mới (120+ mẫu)
const GRADIENT_PRESETS = NEW_GRADIENT_PRESETS.map(g => ({
  id: g.id,
  name: g.nameVi,
  colors: g.colors,
  direction: g.direction,
  tier: g.tier,
  category: g.category,
}));

// ✅ Helper function để tạo CSS gradient từ preset
function createGradientCSS(preset: { colors: string[]; direction: string }): string {
  const stops = preset.colors.map((color, i) => {
    const percent = (i / (preset.colors.length - 1)) * 100;
    return `${color} ${percent}%`;
  }).join(', ');
  return `linear-gradient(${preset.direction}, ${stops})`;
}

// ✅ Màu đơn sắc (backup)
const LETTER_COLORS = [
  '#ffffff', '#fefefe', '#fafafa', '#fffef7', '#fdf8f0',
  '#fff8e1', '#fff3e0', '#ffe0b2', '#ffccbc', '#ffecb3',
  '#f8bbd0', '#fce4ec', '#fff0f5', '#ffe4e6', '#fdf2f8',
  '#e1bee7', '#f3e5f5', '#ede7f6', '#e8eaf6', '#f5f3ff',
  '#c5cae9', '#b3e5fc', '#b2ebf2', '#e0f7fa', '#e3f2fd',
  '#b2dfdb', '#c8e6c9', '#dcedc8', '#e8f5e9', '#f1f8e9',
  '#f5f5dc', '#faf0e6', '#faebd7', '#ffe4c4', '#f0ead6',
];

// FontSize Extension
const FontSize = Extension.create({
  name: 'fontSize',
  
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => {
              const fontSize = element.style.fontSize;
              if (!fontSize) return null;
              return fontSize.replace('px', '');
            },
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}px`,
              };
            },
          },
        },
      },
    ];
  },
  
  addCommands() {
    return {
      setFontSize: (fontSize: string) => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});


// FontFamily Extension (Stable, no DOM mutations)
// - Persist font-family via TipTap schema (TextStyle mark)
// - Also add `data-font-family` + `--tiptap-font-family` so CSS can safely override with !important
const FontFamilyStable = Extension.create({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: (element) => {
              // Prefer computed style, but keep fallback list when possible
              const styleAttr = element.getAttribute('style') || '';
              const match = styleAttr.match(/font-family:\s*([^;]+)/i);
              if (match?.[1]) return match[1].trim();
              const computed = (element as HTMLElement).style?.fontFamily;
              return computed || null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontFamily) return {};
              const fontFamily = String(attributes.fontFamily).trim();

              // Note: TipTap will merge multiple `style:` strings from other extensions (color/fontSize...)
              return {
                'data-font-family': 'true',
                style: `font-family: ${fontFamily}; --tiptap-font-family: ${fontFamily};`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily: string) =>
        ({ chain }: any) => {
          return chain().setMark('textStyle', { fontFamily }).run();
        },

      unsetFontFamily:
        () =>
        ({ chain }: any) => {
          return chain()
            .setMark('textStyle', { fontFamily: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// ✅ Giữ lại TextStyle (đặc biệt là font-family/font-size/color) khi xuống dòng.
// Nếu không, ProseMirror thường sẽ reset textStyle sau khi split paragraph,
// dẫn tới "dòng mới bị mất font".
// ✅ Virtualized Font List Component - chỉ render items visible
function VirtualizedFontList({ 
  fonts, 
  onSelectFont 
}: { 
  fonts: typeof VN_FONTS; 
  onSelectFont: (fontId: FontId) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 15 }); // Render 15 items đầu tiên
  const ITEM_HEIGHT = 70; // Chiều cao mỗi item (px)
  const VISIBLE_COUNT = 15; // Số items visible

  // ✅ Tính toán visible range khi scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const start = Math.floor(scrollTop / ITEM_HEIGHT);
      const end = Math.min(start + VISIBLE_COUNT, fonts.length);
      setVisibleRange({ start, end });
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll);
  }, [fonts.length]);

  // ✅ Render items visible + buffer
  const visibleFonts = fonts.slice(
    Math.max(0, visibleRange.start - 2), // Buffer trước
    Math.min(fonts.length, visibleRange.end + 2) // Buffer sau
  );
  const startIndex = Math.max(0, visibleRange.start - 2);

  return (
    <div 
      ref={containerRef}
      className="overflow-y-auto p-2 flex-1"
      style={{ 
        height: '400px',
        position: 'relative'
      }}
    >
      {/* Spacer trước */}
      {startIndex > 0 && (
        <div style={{ height: startIndex * ITEM_HEIGHT }} />
      )}
      
      {/* Visible items */}
      {visibleFonts.map((font, idx) => {
        const actualIndex = startIndex + idx;
        const previewText = font.isVNSafe 
          ? 'AaBbCcĐđĂăÂâÊêÔôƠơƯư 0123'
          : 'The quick brown fox 0123';
        
        return (
          <FontItem
            key={font.id}
            font={font}
            previewText={previewText}
            onSelect={() => onSelectFont(font.id)}
            onVisible={() => {
              // ✅ Load font khi item visible
              ensureFontLoaded(font.id);
            }}
          />
        );
      })}
      
      {/* Spacer sau */}
      {visibleRange.end < fonts.length && (
        <div style={{ height: (fonts.length - visibleRange.end) * ITEM_HEIGHT }} />
      )}
    </div>
  );
}

// ✅ Font Item Component với IntersectionObserver
function FontItem({
  font,
  previewText,
  onSelect,
  onVisible,
}: {
  font: typeof VN_FONTS[0];
  previewText: string;
  onSelect: () => void;
  onVisible: () => void;
}) {
  const itemRef = useRef<HTMLButtonElement>(null);

  // ✅ IntersectionObserver để load font khi item visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onVisible();
            observer.disconnect(); // Chỉ load 1 lần
          }
        });
      },
      { rootMargin: '50px' } // Load trước khi vào viewport 50px
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <button
      ref={itemRef}
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onSelect}
      onMouseEnter={() => {
        // ✅ Load font khi hover (backup nếu IntersectionObserver chưa trigger)
        ensureFontLoaded(font.id);
      }}
      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gold/10 transition group"
      style={{ minHeight: '70px' }}
    >
      <div className="font-medium text-sm text-ink mb-1">
        {font.label}
      </div>
      <div 
        className="text-xs text-ink/70"
        style={{ 
          fontFamily: `'${font.googleFamily}', ${font.fallback}`,
          lineHeight: '1.4'
        }}
      >
        {previewText}
      </div>
      {!font.isVNSafe && (
        <div className="text-xs text-amber-600 mt-1 opacity-0 group-hover:opacity-100 transition">
          (Fallback VI)
        </div>
      )}
    </button>
  );
}

const PreserveTextStyleOnEnter = Extension.create({
  name: 'preserveTextStyleOnEnter',

  addKeyboardShortcuts() {
    return {
      Enter: () => {
        // Không can thiệp vào code block/list để tránh phá behavior mặc định
        if (
          this.editor.isActive('codeBlock') ||
          this.editor.isActive('bulletList') ||
          this.editor.isActive('orderedList') ||
          this.editor.isActive('taskList')
        ) {
          return false;
        }

        const attrs = this.editor.getAttributes('textStyle') ?? {};
        const didSplit = this.editor.commands.splitBlock();
        if (!didSplit) return false;

        // SetMark trên selection rỗng sẽ set storedMarks -> text gõ tiếp sẽ giữ style
        if (attrs && Object.keys(attrs).length > 0) {
          this.editor.commands.setMark('textStyle', attrs);
        }

        return true;
      },
    };
  },
});

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Viết lời nhắn yêu thương của bạn...',
  className = '',
  background = '#ffffff',
  pattern = 'solid',
  onBackgroundChange,
  showToolbar = true,
  showEditorContent = true,
  onOpenStickerPalette,
  onGetContent,
  onUsedFontsChange,
}: RichTextEditorProps) {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [fontTab, setFontTab] = useState<'vn' | 'en'>('vn'); // Tab font (VN/EN)
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showEffectMenu, setShowEffectMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const [bgActiveTab, setBgActiveTab] = useState<'gradients' | 'colors' | 'patterns'>('gradients');
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [currentFontSize, setCurrentFontSize] = useState('16');
  
  // ✅ Track used fonts để lưu vào DB
  const [usedFonts, setUsedFonts] = useState<Set<FontId>>(new Set());
  // ✅ Track giá trị trước đó để tránh vòng lặp vô hạn
  const prevUsedFontsRef = useRef<string>('');
  
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const sizeMenuRef = useRef<HTMLDivElement>(null);
  const effectMenuRef = useRef<HTMLDivElement>(null);
  const bgMenuRef = useRef<HTMLDivElement>(null);

  // ✅ Lưu selection cuối cùng để khi click toolbar/dropdown không bị mất vùng chọn.
  const lastSelectionRef = useRef<{ from: number; to: number } | null>(null)
  // ✅ Keep latest `content` prop for callbacks to avoid stale closures
  const contentRef = useRef<string>(content || '');

  useEffect(() => {
    contentRef.current = content || '';
  }, [content]);

  // ✅ Track last local editor update to prevent "controlled echo" from resetting content
  const lastEmittedHtmlRef = useRef<string>(content || '');
  const lastEmittedAtRef = useRef<number>(0);
;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        underline: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      FontFamilyStable,
      FontSize,
      PreserveTextStyleOnEnter,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastEmittedHtmlRef.current = html;
      lastEmittedAtRef.current = Date.now();

      // Only notify parent when it's not already in sync
      if (html !== contentRef.current) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none w-full',
        style: `background: transparent; width: 100%;`,
      },
    },
  });

  // Keep track of current selection so toolbar actions can restore it
  useEffect(() => {
    if (!editor) return;
    const updateSelection = () => {
      lastSelectionRef.current = {
        from: editor.state.selection.from,
        to: editor.state.selection.to,
      };
    };
    updateSelection();
    editor.on('selectionUpdate', updateSelection);
    editor.on('transaction', updateSelection);
    return () => {
      editor.off('selectionUpdate', updateSelection);
      editor.off('transaction', updateSelection);
    };
  }, [editor]);

  // Sync editor content from parent ONLY when the parent truly changes it (page switch, load, etc.)
  // Avoid calling setContent for the editor's own updates (prevents selection loss + style resets).
  const normalizeForSync = useCallback((html: string) => {
    return (html || '')
      // Remove recipient header if present
      .replace(/^<p>Gửi\s+<span[^>]*>.*?<\/span>,?<\/p>(<p><br><\/p>)+/i, '')
      .replace(/^<p>Gửi\s+<span[^>]*>.*?<\/span>,?<\/p>/i, '')
      // Remove sender footer if present
      .replace(/<p><br><\/p><p[^>]*style="text-align:\s*right[^"]*"[^>]*>Yêu thương,[\s\S]*?<\/p>\s*$/i, '')
      .trim();
  }, []);

  useEffect(() => {
    if (!editor) return;

    const incoming = content || '';
    const current = editor.getHTML();

    if (incoming === current) return;

    const incomingNorm = normalizeForSync(incoming);
    const currentNorm = normalizeForSync(current);

    // If only header/footer/normalization differs, don't reset editor
    if (incomingNorm === currentNorm) return;

    // If this change is just an "echo" of what the editor emitted very recently, ignore
    const recentlyEmitted = Date.now() - lastEmittedAtRef.current < 500;
    if (recentlyEmitted) {
      const emittedNorm = normalizeForSync(lastEmittedHtmlRef.current);
      if (incomingNorm === emittedNorm) return;
    }

    // External update: replace document without emitting another onUpdate
    editor.commands.setContent(incoming, { emitUpdate: false });
  }, [content, editor, normalizeForSync]);



  // ✅ Expose getContent function to parent via callback (với usedFonts)
  useEffect(() => {
    if (editor && onGetContent) {
      onGetContent(() => ({
        html: editor.getHTML(),
        usedFonts: Array.from(usedFonts),
      }));
    }
  }, [editor, onGetContent, usedFonts]);
  
  // ✅ Notify parent khi usedFonts thay đổi (chỉ khi thực sự có thay đổi)
  useEffect(() => {
    if (!onUsedFontsChange) return;
    
    const currentUsedFonts = Array.from(usedFonts).sort().join(',');
    // Chỉ gọi callback nếu giá trị thực sự khác với lần trước
    if (currentUsedFonts !== prevUsedFontsRef.current) {
      prevUsedFontsRef.current = currentUsedFonts;
      onUsedFontsChange(Array.from(usedFonts));
    }
  }, [usedFonts, onUsedFontsChange]);

  // ✅ Extract used fonts từ HTML khi load content
  useEffect(() => {
    if (!editor || !content) return;
    
    // Parse HTML để tìm tất cả font-family được sử dụng
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const spansWithFont = tempDiv.querySelectorAll('span[style*="font-family"]');
    
    const foundFontIds = new Set<FontId>();
    spansWithFont.forEach((span) => {
      const htmlElement = span as HTMLElement;
      const styleAttr = htmlElement.getAttribute('style') || '';
      const fontMatch = styleAttr.match(/font-family:\s*([^;]+)/);
      
      if (fontMatch) {
        const fontValue = fontMatch[1].trim();
        // Tìm fontId từ fontValue (có thể là Google Font name)
        const fontName = fontValue.split("'")[1] || fontValue.split('"')[1] || fontValue.split(',')[0].trim();
        
        // Tìm trong registry
        const foundFont = getAllFonts().find(f => 
          f.googleFamily === fontName || 
          fontValue.includes(f.googleFamily)
        );
        
        if (foundFont) {
          foundFontIds.add(foundFont.id);
          // Load font ngay khi phát hiện
          ensureFontsLoaded([foundFont.id]);
        }
      }
    });
    
    if (foundFontIds.size > 0) {
      setUsedFonts(prev => new Set([...prev, ...foundFontIds]));
    }
  }, [content, editor]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fontMenuRef.current && !fontMenuRef.current.contains(event.target as Node)) {
        setShowFontMenu(false);
      }
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target as Node)) {
        setShowColorMenu(false);
      }
      if (sizeMenuRef.current && !sizeMenuRef.current.contains(event.target as Node)) {
        setShowSizeMenu(false);
      }
      if (effectMenuRef.current && !effectMenuRef.current.contains(event.target as Node)) {
        setShowEffectMenu(false);
      }
      if (bgMenuRef.current && !bgMenuRef.current.contains(event.target as Node)) {
        setShowBackgroundMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  if (!editor) {
    return <div className="p-4 text-gray-500">Đang tải trình soạn thảo...</div>;
  }

  /**
   * Set font family for selected text
   * Uses CSS variable approach to override global !important rules
   */
  const chainWithSelection = () => {
    const chain = editor.chain().focus();
    const sel = lastSelectionRef.current;
    if (sel && typeof sel.from === 'number' && typeof sel.to === 'number') {
      chain.setTextSelection(sel);
    }
    return chain;
  };

  /**
   * ✅ Set font family với load on-demand
   * - Load font từ Google Fonts trước khi apply
   * - Track used fonts để lưu vào DB
   */
  const setFontFamily = (fontIdOrValue: string) => {
    if (!editor) return;
    
    // ✅ Tìm font từ registry (có thể là id hoặc value cũ)
    let fontId: FontId | null = null;
    let fontValue = fontIdOrValue;
    
    // Kiểm tra xem có phải là fontId từ registry không
    const font = getFontById(fontIdOrValue);
    if (font) {
      fontId = font.id;
      fontValue = `'${font.googleFamily}', ${font.fallback}`;
      
      // ✅ Load font on-demand trước khi apply
      ensureFontsLoaded([fontId]);
      
      // ✅ Track used font
      setUsedFonts(prev => new Set([...prev, fontId!]));
    } else {
      // Fallback: tìm font theo value (tương thích với code cũ)
      const foundFont = FONT_FAMILIES.find(f => f.value === fontIdOrValue || f.id === fontIdOrValue);
      if (foundFont) {
        const registryFont = getFontById(foundFont.id);
        if (registryFont) {
          fontId = registryFont.id;
          fontValue = `'${registryFont.googleFamily}', ${registryFont.fallback}`;
          ensureFontsLoaded([fontId]);
          setUsedFonts(prev => new Set([...prev, fontId!]));
        }
      }
    }
    // ✅ Apply mark ngay lập tức. Font sẽ tự render ngay khi load xong.
    chainWithSelection().setFontFamily(fontValue).run();

    setShowFontMenu(false);
  };

  const setFontSize = (size: string) => {
    chainWithSelection().setFontSize(size).run();
    setCurrentFontSize(size);
    setShowSizeMenu(false);
  };

  // ✅ Sử dụng patterns từ hệ thống mới (lib/design-presets)
  const getPatternStyle = (patternId: string, color: string) => {
    // Hỗ trợ cả gradient và solid color
    const isGradient = color.includes('gradient');
    
    // Tìm pattern từ hệ thống mới
    const patternData = NEW_LETTER_PATTERNS.find(p => p.id === patternId);
    
    // Nếu là solid hoặc không tìm thấy pattern
    if (!patternData || patternId === 'solid' || !patternData.svg) {
      if (isGradient) {
        return { background: color };
      }
      return { backgroundColor: color };
    }
    
    // Tạo URL từ SVG
    const svgUrl = `url("data:image/svg+xml,${encodeURIComponent(patternData.svg)}")`;
    
    if (isGradient) {
      return {
        background: `${svgUrl}, ${color}`,
        backgroundSize: patternData.size,
      };
    }
    
    return {
      backgroundImage: svgUrl,
      backgroundSize: patternData.size,
      backgroundColor: color,
    };
  };

  const setTextColor = (color: string) => {
    chainWithSelection().setColor(color).run();
    setShowColorMenu(false);
  };

  const getCurrentFont = () => {
    const fontFamily = editor.getAttributes('textStyle').fontFamily;
    return FONT_FAMILIES.find(f => f.value === fontFamily) || FONT_FAMILIES[0];
  };

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className={`flex items-center gap-2 p-3 bg-cream-light border border-gold/20 rounded-t-xl flex-wrap shrink-0`}
          onMouseDownCapture={(e) => {
            const target = e.target as HTMLElement;
            if (target.closest('button')) e.preventDefault();
          }}
        >
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive('bold') ? 'bg-burgundy text-cream' : 'bg-cream hover:bg-gold/10 text-ink'
          }`}
          title="In đậm"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive('italic') ? 'bg-burgundy text-cream' : 'bg-cream hover:bg-gold/10 text-ink'
          }`}
          title="In nghiêng"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive('underline') ? 'bg-burgundy text-cream' : 'bg-cream hover:bg-gold/10 text-ink'
          }`}
          title="Gạch chân"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gold/30 mx-1" />

        {/* Font Family - Enhanced với preview và lazy-load */}
        <div className="relative" ref={fontMenuRef}>
          <button
            type="button"
            onClick={() => setShowFontMenu(!showFontMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-cream hover:bg-gold/10 rounded-lg transition text-ink text-sm"
            title="Font chữ"
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">{getCurrentFont().name}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {showFontMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 bg-cream-light border border-gold/20 rounded-xl shadow-vintage z-50 w-80 max-h-[400px] overflow-hidden flex flex-col"
              >
                {/* Tabs */}
                <div className="flex border-b border-gold/20 shrink-0">
                  <button
                    type="button"
                    onClick={() => setFontTab('vn')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                      fontTab === 'vn' 
                        ? 'bg-burgundy text-cream' 
                        : 'text-ink hover:bg-gold/10'
                    }`}
                  >
                    Tiếng Việt (50)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontTab('en')}
                    className={`flex-1 px-4 py-2 text-sm font-medium transition ${
                      fontTab === 'en' 
                        ? 'bg-burgundy text-cream' 
                        : 'text-ink hover:bg-gold/10'
                    }`}
                  >
                    Tiếng Anh (50)
                  </button>
                </div>
                
                {/* Font List với preview - Virtualized */}
                <VirtualizedFontList
                  fonts={fontTab === 'vn' ? VN_FONTS : EN_FONTS}
                  onSelectFont={(fontId) => {
                    setFontFamily(fontId);
                    setShowFontMenu(false);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Font Size - Preset Buttons */}
        <div className="relative" ref={sizeMenuRef}>
          <button
            type="button"
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-cream hover:bg-gold/10 rounded-lg transition text-ink text-sm"
            title="Cỡ chữ"
          >
            <span className="text-xs">{FONT_SIZES.find(s => s.value === currentFontSize)?.label || currentFontSize}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {showSizeMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 bg-cream-light border border-gold/20 rounded-xl shadow-vintage p-2 z-50 min-w-[150px]"
              >
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    onClick={() => setFontSize(size.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                      currentFontSize === size.value ? 'bg-burgundy text-cream' : 'hover:bg-gold/10'
                    }`}
                    style={{ fontSize: `${size.value}px` }}
                  >
                    {size.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Text Color - Compact Grid */}
        <div className="relative" ref={colorMenuRef}>
          <button
            type="button"
            onClick={() => setShowColorMenu(!showColorMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-cream hover:bg-gold/10 rounded-lg transition text-ink"
            title="Màu chữ"
          >
            <Palette className="w-4 h-4" />
            <div 
              className="w-4 h-4 rounded border border-gold/30"
              style={{ backgroundColor: editor.getAttributes('textStyle').color || '#000000' }}
            />
          </button>
          <AnimatePresence>
            {showColorMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 bg-cream-light border border-gold/20 rounded-xl shadow-vintage p-3 z-50 w-56"
              >
                <div className="grid grid-cols-6 gap-1.5">
                  {TEXT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setTextColor(color);
                        setShowColorMenu(false);
                      }}
                      className="w-7 h-7 rounded-md border border-gold/20 hover:scale-110 hover:border-burgundy/50 transition-all shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-gold/30 mx-1" />

        {/* Text Align */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive({ textAlign: 'left' }) ? 'bg-burgundy text-cream' : 'bg-cream hover:bg-gold/10 text-ink'
          }`}
          title="Căn trái"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive({ textAlign: 'center' }) ? 'bg-burgundy text-cream' : 'bg-cream hover:bg-gold/10 text-ink'
          }`}
          title="Căn giữa"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-2 rounded-lg transition ${
            editor.isActive({ textAlign: 'right' }) ? 'bg-burgundy text-cream' : 'bg-cream hover:bg-gold/10 text-ink'
          }`}
          title="Căn phải"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gold/30 mx-1" />

        {/* Text Effect */}
        <div className="relative" ref={effectMenuRef}>
          <button
            type="button"
            onClick={() => setShowEffectMenu(!showEffectMenu)}
            className="flex items-center gap-2 px-3 py-2 bg-cream hover:bg-gold/10 rounded-lg transition text-ink text-sm"
            title="Hiệu ứng chữ"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Hiệu ứng</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          <AnimatePresence>
            {showEffectMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-cream-light border border-gold/20 rounded-xl shadow-vintage p-2 z-50 min-w-[180px]"
              >
                {TEXT_EFFECTS.map((effect) => (
                  <button
                    key={effect.id}
                    type="button"
                    onClick={() => {
                      setSelectedEffect(effect.id);
                      setShowEffectMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition text-sm flex items-center gap-2 ${
                      selectedEffect === effect.id ? 'bg-burgundy text-cream' : 'hover:bg-gold/10'
                    }`}
                  >
                    <span>{effect.icon}</span>
                    <span>{effect.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticker Button */}
        {onOpenStickerPalette && (
          <>
            <div className="w-px h-6 bg-gold/30 mx-1" />
            <button
              type="button"
              onClick={onOpenStickerPalette}
              className="flex items-center gap-2 px-3 py-2 bg-cream hover:bg-gold/10 rounded-lg transition text-ink text-sm"
              title="Thêm Sticker"
            >
              <Sticker className="w-4 h-4" />
              <span className="hidden sm:inline">Sticker</span>
            </button>
          </>
        )}

        {/* Background Color/Pattern */}
        {onBackgroundChange && (
          <div className="relative ml-auto" ref={bgMenuRef}>
            <button
              type="button"
              onClick={() => setShowBackgroundMenu(!showBackgroundMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-cream hover:bg-gold/10 rounded-lg transition text-ink text-sm"
              title="Màu nền & Họa tiết"
            >
              <div 
                className="w-7 h-7 rounded-lg border-2 border-gold/30"
                style={{ background: background }}
              />
              <span className="hidden sm:inline">Nền</span>
            </button>
            <AnimatePresence>
              {showBackgroundMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 bg-cream-light border border-gold/20 rounded-2xl shadow-2xl p-4 z-50 w-[360px]"
                >
                  {/* Tabs */}
                  <div className="flex gap-1 mb-3 bg-gold/10 p-1 rounded-xl">
                    <button
                      onClick={() => setBgActiveTab('gradients')}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        bgActiveTab === 'gradients' ? 'bg-white text-burgundy shadow-sm' : 'text-ink/70 hover:bg-gold/10'
                      }`}
                    >
                      🎨 Gradient
                    </button>
                    <button
                      onClick={() => setBgActiveTab('colors')}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        bgActiveTab === 'colors' ? 'bg-white text-burgundy shadow-sm' : 'text-ink/70 hover:bg-gold/10'
                      }`}
                    >
                      🎯 Đơn sắc
                    </button>
                    <button
                      onClick={() => setBgActiveTab('patterns')}
                      className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        bgActiveTab === 'patterns' ? 'bg-white text-burgundy shadow-sm' : 'text-ink/70 hover:bg-gold/10'
                      }`}
                    >
                      ✨ Họa tiết
                    </button>
                  </div>

                  {/* Gradient Tab */}
                  {bgActiveTab === 'gradients' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-ink/70">Chọn gradient ({GRADIENT_PRESETS.length} mẫu)</label>
                      <div className="grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-1">
                        {GRADIENT_PRESETS.map((preset) => {
                          const gradientCSS = createGradientCSS(preset);
                          const isSelected = background === gradientCSS;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => {
                                onBackgroundChange(gradientCSS, 'solid');
                              }}
                              className={`group relative rounded-xl border-2 transition-all hover:scale-105 ${
                                isSelected ? 'border-burgundy ring-2 ring-burgundy/30 scale-105' : 'border-gold/20 hover:border-gold/50'
                              }`}
                              title={preset.name}
                            >
                              <div 
                                className="w-full aspect-square rounded-lg"
                                style={{ background: gradientCSS }}
                              />
                              <span className="absolute bottom-0 left-0 right-0 text-[8px] text-center py-0.5 bg-white/80 rounded-b-lg truncate px-1">
                                {preset.name}
                              </span>
                              {isSelected && (
                                <div className="absolute top-1 right-1 w-4 h-4 bg-burgundy rounded-full flex items-center justify-center">
                                  <span className="text-white text-[10px]">✓</span>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Colors Tab */}
                  {bgActiveTab === 'colors' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-ink/70">Màu đơn sắc ({LETTER_COLORS.length} màu)</label>
                      <div className="grid grid-cols-7 gap-1.5 max-h-[200px] overflow-y-auto pr-1">
                        {LETTER_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => onBackgroundChange(color, pattern)}
                            className={`w-9 h-9 rounded-lg border-2 transition hover:scale-110 ${
                              background === color && !background.includes('gradient') ? 'border-burgundy ring-2 ring-burgundy/30 scale-110' : 'border-gold/20 hover:border-gold/50'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patterns Tab */}
                  {bgActiveTab === 'patterns' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-ink/70">Họa tiết ({LETTER_PATTERNS.length} mẫu)</label>
                      <div className="grid grid-cols-5 gap-1.5 max-h-[280px] overflow-y-auto pr-1">
                        {LETTER_PATTERNS.map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => onBackgroundChange(background, p.id)}
                            className={`p-2 rounded-xl border-2 transition flex flex-col items-center gap-1 hover:scale-105 ${
                              pattern === p.id ? 'border-burgundy bg-burgundy/10 ring-1 ring-burgundy/30 scale-105' : 'border-gold/30 hover:bg-gold/10'
                            }`}
                            title={p.name}
                          >
                            <span className="text-xl">{p.preview}</span>
                            <span className="text-[9px] text-ink/70 truncate w-full text-center font-medium">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        </div>
      )}

      {/* Editor Content */}
      {showEditorContent && (
        <div 
          className={`flex-1 border border-gold/20 ${showToolbar ? 'border-t-0 rounded-b-xl' : 'rounded-xl'} overflow-hidden min-h-0 flex flex-col`}
          style={getPatternStyle(pattern, background)}
        >
          <div className="flex-1 overflow-y-auto p-6 min-h-0 w-full">
            <style jsx global>{`
              .ProseMirror {
                width: 100% !important;
                max-width: 100% !important;
                min-width: 100% !important;
                word-wrap: break-word;
                overflow-wrap: break-word;
              }
              .ProseMirror p {
                width: 100%;
                max-width: 100%;
              }
            `}</style>
            <div style={{ width: '100%', maxWidth: '100%' }}>
              <EditorContent 
                editor={editor}
                className="w-full min-h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
