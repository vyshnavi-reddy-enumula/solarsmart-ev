import React, { useId } from 'react';

interface StationIllustrationProps {
  total: number;
  available: number;
  className?: string;
}

/** Charging bays under a solar canopy. Green bays are free in the demo data; grey bays are in use. */
export const StationIllustration: React.FC<StationIllustrationProps> = ({ total, available, className = '' }) => {
  const id = useId().replace(/:/g, '');
  const n = Math.min(total, 5);
  const span = n * 28 + (n - 1) * 14;
  const x0 = (240 - span) / 2;
  return (
    <svg viewBox="0 0 240 130" className={className} role="img" aria-label={`${available} of ${total} bays available (demo data)`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}c`} x1="0" x2="1">
          <stop offset="0" stopColor="#2A7B9B" />
          <stop offset="1" stopColor="#1B5F78" />
        </linearGradient>
      </defs>
      <circle cx="206" cy="30" r="14" fill="#EDDD53" opacity=".9" />
      <path d="M0 112 C60 100 120 108 240 100 L240 130 L0 130 Z" fill="#57C785" opacity=".22" />
      <rect x={x0 - 14} y="26" width={span + 28} height="12" rx="6" fill={`url(#${id}c)`} />
      {Array.from({ length: n + 1 }).map((_, i) => (
        <line key={i} x1={x0 - 14 + (i * (span + 28)) / n} x2={x0 - 14 + (i * (span + 28)) / n} y1="26" y2="38" stroke="#8CC3D6" strokeOpacity=".6" />
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const free = i < Math.min(available, n);
        const x = x0 + i * 42;
        return (
          <g key={i}>
            <rect x={x} y="48" width="28" height="60" rx="9" fill="#F0F7FA" stroke="#C9D8E0" strokeWidth="1.5" />
            <rect x={x + 5} y="56" width="18" height="16" rx="4" fill="#0E202B" />
            <path d={`M${x + 15} 58 l-5 8 h4 l-1 5 l6 -9 h-4 z`} fill={free ? '#57C785' : '#6B8696'} />
            <rect x={x + 5} y="80" width="18" height="4" rx="2" fill={free ? '#57C785' : '#9DB7C5'} />
            <circle cx={x + 14} cy="94" r="4" fill="#16242D" />
          </g>
        );
      })}
      <rect x="10" y="106" width="220" height="4" rx="2" fill="#9DB7C5" opacity=".7" />
    </svg>
  );
};
