import React, { useId } from 'react';

export const MiniBarChart: React.FC<{ data: { label: string; value: number }[]; unit?: string; ariaLabel: string }> = ({ data, unit = '', ariaLabel }) => {
  const id = useId().replace(/:/g, '');
  const W = 360, H = 176, top = 26, bottom = 28;
  const max = Math.max(1, ...data.map((d) => d.value));
  const slot = W / data.length;
  const bw = Math.min(34, slot * 0.6);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={ariaLabel} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#2A7B9B" />
          <stop offset="1" stopColor="#57C785" />
        </linearGradient>
      </defs>
      <line x1="0" x2={W} y1={H - bottom} y2={H - bottom} style={{ stroke: 'var(--color-border)' }} strokeWidth="1.5" />
      {data.map((d, i) => {
        const h = d.value > 0 ? Math.max(6, ((H - top - bottom) * d.value) / max) : 3;
        const x = slot * i + (slot - bw) / 2;
        const y = H - bottom - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={bw} height={h} rx={Math.min(10, bw / 2)} fill={d.value > 0 ? `url(#${id}b)` : 'currentColor'} opacity={d.value > 0 ? 1 : 0.18} style={d.value > 0 ? undefined : { color: 'var(--color-text-muted)' }} />
            {d.value > 0 && (
              <text x={x + bw / 2} y={y - 7} textAnchor="middle" fontSize="11" fontWeight="600" style={{ fill: 'var(--color-text)' }}>
                {d.value}
              </text>
            )}
            <text x={x + bw / 2} y={H - 9} textAnchor="middle" fontSize="11" style={{ fill: 'var(--color-text-muted)' }}>
              {d.label}
            </text>
          </g>
        );
      })}
      {unit && (
        <text x="0" y="12" fontSize="11" style={{ fill: 'var(--color-text-muted)' }}>
          {unit}
        </text>
      )}
    </svg>
  );
};

export const Sparkline: React.FC<{ values: number[]; className?: string }> = ({ values, className = '' }) => {
  const id = useId().replace(/:/g, '');
  const W = 96, H = 32;
  const max = Math.max(1, ...values), min = Math.min(...values);
  const span = Math.max(1, max - min);
  const pts = values.map((v, i) => [(i / Math.max(1, values.length - 1)) * (W - 4) + 2, H - 4 - ((v - min) / span) * (H - 8)]);
  const line = pts.map((p) => p.join(',')).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#57C785" stopOpacity=".35" />
          <stop offset="1" stopColor="#57C785" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`2,${H} ${line} ${W - 2},${H}`} fill={`url(#${id}a)`} />
      <polyline points={line} fill="none" stroke="#2F9E64" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
