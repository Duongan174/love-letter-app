// components/ui/AnimatedIcon.tsx
'use client';

import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedIconProps {
  /** Animation data (JSON từ Lottie) */
  animationData: any;
  /** Tự động loop animation */
  loop?: boolean | number;
  /** Tự động play khi mount */
  autoplay?: boolean;
  /** Custom className */
  className?: string;
  /** Width của animation (px hoặc string) */
  width?: number | string;
  /** Height của animation (px hoặc string) */
  height?: number | string;
  /** Animation speed (1 = normal, 2 = 2x faster, 0.5 = slower) */
  speed?: number;
  /** Direction: 1 = forward, -1 = reverse */
  direction?: 1 | -1;
  /** Callback khi animation complete */
  onComplete?: () => void;
  /** Callback khi animation loop complete */
  onLoopComplete?: () => void;
  /** Control play/pause từ bên ngoài */
  isPlaying?: boolean;
  /** Stop animation sau khi play xong (cho one-time animations) */
  stopAfterPlay?: boolean;
}

/**
 * AnimatedIcon Component - Wrapper cho Lottie animations
 * 
 * @example
 * ```tsx
 * import AnimatedIcon from '@/components/ui/AnimatedIcon';
 * import heartAnimation from '@/public/animations/icons/heart.json';
 * 
 * <AnimatedIcon 
 *   animationData={heartAnimation}
 *   width={64}
 *   height={64}
 *   loop={true}
 * />
 * ```
 */
export default function AnimatedIcon({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  width = 64,
  height = 64,
  speed = 1,
  direction = 1,
  onComplete,
  onLoopComplete,
  isPlaying,
  stopAfterPlay = false,
}: AnimatedIconProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  // Set speed và direction thông qua ref
  useEffect(() => {
    if (lottieRef.current) {
      if (speed !== undefined) {
        lottieRef.current.setSpeed(speed);
      }
      if (direction !== undefined) {
        lottieRef.current.setDirection(direction);
      }
    }
  }, [speed, direction]);

  // Control play/pause từ bên ngoài
  useEffect(() => {
    if (lottieRef.current) {
      if (isPlaying === true) {
        lottieRef.current.play();
      } else if (isPlaying === false) {
        lottieRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle complete events
  const handleComplete = () => {
    if (stopAfterPlay && lottieRef.current) {
      lottieRef.current.pause();
    }
    onComplete?.();
  };

  const handleLoopComplete = () => {
    onLoopComplete?.();
  };

  // Convert width/height to string nếu là number
  const widthStr = typeof width === 'number' ? `${width}px` : width;
  const heightStr = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      className={cn('inline-flex items-center justify-center', className)}
      style={{ width: widthStr, height: heightStr }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        onComplete={handleComplete}
        onLoopComplete={handleLoopComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

/**
 * Pre-configured AnimatedIcon components cho các use cases phổ biến
 */

interface IconAnimationProps {
  className?: string;
  width?: number;
  height?: number;
  animationData: any;
}

/** Loading animation - Loop forever */
export function LoadingAnimation({ 
  animationData, 
  className = '', 
  width = 64, 
  height = 64 
}: IconAnimationProps) {
  return (
    <AnimatedIcon
      animationData={animationData}
      loop={true}
      autoplay={true}
      className={className}
      width={width}
      height={height}
    />
  );
}

/** Success animation - Play once */
export function SuccessAnimation({ 
  animationData, 
  className = '', 
  width = 64, 
  height = 64,
  onComplete 
}: IconAnimationProps & { onComplete?: () => void }) {
  return (
    <AnimatedIcon
      animationData={animationData}
      loop={false}
      autoplay={true}
      className={className}
      width={width}
      height={height}
      stopAfterPlay={true}
      onComplete={onComplete}
    />
  );
}

/** Hover animation - Play on hover (controlled) */
export function HoverAnimation({ 
  animationData, 
  className = '', 
  width = 64, 
  height = 64 
}: IconAnimationProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <div 
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedIcon
        animationData={animationData}
        loop={false}
        autoplay={false}
        isPlaying={isHovered}
        className={className}
        width={width}
        height={height}
      />
    </div>
  );
}

