// components/ui/Modal.tsx
'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Feather } from 'lucide-react';
import { cn } from '@/lib/utils';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  closeOnOverlay?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  size = 'md',
  showClose = true,
  closeOnOverlay = true,
  className,
}: ModalProps) {
  
  // ─────────────────────────────────────────────────────────────────────────────
  // KEYBOARD HANDLING
  // ─────────────────────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ─────────────────────────────────────────────────────────────────────────────
  // SIZE VARIANTS
  // ─────────────────────────────────────────────────────────────────────────────
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 300,
              duration: 0.3 
            }}
            className={cn(
              'relative w-full',
              sizeClasses[size],
              className
            )}
          >
            {/* Modal Content */}
            <div className="relative bg-cream-light rounded-soft shadow-elevated overflow-hidden">
              
              {/* Decorative Top Border */}
              <div className="h-1 bg-gold-shimmer" />

              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 text-gold/20 font-serif text-xl">❧</div>
              <div className="absolute top-4 right-12 text-gold/20 font-serif text-xl rotate-90">❧</div>

              {/* Close Button */}
              {showClose && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full text-ink/40 hover:text-burgundy hover:bg-burgundy/10 transition-all duration-200 z-10"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Header */}
              {(title || subtitle) && (
                <div className="px-6 pt-6 pb-4 text-center">
                  {title && (
                    <h2 className="font-display text-2xl font-bold text-ink mb-1">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="font-elegant text-ink/60">
                      {subtitle}
                    </p>
                  )}
                  
                  {/* Ornament Divider */}
                  <div className="flex items-center justify-center gap-3 mt-4">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/50" />
                    <Feather className="w-4 h-4 text-gold/60" />
                    <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/50" />
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="px-6 pb-6">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODAL FOOTER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gold/20',
      className
    )}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIRM MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'warning',
  loading = false,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: {
      icon: '⚠️',
      buttonClass: 'bg-red-700 hover:bg-red-800 text-cream-light',
    },
    warning: {
      icon: '⚡',
      buttonClass: 'bg-gold hover:bg-gold-dark text-cream-light',
    },
    info: {
      icon: '💡',
      buttonClass: 'bg-burgundy hover:bg-burgundy-dark text-cream-light',
    },
  };

  const style = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center py-4">
        <div className="text-4xl mb-4">{style.icon}</div>
        <h3 className="font-display text-xl font-semibold text-ink mb-2">{title}</h3>
        <p className="font-body text-ink/60 mb-6">{message}</p>
        
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 font-display text-sm font-medium text-ink/70 border border-gold/30 rounded-elegant hover:border-gold hover:bg-cream transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              'px-5 py-2.5 font-display text-sm font-medium rounded-elegant transition-all disabled:opacity-50',
              style.buttonClass
            )}
          >
            {loading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}