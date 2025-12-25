'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, X, Wallet, Coffee, ShoppingBag } from 'lucide-react';

interface LiXiButtonProps {
  cardId: string;
  senderName: string;
  recipientName: string;
}

type GiftType = 'money' | 'voucher' | 'coffee' | null;

export default function LiXiButton({ cardId, senderName, recipientName }: LiXiButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<GiftType>(null);
  const [processing, setProcessing] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const handleClaim = async (type: GiftType) => {
    setSelectedGift(type);
    setProcessing(true);

    try {
      // Call API to process payment/voucher
      const response = await fetch('/api/lixi/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId,
          giftType: type,
          recipientName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClaimed(true);
        // Redirect to payment or show voucher
        if (type === 'money') {
          // Redirect to MoMo/ZaloPay
          if (data.paymentUrl) {
            window.location.href = data.paymentUrl;
          }
        } else if (type === 'voucher' || type === 'coffee') {
          // Show voucher code
          alert(`Mã voucher của bạn: ${data.voucherCode}`);
        }
      }
    } catch (error) {
      console.error('Error claiming gift:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      {/* Fireworks Animation Trigger */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !processing && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>

              {!claimed ? (
                <>
                  {/* Fireworks Effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                        initial={{
                          x: '50%',
                          y: '50%',
                          scale: 0,
                        }}
                        animate={{
                          x: `${Math.random() * 100}%`,
                          y: `${Math.random() * 100}%`,
                          scale: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.05,
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-center relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="inline-block mb-4"
                    >
                      <Gift className="w-16 h-16 text-rose-500" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      🎉 Chúc mừng!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      <strong>{senderName}</strong> đã gửi tặng bạn một món quà!
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleClaim('money')}
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition shadow-lg disabled:opacity-50"
                      >
                        <Wallet className="w-5 h-5" />
                        <span>Nhận Lì Xì</span>
                        <Sparkles className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => handleClaim('coffee')}
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition shadow-lg disabled:opacity-50"
                      >
                        <Coffee className="w-5 h-5" />
                        <span>Voucher Highland/Phúc Long</span>
                      </button>

                      <button
                        onClick={() => handleClaim('voucher')}
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition shadow-lg disabled:opacity-50"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span>Voucher Shopping</span>
                      </button>
                    </div>

                    {processing && (
                      <div className="mt-4 text-sm text-gray-500">
                        Đang xử lý...
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-block mb-4"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-green-600" />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Đã nhận quà thành công! 🎊
                  </h3>
                  <p className="text-gray-600">
                    Kiểm tra email hoặc ví điện tử của bạn
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 z-40 px-6 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-2xl flex items-center gap-3 font-semibold hover:from-rose-600 hover:to-pink-600 transition"
      >
        <Gift className="w-6 h-6" />
        <span>Nhận Lì Xì</span>
        <Sparkles className="w-5 h-5" />
      </motion.button>
    </>
  );
}

