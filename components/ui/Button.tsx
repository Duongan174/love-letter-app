// components/ui/Button.tsx
'use client';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost' | 'danger' | 'forest';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading, 
    icon, 
    iconPosition = 'left',
    children, 
    disabled, 
    ...props 
  }, ref) => {
    
    // ═══════════════════════════════════════════════════════════════════════
    // VINTAGE BUTTON VARIANTS
    // ═══════════════════════════════════════════════════════════════════════
    const variants = {
      // Primary - Burgundy elegance
      primary: `
        bg-burgundy text-cream-light
        border-2 border-burgundy
        hover:bg-burgundy-600 hover:border-burgundy-600
        shadow-vintage hover:shadow-elevated
        relative overflow-hidden
        before:absolute before:inset-[3px] before:border before:border-white/20 before:rounded-[inherit] before:pointer-events-none
      `,
      
      // Secondary - Outlined gold
      secondary: `
        bg-transparent text-burgundy
        border-2 border-burgundy/30
        hover:border-burgundy hover:bg-burgundy-50
      `,
      
      // Gold - Premium accent
      gold: `
        bg-transparent text-gold-600
        border-2 border-gold
        hover:bg-gold hover:text-cream-light
        hover:shadow-gold-glow
      `,
      
      // Ghost - Minimal
      ghost: `
        bg-transparent text-ink
        border border-transparent
        hover:bg-cream-dark/50 hover:border-gold/20
      `,
      
      // Danger - For destructive actions
      danger: `
        bg-red-700 text-cream-light
        border-2 border-red-700
        hover:bg-red-800 hover:border-red-800
        shadow-vintage
      `,
      
      // Forest - Secondary color
      forest: `
        bg-forest text-cream-light
        border-2 border-forest
        hover:bg-forest-dark hover:border-forest-dark
        shadow-vintage
      `,
    };

    // ═══════════════════════════════════════════════════════════════════════
    // SIZE VARIANTS
    // ═══════════════════════════════════════════════════════════════════════
    const sizes = {
      sm: 'px-4 py-2 text-sm tracking-wide',
      md: 'px-6 py-2.5 text-base tracking-wide',
      lg: 'px-8 py-3.5 text-lg tracking-wider',
    };

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2.5',
          'font-display font-medium uppercase',
          'rounded-elegant',
          'transition-all duration-300 ease-elegant',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'active:scale-[0.98]',
          'hover:-translate-y-0.5',
          
          // Variant & Size
          variants[variant],
          sizes[size],
          
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        
        {/* Left icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {/* Button text */}
        {children}
        
        {/* Right icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;

// ═══════════════════════════════════════════════════════════════════════════
// ICON BUTTON VARIANT
// ═══════════════════════════════════════════════════════════════════════════
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-burgundy text-cream-light hover:bg-burgundy-600',
      secondary: 'bg-cream text-burgundy border border-gold/30 hover:border-gold',
      gold: 'bg-gold/10 text-gold-600 hover:bg-gold hover:text-cream-light',
      ghost: 'bg-transparent text-ink hover:bg-cream-dark/50',
    };

    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-soft',
          'transition-all duration-300',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'hover:shadow-vintage',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';