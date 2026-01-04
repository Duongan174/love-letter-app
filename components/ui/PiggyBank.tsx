// components/ui/PiggyBank.tsx
'use client';

import { PiggyBank as PiggyBankIcon } from 'lucide-react';

interface PiggyBankProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function PiggyBank({ points, size = 'md', showLabel = true }: PiggyBankProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        ${sizeClasses[size]}
        rounded-full bg-gradient-to-br from-gold/20 to-burgundy/20
        border-2 border-gold/40 flex items-center justify-center
        shadow-vintage
      `}>
        <PiggyBankIcon className={`${iconSizes[size]} text-burgundy`} />
      </div>
      {showLabel && (
        <div className="text-center">
          <p className="font-display text-lg font-bold text-ink">{points}</p>
          <p className="font-elegant text-xs text-ink/60">Tym</p>
        </div>
      )}
    </div>
  );
}

