// components/create/AutoSaveIndicator.tsx
/**
 * Component hiển thị trạng thái auto save
 * - Loading indicator khi đang save
 * - Success icon khi save thành công
 * - Error icon khi save thất bại
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AutoSaveStatus } from '@/hooks/useAutoSave';

interface AutoSaveIndicatorProps {
  status: AutoSaveStatus;
  /** Vị trí hiển thị */
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left';
}

export default function AutoSaveIndicator({
  status,
  position = 'top-center',
}: AutoSaveIndicatorProps) {
  const { isSaving, lastSavedAt, lastError } = status;
  const [shouldShow, setShouldShow] = useState(false);

  // Tính toán vị trí CSS
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'top-center': '', // Sẽ dùng inline style để căn giữa chính xác
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  // Format thời gian đã save
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 10) return 'Vừa xong';
    if (seconds < 60) return `${seconds} giây trước`;
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Logic hiển thị: luôn hiện khi đang save hoặc có lỗi, nhưng tự ẩn sau 5 giây khi save thành công
  useEffect(() => {
    if (isSaving) {
      // Đang save: luôn hiển thị
      setShouldShow(true);
    } else if (lastError) {
      // Có lỗi: luôn hiển thị
      setShouldShow(true);
    } else if (lastSavedAt) {
      // Save thành công: hiển thị và tự ẩn sau 5 giây
      setShouldShow(true);
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 5000); // 5 giây

      return () => {
        clearTimeout(timer);
      };
    } else {
      // Không có gì: ẩn
      setShouldShow(false);
    }
  }, [isSaving, lastSavedAt, lastError]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <div
          className={`fixed ${positionClasses[position]} z-[100]`}
          style={
            position === 'top-center'
              ? {
                  left: '50%',
                  top: '80px',
                  transform: 'translateX(-50%)',
                }
              : undefined
          }
        >
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-amber-200/50 px-4 py-2.5 flex items-center gap-2.5 min-w-[200px]"
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {isSaving ? (
                <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
              ) : lastError ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : lastSavedAt ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Save className="w-4 h-4 text-gray-400" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-700">
                {isSaving ? (
                  'Đang lưu...'
                ) : lastError ? (
                  <span className="text-red-600">Lưu thất bại</span>
                ) : lastSavedAt ? (
                  <span className="text-green-600">Đã lưu</span>
                ) : (
                  'Đang chờ...'
                )}
              </div>
              {lastSavedAt && !isSaving && !lastError && (
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {formatLastSaved(lastSavedAt)}
                </div>
              )}
              {lastError && !isSaving && (
                <div className="text-[10px] text-red-500 mt-0.5 truncate">
                  {lastError.message}
                </div>
              )}
            </div>

            {/* Retry indicator */}
            {status.retryCount > 0 && (
              <div className="flex-shrink-0 text-[10px] text-amber-600 font-medium">
                Thử lại ({status.retryCount}/2)
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

