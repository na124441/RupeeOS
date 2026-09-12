import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  id,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 ${
            checked
              ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] text-slate-950 shadow-sm shadow-emerald-500/25 scale-100'
              : 'border-[var(--border-hover)] bg-[var(--bg-surface-elevated)] group-hover:border-[var(--accent-primary)]/70'
          }`}
        >
          <svg
            className={`w-3.5 h-3.5 stroke-[3] fill-none stroke-current transition-transform duration-200 ${
              checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
      {label && (
        <span
          className={`text-xs font-medium transition-colors ${
            checked ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
          }`}
        >
          {label}
        </span>
      )}
    </label>
  );
};
