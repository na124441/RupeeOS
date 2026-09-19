import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)]/50 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none';

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 text-slate-950 font-bold shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40',
      secondary:
        'bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-app)] hover:border-[var(--border-hover)]',
      outline:
        'bg-transparent hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-app)] hover:border-[var(--border-hover)]',
      ghost:
        'bg-transparent hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
      danger:
        'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 hover:border-rose-500/50',
    };

    const sizeStyles = {
      sm: 'px-2.5 py-1.5 text-xs gap-1.5 min-h-[32px]',
      md: 'px-3.5 py-2 text-xs md:text-sm gap-2 min-h-[40px]',
      lg: 'px-5 py-2.5 text-sm md:text-base gap-2.5 min-h-[46px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
