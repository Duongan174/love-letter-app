// components/ui/ImageEditor.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Move, RotateCcw, Check, X } from 'lucide-react';
import { CARD_ASPECT_RATIO } from '@/lib/constants';

interface ImageEditorProps {
  src: string;
  alt?: string;
  aspectRatio?: number; // width / height (e.g., 3/4 for stamp)
  className?: string;
  onSave?: (transform: ImageTransform) => void;
  onCancel?: () => void;
  initialTransform?: ImageTransform;
  showControls?: boolean;
}

export interface ImageTransform {
  scale: number;
  x: number;
  y: number;
}

const DEFAULT_TRANSFORM: ImageTransform = {
  scale: 1,
  x: 0,
  y: 0,
};

export default function ImageEditor({
  src,
  alt = 'Image',
  aspectRatio = CARD_ASPECT_RATIO,
  className = '',
  onSave,
  onCancel,
  initialTransform = DEFAULT_TRANSFORM,
  showControls = true,
}: ImageEditorProps) {
  const [transform, setTransform] = useState<ImageTransform>(initialTransform);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset transform when src changes
  useEffect(() => {
    setTransform(initialTransform);
  }, [src]);

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
    
    // Limit movement based on container size
    const container = containerRef.current;
    if (container) {
      const maxOffset = 100; // Max pixels to drag
      setTransform(prev => ({
        ...prev,
        x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
        y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - transform.x,
        y: touch.clientY - transform.y,
      });
    }
  }, [transform.x, transform.y]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    const maxOffset = 100;
    setTransform(prev => ({
      ...prev,
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    }));
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
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

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Image Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl bg-cream border-2 border-gold/30 cursor-move"
        style={{ aspectRatio }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover select-none"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          draggable={false}
        />

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
        <div className="flex items-center justify-center gap-2">
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
              onClick={() => onSave(transform)}
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

// Simple image display with saved transform
export function TransformedImage({
  src,
  alt = 'Image',
  transform = DEFAULT_TRANSFORM,
  className = '',
}: {
  src: string;
  alt?: string;
  transform?: ImageTransform;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
      />
    </div>
  );
}

