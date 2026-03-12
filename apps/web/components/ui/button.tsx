import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary:
          'bg-[linear-gradient(135deg,hsl(var(--accent))_0%,hsl(var(--accent-2))_100%)] text-slate-950 hover:brightness-110',
        secondary:
          'border border-line/70 bg-card/70 text-ink hover:border-accent/40 hover:bg-card',
        danger:
          'border border-bad/40 bg-bad/10 text-bad hover:bg-bad/20',
        ghost: 'text-muted hover:text-ink',
      },
      size: {
        sm: 'px-3 py-2 text-xs',
        md: 'px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'md',
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
            aria-hidden="true"
          />
        ) : null}
        <span>{children}</span>
      </button>
    );
  },
);

Button.displayName = 'Button';
