import React, { useEffect, useId, useState } from 'react';

interface ProgressRingProps {
  value: number | null; // percent, null = unavailable
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ value, size = 190, stroke = 16, children }) => {
  const id = useId().replace(/:/g, '');
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const t = requestAnimationFrame(() => setShown(value ?? 0));
    return () => cancelAnimationFrame(t);
  }, [value]);

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2A7B9B" />
            <stop offset=".6" stopColor="#57C785" />
            <stop offset="1" stopColor="#EDDD53" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeDasharray={value === null ? '4 10' : undefined} strokeLinecap="round" style={{ stroke: 'var(--color-border)' }} />
        {value !== null && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#${id}g)`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - shown / 100)}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(.22,1,.36,1)' }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  );
};
