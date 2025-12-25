'use client';

import { motion } from 'framer-motion';
import { Heart, Feather } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface LoadingProps {
  /** Message chính (khuyến nghị dùng) */
  message?: string;
  /** Backward-compat: cho phép <Loading text="..." /> */
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Loading({
  message,
  text,
  fullScreen = true,
  size = 'md',
}: LoadingProps) {
  // Ưu tiên text -> message -> default
  const resolvedMessage = text ?? message ?? 'Đang tải...';

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
  } as const;

  const config = sizeConfig[size];

  const content = (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Main Spinner Container */}
      <div className="relative">
        {/* Outer glow effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 via-burgundy/20 to-gold/20 blur-xl`}
        />

        {/* Outer rotating ring with gradient */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className={`${config.container} rounded-full relative border-4`}
          style={{
            background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, rgba(201, 168, 108, 0.4), rgba(139, 69, 19, 0.3), rgba(201, 168, 108, 0.4)) border-box',
            border: '4px solid transparent',
          }}
        >
          {/* Gold accent dots with glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/50"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-gold/80 shadow-md shadow-gold/40"
          />
        </motion.div>

        {/* Middle rotating ring (counter-clockwise) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1 rounded-full border-2 border-gold/20"
        >
          {/* Decorative dots */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold/40"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-90%)`,
              }}
            />
          ))}
        </motion.div>

        {/* Inner pulsing circle with gradient */}
        <motion.div
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 8, repeat: Infinity, ease: 'linear' }
          }}
          className="absolute inset-3 rounded-full bg-gradient-to-br from-burgundy/20 via-burgundy/10 to-gold/10 flex items-center justify-center backdrop-blur-sm"
        >
          {/* Heart icon with glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute inset-0 blur-md bg-burgundy/30 rounded-full" />
            <Heart
              className={`${config.icon} text-burgundy relative z-10 drop-shadow-lg`}
              fill="currentColor"
            />
          </motion.div>
        </motion.div>

        {/* Floating feathers with trail effect */}
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotate: [0, 15, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 -right-4"
        >
          <Feather className="w-5 h-5 text-gold/60" />
        </motion.div>
        <motion.div
          animate={{
            y: [8, -8, 8],
            rotate: [0, -15, 15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-4 -left-4"
        >
          <Feather className="w-4 h-4 text-gold/50" />
        </motion.div>

        {/* Sparkle particles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
            className="absolute w-1 h-1 rounded-full bg-gold"
            style={{
              top: `${20 + i * 20}%`,
              left: `${20 + (i % 2) * 60}%`,
            }}
          />
        ))}
      </div>

      {/* Loading Text with elegant animation */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.p
            animate={{ 
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`font-elegant text-ink/70 ${config.text} tracking-wide`}
        >
          {resolvedMessage}
        </motion.p>
        </motion.div>

        {/* Elegant animated dots with gradient */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.4, 1, 0.4],
                y: [0, -4, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.25,
                ease: 'easeInOut',
              }}
              className="w-2 h-2 rounded-full bg-gradient-to-br from-gold to-burgundy shadow-md shadow-gold/50"
            />
          ))}
        </div>

        {/* Progress bar effect */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-0.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent rounded-full max-w-xs mx-auto"
        />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cream via-cream-light to-cream backdrop-blur-sm"
      >
        {/* Animated background decorations */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
            scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="absolute top-8 left-8 text-5xl text-gold/10 font-serif"
        >
          ❧
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
            scale: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
          }}
          className="absolute bottom-8 right-8 text-5xl text-gold/10 font-serif"
        >
          ❧
        </motion.div>
        
        {/* Additional decorative elements */}
        <motion.div
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gold/5 blur-3xl"
        />
        <motion.div
          animate={{ 
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-burgundy/5 blur-3xl"
        />

        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/10 backdrop-blur-[2px]" />

        {content}
      </motion.div>
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
        <div
          key={i}
          className="flex gap-4 p-4 border-b border-gold/10"
        >
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
// INLINE SPINNER - Enhanced version
// ═══════════════════════════════════════════════════════════════════════════════
export function Spinner({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-2 border-gold/30 border-t-gold"
      />
      {/* Inner pulsing dot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-2 rounded-full bg-burgundy"
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ELEGANT SPINNER - For admin pages and inline loading
// ═══════════════════════════════════════════════════════════════════════════════
export function ElegantSpinner({ className = '', size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeConfig = {
    sm: { container: 'w-8 h-8', borderWidth: '2px', dot: 'w-1 h-1', dotSize: '4px' },
    md: { container: 'w-12 h-12', borderWidth: '3px', dot: 'w-1.5 h-1.5', dotSize: '6px' },
    lg: { container: 'w-16 h-16', borderWidth: '4px', dot: 'w-2 h-2', dotSize: '8px' },
  };

  const config = sizeConfig[size];

  return (
    <div className={`relative ${config.container} ${className}`}>
      {/* Glow effect */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-gold/20 via-burgundy/20 to-gold/20 blur-md"
      />

      {/* Outer rotating ring with gradient */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 rounded-full border-transparent"
        style={{
          background: 'linear-gradient(white, white) padding-box, linear-gradient(45deg, rgba(201, 168, 108, 0.5), rgba(139, 69, 19, 0.4), rgba(201, 168, 108, 0.5)) border-box',
          border: `${config.borderWidth} solid transparent`,
        }}
      >
        {/* Accent dot */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-lg shadow-gold/50"
          style={{ width: config.dotSize, height: config.dotSize }}
        />
      </motion.div>

      {/* Inner pulsing circle */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 3, repeat: Infinity, ease: 'linear' }
        }}
        className="absolute inset-2 rounded-full bg-gradient-to-br from-burgundy/15 to-gold/10 flex items-center justify-center"
      >
        {/* Center dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className={`${config.dot} rounded-full bg-burgundy shadow-md`}
      />
      </motion.div>
    </div>
  );
}
