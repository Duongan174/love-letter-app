// components/ui/RichTextEditor.tsx
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Extension } from '@tiptap/core';
import { 
  Bold, Italic, Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight,
  Type, Palette, Sparkles, ChevronDown, Sticker, User, Lock, Crown
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
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
  recipientName?: string;
  senderName?: string;
  onRecipientNameChange?: (name: string) => void;
  onSenderNameChange?: (name: string) => void;
  onGetContent?: (getContent: () => string) => void; // ✅ Callback to expose getContent function
}

const FONT_FAMILIES = [
  { id: 'dancing', name: 'Dancing Script', value: "'Dancing Script', cursive" },
  { id: 'playfair', name: 'Playfair Display', value: "'Playfair Display', serif" },
  { id: 'pacifico', name: 'Pacifico', value: "'Pacifico', cursive" },
  { id: 'lobster', name: 'Lobster', value: "'Lobster', cursive" },
  { id: 'vibes', name: 'Great Vibes', value: "'Great Vibes', cursive" },
  { id: 'lexend', name: 'Lexend', value: "'Lexend', sans-serif" },
  { id: 'cormorant', name: 'Cormorant Garamond', value: "'Cormorant Garamond', serif" },
  { id: 'ebgaramond', name: 'EB Garamond', value: "'EB Garamond', serif" },
  { id: 'inter', name: 'Inter', value: "'Inter', sans-serif" },
  { id: 'notosans', name: 'Noto Sans', value: "'Noto Sans', sans-serif" },
  { id: 'roboto', name: 'Roboto', value: "'Roboto', sans-serif" },
  { id: 'opensans', name: 'Open Sans', value: "'Open Sans', sans-serif" },
  { id: 'lato', name: 'Lato', value: "'Lato', sans-serif" },
  { id: 'montserrat', name: 'Montserrat', value: "'Montserrat', sans-serif" },
  { id: 'poppins', name: 'Poppins', value: "'Poppins', sans-serif" },
  { id: 'quicksand', name: 'Quicksand', value: "'Quicksand', sans-serif" },
  { id: 'raleway', name: 'Raleway', value: "'Raleway', sans-serif" },
  { id: 'nunito', name: 'Nunito', value: "'Nunito', sans-serif" },
];

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
  recipientName,
  senderName,
  onRecipientNameChange,
  onSenderNameChange,
  onGetContent,
}: RichTextEditorProps) {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showEffectMenu, setShowEffectMenu] = useState(false);
  const [showBackgroundMenu, setShowBackgroundMenu] = useState(false);
  const [bgActiveTab, setBgActiveTab] = useState<'gradients' | 'colors' | 'patterns'>('gradients');
  const [selectedEffect, setSelectedEffect] = useState('none');
  const [currentFontSize, setCurrentFontSize] = useState('16');
  
  const fontMenuRef = useRef<HTMLDivElement>(null);
  const colorMenuRef = useRef<HTMLDivElement>(null);
  const sizeMenuRef = useRef<HTMLDivElement>(null);
  const effectMenuRef = useRef<HTMLDivElement>(null);
  const bgMenuRef = useRef<HTMLDivElement>(null);

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
      FontFamily.configure({
        types: ['textStyle'],
      }),
      FontSize,
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (html !== content) {
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

  // Update editor content when prop changes
  const isUpdatingRef = useRef(false);
  const lastContentRef = useRef<string>(content || '');
  const lastRecipientNameRef = useRef<string>(recipientName || '');
  const lastSenderNameRef = useRef<string>(senderName || '');
  
  useEffect(() => {
    if (isUpdatingRef.current) {
      isUpdatingRef.current = false;
      return;
    }
    
    if (editor) {
      const currentEditorContent = editor.getHTML();
      const recipientNameChanged = (recipientName || '') !== lastRecipientNameRef.current;
      const senderNameChanged = (senderName || '') !== lastSenderNameRef.current;
      
      const stripHeaderFooter = (html: string) => {
        return html
          .replace(/^<p>Gửi\s+<span[^>]*>.*?<\/span>,?<\/p>(<p><br><\/p>)?/gi, '')
          .replace(/<p><br><\/p><p[^>]*style="text-align:\s*right[^"]*"[^>]*>Yêu thương,[\s\S]*?<\/p>$/i, '')
          .trim();
      };
      
      const strippedNew = stripHeaderFooter(content || '');
      const strippedCurrent = stripHeaderFooter(currentEditorContent);
      
      if (strippedNew !== strippedCurrent || recipientNameChanged || senderNameChanged) {
        isUpdatingRef.current = true;
        editor.commands.setContent(content || '');
        lastContentRef.current = content || '';
        lastRecipientNameRef.current = recipientName || '';
        lastSenderNameRef.current = senderName || '';
        
        // ✅ Apply CSS variables for font-family after setContent
        // This ensures font-family is preserved when content is loaded
        setTimeout(() => {
          const view = editor.view;
          const viewport = view.dom;
          const spansWithFont = viewport.querySelectorAll('span[style*="font-family"]');
          
          spansWithFont.forEach((span) => {
            const htmlElement = span as HTMLElement;
            const styleAttr = htmlElement.getAttribute('style') || '';
            const fontMatch = styleAttr.match(/font-family:\s*([^;]+)/);
            
            if (fontMatch) {
              const extractedFont = fontMatch[1].trim().replace(/['"]/g, '');
              htmlElement.setAttribute('data-font-family', 'true');
              htmlElement.style.setProperty('--tiptap-font-family', extractedFont);
            }
          });
        }, 50);
      }
    }
  }, [content, editor, recipientName, senderName]);

  // ✅ Expose getContent function to parent via callback
  useEffect(() => {
    if (editor && onGetContent) {
      onGetContent(() => editor.getHTML());
    }
  }, [editor, onGetContent]);

  // Apply CSS variable for font-family on initial load and when content changes
  useEffect(() => {
    if (!editor) return;
    
    // Apply immediately and once more after a short delay to catch late DOM updates
    const applyFontVariables = () => {
      const view = editor.view;
      const viewport = view.dom;
      const spansWithFont = viewport.querySelectorAll('span[style*="font-family"]');
      
      spansWithFont.forEach((span) => {
        const htmlElement = span as HTMLElement;
        const styleAttr = htmlElement.getAttribute('style') || '';
        const fontMatch = styleAttr.match(/font-family:\s*([^;]+)/);
        
        if (fontMatch) {
          const fontValue = fontMatch[1].trim();
          htmlElement.setAttribute('data-font-family', 'true');
          htmlElement.style.setProperty('--tiptap-font-family', fontValue);
        }
      });
    };
    
    applyFontVariables();
    // Apply multiple times to catch late DOM updates
    const timeout1 = setTimeout(applyFontVariables, 50);
    const timeout2 = setTimeout(applyFontVariables, 150);
    const timeout3 = setTimeout(applyFontVariables, 300);
    
    const handleSelectionUpdate = () => {
      setTimeout(applyFontVariables, 0);
    };
    
    // ✅ Also apply on transaction (content changes)
    const handleTransaction = () => {
      setTimeout(applyFontVariables, 10);
    };
    
    editor.on('selectionUpdate', handleSelectionUpdate);
    editor.on('transaction', handleTransaction);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      editor.off('selectionUpdate', handleSelectionUpdate);
      editor.off('transaction', handleTransaction);
    };
  }, [editor, content]);

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
  const setFontFamily = (fontValue: string) => {
    if (!editor) return;
    
    editor.chain().focus().setFontFamily(fontValue).run();
    
    // Apply CSS variables after DOM update
    setTimeout(() => {
      const view = editor.view;
      const viewport = view.dom;
      const spansWithFont = viewport.querySelectorAll('span[style*="font-family"]');
      
      spansWithFont.forEach((span) => {
        const htmlElement = span as HTMLElement;
        const styleAttr = htmlElement.getAttribute('style') || '';
        const fontMatch = styleAttr.match(/font-family:\s*([^;]+)/);
        
        if (fontMatch) {
          const extractedFont = fontMatch[1].trim();
          htmlElement.setAttribute('data-font-family', 'true');
          htmlElement.style.setProperty('--tiptap-font-family', extractedFont);
        }
      });
    }, 0);
    
    setShowFontMenu(false);
  };

  const setFontSize = (size: string) => {
    editor.chain().focus().setFontSize(size).run();
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
    editor.chain().focus().setColor(color).run();
    setShowColorMenu(false);
  };

  const getCurrentFont = () => {
    const fontFamily = editor.getAttributes('textStyle').fontFamily;
    return FONT_FAMILIES.find(f => f.value === fontFamily) || FONT_FAMILIES[0];
  };

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* Name Inputs - Above Toolbar */}
      {(onRecipientNameChange || onSenderNameChange) && (
        <div className="flex items-center gap-3 p-3 bg-cream-light border border-gold/20 rounded-t-xl shrink-0 flex-wrap">
          {/* Recipient Name */}
          {onRecipientNameChange && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <User className="w-4 h-4 text-burgundy shrink-0" />
              <label className="text-xs font-vn font-medium text-ink/70 shrink-0">Gửi đến:</label>
              <input
                type="text"
                value={recipientName || ''}
                onChange={(e) => onRecipientNameChange(e.target.value)}
                placeholder="Tên người nhận..."
                className="flex-1 px-3 py-1.5 bg-cream border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn text-sm transition"
              />
            </div>
          )}

          {/* Sender Name */}
          {onSenderNameChange && (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <User className="w-4 h-4 text-burgundy shrink-0" />
              <label className="text-xs font-vn font-medium text-ink/70 shrink-0">Từ:</label>
              <input
                type="text"
                value={senderName || ''}
                onChange={(e) => onSenderNameChange(e.target.value)}
                placeholder="Tên của bạn..."
                className="flex-1 px-3 py-1.5 bg-cream border border-gold/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-burgundy/30 font-vn text-sm transition"
              />
            </div>
          )}
        </div>
      )}

      {/* Toolbar */}
      {showToolbar && (
        <div className={`flex items-center gap-2 p-3 bg-cream-light border border-gold/20 ${(onRecipientNameChange || onSenderNameChange) ? 'border-t-0' : 'rounded-t-xl'} flex-wrap shrink-0`}>
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

        {/* Font Family */}
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
                className="absolute top-full left-0 mt-2 bg-cream-light border border-gold/20 rounded-xl shadow-vintage p-2 z-50 min-w-[200px] max-h-[300px] overflow-y-auto"
              >
                {FONT_FAMILIES.map((font) => (
                  <button
                    key={font.id}
                    type="button"
                    onClick={() => setFontFamily(font.value)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-gold/10 transition text-sm"
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </button>
                ))}
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
