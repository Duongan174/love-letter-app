'use client';

import { useState } from 'react';
import { Gift, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: (newBalance: number) => void;
}

export default function PromoCodeModal({ isOpen, onClose, userId, onSuccess }: PromoCodeModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error';
    message: string;
    tym?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/promo/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), user_id: userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          type: 'success',
          message: data.message,
          tym: data.tym_received,
        });
        setCode('');
        if (onSuccess) {
          onSuccess(data.new_balance);
        }
      } else {
        setResult({
          type: 'error',
          message: data.error,
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Nhập mã khuyến mãi</h2>
          <p className="text-gray-500 text-sm mt-1">Nhập mã để nhận Tym miễn phí!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Nhập mã tại đây..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-lg font-mono tracking-wider focus:outline-none focus:border-rose-500 uppercase"
              disabled={loading}
              autoFocus
            />
          </div>

          {result && (
            <div
              className={`flex items-center gap-3 p-4 rounded-xl ${
                result.type === 'success'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {result.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <div>
                <p className="font-medium">{result.message}</p>
                {result.tym && (
                  <p className="text-sm mt-1">+{result.tym} 💜 Tym đã được cộng vào tài khoản!</p>
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                Nhận thưởng
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Mỗi mã chỉ có thể sử dụng 1 lần cho mỗi tài khoản
          </p>
        </div>
      </div>
    </div>
  );
}