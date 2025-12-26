// components/create/Step3Message.tsx
'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Sparkles, Sticker, X, Save, Edit2, Lock } from 'lucide-react';
import RichTextEditor from '@/components/ui/RichTextEditor';
import StickerPalette from '@/components/ui/StickerPalette';
import PageManager from '@/components/create/PageManager';
import { useDrag, useDrop } from 'react-dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LETTER_PAGE_BREAK_TOKEN } from '@/hooks/useCreateCard';

interface Step3MessageProps {
  recipientName: string;
  senderName: string;
  message: string;
  letterPages?: string[];
  onUpdateLetterPages?: (pages: string[]) => void;
  fontStyle: string;
  textEffect: string;
  letterBackground?: string;
  letterPattern?: string;
  letterContainerBackground?: string; // ✅ Nền container bên ngoài trang giấy
  stickers?: Array<{ id: string; x: number; y: number; width?: number; height?: number; sticker_id: string; image_url: string }>;
  signatureData?: string | null;
  userTym?: number;
  onUpdate: (data: {
    recipientName?: string;
    senderName?: string;
    message?: string;
    richContent?: string | null; // ✅ Thêm richContent
    usedFonts?: string[]; // ✅ Fonts đã sử dụng
    fontStyle?: string;
    textEffect?: string;
    letterBackground?: string;
    letterPattern?: string;
    letterContainerBackground?: string; // ✅ Nền container bên ngoài trang giấy
    stickers?: Array<{ id: string; x: number; y: number; width?: number; height?: number; sticker_id: string; image_url: string }>;
  }) => void;
}

interface Sticker {
  id: string;
  name: string;
  image_url: string;
  category: string;
  points_required: number;
}

// Sticker Item Component with Resize and Move
function StickerItem({ 
  sticker, 
  x, 
  y, 
  width = 64,
  height = 64,
  onRemove,
  onUpdate,
  onMove
}: { 
  sticker: { id: string; image_url: string; sticker_id: string };
  x: number;
  y: number;
  width?: number;
  height?: number;
  onRemove: () => void;
  onUpdate: (width: number, height: number) => void;
  onMove: (x: number, y: number) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isResizing) return;
    e.stopPropagation();
    setIsDragging(true);
    const rect = containerRef.current?.parentElement?.getBoundingClientRect();
    if (rect) {
      setDragStart({
        x: e.clientX - (rect.left + (rect.width * x / 100)),
        y: e.clientY - (rect.top + (rect.height * y / 100)),
      });
    }
  }, [x, y, isResizing]);

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current?.parentElement) return;
    
    const rect = containerRef.current.parentElement.getBoundingClientRect();
    const newX = ((e.clientX - dragStart.x - rect.left) / rect.width) * 100;
    const newY = ((e.clientY - dragStart.y - rect.top) / rect.height) * 100;
    
    onMove(
      Math.max(0, Math.min(100, newX)),
      Math.max(0, Math.min(100, newY))
    );
  }, [isDragging, dragStart, onMove]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width,
      height,
    });
  }, [width, height]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - resizeStart.x;
    const deltaY = e.clientY - resizeStart.y;
    const scale = Math.max(0.5, Math.min(3, 1 + (deltaX + deltaY) / 200));
    
    onUpdate(
      Math.max(32, Math.min(256, resizeStart.width * scale)),
      Math.max(32, Math.min(256, resizeStart.height * scale))
    );
  }, [isResizing, resizeStart, onUpdate]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      onMouseDown={handleDragStart}
      className="absolute cursor-move group"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity: isDragging ? 0.7 : 1,
        width: `${width}px`,
        height: `${height}px`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        zIndex: isDragging ? 1000 : 1,
      }}
    >
      <img
        src={sticker.image_url}
        alt="Sticker"
        className="w-full h-full object-contain drop-shadow-lg pointer-events-none"
        style={{ width: '100%', height: '100%' }}
      />
      <button
        onClick={onRemove}
        className="absolute -top-2 -right-2 w-5 h-5 bg-burgundy text-cream rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center z-10"
      >
        <X className="w-3 h-3" />
      </button>
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 bg-burgundy/80 rounded-tl-lg cursor-nwse-resize opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
        style={{ cursor: 'nwse-resize' }}
      >
        <div className="w-2 h-2 border border-cream" />
      </div>
    </motion.div>
  );
}

/**
 * Component to render saved HTML content with proper font-family support
 * Uses useEffect to apply inline styles after render to ensure fonts are displayed correctly
 */
function SavedContentRenderer({ html }: { html: string }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    // Find all spans with inline font-family style and force the style
    const spansWithFont = contentRef.current.querySelectorAll('span[style*="font-family"]');
    spansWithFont.forEach((span) => {
      const htmlElement = span as HTMLElement;
      const styleAttr = htmlElement.getAttribute('style') || '';
      const fontMatch = styleAttr.match(/font-family:\s*([^;]+)/);
      
      if (fontMatch) {
        // Extract the font value and apply it directly with !important
        const fontValue = fontMatch[1].trim().replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        htmlElement.style.setProperty('font-family', fontValue, 'important');
      }
    });
  }, [html]);

  return (
    <div 
      ref={contentRef}
      className="letter-content rich-text-content max-w-none text-lg leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Drop Zone Component
function DropZone({ 
  onDrop, 
  children 
}: { 
  onDrop: (x: number, y: number, sticker: Sticker) => void;
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [{ isOver }, drop] = useDrop({
    accept: 'sticker-palette',
    drop: (item: { sticker: Sticker }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((offset.x - rect.left) / rect.width) * 100;
        const y = ((offset.y - rect.top) / rect.height) * 100;
        onDrop(Math.max(0, Math.min(100, x)), Math.max(0, Math.min(100, y)), item.sticker);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Combine refs using a callback
  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      (containerRef as any).current = node;
      (drop as any)(node);
    }
  }, [drop]);

  return (
    <div
      ref={combinedRef}
      className={`relative ${isOver ? 'ring-2 ring-burgundy ring-offset-2' : ''}`}
    >
      {children}
    </div>
  );
}

export default function Step3Message({
  recipientName,
  senderName,
  message,
  letterPages,
  onUpdateLetterPages,
  fontStyle,
  textEffect,
  letterBackground = '#ffffff',
  letterPattern = 'solid',
  letterContainerBackground = 'linear-gradient(to bottom right, rgba(254, 243, 199, 0.3), rgba(254, 226, 226, 0.2))',
  stickers = [],
  signatureData = null,
  userTym = 0,
  onUpdate,
}: Step3MessageProps) {
  const [showStickerPalette, setShowStickerPalette] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const letterRef = useRef<HTMLDivElement>(null);
  
  // Track saved pages - pages that have been explicitly saved
  const [savedPages, setSavedPages] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    if (letterPages && letterPages.length > 0) {
      letterPages.forEach((content, idx) => {
        initial[idx] = content || '';
      });
    } else {
      initial[0] = message || '';
    }
    return initial;
  });
  
  // Track editing state for each page
  const [editingPages, setEditingPages] = useState<Record<number, boolean>>({});
  
  // Store page contents in a local map for editing
  const [localPages, setLocalPages] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    if (letterPages && letterPages.length > 0) {
      letterPages.forEach((content, idx) => {
        initial[idx] = content || '';
      });
    } else {
      initial[0] = message || '';
    }
    return initial;
  });

  // Ref to store current editor content before page change
  const editorContentRef = useRef<string>('');
  // ✅ Ref to get HTML directly from editor instance (returns { html, usedFonts })
  const getEditorContentRef = useRef<(() => { html: string; usedFonts?: any[] }) | null>(null);
  // Track if we're currently switching pages to prevent saving during switch
  const isSwitchingPageRef = useRef(false);
  
  // Check if current page is in editing mode
  const isEditing = editingPages[activePage] !== false; // Default to true (editing mode)

  // Multi-page logic
  const pageCount = letterPages && letterPages.length > 0 ? letterPages.length : 1;
  const FREE_PAGES = 2;
  const ADD_PAGE_COST = 10;
  const canAddPage = pageCount < FREE_PAGES || userTym >= ADD_PAGE_COST;

  // Get the display content for a page (with headers/footers)
  const getDisplayContent = useCallback((pageIndex: number, rawContent: string) => {
    let content = rawContent || '';
    
    // Always add recipient to first page if recipientName exists
    if (pageIndex === 0 && recipientName) {
      // Remove any existing recipient header first
      content = content.replace(/^<p>Gửi\s+<span[^>]*>[^<]*<\/span>,?<\/p>(<p><br><\/p>)?/i, '');
      // Add recipient header
      const recipientHtml = `<p>Gửi <span style="color: #b45309; font-weight: 600;">${recipientName}</span>,</p><p><br></p>`;
      content = recipientHtml + content;
    }
    
    // Always add sender to last page if senderName exists
    if (pageIndex === pageCount - 1 && senderName) {
      // Remove any existing sender footer first
      content = content.replace(/<p><br><\/p><p[^>]*style="text-align:\s*right[^"]*"[^>]*>Yêu thương,[\s\S]*?<\/p>$/i, '');
      // Add sender footer
      const senderHtml = `<p><br></p><p style="text-align: right;">Yêu thương,<br><span style="color: #b45309; font-weight: 600; font-size: 1.1em;">${senderName}</span></p>`;
      content = content + senderHtml;
    }
    
    return content;
  }, [recipientName, senderName, pageCount]);

  // Extract raw content from display content (remove headers/footers)
  // Always extract to ensure we store clean content without headers/footers
  const extractRawContent = useCallback((html: string | { html: string; usedFonts?: any[] } | null | undefined, pageIndex: number) => {
    // ✅ Handle case where html might be an object with { html, usedFonts }
    let htmlString: string;
    if (typeof html === 'string') {
      htmlString = html;
    } else if (html && typeof html === 'object' && 'html' in html) {
      htmlString = html.html;
    } else {
      htmlString = '';
    }
    
    let raw = htmlString || '';
    
    // Remove recipient header from first page - be more careful to preserve content
    if (pageIndex === 0 && recipientName) {
      // Match recipient header with various patterns
      raw = raw.replace(/^<p>Gửi\s+<span[^>]*>.*?<\/span>,?<\/p>/i, '');
      raw = raw.replace(/^<p><br><\/p>/i, '');
      // Also handle case where there might be multiple <br> tags
      raw = raw.replace(/^(<p><br><\/p>)+/i, '');
    }
    
    // Remove sender footer from last page
    if (pageIndex === pageCount - 1 && senderName) {
      raw = raw.replace(/<p><br><\/p><p[^>]*style="text-align:\s*right[^"]*"[^>]*>Yêu thương,[\s\S]*?<\/p>$/i, '');
    }
    
    return raw.trim();
  }, [recipientName, senderName, pageCount]);

  // Determine which content to use: saved or editing
  const currentRawContent = isEditing 
    ? (localPages[activePage] || '') 
    : (savedPages[activePage] || '');
  
  // Display content with headers/footers
  // Don't memoize - we need it to update when recipientName/senderName changes
  // But the editor won't reset because RichTextEditor only updates on main content changes
  const displayContent = getDisplayContent(activePage, currentRawContent);

  // Update editorContentRef when page changes
  useEffect(() => {
    editorContentRef.current = displayContent;
  }, [activePage, displayContent]);
  
  // Sync savedPages with letterPages when letterPages changes externally
  // But only update if the new letterPages has more pages or different content
  useEffect(() => {
    if (letterPages && letterPages.length > 0) {
      setSavedPages(prev => {
        const updated: Record<number, string> = {};
        let hasChanges = false;
        
        letterPages.forEach((content, idx) => {
          // If we have saved content for this page, keep it (it's more recent)
          // Only update if the page doesn't exist in savedPages or is empty
          if (prev[idx] === undefined || prev[idx] === '') {
            updated[idx] = content || '';
            if (content && content !== prev[idx]) {
              hasChanges = true;
            }
          } else {
            // Keep existing saved content unless it's empty and new content exists
            updated[idx] = prev[idx];
          }
        });
        
        // Preserve any extra saved pages that exist locally
        Object.keys(prev).forEach(key => {
          const idx = parseInt(key);
          if (idx >= letterPages.length) {
            updated[idx] = prev[idx];
            hasChanges = true;
          }
        });
        
        // Only update if there are actual changes
        return hasChanges ? updated : prev;
      });
    }
  }, [letterPages]);

  // Handle content change from editor (only when editing)
  const handleContentChange = useCallback((html: string) => {
    // Don't save if we're in the middle of switching pages or not in editing mode
    if (isSwitchingPageRef.current || !isEditing) {
      return;
    }
    
    // Store current editor content (with headers/footers for display)
    editorContentRef.current = html;
    
    // Extract raw content (remove headers/footers) to store in localPages
    // This ensures we always store clean content, but display with headers/footers
    const rawContent = extractRawContent(html, activePage);
    
    // Update local state immediately (for editing)
    setLocalPages(prev => ({
      ...prev,
      [activePage]: rawContent
    }));
  }, [activePage, extractRawContent, isEditing]);
  
  // Handle save page
  const handleSavePage = useCallback(() => {
    // ✅ Get current editor content directly from editor (most up-to-date)
    // Fallback to editorContentRef if getEditorContentRef is not available
    let currentHtml: string;
    if (getEditorContentRef.current) {
      const result = getEditorContentRef.current();
      currentHtml = typeof result === 'string' ? result : result.html;
    } else {
      currentHtml = editorContentRef.current || displayContent;
    }
    // Extract raw content (remove headers/footers)
    const rawContent = extractRawContent(currentHtml, activePage);
    
    // Save to savedPages
    setSavedPages(prev => ({
      ...prev,
      [activePage]: rawContent
    }));
    
    // Update localPages to match saved
    setLocalPages(prev => ({
      ...prev,
      [activePage]: rawContent
    }));
    
    // Exit editing mode
    setEditingPages(prev => ({
      ...prev,
      [activePage]: false
    }));
    
    // Update parent state - ensure we preserve all existing pages
    if (onUpdateLetterPages) {
      const newPages = [...(letterPages || [''])];
      // Ensure array is long enough
      while (newPages.length <= activePage) {
        newPages.push('');
      }
      newPages[activePage] = rawContent;
      // Call update with the complete array
      onUpdateLetterPages(newPages);
      
      // ✅ Cập nhật richContent (HTML từ tất cả pages)
      // ✅ QUAN TRỌNG: Luôn giữ nguyên letterBackground và letterPattern khi lưu trang
      const fullRichContent = newPages.join(LETTER_PAGE_BREAK_TOKEN);
      onUpdate({ 
        richContent: fullRichContent,
        letterBackground: letterBackground || '#ffffff', // ✅ Luôn có giá trị, fallback về mặc định nếu undefined
        letterPattern: letterPattern || 'solid', // ✅ Luôn có giá trị, fallback về mặc định nếu undefined
      });
    } else {
      onUpdate({ 
        message: rawContent,
        letterBackground: letterBackground || '#ffffff', // ✅ Luôn có giá trị, fallback về mặc định nếu undefined
        letterPattern: letterPattern || 'solid', // ✅ Luôn có giá trị, fallback về mặc định nếu undefined
      });
    }
  }, [activePage, displayContent, extractRawContent, onUpdateLetterPages, onUpdate, letterPages, letterBackground, letterPattern]);
  
  // Handle edit page
  const handleEditPage = useCallback(() => {
    // Enter editing mode
    setEditingPages(prev => ({
      ...prev,
      [activePage]: true
    }));
    
    // Load saved content to localPages for editing
    const savedContent = savedPages[activePage] || '';
    setLocalPages(prev => ({
      ...prev,
      [activePage]: savedContent
    }));
    
    // ✅ Update editorContentRef to trigger editor update with saved content
    // This ensures the editor displays the saved content with all formatting (including font-family)
    const displayContentForEdit = getDisplayContent(activePage, savedContent);
    editorContentRef.current = displayContentForEdit;
  }, [activePage, savedPages, getDisplayContent]);

  // Handle page change - save current content if editing
  const handlePageChange = useCallback((index: number) => {
    if (index === activePage) return;
    
    // Mark that we're switching pages
    isSwitchingPageRef.current = true;
    
    // If currently editing, save the content to localPages before switching
    if (isEditing) {
      const currentHtml = editorContentRef.current || displayContent;
      // Extract raw content (remove headers/footers) to store
      const contentToSave = extractRawContent(currentHtml, activePage);
      
      // Update local state
      setLocalPages(prev => {
        const updated = { ...prev };
        updated[activePage] = contentToSave;
        return updated;
      });
      
      // Note: Don't auto-save to savedPages, user must click "Lưu trang"
    }
    
    // Switch to new page
    setActivePage(index);
    
    // Reset switching flag after a short delay
    setTimeout(() => {
      isSwitchingPageRef.current = false;
      // Update editorContentRef to new page's content
      const newRawContent = isEditing 
        ? (localPages[index] || '') 
        : (savedPages[index] || '');
      const newDisplayContent = getDisplayContent(index, newRawContent);
      editorContentRef.current = newDisplayContent;
    }, 100);
  }, [activePage, displayContent, extractRawContent, isEditing, localPages, savedPages, getDisplayContent]);

  // Handle add page
  const handleAddPage = useCallback(() => {
    if (pageCount >= FREE_PAGES && userTym < ADD_PAGE_COST) {
      alert(`Bạn cần ${ADD_PAGE_COST} Tym để thêm trang mới!`);
      return;
    }

    if (onUpdateLetterPages) {
      // Preserve all existing pages and add a new empty one
      const currentPages = letterPages && letterPages.length > 0 ? letterPages : [''];
      const newPages = [...currentPages, ''];
      
      // Update parent state first
      onUpdateLetterPages(newPages);
      
      // Then update local state
      setLocalPages(prev => ({
        ...prev,
        [newPages.length - 1]: ''
      }));
      
      // Also update savedPages to ensure consistency
      setSavedPages(prev => ({
        ...prev,
        [newPages.length - 1]: ''
      }));
      
      // Switch to new page
      setActivePage(newPages.length - 1);
      
      // Enter editing mode for new page
      setEditingPages(prev => ({
        ...prev,
        [newPages.length - 1]: true
      }));
    }
  }, [pageCount, userTym, onUpdateLetterPages, letterPages]);

  // Handle remove page
  const handleRemovePage = useCallback((index: number) => {
    if (!onUpdateLetterPages || pageCount <= 1) return;
    
    const newPages = (letterPages || ['']).filter((_, i) => i !== index);
    onUpdateLetterPages(newPages);
    
    // Update local pages
    setLocalPages(prev => {
      const updated: Record<number, string> = {};
      Object.keys(prev).forEach(key => {
        const idx = parseInt(key);
        if (idx < index) {
          updated[idx] = prev[idx];
        } else if (idx > index) {
          updated[idx - 1] = prev[idx];
        }
      });
      return updated;
    });
    
    if (activePage === index) {
      setActivePage(Math.max(0, index - 1));
    } else if (activePage > index) {
      setActivePage(activePage - 1);
    }
  }, [pageCount, activePage, onUpdateLetterPages, letterPages]);

  // Sync local pages with prop when letterPages changes externally
  // But preserve local changes that haven't been saved yet
  // Only sync if letterPages actually has more pages (new page added)
  const prevLetterPagesLengthRef = useRef<number>(letterPages?.length || 1);
  const isAddingPageRef = useRef(false);
  
  useEffect(() => {
    if (letterPages && letterPages.length > 0) {
      const prevLength = prevLetterPagesLengthRef.current;
      const newLength = letterPages.length;
      
      // Only sync if pages were added (not on every change)
      if (newLength > prevLength) {
        isAddingPageRef.current = true;
        
        setLocalPages(prev => {
          const updated = { ...prev };
          // Add the new pages
          for (let i = prevLength; i < newLength; i++) {
            updated[i] = letterPages[i] || '';
          }
          return updated;
        });
        
        setSavedPages(prev => {
          const updated = { ...prev };
          for (let i = prevLength; i < newLength; i++) {
            updated[i] = letterPages[i] || '';
          }
          return updated;
        });
        
        // Reset flag after a short delay
        setTimeout(() => {
          isAddingPageRef.current = false;
        }, 100);
      }
      
      prevLetterPagesLengthRef.current = newLength;
    }
  }, [letterPages]);

  const handleStickerSelect = useCallback((sticker: Sticker) => {
    if (userTym < sticker.points_required) {
      alert(`Bạn cần ${sticker.points_required} Tym để sử dụng sticker này!`);
      return;
    }

    // Thêm sticker vào giữa màn hình
    const newSticker = {
      id: `sticker-${Date.now()}`,
      x: 50,
      y: 50,
      width: 64,
      height: 64,
      sticker_id: sticker.id,
      image_url: sticker.image_url,
    };

    onUpdate({
      stickers: [...stickers, newSticker],
    });
  }, [stickers, userTym, onUpdate]);

  const handleStickerResize = useCallback((id: string, width: number, height: number) => {
    onUpdate({
      stickers: stickers.map(s => 
        s.id === id ? { ...s, width, height } : s
      ),
    });
  }, [stickers, onUpdate]);

  const handleStickerMove = useCallback((id: string, newX: number, newY: number) => {
    onUpdate({
      stickers: stickers.map(s => 
        s.id === id ? { ...s, x: newX, y: newY } : s
      ),
    });
  }, [stickers, onUpdate]);

  const handleStickerDrop = useCallback((x: number, y: number, sticker: Sticker) => {
    if (userTym < sticker.points_required) {
      alert(`Bạn cần ${sticker.points_required} Tym để sử dụng sticker này!`);
      return;
    }

    const newSticker = {
      id: `sticker-${Date.now()}`,
      x,
      y,
      width: 64,
      height: 64,
      sticker_id: sticker.id,
      image_url: sticker.image_url,
    };

    onUpdate({
      stickers: [...stickers, newSticker],
    });
  }, [stickers, userTym, onUpdate]);

  const handleRemoveSticker = useCallback((id: string) => {
    onUpdate({
      stickers: stickers.filter(s => s.id !== id),
    });
  }, [stickers, onUpdate]);

  // ✅ Handle used fonts change - moved outside JSX to comply with hooks rules
  const handleUsedFontsChange = useCallback((usedFonts: string[]) => {
    // ✅ Lưu usedFonts vào state (chỉ khi thực sự có thay đổi)
    onUpdate({ usedFonts });
  }, [onUpdate]);

  /**
   * ✅ Enhanced pattern styles với nhiều họa tiết đẹp mắt
   * Đồng bộ với RichTextEditor và trang xem thiệp
   * ✅ Hỗ trợ cả gradient và solid color
   */
  const getPatternStyle = (pattern: string, color: string): React.CSSProperties => {
    // ✅ Kiểm tra nếu color là gradient
    const isGradient = color.includes('gradient');
    
    switch (pattern) {
      case 'lined':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, rgba(0,0,0,0.08) 31px, rgba(0,0,0,0.08) 32px)`,
          ...(isGradient ? { background: color } : { backgroundColor: color }),
        };
      case 'dotted':
        return {
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)`,
          backgroundSize: '20px 20px',
          ...(isGradient ? { background: `${color}, radial-gradient(circle, rgba(0,0,0,0.08) 1.5px, transparent 1.5px)` } : { backgroundColor: color }),
        };
      case 'floral':
        const floralPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10-10c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm-10 30c5.5 0 10-4.5 10-10s-4.5-10-10-10-10 4.5-10 10 4.5 10 10 10zm30-10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
        if (isGradient) {
          return { background: `${floralPattern}, ${color}` };
        }
        return {
          backgroundImage: floralPattern,
          backgroundColor: color,
        };
      case 'vintage':
        const vintagePattern = `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;
        if (isGradient) {
          return { background: `${vintagePattern}, ${color}` };
        }
        return {
          backgroundImage: vintagePattern,
          backgroundColor: color,
        };
      // ✅ Họa tiết trái tim
      case 'hearts':
        const heartsPattern = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 35l-2.5-2.3C9.5 25.2 4 20.1 4 14c0-5 3.9-9 8.6-9 2.8 0 5.4 1.3 7.4 3.5C21.9 6.3 24.5 5 27.4 5 32.1 5 36 9 36 14c0 6.1-5.5 11.2-13.5 18.7L20 35z' fill='%23FF69B4' fill-opacity='0.08'/%3E%3C/svg%3E")`;
        if (isGradient) {
          return {
            background: `${heartsPattern}, ${color}`,
            backgroundSize: '40px 40px',
          };
        }
        return {
          backgroundImage: heartsPattern,
          backgroundSize: '40px 40px',
          backgroundColor: color,
        };
      // ✅ Họa tiết ngôi sao
      case 'stars':
        const starsPattern = `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='25,2 32,18 50,18 36,29 41,46 25,36 9,46 14,29 0,18 18,18' fill='%23FFD700' fill-opacity='0.1'/%3E%3C/svg%3E")`;
        if (isGradient) {
          return {
            background: `${starsPattern}, ${color}`,
            backgroundSize: '50px 50px',
          };
        }
        return {
          backgroundImage: starsPattern,
          backgroundSize: '50px 50px',
          backgroundColor: color,
        };
      // ✅ Họa tiết hoa hồng
      case 'roses':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23E91E63' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='8'/%3E%3Ccircle cx='30' cy='20' r='4'/%3E%3Ccircle cx='40' cy='30' r='4'/%3E%3Ccircle cx='30' cy='40' r='4'/%3E%3Ccircle cx='20' cy='30' r='4'/%3E%3Ccircle cx='37' cy='23' r='3'/%3E%3Ccircle cx='37' cy='37' r='3'/%3E%3Ccircle cx='23' cy='37' r='3'/%3E%3Ccircle cx='23' cy='23' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundColor: color,
        };
      // ✅ Họa tiết bướm
      case 'butterflies':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C27B0' fill-opacity='0.07'%3E%3Cellipse cx='25' cy='40' rx='12' ry='18' transform='rotate(-30 25 40)'/%3E%3Cellipse cx='55' cy='40' rx='12' ry='18' transform='rotate(30 55 40)'/%3E%3Cellipse cx='30' cy='55' rx='8' ry='12' transform='rotate(-30 30 55)'/%3E%3Cellipse cx='50' cy='55' rx='8' ry='12' transform='rotate(30 50 55)'/%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
          backgroundColor: color,
        };
      // ✅ Họa tiết lá cây
      case 'leaves':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-10 15-5 35 0 50 5-15 10-35 0-50z' fill='%234CAF50' fill-opacity='0.08'/%3E%3Cpath d='M15 20c10 10 25 10 30 25-15-5-25-10-30-25z' fill='%234CAF50' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundColor: color,
        };
      // ✅ Họa tiết tuyết
      case 'snowflakes':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%2364B5F6' stroke-opacity='0.15' stroke-width='1.5' fill='none'%3E%3Cline x1='25' y1='5' x2='25' y2='45'/%3E%3Cline x1='5' y1='25' x2='45' y2='25'/%3E%3Cline x1='11' y1='11' x2='39' y2='39'/%3E%3Cline x1='39' y1='11' x2='11' y2='39'/%3E%3Ccircle cx='25' cy='25' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '50px 50px',
          backgroundColor: color,
        };
      // ✅ Họa tiết lấp lánh
      case 'sparkles':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0l2 8 8-2-8 2 2 8-2-8-8 2 8-2-2-8z' fill='%23FFD700' fill-opacity='0.12'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          backgroundColor: color,
        };
      // ✅ Họa tiết sóng
      case 'waves':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q25 0 50 10 T100 10' stroke='%232196F3' stroke-opacity='0.1' stroke-width='2' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 20px',
          backgroundColor: color,
        };
      // ✅ Họa tiết ren
      case 'lace':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-opacity='0.06' stroke-width='1'%3E%3Ccircle cx='24' cy='24' r='10'/%3E%3Ccircle cx='24' cy='24' r='18'/%3E%3Ccircle cx='0' cy='0' r='6'/%3E%3Ccircle cx='48' cy='0' r='6'/%3E%3Ccircle cx='0' cy='48' r='6'/%3E%3Ccircle cx='48' cy='48' r='6'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '48px 48px',
          backgroundColor: color,
        };
      // ✅ Họa tiết kim cương
      case 'diamonds':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%232196F3' stroke-opacity='0.1' stroke-width='1.5'/%3E%3Cpath d='M20 10L30 20L20 30L10 20Z' fill='%232196F3' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
          backgroundColor: color,
        };
      // ✅ Họa tiết confetti
      case 'confetti':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill-opacity='0.12'%3E%3Crect x='10' y='5' width='4' height='8' fill='%23FF6B6B' transform='rotate(25 12 9)'/%3E%3Crect x='45' y='15' width='3' height='6' fill='%234ECDC4' transform='rotate(-15 46 18)'/%3E%3Crect x='25' y='35' width='4' height='8' fill='%23FFE66D' transform='rotate(45 27 39)'/%3E%3Crect x='5' y='40' width='3' height='6' fill='%23A855F7' transform='rotate(-30 6 43)'/%3E%3Crect x='50' y='45' width='4' height='8' fill='%23F472B6' transform='rotate(20 52 49)'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundColor: color,
        };
      // ✅ Họa tiết mây
      case 'clouds':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='60' viewBox='0 0 100 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2390CAF9' fill-opacity='0.1'%3E%3Cellipse cx='30' cy='40' rx='20' ry='12'/%3E%3Cellipse cx='50' cy='35' rx='15' ry='10'/%3E%3Cellipse cx='65' cy='42' rx='18' ry='11'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 60px',
          backgroundColor: color,
        };
      // ✅ Họa tiết hoa anh đào
      case 'sakura':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='70' height='70' viewBox='0 0 70 70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFACC7' fill-opacity='0.12'%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(0 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(72 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(144 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(216 35 35)'/%3E%3Cellipse cx='35' cy='20' rx='6' ry='10' transform='rotate(288 35 35)'/%3E%3Ccircle cx='35' cy='35' r='5' fill='%23FFD4E0'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '70px 70px',
          backgroundColor: color,
        };
      // ✅ Họa tiết hình học
      case 'geometric':
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000000' stroke-opacity='0.06' stroke-width='1'%3E%3Cpolygon points='30,5 55,30 30,55 5,30'/%3E%3Cpolygon points='30,15 45,30 30,45 15,30'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
          backgroundColor: color,
        };
      // ✅ Họa tiết màu nước
      case 'watercolor':
        return {
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(255,182,193,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(173,216,230,0.12) 0%, transparent 45%),
            radial-gradient(ellipse at 60% 70%, rgba(221,160,221,0.1) 0%, transparent 55%),
            radial-gradient(ellipse at 30% 80%, rgba(255,218,185,0.12) 0%, transparent 50%)
          `,
          backgroundColor: color,
        };
      default:
        // ✅ Solid pattern - hỗ trợ cả gradient và solid color
        if (isGradient) {
          return { background: color };
        }
        return { backgroundColor: color };
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-3 tracking-tight" style={{ fontFamily: 'serif' }}>Viết lời nhắn</h2>
          <p className="text-amber-700/70 text-sm">Gửi gắm tình cảm của bạn qua những dòng chữ</p>
      </div>

        <div className="space-y-6">
          {/* Rich Text Editor (Inline Editing) */}
          <div className="space-y-4">
            {/* Page Manager */}
            {onUpdateLetterPages && (
              <PageManager
                pages={letterPages || ['']}
                activePage={activePage}
                onPageChange={handlePageChange}
                onAddPage={handleAddPage}
                onRemovePage={handleRemovePage}
                canAddPage={canAddPage}
                addPageCost={ADD_PAGE_COST}
                userTym={userTym}
              />
            )}

            <div className="bg-gradient-to-br from-amber-50/50 to-white rounded-2xl border border-amber-200/50 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-amber-200/50 bg-gradient-to-r from-amber-50/30 to-transparent">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide flex items-center gap-2">
                    <Heart className="w-4 h-4 text-amber-700 fill-current" />
                    Viết lời nhắn {onUpdateLetterPages && `(Trang ${activePage + 1})`}
                    {!isEditing && (
                      <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Đã lưu
                      </span>
                    )}
                  </h3>
                  
                  {/* Save/Edit Buttons */}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <button
                        onClick={handleSavePage}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                      >
                        <Save className="w-4 h-4" />
                        Lưu trang
                      </button>
                    ) : (
                      <button
                        onClick={handleEditPage}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-all shadow-sm hover:shadow-md text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Letter Container with Background */}
              <div 
                className="p-8 flex justify-center overflow-x-auto"
                style={{
                  background: letterContainerBackground.includes('gradient') 
                    ? letterContainerBackground 
                    : letterContainerBackground.includes('#') || letterContainerBackground.includes('rgb')
                    ? letterContainerBackground
                    : `linear-gradient(to bottom right, ${letterContainerBackground}, ${letterContainerBackground})`,
                }}
              >
                <DropZone onDrop={handleStickerDrop}>
                  <div
                    ref={letterRef}
                    className="relative rounded-xl shadow-2xl mx-auto overflow-hidden flex flex-col border-2 border-amber-200/50"
                    style={{
                      ...getPatternStyle(letterPattern, letterBackground),
                      width: '612px',
                      height: '792px',
                      maxWidth: '100%',
                      aspectRatio: '612 / 792',
                    }}
                  >
                    {/* Rich Text Editor with Toolbar */}
                    {isEditing ? (
                      <RichTextEditor
                        content={displayContent}
                        onChange={handleContentChange}
                        placeholder="Viết lời nhắn yêu thương của bạn..."
                        background={letterBackground}
                        pattern={letterPattern}
                        onBackgroundChange={(color, pattern) => {
                          onUpdate({ letterBackground: color, letterPattern: pattern });
                        }}
                        onUsedFontsChange={handleUsedFontsChange}
                        showToolbar={true}
                        showEditorContent={true}
                        onOpenStickerPalette={() => setShowStickerPalette(true)}
                        recipientName={recipientName}
                        senderName={senderName}
                        onRecipientNameChange={(name) => onUpdate({ recipientName: name })}
                        onSenderNameChange={(name) => onUpdate({ senderName: name })}
                        onGetContent={(getContent) => {
                          // ✅ Store getContent function to get HTML directly from editor
                          getEditorContentRef.current = getContent;
                        }}
                        className="flex-1 flex flex-col min-h-0"
                      />
                    ) : (
                      <div 
                        className="flex-1 flex flex-col min-h-0 p-6 overflow-y-auto"
                        style={getPatternStyle(letterPattern, letterBackground)}
                      >
                        {/* ✅ Use letter-content class instead of prose to preserve inline font-family */}
                        {/* ✅ Áp dụng background style để hiển thị đúng nền trang giấy khi không editing */}
                        <SavedContentRenderer html={displayContent || '<p class="text-gray-400 italic">Chưa có nội dung. Nhấn "Chỉnh sửa" để bắt đầu viết.</p>'} />
                      </div>
                    )}

                    {/* Stickers */}
                    {stickers
                      .filter((sticker) => sticker.y > 10) // Prevent stickers in top area
                      .map((sticker) => (
                        <StickerItem
                          key={sticker.id}
                          sticker={sticker}
                          x={sticker.x}
                          y={sticker.y}
                          width={sticker.width}
                          height={sticker.height}
                          onRemove={() => handleRemoveSticker(sticker.id)}
                          onUpdate={(width, height) => handleStickerResize(sticker.id, width, height)}
                          onMove={(newX, newY) => {
                            // Prevent moving sticker into top area
                            const safeY = Math.max(10, newY);
                            handleStickerMove(sticker.id, newX, safeY);
                          }}
                        />
              ))}
            </div>
                </DropZone>
          </div>
            </div>
          </div>
        </div>

        {/* Sticker Palette */}
        <StickerPalette
          isOpen={showStickerPalette}
          onClose={() => setShowStickerPalette(false)}
          onStickerSelect={handleStickerSelect}
          userPoints={userTym}
        />
      </div>
    </DndProvider>
  );
}
