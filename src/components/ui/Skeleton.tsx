import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', style, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-[var(--bg-surface-elevated)]/70 ${className}`}
      style={style}
      {...props}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl border border-[var(--border-app)] bg-[var(--bg-surface)] space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-48" />
    </div>
  );
};

export const SkeletonBalance: React.FC = () => {
  return (
    <div className="p-8 rounded-3xl border border-[var(--border-app)] bg-[var(--bg-surface)] space-y-4">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-14 w-60" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-10 w-28 rounded-xl" />
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-[var(--border-app)] bg-[var(--bg-surface)] flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonChart: React.FC = () => {
  return (
    <div className="p-6 rounded-3xl border border-[var(--border-app)] bg-[var(--bg-surface)] space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="h-44 w-full flex items-end gap-3 pt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-lg"
            style={{ height: `${20 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
};
