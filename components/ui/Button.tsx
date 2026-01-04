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
    type,
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
        bg-burgundy dark:bg-burgundy-600 text-cream-light
        border-2 border-burgundy dark:border-burgundy-500
        hover:bg-burgundy-600 dark:hover:bg-burgundy-500 hover:border-burgundy-600 dark:hover:border-burgundy-400
        shadow-vintage hover:shadow-elevated
        relative overflow-hidden
        before:absolute before:inset-[3px] before:border before:border-white/20 dark:before:border-gold/30 before:rounded-[inherit] before:pointer-events-none
      `,

      // Secondary - Outlined gold
      secondary: `
        bg-transparent text-burgundy dark:text-gold
        border-2 border-burgundy/30 dark:border-gold/40
        hover:border-burgundy dark:hover:border-gold hover:bg-burgundy-50 dark:hover:bg-burgundy/20
        shadow-vintage hover:shadow-elevated
      `,

      // Gold - Premium accent
      gold: `
        bg-gold/10 dark:bg-gold/20 text-gold-700 dark:text-gold
        border-2 border-gold/30 dark:border-gold/40
        hover:bg-gold dark:hover:bg-gold-600 hover:text-cream-light hover:border-gold dark:hover:border-gold-500
        shadow-vintage hover:shadow-elevated
      `,

      // Ghost - Minimal
      ghost: `
        bg-transparent text-ink dark:text-cream-light
        border border-transparent
        hover:bg-cream-dark/50 dark:hover:bg-ink/50 hover:border-gold/20 dark:hover:border-gold/30
      `,

      // Danger - For destructive actions
      danger: `
        bg-red-700 dark:bg-red-800 text-cream-light
        border-2 border-red-700 dark:border-red-600
        hover:bg-red-800 dark:hover:bg-red-700 hover:border-red-800 dark:hover:border-red-500
        shadow-vintage
      `,

      // Forest - Alternative accent
      forest: `
        bg-forest dark:bg-forest-light text-cream-light
        border-2 border-forest dark:border-forest-light
        hover:bg-forest-600 dark:hover:bg-forest hover:border-forest-600 dark:hover:border-forest
        shadow-vintage hover:shadow-elevated
      `,
    } as const;

    const sizes = {
      sm: 'px-4 py-2 text-sm tracking-wide',
      md: 'px-6 py-2.5 text-base tracking-wide',
      lg: 'px-8 py-3.5 text-lg tracking-wider',
    } as const;

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER
    // ═══════════════════════════════════════════════════════════════════════
    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        aria-busy={loading ? true : undefined}
        disabled={disabled || loading}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2.5',
          'font-display font-medium uppercase',
          'rounded-elegant',
          'transition-all duration-300 ease-elegant',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light',
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

        {/* Label */}
        <span className="whitespace-nowrap">{children}</span>

        {/* Right icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant = 'ghost', size = 'md', loading, type, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-burgundy dark:bg-burgundy-600 text-cream-light hover:bg-burgundy-600 dark:hover:bg-burgundy-500',
      secondary: 'bg-cream dark:bg-ink/50 text-burgundy dark:text-gold border border-gold/30 dark:border-gold/40 hover:border-gold dark:hover:border-gold-500',
      gold: 'bg-gold/10 dark:bg-gold/20 text-gold-600 dark:text-gold hover:bg-gold dark:hover:bg-gold-600 hover:text-cream-light',
      ghost: 'bg-transparent text-ink dark:text-cream-light hover:bg-cream-dark/50 dark:hover:bg-ink/50',
    } as const;

    const sizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    } as const;

    return (
      <button
        ref={ref}
        type={type ?? 'button'}
        aria-busy={loading ? true : undefined}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded-elegant',
          'transition-all duration-300 ease-elegant',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-light',
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

export default Button;
