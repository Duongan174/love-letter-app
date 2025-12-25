// components/ui/StickerEditor.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Move, RotateCcw, Check, X, Wand2, Loader2 } from 'lucide-react';
import { ImageTransform } from './ImageEditor';

interface StickerEditorProps {
  src: string;
  alt?: string;
  className?: string;
  onSave?: (transform: ImageTransform, processedUrl?: string) => void;
  onCancel?: () => void;
  initialTransform?: ImageTransform;
  showControls?: boolean;
}

const DEFAULT_TRANSFORM: ImageTransform = {
  scale: 1,
  x: 0,
  y: 0,
};

export default function StickerEditor({
  src,
  alt = 'Sticker',
  className = '',
  onSave,
  onCancel,
  initialTransform = DEFAULT_TRANSFORM,
  showControls = true,
}: StickerEditorProps) {
  const [transform, setTransform] = useState<ImageTransform>(initialTransform);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [removingBackground, setRemovingBackground] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Reset transform when src changes
  useEffect(() => {
    setTransform(initialTransform);
    setProcessedUrl(null);
  }, [src, initialTransform]);

  const handleZoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale + 0.1, 3),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale - 0.1, 0.5),
    }));
  }, []);

  const handleReset = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y,
    });
  }, [transform.x, transform.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const maxOffset = 100;
    setTransform(prev => ({
      ...prev,
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    }));
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale + delta)),
    }));
  }, []);

  const handleRemoveBackground = useCallback(async () => {
    if (!src) return;
    
    setRemovingBackground(true);
    try {
      const response = await fetch('/api/remove-background', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: src }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove background');
      }

      const data = await response.json();
      setProcessedUrl(data.url);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Không thể xóa nền. Vui lòng thử lại hoặc sử dụng ảnh có nền trong suốt.');
    } finally {
      setRemovingBackground(false);
    }
  }, [src]);

  const currentImageUrl = processedUrl || src;

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Image Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl bg-cream border-2 border-gold/30 cursor-move"
        style={{ aspectRatio: 1, minHeight: '300px' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Grid overlay for guidance */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '33.33% 33.33%',
          }} />
        </div>

        {/* Image */}
        {currentImageUrl && (
          <motion.img
            ref={imageRef}
            src={currentImageUrl}
            alt={alt}
            className="absolute inset-0 w-full h-full object-contain select-none"
            style={{
              transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
            draggable={false}
          />
        )}

        {/* Drag hint */}
        {!isDragging && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-ink/60 text-cream text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-60">
              <Move className="w-3 h-3" />
              Kéo để di chuyển
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 bg-cream border border-gold/30 rounded-lg hover:bg-gold/10 transition"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4 text-ink/70" />
          </button>
          
          <div className="px-3 py-1 bg-cream border border-gold/30 rounded-lg text-sm font-mono text-ink/70 min-w-[60px] text-center">
            {Math.round(transform.scale * 100)}%
          </div>
          
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 bg-cream border border-gold/30 rounded-lg hover:bg-gold/10 transition"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4 text-ink/70" />
          </button>
          
          <div className="w-px h-6 bg-gold/30 mx-1" />
          
          <button
            type="button"
            onClick={handleReset}
            className="p-2 bg-cream border border-gold/30 rounded-lg hover:bg-gold/10 transition"
            title="Đặt lại"
          >
            <RotateCcw className="w-4 h-4 text-ink/70" />
          </button>

          <div className="w-px h-6 bg-gold/30 mx-1" />

          <button
            type="button"
            onClick={handleRemoveBackground}
            disabled={removingBackground}
            className="p-2 bg-cream border border-gold/30 rounded-lg hover:bg-gold/10 transition disabled:opacity-50 flex items-center gap-2"
            title="Xóa nền"
          >
            {removingBackground ? (
              <Loader2 className="w-4 h-4 text-ink/70 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 text-ink/70" />
            )}
            <span className="text-xs text-ink/70 font-vn">Xóa nền</span>
          </button>
        </div>
      )}

      {/* Save/Cancel buttons */}
      {(onSave || onCancel) && (
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-cream border border-gold/30 rounded-lg text-ink/70 hover:bg-gold/10 transition font-vn text-sm"
            >
              <X className="w-4 h-4" />
              Hủy
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(transform, processedUrl || undefined)}
              className="flex-1 flex items-center justify-center gap-2 py-2 bg-burgundy text-cream rounded-lg hover:bg-burgundy-dark transition font-vn text-sm"
            >
              <Check className="w-4 h-4" />
              Lưu
            </button>
          )}
        </div>
      )}
    </div>
  );
}

