// components/create/Step3Message.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Type, Sparkles, User, Heart } from 'lucide-react';

interface Step3MessageProps {
  recipientName: string;
  senderName: string;
  message: string;
  fontStyle: string;
  textEffect: string;
  onUpdate: (data: {
    recipientName?: string;
    senderName?: string;
    message?: string;
    fontStyle?: string;
    textEffect?: string;
  }) => void;
}

const fontStyles = [
  { id: 'dancing', name: 'Dancing Script', preview: 'Aa', className: 'font-dancing' },
  { id: 'playfair', name: 'Playfair Display', preview: 'Aa', className: 'font-playfair' },
  { id: 'pacifico', name: 'Pacifico', preview: 'Aa', className: 'font-pacifico' },
  { id: 'lobster', name: 'Lobster', preview: 'Aa', className: 'font-lobster' },
  { id: 'vibes', name: 'Great Vibes', preview: 'Aa', className: 'font-vibes' },
  { id: 'lexend', name: 'Lexend', preview: 'Aa', className: 'font-lexend' },
];

const textEffects = [
  { id: 'none', name: 'Không có', icon: '—' },
  { id: 'typewriter', name: 'Đánh máy', icon: '⌨️' },
  { id: 'fade', name: 'Fade In', icon: '✨' },
  { id: 'slide', name: 'Trượt lên', icon: '⬆️' },
  { id: 'glow', name: 'Phát sáng', icon: '💫' },
  { id: 'handwriting', name: 'Viết tay', icon: '✍️' },
];

export default function Step3Message({
  recipientName,
  senderName,
  message,
  fontStyle,
  textEffect,
  onUpdate,
}: Step3MessageProps) {
  const currentFont = fontStyles.find(f => f.id === fontStyle) || fontStyles[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Viết lời nhắn
        </h2>
        <p className="text-gray-600">
          Gửi gắm tình cảm của bạn qua những dòng chữ
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Input Form */}
        <div className="space-y-6">
          {/* Recipient Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 text-rose-500" />
              Gửi đến
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => onUpdate({ recipientName: e.target.value })}
              placeholder="Tên người nhận..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            />
          </div>

          {/* Message */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Heart className="w-4 h-4 text-rose-500" />
              Lời nhắn
            </label>
            <textarea
              value={message}
              onChange={(e) => onUpdate({ message: e.target.value })}
              placeholder="Viết lời nhắn yêu thương của bạn..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {message.length} / 500 ký tự
            </p>
          </div>

          {/* Sender Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 text-rose-500" />
              Từ
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => onUpdate({ senderName: e.target.value })}
              placeholder="Tên của bạn..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition"
            />
          </div>

          {/* Font Style */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Type className="w-4 h-4 text-rose-500" />
              Kiểu chữ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {fontStyles.map((font) => (
                <button
                  key={font.id}
                  onClick={() => onUpdate({ fontStyle: font.id })}
                  className={`
                    p-3 rounded-xl text-center transition-all
                    ${fontStyle === font.id 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-rose-50'
                    }
                  `}
                >
                  <span className={`text-xl ${font.className}`}>{font.preview}</span>
                  <p className="text-xs mt-1 truncate">{font.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Text Effect */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Hiệu ứng chữ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {textEffects.map((effect) => (
                <button
                  key={effect.id}
                  onClick={() => onUpdate({ textEffect: effect.id })}
                  className={`
                    p-3 rounded-xl text-center transition-all
                    ${textEffect === effect.id 
                      ? 'bg-rose-500 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-rose-50'
                    }
                  `}
                >
                  <span className="text-xl">{effect.icon}</span>
                  <p className="text-xs mt-1">{effect.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-4 text-center">Xem trước</h3>
          
          <div className="flex-1 bg-white rounded-xl shadow-lg p-6 flex flex-col">
            {/* Paper texture */}
            <div className="flex-1 flex flex-col justify-center">
              {/* Recipient */}
              {recipientName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-gray-700 mb-4 ${currentFont.className}`}
                >
                  Gửi <span className="text-rose-500 font-semibold">{recipientName}</span>,
                </motion.p>
              )}
              
              {/* Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  text-gray-800 leading-relaxed whitespace-pre-wrap
                  ${currentFont.className}
                  ${fontStyle === 'dancing' || fontStyle === 'vibes' || fontStyle === 'pacifico' ? 'text-2xl' : 'text-lg'}
                `}
              >
                {message || (
                  <span className="text-gray-300 italic">Lời nhắn của bạn sẽ hiển thị ở đây...</span>
                )}
              </motion.div>
              
              {/* Sender */}
              {senderName && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-gray-700 mt-6 text-right ${currentFont.className}`}
                >
                  Yêu thương,
                  <br />
                  <span className="text-rose-500 font-semibold text-lg">{senderName}</span>
                </motion.p>
              )}
            </div>
            
            {/* Decorations */}
            <div className="flex justify-center mt-4 gap-2 text-rose-300">
              <Heart className="w-4 h-4" fill="currentColor" />
              <Heart className="w-5 h-5" fill="currentColor" />
              <Heart className="w-4 h-4" fill="currentColor" />
            </div>
          </div>
          
          {/* Effect indicator */}
          {textEffect !== 'none' && (
            <p className="text-xs text-center text-gray-400 mt-3">
              Hiệu ứng "{textEffects.find(e => e.id === textEffect)?.name}" sẽ hiển thị khi xem thiệp
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
