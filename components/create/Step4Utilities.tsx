// components/create/Step4Utilities.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  QrCode,
  Lock,
  Calendar,
  Bell,
  BarChart3,
  Share2,
  Link as LinkIcon,
  Check,
  X,
  Eye,
  EyeOff,
  Facebook,
  Twitter,
  Copy,
  Download,
  Globe,
  Mail,
  Clock,
  Send,
} from 'lucide-react';
import Button from '@/components/ui/Button';

export interface CardUtilities {
  // QR Code settings
  enableQRCode: boolean;
  qrCodeStyle?: 'default' | 'rounded' | 'dots';
  
  // Security settings
  enablePassword: boolean;
  password?: string;
  
  // Expiry settings
  enableExpiry: boolean;
  expiryDate?: string | null; // ISO date string
  
  // Notification settings
  enableEmailNotification: boolean;
  notifyOnOpen?: boolean;
  notifyOnView?: boolean;
  
  // Analytics settings
  enableAnalytics: boolean;
  
  // Share settings
  shareSettings: {
    allowFacebook: boolean;
    allowTwitter: boolean;
    allowCopy: boolean;
    allowDownload: boolean;
  };
  
  // ✅ Send options - Gửi tự động
  sendMethod: 'link' | 'email' | 'facebook' | 'both'; // 'link' = chỉ tạo link, 'email' = gửi email, 'facebook' = gửi Facebook, 'both' = cả hai
  recipientEmail?: string; // Email người nhận (cho Gmail)
  recipientFacebookId?: string; // Facebook ID người nhận (cho Facebook)
  
  // ✅ Scheduled send - Gửi theo lịch
  scheduledSend: boolean;
  scheduledSendDate?: string | null; // ISO date string với time
  scheduledSendTime?: string | null; // HH:mm format
  
  // Custom domain (premium feature)
  customDomain?: string;
}

interface Step4UtilitiesProps {
  utilities: CardUtilities;
  onUpdate: (utilities: CardUtilities) => void;
}

export default function Step4Utilities({ utilities, onUpdate }: Step4UtilitiesProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [localUtilities, setLocalUtilities] = useState<CardUtilities>(utilities);

  const updateUtilities = (updates: Partial<CardUtilities>) => {
    const newUtilities = { ...localUtilities, ...updates };
    setLocalUtilities(newUtilities);
    onUpdate(newUtilities);
  };

  const updateShareSettings = (updates: Partial<CardUtilities['shareSettings']>) => {
    updateUtilities({
      shareSettings: { ...localUtilities.shareSettings, ...updates },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-ink mb-2">
            Tính Năng Tiện Ích
          </h2>
          <p className="text-ink/60 font-body">
            Tùy chỉnh cách chia sẻ và bảo mật cho thiệp của bạn
          </p>
        </div>

        {/* QR Code Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <QrCode className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">QR Code</h3>
              <p className="text-sm text-ink/60">Tạo mã QR để dễ dàng chia sẻ thiệp</p>
            </div>
            <button
              onClick={() => updateUtilities({ enableQRCode: !localUtilities.enableQRCode })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                localUtilities.enableQRCode ? 'bg-amber-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{
                  x: localUtilities.enableQRCode ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {localUtilities.enableQRCode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gold/10"
            >
              <label className="block text-sm font-medium text-ink mb-2">
                Kiểu QR Code
              </label>
              <div className="flex gap-3">
                {(['default', 'rounded', 'dots'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => updateUtilities({ qrCodeStyle: style })}
                    className={`flex-1 px-4 py-2 rounded-xl border-2 transition-all ${
                      localUtilities.qrCodeStyle === style
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-gold/20 bg-white text-ink/60 hover:border-gold/40'
                    }`}
                  >
                    {style === 'default' && 'Mặc định'}
                    {style === 'rounded' && 'Bo góc'}
                    {style === 'dots' && 'Chấm tròn'}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">Bảo Mật</h3>
              <p className="text-sm text-ink/60">Bảo vệ thiệp bằng mật khẩu</p>
            </div>
            <button
              onClick={() => updateUtilities({ enablePassword: !localUtilities.enablePassword })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                localUtilities.enablePassword ? 'bg-amber-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{
                  x: localUtilities.enablePassword ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {localUtilities.enablePassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gold/10"
            >
              <label className="block text-sm font-medium text-ink mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={localUtilities.password || ''}
                  onChange={(e) => updateUtilities({ password: e.target.value })}
                  placeholder="Nhập mật khẩu"
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gold/20 focus:border-amber-600 focus:outline-none bg-white text-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-ink/50">
                Người nhận cần nhập mật khẩu để xem thiệp
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Expiry Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">Hết Hạn</h3>
              <p className="text-sm text-ink/60">Thiết lập ngày hết hạn cho thiệp</p>
            </div>
            <button
              onClick={() => updateUtilities({ enableExpiry: !localUtilities.enableExpiry })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                localUtilities.enableExpiry ? 'bg-amber-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{
                  x: localUtilities.enableExpiry ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {localUtilities.enableExpiry && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gold/10"
            >
              <label className="block text-sm font-medium text-ink mb-2">
                Ngày hết hạn
              </label>
              <input
                type="date"
                value={localUtilities.expiryDate || ''}
                onChange={(e) => updateUtilities({ expiryDate: e.target.value || null })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border-2 border-gold/20 focus:border-amber-600 focus:outline-none bg-white text-ink"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Share Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">Chia Sẻ</h3>
              <p className="text-sm text-ink/60">Tùy chọn chia sẻ thiệp</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            {[
              { key: 'allowFacebook' as const, label: 'Chia sẻ Facebook', icon: Facebook },
              { key: 'allowTwitter' as const, label: 'Chia sẻ Twitter', icon: Twitter },
              { key: 'allowCopy' as const, label: 'Sao chép link', icon: Copy },
              { key: 'allowDownload' as const, label: 'Tải QR Code', icon: Download },
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/50">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-ink/60" />
                  <span className="font-body text-ink">{label}</span>
                </div>
                <button
                  onClick={() => updateShareSettings({ [key]: !localUtilities.shareSettings[key] })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    localUtilities.shareSettings[key] ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{
                      x: localUtilities.shareSettings[key] ? 24 : 4,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Analytics Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">Thống Kê</h3>
              <p className="text-sm text-ink/60">Theo dõi lượt xem và tương tác</p>
            </div>
            <button
              onClick={() => updateUtilities({ enableAnalytics: !localUtilities.enableAnalytics })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                localUtilities.enableAnalytics ? 'bg-amber-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{
                  x: localUtilities.enableAnalytics ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
          {localUtilities.enableAnalytics && (
            <p className="mt-2 text-sm text-ink/60">
              Theo dõi số lượt xem, thời gian xem và các tương tác với thiệp
            </p>
          )}
        </motion.div>

        {/* Send Options - Gửi tự động */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Send className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">Gửi Tự Động</h3>
              <p className="text-sm text-ink/60">Chọn cách gửi thiệp đến người nhận</p>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            {/* Send Method Selection */}
            <div>
              <label className="block text-sm font-medium text-ink mb-3">
                Phương thức gửi
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'link' as const, label: 'Chỉ tạo link', icon: LinkIcon },
                  { value: 'email' as const, label: 'Gửi Email', icon: Mail },
                  { value: 'facebook' as const, label: 'Gửi Facebook', icon: Facebook },
                  { value: 'both' as const, label: 'Cả hai', icon: Share2 },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateUtilities({ sendMethod: value })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                      localUtilities.sendMethod === value
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-gold/20 bg-white text-ink/60 hover:border-gold/40'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-body text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            {(localUtilities.sendMethod === 'email' || localUtilities.sendMethod === 'both') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-gold/10"
              >
                <label className="block text-sm font-medium text-ink mb-2">
                  Email người nhận
                </label>
                <input
                  type="email"
                  value={localUtilities.recipientEmail || ''}
                  onChange={(e) => updateUtilities({ recipientEmail: e.target.value })}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gold/20 focus:border-amber-600 focus:outline-none bg-white text-ink"
                />
                <p className="mt-2 text-xs text-ink/50">
                  Thiệp sẽ được gửi tự động đến email này
                </p>
              </motion.div>
            )}

            {/* Facebook ID Input */}
            {(localUtilities.sendMethod === 'facebook' || localUtilities.sendMethod === 'both') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-4 border-t border-gold/10"
              >
                <label className="block text-sm font-medium text-ink mb-2">
                  Facebook ID / Username người nhận
                </label>
                <input
                  type="text"
                  value={localUtilities.recipientFacebookId || ''}
                  onChange={(e) => updateUtilities({ recipientFacebookId: e.target.value })}
                  placeholder="username hoặc Facebook ID"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gold/20 focus:border-amber-600 focus:outline-none bg-white text-ink"
                />
                <p className="mt-2 text-xs text-ink/50">
                  Thiệp sẽ được gửi qua Facebook Messenger
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Scheduled Send - Gửi theo lịch */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">Gửi Theo Lịch</h3>
              <p className="text-sm text-ink/60">Đặt thời gian tự động gửi thiệp</p>
            </div>
            <button
              onClick={() => updateUtilities({ scheduledSend: !localUtilities.scheduledSend })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                localUtilities.scheduledSend ? 'bg-amber-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{
                  x: localUtilities.scheduledSend ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>

          {localUtilities.scheduledSend && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-gold/10 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Ngày gửi
                  </label>
                  <input
                    type="date"
                    value={localUtilities.scheduledSendDate ? new Date(localUtilities.scheduledSendDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const date = e.target.value;
                      const time = localUtilities.scheduledSendTime || '00:00';
                      const dateTime = date ? `${date}T${time}:00` : null;
                      updateUtilities({ scheduledSendDate: dateTime });
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gold/20 focus:border-amber-600 focus:outline-none bg-white text-ink"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-2">
                    Giờ gửi
                  </label>
                  <input
                    type="time"
                    value={localUtilities.scheduledSendTime || ''}
                    onChange={(e) => {
                      const time = e.target.value;
                      const date = localUtilities.scheduledSendDate ? new Date(localUtilities.scheduledSendDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
                      const dateTime = date ? `${date}T${time}:00` : null;
                      updateUtilities({ 
                        scheduledSendTime: time,
                        scheduledSendDate: dateTime,
                      });
                    }}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gold/20 focus:border-amber-600 focus:outline-none bg-white text-ink"
                  />
                </div>
              </div>
              {localUtilities.scheduledSendDate && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-ink/70">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Thiệp sẽ được gửi vào:{' '}
                    <span className="font-semibold text-amber-900">
                      {new Date(localUtilities.scheduledSendDate).toLocaleString('vi-VN', {
                        dateStyle: 'full',
                        timeStyle: 'short',
                      })}
                    </span>
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-cream-light border border-gold/20 rounded-2xl p-6 shadow-vintage"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-burgundy" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-ink">Thông Báo</h3>
              <p className="text-sm text-ink/60">Nhận thông báo khi thiệp được mở</p>
            </div>
            <button
              onClick={() => updateUtilities({ enableEmailNotification: !localUtilities.enableEmailNotification })}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                localUtilities.enableEmailNotification ? 'bg-amber-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{
                  x: localUtilities.enableEmailNotification ? 24 : 4,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
              />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

