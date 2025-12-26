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
  const [resizeStart, setResizeStart] = useState({ 
    clickX: 0, // Vị trí X của click ban đầu (percentage)
    clickY: 0, // Vị trí Y của click ban đầu (percentage)
    startX: 0, // Vị trí X ban đầu của slot
    startY: 0, // Vị trí Y ban đầu của slot
    width: 0, // Kích thước width ban đầu
    height: 0, // Kích thước height ban đầu
  });
  const [rotateStart, setRotateStart] = useState({ angle: 0, centerX: 0, centerY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<ResizeHandle | null>(null);
  // ✅ Track xem có đang drag/resize/rotate không để tránh clear selection khi mouseup
  const wasInteractingRef = useRef(false);

  const updateSlot = useCallback((index: number, updates: Partial<PhotoSlot>) => {
    const newSlots = [...slots];
    newSlots[index] = { ...newSlots[index], ...updates };
    onSlotsChange(newSlots);
  }, [slots, onSlotsChange]);

  const handleSlotMouseDown = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedSlotIndex(index);
    setIsDragging(true);
    wasInteractingRef.current = true; // ✅ Đánh dấu đang tương tác
    
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
      
      // ✅ Lấy giá trị ban đầu từ resizeStart (khi bắt đầu resize)
      const startX = resizeStart.startX; // Vị trí X ban đầu của slot
      const startY = resizeStart.startY; // Vị trí Y ban đầu của slot
      const startWidth = resizeStart.width; // Kích thước width ban đầu
      const startHeight = resizeStart.height; // Kích thước height ban đầu
      const startClickX = resizeStart.clickX; // Vị trí X của click ban đầu
      const startClickY = resizeStart.clickY; // Vị trí Y của click ban đầu
      
      // ✅ Tính diff từ vị trí click ban đầu đến vị trí chuột hiện tại
      const diffX = mouseX - startClickX;
      const diffY = mouseY - startClickY;
      
      let newX = startX;
      let newY = startY;
      let newWidth = startWidth;
      let newHeight = startHeight;

      // ✅ Tính toán resize dựa trên handle và diff
      if (handle.includes('w')) {
        // Resize từ bên trái: di chuyển X và giảm width
        newX = Math.max(0, startX + diffX);
        newWidth = Math.max(5, startWidth - diffX);
      }
      if (handle.includes('e')) {
        // Resize từ bên phải: chỉ tăng width
        newWidth = Math.max(5, startWidth + diffX);
      }
      if (handle.includes('n')) {
        // Resize từ trên: di chuyển Y và giảm height
        newY = Math.max(0, startY + diffY);
        newHeight = Math.max(5, startHeight - diffY);
      }
      if (handle.includes('s')) {
        // Resize từ dưới: chỉ tăng height
        newHeight = Math.max(5, startHeight + diffY);
      }

      // ✅ Đảm bảo slot không vượt quá bounds (0-100%)
      if (newX + newWidth > 100) {
        newWidth = 100 - newX;
      }
      if (newY + newHeight > 100) {
        newHeight = 100 - newY;
      }
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
        if (newWidth < 5) newWidth = 5;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
        if (newHeight < 5) newHeight = 5;
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
      
      // ✅ Tính góc hiện tại từ vị trí chuột đến center
      const currentAngle = Math.atan2(
        e.clientY - centerPixelY,
        e.clientX - centerPixelX
      ) * (180 / Math.PI);
      
      // ✅ Tính delta từ góc ban đầu (khi bắt đầu rotate)
      const deltaAngle = currentAngle - rotateStart.angle;
      
      // ✅ Áp dụng delta vào rotation hiện tại của slot
      const currentRotation = slot.rotation || 0;
      const newRotation = ((currentRotation + deltaAngle) % 360 + 360) % 360;
      
      updateSlot(selectedSlotIndex, { rotation: newRotation });
    }
  }, [isDragging, isResizing, isRotating, selectedSlotIndex, dragStart, resizeStart, rotateStart, slots, updateSlot]);

  const handleMouseUp = useCallback(() => {
    // ✅ Reset interaction flags sau một chút để tránh onClick của container clear selection
    setTimeout(() => {
      wasInteractingRef.current = false;
    }, 100);
    
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
    e.preventDefault();
    setSelectedSlotIndex(index);
    setIsResizing(true);
    wasInteractingRef.current = true; // ✅ Đánh dấu đang tương tác
    resizeHandleRef.current = handle;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const slot = slots[index];
    
    // ✅ Lưu vị trí click ban đầu (trong tọa độ container percentage)
    const clickX = (e.clientX - rect.left) / rect.width * 100;
    const clickY = (e.clientY - rect.top) / rect.height * 100;
    
    // ✅ Lưu vị trí và kích thước ban đầu của slot khi bắt đầu resize
    setResizeStart({
      clickX: clickX, // Vị trí X của click ban đầu (percentage)
      clickY: clickY, // Vị trí Y của click ban đầu (percentage)
      startX: slot.x, // Vị trí X ban đầu của slot
      startY: slot.y, // Vị trí Y ban đầu của slot
      width: slot.width, // Kích thước width ban đầu
      height: slot.height, // Kích thước height ban đầu
    });
  }, [slots]);

  const handleRotateStart = useCallback((e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedSlotIndex(index);
    setIsRotating(true);
    wasInteractingRef.current = true; // ✅ Đánh dấu đang tương tác
    
    const container = containerRef.current;
    if (!container) return;
    
    const slot = slots[index];
    const rect = container.getBoundingClientRect();
    const centerX = slot.x + slot.width / 2;
    const centerY = slot.y + slot.height / 2;
    
    const centerPixelX = (centerX / 100) * rect.width + rect.left;
    const centerPixelY = (centerY / 100) * rect.height + rect.top;
    
    // ✅ Tính góc ban đầu từ vị trí click đến center
    const initialAngle = Math.atan2(
      e.clientY - centerPixelY,
      e.clientX - centerPixelX
    ) * (180 / Math.PI);
    
    setRotateStart({
      angle: initialAngle,
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
        onClick={(e) => {
          // ✅ Chỉ clear selection nếu click vào container (không phải slot) và không đang tương tác
          const target = e.target as HTMLElement;
          if (!wasInteractingRef.current && !target.closest('.photo-slot')) {
            setSelectedSlotIndex(null);
          }
        }}
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
              className={`photo-slot absolute border-2 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-400 bg-gray-400/10'
              } ${isSelected ? 'cursor-move' : 'cursor-pointer'}`}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.width}%`,
                height: `${slot.height}%`,
                transform: `rotate(${slot.rotation || 0}deg)`,
                zIndex: isSelected ? (slot.zIndex || 10) + 100 : (slot.zIndex || 10),
                transformOrigin: 'center center',
              }}
              onClick={(e) => {
                // ✅ Click vào slot (không phải handle) để select
                e.stopPropagation();
                const target = e.target as HTMLElement;
                if (!target.closest('.resize-handle') && !target.closest('.rotate-handle') && !target.closest('.delete-button')) {
                  setSelectedSlotIndex(index);
                }
              }}
              onMouseDown={(e) => {
                // ✅ Chỉ drag nếu không click vào handle
                e.stopPropagation();
                const target = e.target as HTMLElement;
                if (!target.closest('.resize-handle') && !target.closest('.rotate-handle') && !target.closest('.delete-button')) {
                  handleSlotMouseDown(e, index);
                }
              }}
            >
              {/* Resize Handles */}
              {isSelected && (
                <>
                  {/* Corner handles */}
                  <div
                    className="resize-handle absolute -top-1.5 -left-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nwse-resize z-50 pointer-events-auto"
                    style={{ transform: 'translate(0, 0)' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 'nw', index);
                    }}
                  />
                  <div
                    className="resize-handle absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nesw-resize z-50 pointer-events-auto"
                    style={{ transform: 'translate(0, 0)' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 'ne', index);
                    }}
                  />
                  <div
                    className="resize-handle absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nesw-resize z-50 pointer-events-auto"
                    style={{ transform: 'translate(0, 0)' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 'sw', index);
                    }}
                  />
                  <div
                    className="resize-handle absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nwse-resize z-50 pointer-events-auto"
                    style={{ transform: 'translate(0, 0)' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 'se', index);
                    }}
                  />
                  
                  {/* Edge handles */}
                  <div
                    className="resize-handle absolute -top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ns-resize z-50 pointer-events-auto"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 'n', index);
                    }}
                  />
                  <div
                    className="resize-handle absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ns-resize z-50 pointer-events-auto"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 's', index);
                    }}
                  />
                  <div
                    className="resize-handle absolute -left-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ew-resize z-50 pointer-events-auto"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 'w', index);
                    }}
                  />
                  <div
                    className="resize-handle absolute -right-1.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-ew-resize z-50 pointer-events-auto"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleResizeStart(e, 'e', index);
                    }}
                  />

                  {/* Rotate Handle */}
                  <div
                    className="rotate-handle absolute -top-10 left-1/2 -translate-x-1/2 w-7 h-7 bg-blue-500 border-2 border-white rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center hover:bg-blue-600 z-50 pointer-events-auto shadow-lg"
                    style={{ transform: 'translate(-50%, 0)' }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleRotateStart(e, index);
                    }}
                  >
                    <RotateCw className="w-4 h-4 text-white" />
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    className="delete-button absolute -top-2 -right-10 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-50 pointer-events-auto shadow-lg transition"
                    style={{ transform: 'translate(0, 0)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeSlot(index);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    title="Xóa slot"
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

