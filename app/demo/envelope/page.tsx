// app/demo/envelope/page.tsx
'use client';

import { useState } from 'react';
import Envelope3D from '@/components/create/Envelope3D';
import { motion } from 'framer-motion';

type EnvelopeSide = 'front' | 'back';

// Mẫu phong bì đa dạng
const ENVELOPE_PRESETS = [
  {
    name: 'Kraft Paper',
    color: '#d4a574',
    linerPattern: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=80',
    stampUrl: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=150&q=80',
  },
  {
    name: 'Rose Pink',
    color: '#f8b4c4',
    linerPattern: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    stampUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=150&q=80',
  },
  {
    name: 'Sage Green',
    color: '#8fbc8f',
    linerPattern: 'https://images.unsplash.com/photo-1444930694458-01babf71870c?w=400&q=80',
    stampUrl: 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?w=150&q=80',
  },
  {
    name: 'Lavender',
    color: '#b39ddb',
    linerPattern: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=400&q=80',
    stampUrl: 'https://images.unsplash.com/photo-1518882605630-8996a190e91d?w=150&q=80',
  },
  {
    name: 'Sky Blue',
    color: '#87ceeb',
    linerPattern: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=400&q=80',
    stampUrl: 'https://images.unsplash.com/photo-1516617442634-75371039cb3a?w=150&q=80',
  },
  {
    name: 'Cream White',
    color: '#f5f0e1',
    linerPattern: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400&q=80',
    stampUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=150&q=80',
  },
];

export default function EnvelopeDemoPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [side, setSide] = useState<EnvelopeSide>('front');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customColor, setCustomColor] = useState('#d4a574');

  const preset = ENVELOPE_PRESETS[selectedPreset];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">✉️ Envelope 2D Demo</h1>
            <p className="text-sm text-gray-500">Test phong bì vintage đẹp mắt</p>
          </div>
          <a 
            href="/create" 
            className="px-4 py-2 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition"
          >
            Tạo thiệp →
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Envelope Preview */}
        <section className="mb-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="flex flex-col items-center">
              <Envelope3D
                color={customColor}
                texture={undefined}
                stampUrl={preset.stampUrl}
                isOpen={isOpen}
                isFlipped={side === 'back'}
                showControls
                onOpen={() => setIsOpen(true)}
                onClose={() => setIsOpen(false)}
                onFlip={() => setSide(side === 'front' ? 'back' : 'front')}
              />

              {/* Status */}
              <div className="mt-16 flex items-center gap-4 text-sm">
                <div className={`px-3 py-1.5 rounded-full font-medium ${isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {isOpen ? '📬 Đã mở' : '📪 Đóng'}
                </div>
                <div className={`px-3 py-1.5 rounded-full font-medium ${side === 'front' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  {side === 'front' ? '👁️ Mặt trước' : '🔄 Mặt sau'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Color Picker */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🎨 Chọn màu phong bì</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Preset colors */}
              {ENVELOPE_PRESETS.map((p, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedPreset(index);
                    setCustomColor(p.color);
                  }}
                  className={`
                    relative w-12 h-12 rounded-xl shadow-md transition-all
                    ${selectedPreset === index ? 'ring-2 ring-offset-2 ring-rose-500' : ''}
                  `}
                  style={{ backgroundColor: p.color }}
                  title={p.name}
                >
                  {selectedPreset === index && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white drop-shadow-lg">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}

              {/* Custom color input */}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                <label className="text-sm text-gray-600">Custom:</label>
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-24 px-2 py-1 text-sm border rounded-lg font-mono"
                  placeholder="#d4a574"
                />
              </div>
            </div>

            {/* Preset name */}
            <div className="mt-4 text-sm text-gray-500">
              Đang chọn: <span className="font-medium text-gray-800">{ENVELOPE_PRESETS[selectedPreset].name}</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-gray-800 mb-4">⚡ Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-center"
            >
              <span className="text-2xl mb-2 block">📪</span>
              <span className="text-sm font-medium text-gray-700">Đóng thư</span>
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-center"
            >
              <span className="text-2xl mb-2 block">📬</span>
              <span className="text-sm font-medium text-gray-700">Mở thư</span>
            </button>
            <button
              onClick={() => setSide('front')}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-center"
            >
              <span className="text-2xl mb-2 block">👁️</span>
              <span className="text-sm font-medium text-gray-700">Mặt trước</span>
            </button>
            <button
              onClick={() => setSide('back')}
              className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-center"
            >
              <span className="text-2xl mb-2 block">🔄</span>
              <span className="text-sm font-medium text-gray-700">Mặt sau</span>
            </button>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-4">✨ Tính năng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '🎨', title: 'Màu sắc tuỳ chỉnh', desc: 'Chọn bất kỳ màu nào bạn thích' },
              { icon: '🖼️', title: 'Liner Pattern', desc: 'Họa tiết bên trong nắp phong bì' },
              { icon: '📮', title: 'Tem thư vintage', desc: 'Tem với viền răng cưa cổ điển' },
              { icon: '💌', title: 'Wax Seal', desc: 'Con dấu sáp đỏ trái tim' },
              { icon: '🔄', title: 'Lật 2 mặt', desc: 'Xem cả mặt trước và mặt sau' },
              { icon: '✨', title: 'Animation mượt', desc: 'Mở/đóng thư với hiệu ứng đẹp' },
            ].map((feature, i) => (
              <div key={i} className="p-4 bg-white rounded-xl shadow-md">
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h3 className="font-medium text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

