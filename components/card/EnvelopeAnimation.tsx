'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

interface EnvelopeAnimationProps {
  color: string;
  stamp: string;
  recipientName: string;
  onOpen: () => void;
}

export default function EnvelopeAnimation({
  color = '#f8b4c4',
  stamp = '❤️',
  recipientName,
  onOpen,
}: EnvelopeAnimationProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0, rotateY: 180 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      {/* Instruction */}
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-600 mb-6 text-center"
      >
        Bạn có một lá thư yêu thương 💕
      </motion.p>

      {/* Envelope */}
      <motion.div
        whileHover={{ scale: 1.05, rotateZ: [-1, 1, -1, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpen}
        className="relative cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        {/* Envelope Body */}
        <div
          className="w-72 h-48 md:w-96 md:h-64 rounded-lg shadow-2xl relative overflow-hidden"
          style={{ backgroundColor: color }}
        >
          {/* Envelope Flap */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/2 origin-top"
            style={{
              background: `linear-gradient(180deg, ${color} 0%, ${color}dd 100%)`,
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
              filter: 'brightness(0.9)',
            }}
            animate={{ rotateX: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Inner shadow for depth */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.1) 100%)'
            }}
          />

          {/* Wax Seal */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center text-white z-10"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #e74c3c, #c0392b 50%, #922b21)',
              boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.3)'
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              boxShadow: [
                'inset 0 0 15px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.3)',
                'inset 0 0 15px rgba(0,0,0,0.3), 0 4px 25px rgba(231,76,60,0.5)',
                'inset 0 0 15px rgba(0,0,0,0.3), 0 4px 15px rgba(0,0,0,0.3)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="w-7 h-7" fill="currentColor" />
          </motion.div>

          {/* Stamp */}
          <div className="absolute top-3 right-3 w-12 h-12 bg-white rounded shadow-md flex items-center justify-center text-2xl">
            {stamp}
          </div>

          {/* Recipient */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white/80 text-sm">Gửi đến</p>
            <p className="text-white font-bold text-lg truncate">{recipientName}</p>
          </div>
        </div>

        {/* Click hint */}
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <span className="text-rose-500 font-medium text-sm">Nhấn để mở 💌</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}