import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`p-10 rounded-3xl border border-dashed border-[var(--border-hover)] bg-[var(--bg-surface)]/40 flex flex-col items-center justify-center text-center max-w-lg mx-auto my-6 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-app)] flex items-center justify-center text-[var(--accent-primary)] mb-4 shadow-sm">
        {icon}
      </div>
      <h4 className="text-sm md:text-base font-bold text-[var(--text-primary)] mb-1">
        {title}
      </h4>
      <p className="text-xs text-[var(--text-muted)] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
