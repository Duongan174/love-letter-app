// components/ui/Loading.tsx
'use client';

import { motion } from 'framer-motion';
import { Heart, Feather } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Loading({ 
  message = 'Đang tải...', 
  fullScreen = true,
  size = 'md' 
}: LoadingProps) {
  
  const sizeConfig = {
    sm: {
      container: 'w-12 h-12',
      icon: 'w-5 h-5',
      text: 'text-sm',
    },
    md: {
      container: 'w-20 h-20',
      icon: 'w-8 h-8',
      text: 'text-base',
    },
    lg: {
      container: 'w-28 h-28',
      icon: 'w-12 h-12',
      text: 'text-lg',
    },
  };

  const config = sizeConfig[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Main Spinner Container */}
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className={`${config.container} rounded-full border-2 border-gold/30`}
        >
          {/* Gold accent dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gold" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-gold/60" />
        </motion.div>

        {/* Inner pulsing circle */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-2 rounded-full bg-burgundy/10 flex items-center justify-center"
        >
          {/* Heart icon */}
          <motion.div
            animate={{ scale: [1, 0.9, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className={`${config.icon} text-burgundy`} fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Floating feather */}
        <motion.div
          animate={{ 
            y: [-5, 5, -5],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4"
        >
          <Feather className="w-5 h-5 text-gold/60" />
        </motion.div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`font-elegant text-ink/60 ${config.text}`}
        >
          {message}
        </motion.p>
        
        {/* Animated dots */}
        <div className="flex items-center justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1.2, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 rounded-full bg-gold"
            />
          ))}
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream">
        {/* Background decoration */}
        <div className="absolute top-8 left-8 text-4xl text-gold/10 font-serif">❧</div>
        <div className="absolute bottom-8 right-8 text-4xl text-gold/10 font-serif rotate-180">❧</div>
        
        {content}
      </div>
    );
  }

  return content;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SKELETON LOADING COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`
        bg-gradient-to-r from-cream via-paper to-cream 
        bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]
        rounded-vintage
        ${className}
      `}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-cream-light border border-gold/20 rounded-soft p-4 space-y-4">
      <Skeleton className="h-48 w-full rounded-soft" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 p-4 bg-cream/50 rounded-soft">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-gold/10">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INLINE SPINNER
// ═══════════════════════════════════════════════════════════════════════════════
export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={`animate-spin text-burgundy ${className}`} 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}