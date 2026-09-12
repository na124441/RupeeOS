import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  colorClass?: string;
  heightClass?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  colorClass = 'bg-brand-500',
  heightClass = 'h-2.5',
  showPercentage = false,
}) => {
  const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  
  return (
    <div className="w-full">
      <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${heightClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-xs text-slate-400 mt-1 block text-right font-mono">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  );
};
