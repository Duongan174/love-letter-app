// components/create/Step2Envelope.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Stamp, Heart, Check } from 'lucide-react';
import { Envelope, Stamp as StampType } from '@/hooks/useCreateCard';

interface Step2EnvelopeProps {
  selectedEnvelopeId: string | null;
  selectedStampId: string | null;
  onSelectEnvelope: (envelope: Envelope) => void;
  onSelectStamp: (stamp: StampType) => void;
}

// Mock data - sẽ thay bằng Supabase sau
const mockEnvelopes: Envelope[] = [
  { id: '1', name: 'Đỏ Cổ Điển', color: '#e74c3c', texture: 'paper', thumbnail: '', tym_cost: 0 },
  { id: '2', name: 'Hồng Pastel', color: '#f8b4c4', texture: 'smooth', thumbnail: '', tym_cost: 0 },
  { id: '3', name: 'Trắng Tinh Khôi', color: '#ffffff', texture: 'linen', thumbnail: '', tym_cost: 0 },
  { id: '4', name: 'Vàng Hoàng Gia', color: '#f1c40f', texture: 'silk', thumbnail: '', tym_cost: 0 },
  { id: '5', name: 'Xanh Dương', color: '#3498db', texture: 'paper', thumbnail: '', tym_cost: 0 },
  { id: '6', name: 'Tím Lavender', color: '#9b59b6', texture: 'velvet', thumbnail: '', tym_cost: 0 },
];

const mockStamps: StampType[] = [
  { id: '1', name: 'Trái Tim', image: '❤️', tym_cost: 0 },
  { id: '2', name: 'Hoa Hồng', image: '🌹', tym_cost: 0 },
  { id: '3', name: 'Bướm', image: '🦋', tym_cost: 0 },
  { id: '4', name: 'Ngôi Sao', image: '⭐', tym_cost: 0 },
  { id: '5', name: 'Nụ Hôn', image: '💋', tym_cost: 0 },
  { id: '6', name: 'Lá Thư', image: '💌', tym_cost: 0 },
];

export default function Step2Envelope({
  selectedEnvelopeId,
  selectedStampId,
  onSelectEnvelope,
  onSelectStamp,
}: Step2EnvelopeProps) {
  const selectedEnvelope = mockEnvelopes.find(e => e.id === selectedEnvelopeId);
  const selectedStamp = mockStamps.find(s => s.id === selectedStampId);

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Chọn phong bì & tem
        </h2>
        <p className="text-gray-600">
          Tùy chỉnh phong bì và tem cho thiệp của bạn
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Envelopes Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-semibold text-gray-800">Phong bì</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {mockEnvelopes.map((envelope, index) => {
              const isSelected = selectedEnvelopeId === envelope.id;
              
              return (
                <motion.button
                  key={envelope.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectEnvelope(envelope)}
                  className={`
                    relative aspect-[4/3] rounded-xl overflow-hidden
                    transition-all duration-300 group
                    ${isSelected 
                      ? 'ring-4 ring-rose-500 shadow-xl' 
                      : 'hover:shadow-lg hover:-translate-y-1 border-2 border-gray-100'
                    }
                  `}
                  style={{ backgroundColor: envelope.color }}
                >
                  {/* Envelope flap simulation */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1/2 opacity-80"
                    style={{ 
                      background: `linear-gradient(135deg, ${envelope.color} 50%, transparent 50%)`,
                      filter: 'brightness(0.9)'
                    }}
                  />
                  
                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                  
                  {/* Name tooltip on hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{envelope.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          {/* Selected envelope info */}
          {selectedEnvelope && (
            <div className="mt-4 p-3 bg-rose-50 rounded-lg">
              <p className="text-sm text-rose-700">
                <span className="font-semibold">{selectedEnvelope.name}</span>
                <span className="ml-2">
                  {selectedEnvelope.tym_cost === 0 ? '• Miễn phí' : `• 💜 ${selectedEnvelope.tym_cost} Tym`}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Stamps Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Stamp className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-semibold text-gray-800">Tem</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {mockStamps.map((stamp, index) => {
              const isSelected = selectedStampId === stamp.id;
              
              return (
                <motion.button
                  key={stamp.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectStamp(stamp)}
                  className={`
                    relative aspect-square rounded-xl bg-white
                    flex items-center justify-center
                    transition-all duration-300 group
                    ${isSelected 
                      ? 'ring-4 ring-rose-500 shadow-xl bg-rose-50' 
                      : 'hover:shadow-lg hover:-translate-y-1 border-2 border-gray-100 hover:border-rose-200'
                    }
                  `}
                >
                  {/* Stamp image/emoji */}
                  <span className="text-4xl">{stamp.image}</span>
                  
                  {/* Selected checkmark */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                  
                  {/* Name on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
                    <span className="text-white text-xs">{stamp.name}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
          
          {/* Selected stamp info */}
          {selectedStamp && (
            <div className="mt-4 p-3 bg-rose-50 rounded-lg">
              <p className="text-sm text-rose-700">
                <span className="font-semibold">{selectedStamp.name}</span>
                <span className="ml-2">
                  {selectedStamp.tym_cost === 0 ? '• Miễn phí' : `• 💜 ${selectedStamp.tym_cost} Tym`}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="mt-10">
        <h3 className="text-center text-lg font-semibold text-gray-800 mb-4">Xem trước</h3>
        <div className="flex justify-center">
          <motion.div
            initial={{ rotateY: -10 }}
            animate={{ rotateY: [0, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative w-64 h-44 rounded-lg shadow-2xl"
            style={{ 
              backgroundColor: selectedEnvelope?.color || '#f8b4c4',
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Envelope flap */}
            <div 
              className="absolute top-0 left-0 right-0"
              style={{
                height: '50%',
                background: selectedEnvelope 
                  ? `linear-gradient(135deg, ${selectedEnvelope.color} 50%, transparent 50%)`
                  : 'linear-gradient(135deg, #f8b4c4 50%, transparent 50%)',
                filter: 'brightness(0.85)',
                borderRadius: '8px 8px 0 0'
              }}
            />
            
            {/* Wax seal */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white z-10"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b 50%, #922b21)',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.3)'
              }}
            >
              <Heart className="w-5 h-5" fill="currentColor" />
            </div>
            
            {/* Stamp */}
            {selectedStamp && (
              <div className="absolute top-2 right-2 w-10 h-10 bg-white rounded flex items-center justify-center shadow-md">
                <span className="text-2xl">{selectedStamp.image}</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
