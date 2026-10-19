import React, { useId } from 'react';

interface BatteryGraphicProps {
  percent: number | null; // null = unavailable
  className?: string;
}

/** Five-segment battery. Pass null to draw an empty, dashed "unavailable" battery. */
export const BatteryGraphic: React.FC<BatteryGraphicProps> = ({ percent, className = '' }) => {
  const id = useId().replace(/:/g, '');
  const segW = 30.4;
  const gap = 6;
  return (
    <svg viewBox="0 0 220 100" className={className} role="img" aria-label={percent === null ? 'Battery level unavailable' : `Battery level ${percent} percent (sample)`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}f`} x1="0" x2="1">
          <stop offset="0" stopColor="#2A7B9B" />
          <stop offset=".6" stopColor="#57C785" />
          <stop offset="1" stopColor="#EDDD53" />
        </linearGradient>
      </defs>
      <rect x="3" y="13" width="198" height="74" rx="18" fill="none" strokeWidth="4" strokeDasharray={percent === null ? '8 7' : undefined} style={{ stroke: 'var(--color-text-muted)' }} />
      <rect x="205" y="38" width="11" height="24" rx="4" style={{ fill: 'var(--color-text-muted)' }} />
      {[0, 1, 2, 3, 4].map((i) => {
        const frac = percent === null ? 0 : Math.max(0, Math.min(1, ((percent / 100) * 5) - i));
        const x = 14 + i * (segW + gap);
        return (
          <g key={i}>
            <rect x={x} y="24" width={segW} height="52" rx="8" style={{ fill: 'var(--color-border)' }} opacity=".7" />
            {frac > 0 && <rect x={x} y="24" width={segW * frac} height="52" rx="8" fill={`url(#${id}f)`} />}
          </g>
        );
      })}
    </svg>
  );
};
