// components/ui/PhotoSlotEditor.tsx
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, X, Plus } from 'lucide-react';

interface PhotoSlot {
  x: number; // Percentage
  y: number; // Percentage
  width: number; // Percentage
  height: number; // Percentage
  rotation?: number; // Degrees
  zIndex?: number;
}

interface PhotoSlotEditorProps {
  frameImageUrl: string;
  slots: PhotoSlot[];
  onSlotsChange: (slots: PhotoSlot[]) => void;
  className?: string;
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';

export default function PhotoSlotEditor({
  frameImageUrl,
  slots,
  onSlotsChange,
  className = '',
}: PhotoSlotEditorProps) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [rotateStart, setRotateStart] = useState({ angle: 0, centerX: 0, centerY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<ResizeHandle | null>(null);

  const updateSlot = useCallback((index: number, updates: Partial<PhotoSlot>) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], ...updates };
    onSlotsChange(newSlots);
  }, [slots, onSlotsChange]);

  const handleSlotMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedSlotIndex(index);
    setIsDragging(true);
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const slot = slots[index];
    setDragStart({
      x: e.clientX - (rect.left + (rect.width * slot.x / 100)),
      y: e.clientY - (rect.top + (rect.height * slot.y / 100)),
    });
  }, [slots]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    if (isDragging && selectedSlotIndex !== null) {
      const newX = ((e.clientX - dragStart.x - rect.left) / containerWidth) * 100;
      const newY = ((e.clientY - dragStart.y - rect.top) / containerHeight) * 100;
      
      updateSlot(selectedSlotIndex, {
        x: Math.max(0, Math.min(100 - slots[selectedSlotIndex].width, newX)),
        y: Math.max(0, Math.min(100 - slots[selectedSlotIndex].height, newY)),
      });
    } else if (isResizing && selectedSlotIndex !== null && resizeHandleRef.current) {
      const slot = slots[selectedSlotIndex];
      const handle = resizeHandleRef.current;
      
      const mouseX = ((e.clientX - rect.left) / containerWidth) * 100;
      const mouseY = ((e.clientY - rect.top) / containerHeight) * 100;
      
      let newX = slot.x;
      let newY = slot.y;
      let newWidth = slot.width;
      let newHeight = slot.height;

      if (handle.includes('w')) {
        const diffX = mouseX - (slot.x + resizeStart.x);
        newX = Math.max(0, slot.x + diffX);
        newWidth = Math.max(5, slot.width - diffX);
      }
      if (handle.includes('e')) {
        const diffX = mouseX - (slot.x + slot.width + resizeStart.x);
        newWidth = Math.max(5, slot.width + diffX);
      }
      if (handle.includes('n')) {
        const diffY = mouseY - (slot.y + resizeStart.y);
        newY = Math.max(0, slot.y + diffY);
        newHeight = Math.max(5, slot.height - diffY);
      }
      if (handle.includes('s')) {
        const diffY = mouseY - (slot.y + slot.height + resizeStart.y);
        newHeight = Math.max(5, slot.height + diffY);
      }

      // Ensure slot stays within bounds
      if (newX + newWidth > 100) {
        newWidth = 100 - newX;
      }
      if (newY + newHeight > 100) {
        newHeight = 100 - newY;
      }

      updateSlot(selectedSlotIndex, {
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight,
      });
    } else if (isRotating && selectedSlotIndex !== null) {
      const slot = slots[selectedSlotIndex];
      const centerX = slot.x + slot.width / 2;
      const centerY = slot.y + slot.height / 2;
      
      const rect = container.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      
      const centerPixelX = (centerX / 100) * containerWidth + rect.left;
      const centerPixelY = (centerY / 100) * containerHeight + rect.top;
      
      const angle = Math.atan2(
        e.clientY - centerPixelY,
        e.clientX - centerPixelX
      ) * (180 / Math.PI);
      
      const deltaAngle = angle - rotateStart.angle;
      const newRotation = ((rotateStart.angle + deltaAngle) % 360 + 360) % 360;
      
      updateSlot(selectedSlotIndex, { rotation: newRotation });
    }
  }, [isDragging, isResizing, isRotating, selectedSlotIndex, dragStart, resizeStart, rotateStart, slots, updateSlot]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    resizeHandleRef.current = null;
  }, []);

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: ResizeHandle, index: number) => {
    e.stopPropagation();
    setSelectedSlotIndex(index);
    setIsResizing(true);
    resizeHandleRef.current = handle;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const slot = slots[index];
    setResizeStart({
      x: (e.clientX - rect.left) / rect.width * 100 - slot.x,
      y: (e.clientY - rect.top) / rect.height * 100 - slot.y,
      width: slot.width,
      height: slot.height,
    });
  }, [slots]);

  const handleRotateStart = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedSlotIndex(index);
    setIsRotating(true);
    
    const container = containerRef.current;
    if (!container) return;
    
    const slot = slots[index];
    const rect = container.getBoundingClientRect();
    const centerX = slot.x + slot.width / 2;
    const centerY = slot.y + slot.height / 2;
    
    const centerPixelX = (centerX / 100) * rect.width + rect.left;
    const centerPixelY = (centerY / 100) * rect.height + rect.top;
    
    const angle = Math.atan2(
      e.clientY - centerPixelY,
      e.clientX - centerPixelX
    ) * (180 / Math.PI);
    
    setRotateStart({
      angle,
      centerX: centerPixelX,
      centerY: centerPixelY,
    });
  }, [slots]);

  const addSlot = useCallback(() => {
    onSlotsChange([
      ...slots,
      { x: 10, y: 10, width: 30, height: 30, rotation: 0, zIndex: 10 },
    ]);
    setSelectedSlotIndex(slots.length);
  }, [slots, onSlotsChange]);

  const removeSlot = useCallback((index: number) => {
    onSlotsChange(slots.filter((_, i) => i !== index));
    if (selectedSlotIndex === index) {
      setSelectedSlotIndex(null);
    }
  }, [slots, onSlotsChange, selectedSlotIndex]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="relative border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100"
        style={{ aspectRatio: 'auto' }}
        onClick={() => setSelectedSlotIndex(null)}
      >
        {frameImageUrl && (
          <img
            src={frameImageUrl}
            alt="Frame"
            className="w-full h-auto pointer-events-none"
          />
        )}

        {/* Photo Slots */}
        {slots.map((slot, index) => {
          const isSelected = selectedSlotIndex === index;
          
          return (
            <motion.div
              key={index}
              className={`absolute border-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-400 bg-gray-400/10'
              } cursor-move`}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
                transform: `rotate(${slot.rotation || 0}deg)`,
                zIndex: slot.zIndex || 10,
              }}
              onMouseDown={(e) => handleSlotMouseDown(e, index)}
            >
              {/* Resize Handles */}
              {isSelected && (
                <>
                  {/* Corner handles */}
                  <div
                    className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-nwse-resize"
                    onMouseDown={(e) => handleResizeStart(e, 'nw', index)}
                  />
                  <div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-nesw-resize"
                    onMouseDown={(e) => handleResizeStart(e, 'ne', index)}
                  />
                  <div
                    className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-nesw-resize"
                    onMouseDown={(e) => handleResizeStart(e, 'sw', index)}
                  />
                  <div
                    className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded cursor-nwse-resize"
                    onMouseDown={(e) => handleResizeStart(e, 'se', index)}
                  />
                  
                  {/* Edge handles */}
                  <div
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded cursor-ns-resize"
                    onMouseDown={(e) => handleResizeStart(e, 'n', index)}
                  />
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded cursor-ns-resize"
                    onMouseDown={(e) => handleResizeStart(e, 's', index)}
                  />
                  <div
                    className="absolute -left-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded cursor-ew-resize"
                    onMouseDown={(e) => handleResizeStart(e, 'w', index)}
                  />
                  <div
                    className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded cursor-ew-resize"
                    onMouseDown={(e) => handleResizeStart(e, 'e', index)}
                  />

                  {/* Rotate Handle */}
                  <div
                    className="absolute -top-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 border border-white rounded-full cursor-grab flex items-center justify-center hover:bg-blue-600"
                    onMouseDown={(e) => handleRotateStart(e, index)}
                  >
                    <RotateCw className="w-3 h-3 text-white" />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlot(index);
                    }}
                    className="absolute -top-1 -right-8 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Slot Label */}
              <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                Slot {index + 1}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Slot Button */}
      <button
        onClick={addSlot}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Thêm slot
      </button>

      {/* Slot Info */}
      {selectedSlotIndex !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Slot {selectedSlotIndex + 1}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">X:</span>{' '}
              <input
                type="number"
                value={slots[selectedSlotIndex].x.toFixed(1)}
                onChange={(e) => updateSlot(selectedSlotIndex, { x: parseFloat(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border rounded"
                step="0.1"
              />
              <span className="text-gray-500 ml-1">%</span>
            </div>
            <div>
              <span className="text-gray-600">Y:</span>{' '}
              <input
                type="number"
                value={slots[selectedSlotIndex].y.toFixed(1)}
                onChange={(e) => updateSlot(selectedSlotIndex, { y: parseFloat(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border rounded"
                step="0.1"
              />
              <span className="text-gray-500 ml-1">%</span>
            </div>
            <div>
              <span className="text-gray-600">Width:</span>{' '}
              <input
                type="number"
                value={slots[selectedSlotIndex].width.toFixed(1)}
                onChange={(e) => updateSlot(selectedSlotIndex, { width: parseFloat(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border rounded"
                step="0.1"
              />
              <span className="text-gray-500 ml-1">%</span>
            </div>
            <div>
              <span className="text-gray-600">Height:</span>{' '}
              <input
                type="number"
                value={slots[selectedSlotIndex].height.toFixed(1)}
                onChange={(e) => updateSlot(selectedSlotIndex, { height: parseFloat(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border rounded"
                step="0.1"
              />
              <span className="text-gray-500 ml-1">%</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Rotation:</span>{' '}
              <input
                type="number"
                value={slots[selectedSlotIndex].rotation || 0}
                onChange={(e) => updateSlot(selectedSlotIndex, { rotation: parseFloat(e.target.value) || 0 })}
                className="w-20 px-2 py-1 border rounded"
                step="1"
                min="0"
                max="360"
              />
              <span className="text-gray-500 ml-1">°</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

