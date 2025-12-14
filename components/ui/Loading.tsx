// components/ui/Loading.tsx
'use client';
import { motion } from 'framer-motion';

export default function Loading({ text = 'Đang tải...' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-rose-50 to-pink-100 flex flex-col items-center justify-center z-50">
      {/* Animated envelope */}
      <motion.div
        animate={{
          rotateY: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-24 h-16 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg shadow-xl" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-0 h-0 border-l-[48px] border-r-[48px] border-t-[40px] border-transparent border-t-rose-300 mx-auto" />
        </div>
      </motion.div>

      {/* Text */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="mt-6 text-rose-600 font-medium"
      >
        {text}
      </motion.p>

      {/* Dots */}
      <div className="flex gap-1 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 bg-rose-400 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}