import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'surface' | 'elevated' | 'glass';
  interactive?: boolean;
  className?: string;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  interactive = false,
  className = '',
  animate = false,
  ...props
}) => {
  const variantStyles = {
    surface: 'bg-[var(--bg-surface)] border-[var(--border-app)]',
    elevated: 'bg-[var(--bg-surface-elevated)] border-[var(--border-app)] shadow-[var(--shadow-sm)]',
    glass: 'bg-[var(--bg-surface)]/90 backdrop-blur-md border-[var(--border-app)]',
  };

  const interactiveStyles = interactive
    ? 'cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-md)] active:translate-y-0'
    : '';

  return (
    <div
      data-animate={animate ? 'card' : undefined}
      className={`rounded-2xl border p-5 relative overflow-hidden transition-colors ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
