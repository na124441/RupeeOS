import React from 'react';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showBadge?: boolean;
  animated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = false,
  showBadge = false,
  animated = false,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-base', badge: 'text-[9px] px-1 py-0.2' },
    md: { icon: 36, text: 'text-lg', badge: 'text-[10px] px-1.5 py-0.5' },
    lg: { icon: 48, text: 'text-xl', badge: 'text-xs px-2 py-0.5' },
    xl: { icon: 64, text: 'text-2xl', badge: 'text-xs px-2.5 py-1' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Emblem SVG with Radiant Gradient & Glow */}
      <div
        className={`relative flex items-center justify-center shrink-0 group ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        {/* Ambient Glow Backlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-emerald-500/40 via-teal-400/30 to-cyan-400/40 blur-md opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Vector SVG Emblem */}
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="logoGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rupeeStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Outer Rounded Squircle Container */}
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="16"
            fill="url(#logoBgGrad)"
          />

          {/* Glass Gloss Sheen on top half */}
          <rect
            x="2"
            y="2"
            width="60"
            height="30"
            rx="16"
            fill="url(#logoGlossGrad)"
          />

          {/* Subtle Inner Border */}
          <rect
            x="2.5"
            y="2.5"
            width="59"
            height="59"
            rx="15.5"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1.2"
          />

          {/* Precision Indian Rupee Geometric Symbol (₹) */}
          <g filter="url(#logoShadow)">
            {/* Top Bar */}
            <path
              d="M20 18H44"
              stroke="url(#rupeeStrokeGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Second Bar */}
            <path
              d="M20 26H39"
              stroke="url(#rupeeStrokeGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Upper Loop & Stem */}
            <path
              d="M26 18V34C26 34 37 34 37 26C37 18 26 18 26 18Z"
              stroke="url(#rupeeStrokeGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Diagonal Kick Leg */}
            <path
              d="M27 34L41 48"
              stroke="url(#rupeeStrokeGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Luminous Core Light Dot */}
          <circle cx="45" cy="18" r="2" fill="#38bdf8" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-[var(--text-primary)] ${currentSize.text}`}
            >
              Rupee<span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">OS</span>
            </span>
            {showBadge && (
              <span
                className={`uppercase font-bold tracking-wider rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${currentSize.badge}`}
              >
                PRO
              </span>
            )}
          </div>
          {size !== 'sm' && (
            <span className="text-[10px] md:text-[11px] font-medium text-[var(--text-muted)] tracking-normal">
              Financial Operating System
            </span>
          )}
        </div>
      )}
    </div>
  );
};
