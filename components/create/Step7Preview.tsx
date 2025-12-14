'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Eye, Copy, Mail, Heart, Music, Image, 
  PenTool, Check, Share2, Link, Facebook 
} from 'lucide-react';
import { CreateCardState } from '@/hooks/useCreateCard';

interface Step7PreviewProps {
  state: CreateCardState;
  userTym: number;
  onSend: () => Promise<string>;
}

export default function Step7Preview({
  state,
  userTym,
  onSend,
}: Step7PreviewProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canAfford = userTym >= state.totalTymCost;

  const handleSend = async () => {
    if (!canAfford) {
      alert('Bạn không đủ Tym!');
      return;
    }

    setSending(true);
    try {
      const cardId = await onSend();
      setSent(true);
      setShareLink(`${window.location.origin}/card/${cardId}`);
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi tạo thiệp!');
    } finally {
      setSending(false);
    }
  };

  const copyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToFacebook = () => {
    if (shareLink) {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank');
    }
  };

  const shareNative = async () => {
    if (shareLink && navigator.share) {
      await navigator.share({
        title: `Thiệp yêu thương gửi ${state.recipientName}`,
        url: shareLink,
      });
    }
  };

  const summaryItems = [
    { 
      icon: Heart, 
      label: 'Mẫu thiệp', 
      value: state.template?.name || 'Chưa chọn',
      cost: state.template?.tym_cost || 0,
    },
    { 
      icon: Mail, 
      label: 'Phong bì', 
      value: state.envelope?.name || 'Chưa chọn',
      cost: state.envelope?.tym_cost || 0,
    },
    { 
      icon: Image, 
      label: 'Ảnh', 
      value: `${state.photos.length} ảnh`,
      cost: 0,
    },
    { 
      icon: Music, 
      label: 'Nhạc nền', 
      value: state.music?.name || 'Không có',
      cost: state.music?.tym_cost || 0,
    },
    { 
      icon: PenTool, 
      label: 'Chữ ký', 
      value: state.signatureData ? 'Có' : 'Không',
      cost: 0,
    },
  ];

  // Màn hình thành công
  if (sent && shareLink) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Thiệp đã sẵn sàng! 🎉
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-8"
        >
          Chia sẻ link để người nhận mở thiệp của bạn
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-100 rounded-2xl p-4 flex items-center gap-3 mb-6"
        >
          <Link className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={shareLink}
            readOnly
            className="flex-1 bg-transparent text-gray-700 text-sm outline-none"
          />
          <button
            onClick={copyLink}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2
              ${copied ? 'bg-green-500 text-white' : 'bg-rose-500 text-white hover:bg-rose-600'}`}
          >
            {copied ? <><Check className="w-4 h-4" /> Đã copy!</> : <><Copy className="w-4 h-4" /> Copy</>}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button 
            onClick={shareToFacebook}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center text-white">
              <Facebook className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-600">Facebook</span>
          </button>
          
          <button 
            onClick={shareNative}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-600">Khác</span>
          </button>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
            href={shareLink}
            target="_blank"
            className="px-6 py-3 bg-white border-2 border-rose-500 text-rose-500 rounded-xl font-medium hover:bg-rose-50 transition flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            Xem thiệp
          </a>
          
            href="/dashboard"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Về Dashboard
          </a>
        </div>
      </div>
    );
  }

  // Màn hình xem trước
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Xem trước & Gửi
        </h2>
        <p className="text-gray-600">
          Kiểm tra lại thiệp trước khi gửi cho người nhận
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Xem trước thiệp</h3>
          
          <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-6 aspect-[3/4] flex flex-col items-center justify-center relative overflow-hidden">
            <motion.div
              animate={{ rotateY: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-48 h-32 rounded-lg shadow-2xl relative"
              style={{ backgroundColor: state.envelope?.color || '#f8b4c4' }}
            >
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white z-10"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b 50%, #922b21)',
                  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.3)'
                }}
              >
                <Heart className="w-4 h-4" fill="currentColor" />
              </div>

              {state.stamp && (
                <div className="absolute top-2 right-2 text-2xl">{state.stamp.image}</div>
              )}
            </motion.div>

            <p className="mt-6 text-gray-700 font-medium">
              Gửi: <span className="text-rose-600">{state.recipientName || '...'}</span>
            </p>

            {state.music && (
              <div className="absolute bottom-4 right-4 flex items-center gap-1 text-rose-400">
                <Music className="w-4 h-4" />
                <span className="text-xs">Có nhạc</span>
              </div>
            )}

            {state.photos.length > 0 && (
              <div className="absolute bottom-4 left-4 flex items-center gap-1 text-rose-400">
                <Image className="w-4 h-4" />
                <span className="text-xs">{state.photos.length} ảnh</span>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tóm tắt thiệp</h3>
          
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {summaryItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 ${index !== summaryItems.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-800">{item.value}</p>
                    </div>
                  </div>
                  <span className={item.cost === 0 ? 'text-green-600 text-sm' : 'text-rose-600 text-sm font-medium'}>
                    {item.cost === 0 ? 'Miễn phí' : `💜 ${item.cost}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cost */}
          <div className="mt-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80">Tổng chi phí</span>
              <span className="text-2xl font-bold">💜 {state.totalTymCost} Tym</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Tym hiện có</span>
              <span className={canAfford ? 'text-green-200' : 'text-red-200'}>💜 {userTym} Tym</span>
            </div>
            
            {!canAfford && (
              <p className="mt-2 text-sm text-red-200 bg-red-500/20 rounded-lg p-2">
                ⚠️ Bạn cần thêm {state.totalTymCost - userTym} Tym
              </p>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canAfford || sending}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all
              ${canAfford && !sending
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-1'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {sending ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang tạo thiệp...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                Tạo & Gửi Thiệp
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Sau khi tạo, bạn sẽ nhận được link để chia sẻ cho người nhận
          </p>
        </div>
      </div>
    </div>
  );
}