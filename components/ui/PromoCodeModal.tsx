// components/ui/PromoCodeModal.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Loader2, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { supabase } from '@/lib/supabase';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: (newBalance: number) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function PromoCodeModal({ 
  isOpen, 
  onClose, 
  userId, 
  onSuccess 
}: PromoCodeModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | null;
    message: string;
    points?: number;
  }>({ type: null, message: '' });

  // ─────────────────────────────────────────────────────────────────────────────
  // SUBMIT HANDLER
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setResult({ type: 'error', message: 'Vui lòng nhập mã khuyến mãi' });
      return;
    }

    setLoading(true);
    setResult({ type: null, message: '' });

    try {
      // Call API to validate and redeem promo code
      const response = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mã không hợp lệ');
      }

      setResult({ 
        type: 'success', 
        message: `Chúc mừng! Bạn đã nhận được ${data.points} Tym!`,
        points: data.points
      });

      if (onSuccess && data.newBalance) {
        onSuccess(data.newBalance);
      }

      // Clear input after success
      setCode('');
      
    } catch (error: any) {
      setResult({ 
        type: 'error', 
        message: error.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // CLOSE HANDLER
  // ─────────────────────────────────────────────────────────────────────────────
  const handleClose = () => {
    setCode('');
    setResult({ type: null, message: '' });
    onClose();
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      title="Nhập Mã Khuyến Mãi"
      subtitle="Đổi mã để nhận Tym miễn phí"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Gift Icon */}
        <div className="flex justify-center">
          <motion.div 
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center"
          >
            <Gift className="w-10 h-10 text-gold" />
          </motion.div>
        </div>

        {/* Input Field */}
        <div>
          <label className="label-vintage">Mã khuyến mãi</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Nhập mã tại đây..."
            className="input-vintage text-center font-display text-lg tracking-widest uppercase"
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Result Message */}
        <AnimatePresence mode="wait">
          {result.type && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`
                flex items-center gap-3 p-4 rounded-soft border
                ${result.type === 'success' 
                  ? 'bg-forest/10 border-forest/30 text-forest' 
                  : 'bg-red-50 border-red-200 text-red-700'
                }
              `}
            >
              {result.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-elegant">{result.message}</p>
                {result.points && (
                  <div className="flex items-center gap-2 mt-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span className="font-display font-bold text-gold">
                      +{result.points} Tym
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button 
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
            disabled={loading}
          >
            Đóng
          </Button>
          <Button 
            type="submit"
            variant="primary"
            className="flex-1"
            loading={loading}
            icon={<Gift className="w-4 h-4" />}
          >
            Đổi Mã
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-center font-elegant text-sm text-ink/50">
          Mã khuyến mãi có thể được tìm thấy trong các sự kiện hoặc từ đối tác của Echo.
        </p>
      </form>
    </Modal>
  );
}