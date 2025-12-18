// components/create/Envelope3D.tsx
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

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

  // Style chung cho giấy
  const paperStyle = {
    backgroundColor: color,
    backgroundImage: texture ? `url(${texture})` : 'none',
    backgroundSize: 'cover',
    backgroundBlendMode: 'multiply',
  };

  return (
    <div className="relative w-[320px] h-[220px] sm:w-[450px] sm:h-[300px] mx-auto my-12 flex flex-col items-center justify-center perspective-1000">
      
      {/* 1. TẤM THIỆP BÊN TRONG (CARD) */}
      <motion.div
        className="absolute w-[90%] h-[90%] bg-white rounded-lg shadow-md z-10 flex items-center justify-center overflow-hidden border-4 border-double border-rose-100"
        initial={{ y: 0, scale: 0.95 }}
        animate={{ 
          y: isOpen ? -100 : 0, // Trượt lên
          scale: isOpen ? 1 : 0.95,
          zIndex: isOpen ? 30 : 10 
        }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
      >
        <div className="text-center">
          <p className="font-dancing text-gray-400 text-xl">Love Letter</p>
          <p className="text-[10px] text-gray-300 uppercase tracking-widest mt-1">Sent with love</p>
        </div>
      </motion.div>

      {/* 2. VỎ PHONG BÌ (SLEEVE) */}
      <motion.div 
        className="absolute inset-0 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col"
        animate={{ 
          y: isOpen ? 100 : 0, // Trượt xuống
          opacity: isOpen ? 0 : 1, 
          rotateX: isOpen ? 45 : 0 
        }}
        transition={{ duration: 0.8 }}
        style={{ ...paperStyle }}
      >
        <div className="absolute inset-0 border-[1px] border-white/20 m-2 rounded-lg" />

        {/* TEM THƯ */}
        {stampUrl && !imgError && (
          <div className="absolute top-6 right-6 w-20 h-24 bg-white p-1.5 shadow-lg rotate-3 transition-transform hover:rotate-0">
            <img 
              src={stampUrl} 
              className="w-full h-full object-cover border border-gray-100" 
              onError={() => setImgError(true)}
              alt="Stamp" 
            />
            <div className="absolute -left-2 -bottom-2 w-10 h-10 border-2 border-gray-400/50 rounded-full flex items-center justify-center rotate-12 opacity-70 pointer-events-none">
               <span className="text-[6px] text-gray-500 font-mono">ECHO</span>
            </div>
          </div>
        )}

        {/* Thông tin giả lập */}
        <div className="absolute bottom-8 left-8 right-20 flex flex-col gap-3 opacity-40">
           <div className="h-0.5 bg-black w-full" />
           <div className="h-0.5 bg-black w-2/3" />
        </div>
      </motion.div>

      {/* Bóng đổ */}
      <motion.div 
        className="absolute -bottom-4 w-[90%] h-4 bg-black/20 blur-lg rounded-[100%]"
        animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.5 : 1 }}
      />
    </div>
  );
}