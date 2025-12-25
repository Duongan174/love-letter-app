'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send, Eye, Copy, Mail, Heart, Music, Image, 
  PenTool, Check, Share2, Link, Facebook, QrCode, Download, Lock
} from 'lucide-react';
import { CreateCardState } from '@/hooks/useCreateCard';
import QRCode from 'qrcode';
import AIVoiceCard from '@/components/card/AIVoiceCard';
import WebARViewer from '@/components/card/WebARViewer';
import LiXiButton from '@/components/card/LiXiButton';

interface Step7PreviewProps {
  state: CreateCardState;
  userTym: number;
  onSend: () => Promise<string>;
}

export default function Step7Preview({ state, userTym, onSend }: Step7PreviewProps) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [downloadingQR, setDownloadingQR] = useState(false);
  const [cardId, setCardId] = useState<string | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);

  const canAfford = userTym >= state.totalTymCost;

  // Tính toán chi phí chính xác từ points_required
  const calculateTotalCost = () => {
    let total = 0;
    if (state.template?.points_required) total += state.template.points_required;
    if (state.envelope?.points_required) total += state.envelope.points_required;
    if (state.stamp?.points_required) total += state.stamp.points_required;
    if (state.music?.points_required) total += state.music.points_required;
    return total;
  };

  const actualTotalCost = calculateTotalCost();

  // Tạo QR code khi có shareLink và showQRCode = true
  useEffect(() => {
    if (shareLink && showQRCode) {
      QRCode.toDataURL(shareLink, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then((url) => {
          setQrCodeDataUrl(url);
        })
        .catch((err) => {
          console.error('Error generating QR code:', err);
        });
    } else {
      setQrCodeDataUrl(null);
    }
  }, [shareLink, showQRCode]);

  const handleSend = async () => {
    if (!canAfford) {
      alert('Bạn không đủ Tym!');
      return;
    }

    setSending(true);
    try {
      console.log('Starting to send card...');
      const cardId = await onSend();
      console.log('Card created with ID:', cardId);
      
      if (!cardId || typeof cardId !== 'string') {
        throw new Error('Không nhận được ID thiệp từ server');
      }
      
      const link = `${window.location.origin}/card/${cardId}`;
      console.log('Share link:', link);
      
      // Set link and cardId
      setShareLink(link);
      setCardId(cardId);
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        setSent(true);
        setSending(false);
      }, 100);
    } catch (error: any) {
      console.error('Error creating card:', error);
      alert(`Có lỗi xảy ra khi tạo thiệp: ${error?.message || 'Lỗi không xác định'}`);
      setSending(false);
      setSent(false);
      setShareLink(null);
    }
  };

  const copyLink = async () => {
    if (shareLink) {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      setDownloadingQR(true);
      const link = document.createElement('a');
      link.download = `qrcode-${state.recipientName || 'card'}.png`;
      link.href = qrCodeDataUrl;
      link.click();
      setTimeout(() => setDownloadingQR(false), 500);
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

  // Summary items với chi phí chính xác từ points_required
  const summaryItems = [
    { 
      icon: Heart, 
      label: 'Mẫu thiệp', 
      value: state.template?.name || 'Chưa chọn', 
      cost: state.template?.points_required || 0 
    },
    { 
      icon: Mail, 
      label: 'Phong bì', 
      value: state.envelope?.name || 'Chưa chọn', 
      cost: state.envelope?.points_required || 0 
    },
    { 
      icon: Image, 
      label: 'Tem thư', 
      value: state.stamp?.name || 'Chưa chọn', 
      cost: state.stamp?.points_required || 0 
    },
    { 
      icon: Image, 
      label: 'Ảnh', 
      value: `${state.photos.length} ảnh`, 
      cost: 0 
    },
    { 
      icon: Music, 
      label: 'Nhạc nền', 
      value: state.music?.name || 'Không có', 
      cost: state.music?.points_required || 0 
    },
    { 
      icon: PenTool, 
      label: 'Chữ ký', 
      value: state.signatureData ? 'Có' : 'Không', 
      cost: 0 
    },
  ];

  // Màn hình thành công với QR code và link
  // Debug: Log state để kiểm tra
  useEffect(() => {
    console.log('Step7Preview state:', { sent, shareLink, sending, qrCodeDataUrl });
  }, [sent, shareLink, sending, qrCodeDataUrl]);

  if (sent && shareLink) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-24 h-24 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-2 font-serif"
        >
          Thiệp đã sẵn sàng! 🎉
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mb-8"
        >
          Chia sẻ link hoặc quét QR code để người nhận mở thiệp của bạn
        </motion.p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Link Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl p-6 border border-amber-200/50 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Link className="w-6 h-6 text-amber-700" />
              <h3 className="text-xl font-bold text-gray-800 font-serif">Link Chia Sẻ</h3>
            </div>
            
            <div className="bg-white rounded-xl p-4 mb-4 shadow-inner">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                <Link className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-transparent text-gray-700 text-sm outline-none font-mono"
                />
              </div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <button
                onClick={copyLink}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  copied 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Đã copy!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
              
              {/* ✅ Tùy chọn chuyển link thành QR code */}
              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                  showQRCode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50'
                }`}
              >
                <QrCode className="w-4 h-4" />
                {showQRCode ? 'Ẩn QR' : 'Tạo QR'}
              </button>
            </div>
            
            {/* QR Code hiển thị khi showQRCode = true */}
            {showQRCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-white rounded-xl p-4 flex items-center justify-center shadow-inner"
              >
                {qrCodeDataUrl ? (
                  <img 
                    src={qrCodeDataUrl} 
                    alt="QR Code" 
                    className="w-full max-w-[200px] h-auto"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-gray-400 text-sm">Đang tạo QR code...</div>
                  </div>
                )}
              </motion.div>
            )}
            
            {showQRCode && qrCodeDataUrl && (
              <button
                onClick={downloadQRCode}
                disabled={downloadingQR}
                className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloadingQR ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Tải QR Code
                  </>
                )}
              </button>
            )}
          </motion.div>

          {/* Share Buttons Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl p-6 border border-amber-200/50 shadow-lg"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Share2 className="w-6 h-6 text-amber-700" />
              <h3 className="text-xl font-bold text-gray-800 font-serif">Chia Sẻ</h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={shareToFacebook} 
                className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-gray-200"
              >
                <div className="w-10 h-10 bg-[#1877F2] rounded-full flex items-center justify-center text-white">
                  <Facebook className="w-5 h-5" />
                </div>
                <span className="text-gray-700 font-medium">Chia sẻ lên Facebook</span>
              </button>
              
              <button 
                onClick={shareNative} 
                className="flex items-center justify-center gap-3 p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition border border-gray-200"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-500 rounded-full flex items-center justify-center text-white">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-gray-700 font-medium">Chia sẻ khác</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <a 
            href={shareLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:from-amber-600 hover:to-amber-700 transition flex items-center justify-center gap-2 shadow-lg"
          >
            <Eye className="w-5 h-5" />
            Xem thiệp
          </a>
          <a 
            href="/dashboard" 
            className="px-6 py-3 bg-white border-2 border-amber-500 text-amber-600 rounded-xl font-medium hover:bg-amber-50 transition shadow-lg"
          >
            Về Dashboard
          </a>
        </motion.div>

        {/* ✅ Tính năng bổ sung - AI Voice Card, WebAR, LiXi (khóa tạm thời) */}
        {cardId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 font-serif text-center">Tính năng bổ sung</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* AI Voice Card - Hoạt động */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg">
                <AIVoiceCard
                  cardId={cardId}
                  message={state.message || ''}
                  senderName={state.senderName || ''}
                />
              </div>
              
              {/* WebAR Viewer - Khóa tạm thời */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg relative opacity-60">
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-sm rounded-xl">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Tính năng đang phát triển</p>
                  </div>
                </div>
                <WebARViewer
                  cardId={cardId}
                  arContent={{ type: 'fireworks' }}
                />
              </div>
              
              {/* LiXi Button - Khóa tạm thời */}
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-lg relative opacity-60">
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 backdrop-blur-sm rounded-xl">
                  <div className="text-center">
                    <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Tính năng đang phát triển</p>
                  </div>
                </div>
                <LiXiButton
                  cardId={cardId}
                  senderName={state.senderName || ''}
                  recipientName={state.recipientName || ''}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Màn hình xem trước với tổng chi phí chính xác
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 font-serif">Xem trước & Gửi</h2>
        <p className="text-gray-600">Kiểm tra lại thiệp và chi phí trước khi gửi cho người nhận</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Xem trước thiệp</h3>
          <div 
            className="bg-gradient-to-br from-amber-50 to-rose-50 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden mx-auto border border-amber-200/50 shadow-lg"
            style={{
              width: '1080px',
              height: '1440px',
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 200px)',
              aspectRatio: '1080 / 1440',
            }}
          >
            <motion.div
              animate={{ rotateY: [0, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-48 h-32 rounded-lg shadow-2xl relative"
              style={{ backgroundColor: state.envelope?.color || '#f8b4c4' }}
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white z-10" style={{ background: 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b 50%, #922b21)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.3)' }}>
                <Heart className="w-4 h-4" fill="currentColor" />
              </div>
              {state.stamp && <div className="absolute top-2 right-2 text-2xl">{state.stamp.image}</div>}
            </motion.div>
            <p className="mt-6 text-gray-700 font-medium">Gửi: <span className="text-amber-700 font-serif">{state.recipientName || '...'}</span></p>
            {state.music && <div className="absolute bottom-4 right-4 flex items-center gap-1 text-amber-600"><Music className="w-4 h-4" /><span className="text-xs">Có nhạc</span></div>}
            {state.photos.length > 0 && <div className="absolute bottom-4 left-4 flex items-center gap-1 text-amber-600"><Image className="w-4 h-4" /><span className="text-xs">{state.photos.length} ảnh</span></div>}
          </div>
        </div>

        {/* Summary */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-serif">Tóm tắt thiệp</h3>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            {summaryItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 ${
                    index !== summaryItems.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg flex items-center justify-center border border-amber-200/50">
                      <Icon className="w-4 h-4 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-medium text-gray-800">{item.value}</p>
                    </div>
                  </div>
                  <span className={
                    item.cost === 0 
                      ? 'text-green-600 text-sm font-medium' 
                      : 'text-amber-700 text-sm font-bold'
                  }>
                    {item.cost === 0 ? 'Miễn phí' : `💜 ${item.cost}`}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cost Summary */}
          <div className="mt-4 bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/90 text-lg font-medium">Tổng chi phí</span>
              <span className="text-3xl font-bold font-serif">💜 {actualTotalCost} Tym</span>
            </div>
            <div className="h-px bg-white/30 my-3"></div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Tym hiện có</span>
              <span className={canAfford ? 'text-green-200 font-bold' : 'text-red-200 font-bold'}>
                💜 {userTym} Tym
              </span>
            </div>
            {!canAfford && (
              <div className="mt-3 p-3 bg-red-500/20 rounded-lg border border-red-300/30">
                <p className="text-sm text-red-100">
                  ⚠️ Bạn cần thêm <span className="font-bold">{actualTotalCost - userTym} Tym</span> để tạo thiệp này
                </p>
              </div>
            )}
            {canAfford && (
              <div className="mt-3 p-3 bg-green-500/20 rounded-lg border border-green-300/30">
                <p className="text-sm text-green-100">
                  ✓ Số dư còn lại: <span className="font-bold">{userTym - actualTotalCost} Tym</span>
                </p>
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!canAfford || sending}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg ${
              canAfford && !sending 
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500 text-white hover:shadow-2xl hover:shadow-amber-200/50 hover:-translate-y-1' 
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
            Sau khi tạo, bạn sẽ nhận được link và QR code để chia sẻ cho người nhận
          </p>
        </div>
      </div>
    </div>
  );
}
