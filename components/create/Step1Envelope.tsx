// components/create/Step1Envelope.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Envelope3D from './Envelope3D';
import { Loader2, Sparkles, Mail, Check } from 'lucide-react';

interface Step1EnvelopeProps {
  selectedEnvelope: any;
  onSelectEnvelope: (env: any) => void;
}

export default function Step1Envelope({
  selectedEnvelope,
  onSelectEnvelope,
}: Step1EnvelopeProps) {
  const [envelopes, setEnvelopes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('envelopes').select('*').order('points_required').then(({ data }) => {
      setEnvelopes(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-6xl mx-auto px-4">
      
      {/* ═══ CỘT TRÁI: PREVIEW 3D ═══ */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative"
      >
        {/* Decorative Frame */}
        <div className="absolute -inset-4 border-2 border-gold/20 rounded-3xl pointer-events-none" />
        <div className="absolute -inset-2 border border-gold/10 rounded-2xl pointer-events-none" />
        
        <div className="bg-gradient-to-br from-cream via-cream-light to-aged-paper rounded-2xl p-8 min-h-[420px] flex items-center justify-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 text-4xl text-burgundy">❧</div>
            <div className="absolute bottom-4 right-4 text-4xl text-burgundy rotate-180">❧</div>
          </div>
          
          {selectedEnvelope ? (
            <motion.div
              key={selectedEnvelope.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Envelope3D 
                color={selectedEnvelope.color} 
                texture={selectedEnvelope.thumbnail} 
                isOpen={false} 
              />
            </motion.div>
          ) : (
            <div className="text-center space-y-4">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mail className="w-16 h-16 text-burgundy/30 mx-auto" />
              </motion.div>
              <p className="font-elegant text-lg text-ink/50 italic">
                Chọn một chiếc phong bì để bắt đầu...
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ═══ CỘT PHẢI: SELECTION ═══ */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-burgundy/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-burgundy" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink">
              Chọn Mẫu Phong Bì
            </h3>
          </div>
          <p className="font-vn text-ink/60 pl-13">
            Chiếc áo choàng đầu tiên cho thông điệp của bạn
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <span className="text-gold/60 text-sm">✦</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent" />
        </div>

        {/* Grid Selection */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-burgundy" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {envelopes.map((env, index) => {
              const isSelected = selectedEnvelope?.id === env.id;
              
              return (
                <motion.button
                  key={env.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectEnvelope(env)}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-300
                    flex flex-col items-center gap-3 group
                    ${isSelected 
                      ? 'border-burgundy bg-burgundy/5 shadow-lg ring-2 ring-burgundy/20' 
                      : 'border-gold/20 bg-cream hover:border-gold/50 hover:shadow-md'
                    }
                  `}
                >
                  {/* Selected Check */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-burgundy rounded-full flex items-center justify-center shadow-md"
                    >
                      <Check className="w-4 h-4 text-cream-light" />
                    </motion.div>
                  )}

                  {/* Envelope Preview */}
                  <div 
                    className="w-full h-20 rounded-lg shadow-inner transition-transform duration-300 group-hover:scale-105 relative overflow-hidden"
                    style={{ 
                      backgroundColor: env.color || '#eee',
                      backgroundImage: env.thumbnail ? `url(${env.thumbnail})` : 'none',
                      backgroundSize: 'cover',
                    }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  </div>

                  {/* Info */}
                  <div className="text-center w-full space-y-1">
                    <p className="font-vn text-sm font-semibold text-ink truncate">
                      {env.name}
                    </p>
                    <span className={`
                      inline-block text-xs font-bold px-3 py-1 rounded-full
                      ${env.points_required === 0 
                        ? 'bg-forest/10 text-forest' 
                        : 'bg-gold/10 text-gold-dark'
                      }
                    `}>
                      {env.points_required === 0 ? '✓ Miễn phí' : `${env.points_required} Tym`}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Hint */}
        {selectedEnvelope && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-burgundy/5 rounded-lg border border-burgundy/10"
          >
            <Check className="w-4 h-4 text-burgundy" />
            <p className="font-vn text-sm text-burgundy">
              Đã chọn: <strong>{selectedEnvelope.name}</strong>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}