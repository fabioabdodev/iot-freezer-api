import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/70 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[linear-gradient(135deg,var(--btn-primary-from)_0%,var(--btn-primary-to)_100%)] text-white shadow-[0_18px_45px_var(--btn-primary-shadow)] hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_24px_60px_var(--btn-primary-shadow-hover)]',
        secondary:
          'border bg-[linear-gradient(135deg,var(--btn-secondary-from)_0%,var(--btn-secondary-to)_100%)] text-[var(--btn-secondary-text)] shadow-[0_14px_36px_var(--btn-secondary-shadow)] hover:-translate-y-0.5 hover:brightness-110',
        ghost:
          'border text-[var(--btn-ghost-text)] hover:bg-[var(--btn-ghost-bg-hover)]',
      },
      size: {
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-5 text-sm',
        lg: 'h-14 px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const toneClasses =
      variant === 'secondary'
        ? 'border-[var(--btn-secondary-border)] hover:border-[var(--btn-secondary-border-hover)]'
        : variant === 'ghost'
          ? 'border-[var(--btn-ghost-border)] bg-[var(--btn-ghost-bg)]'
          : '';

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          toneClasses,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
