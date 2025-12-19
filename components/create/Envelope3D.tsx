// components/create/Envelope3D.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart } from 'lucide-react';

interface Envelope3DProps {
  color: string;
  texture?: string | null;
  stampUrl?: string | null;
  isOpen?: boolean; 
}

export default function Envelope3D({ 
  color, texture, stampUrl, isOpen = false 
}: Envelope3DProps) {
  
  const [imgError, setImgError] = useState(false);

  const paperStyle = {
    backgroundColor: color,
    backgroundImage: texture ? `url(${texture})` : 'none',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply' as const,
  };

  return (
    <div 
      className="relative w-[300px] h-[200px] sm:w-[420px] sm:h-[280px] mx-auto flex items-center justify-center"
      style={{ perspective: '1200px' }}
    >
      
      {/* ═══ 1. TẤM THIỆP BÊN TRONG ═══ */}
      <motion.div
        className="absolute w-[85%] h-[85%] bg-gradient-to-br from-cream-light to-cream rounded-lg z-10 flex items-center justify-center overflow-hidden"
        style={{
          boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.1)',
          border: '3px double rgba(212,175,55,0.3)',
        }}
        animate={{ 
          y: isOpen ? -80 : 0,
          scale: isOpen ? 1.02 : 0.95,
          zIndex: isOpen ? 30 : 10,
          rotateX: isOpen ? -5 : 0,
        }}
        transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
      >
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-gold/30 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-gold/30 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-gold/30 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-gold/30 rounded-br-lg" />
        
        <div className="text-center space-y-2">
          <p className="font-script text-2xl text-burgundy/60">With Love</p>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-12 h-px bg-gold/40" />
            <Heart className="w-4 h-4 text-burgundy/40" fill="currentColor" />
            <div className="w-12 h-px bg-gold/40" />
          </div>
          <p className="text-[10px] text-ink/30 uppercase tracking-[0.3em] font-elegant">
            Echo Vintage
          </p>
        </div>
      </motion.div>

      {/* ═══ 2. VỎ PHONG BÌ ═══ */}
      <motion.div 
        className="absolute inset-0 rounded-xl z-20 overflow-hidden"
        style={{ 
          ...paperStyle,
          boxShadow: '0 10px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
        animate={{ 
          y: isOpen ? 80 : 0,
          opacity: isOpen ? 0 : 1, 
          rotateX: isOpen ? 30 : 0 
        }}
        transition={{ duration: 0.6 }}
      >
        {/* Inner border decoration */}
        <div className="absolute inset-3 border border-white/20 rounded-lg pointer-events-none" />
        
        {/* Texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10" />

        {/* ═══ TEM THƯ ═══ */}
        {stampUrl && !imgError && (
          <div className="absolute top-5 right-5 transform rotate-2 hover:rotate-0 transition-transform">
            <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-cream p-1.5 shadow-lg">
              {/* Stamp border pattern */}
              <div className="absolute inset-0 border-2 border-dashed border-burgundy/20" 
                style={{ 
                  clipPath: 'polygon(5% 0%, 10% 5%, 15% 0%, 20% 5%, 25% 0%, 30% 5%, 35% 0%, 40% 5%, 45% 0%, 50% 5%, 55% 0%, 60% 5%, 65% 0%, 70% 5%, 75% 0%, 80% 5%, 85% 0%, 90% 5%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 90% 95%, 85% 100%, 80% 95%, 75% 100%, 70% 95%, 65% 100%, 60% 95%, 55% 100%, 50% 95%, 45% 100%, 40% 95%, 35% 100%, 30% 95%, 25% 100%, 20% 95%, 15% 100%, 10% 95%, 5% 100%, 0% 95%, 0% 5%)' 
                }}
              />
              <img 
                src={stampUrl} 
                className="w-full h-full object-cover" 
                onError={() => setImgError(true)}
                alt="Stamp" 
              />
              
              {/* Postmark */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 border-2 border-ink/20 rounded-full flex items-center justify-center rotate-12">
                <span className="text-[6px] text-ink/30 font-mono font-bold">VN</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ WAX SEAL ═══ */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div 
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #a83232 0%, #8b0000 40%, #5c0000 100%)',
              boxShadow: 'inset 0 -4px 10px rgba(0,0,0,0.4), inset 0 4px 10px rgba(255,255,255,0.1), 0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            {/* Wax texture */}
            <div className="absolute inset-1 rounded-full border border-white/10" />
            <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-cream-light drop-shadow-lg" fill="currentColor" />
          </div>
        </motion.div>

        {/* Address lines */}
        <div className="absolute bottom-6 left-6 right-20 space-y-2 opacity-30">
          <div className="h-0.5 bg-ink w-full" />
          <div className="h-0.5 bg-ink w-3/4" />
          <div className="h-0.5 bg-ink w-1/2" />
        </div>
      </motion.div>

      {/* ═══ BÓNG ĐỔ ═══ */}
      <motion.div 
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[80%] h-6 rounded-[100%] blur-xl"
        style={{ background: 'rgba(0,0,0,0.15)' }}
        animate={{ 
          opacity: isOpen ? 0.3 : 1, 
          scale: isOpen ? 0.6 : 1,
          y: isOpen ? 20 : 0 
        }}
      />
    </div>
  );
}