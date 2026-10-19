import React, { useId } from 'react';
import { EVCarArt } from './EVCar';

/** Hero illustration: solar canopy, charger, cable and EV. Decorative, not a measurement. */
export const ChargingScene: React.FC<{ className?: string }> = ({ className = '' }) => {
  const id = useId().replace(/:/g, '');
  // Solar canopy panel grid
  const P0 = [36, 104], P1 = [244, 84], P2 = [260, 106], P3 = [52, 128];
  const lerp = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const cells = [0.25, 0.5, 0.75].map((t) => [lerp(P0, P1, t), lerp(P3, P2, t)]);
  return (
    <svg viewBox="0 0 720 320" className={className} role="img" aria-label="Illustration of an electric car charging under a solar canopy" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={`${id}sun`}>
          <stop offset="0" stopColor="#EDDD53" stopOpacity=".55" />
          <stop offset="1" stopColor="#EDDD53" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}led`} x1="0" x2="1">
          <stop offset="0" stopColor="#2A7B9B" />
          <stop offset=".5" stopColor="#57C785" />
          <stop offset="1" stopColor="#EDDD53" />
        </linearGradient>
      </defs>
      <circle cx="596" cy="72" r="86" fill={`url(#${id}sun)`} />
      <circle cx="596" cy="72" r="28" fill="#EDDD53" />
      <path d="M0 250 C120 205 220 225 340 235 S560 215 720 238 L720 320 L0 320 Z" fill="#2A7B9B" opacity=".14" />
      <path d="M0 275 C140 250 260 268 400 262 S620 248 720 268 L720 320 L0 320 Z" fill="#57C785" opacity=".2" />
      <rect x="0" y="268" width="720" height="52" fill="#0E202B" opacity=".08" />
      <path d="M0 296 L720 296" stroke="#fff" strokeOpacity=".5" strokeWidth="3" strokeDasharray="22 18" />

      {/* canopy */}
      <line x1="60" y1="126" x2="60" y2="268" stroke="#7C98A8" strokeWidth="6" strokeLinecap="round" />
      <line x1="236" y1="108" x2="236" y2="268" stroke="#7C98A8" strokeWidth="6" strokeLinecap="round" />
      <polygon points={`${P0} ${P1} ${P2} ${P3}`} fill="#1B5F78" />
      {cells.map(([a, b], i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#8CC3D6" strokeOpacity=".55" strokeWidth="1.5" />
      ))}
      <line x1="44" y1="116" x2="252" y2="95" stroke="#8CC3D6" strokeOpacity=".55" strokeWidth="1.5" />
      <polygon points={`${P0} ${P1} ${lerp(P0, P1, 1)}`} fill="none" />

      {/* charger */}
      <rect x="118" y="262" width="68" height="8" rx="4" fill="#9DB7C5" />
      <rect x="126" y="150" width="52" height="118" rx="14" fill="#F0F7FA" stroke="#C9D8E0" strokeWidth="2" />
      <rect x="136" y="164" width="32" height="30" rx="7" fill="#0E202B" />
      <path d="M153 169 l-8 13 h6 l-2 9 l9 -14 h-6 z" fill="#57C785" />
      <rect x="136" y="204" width="32" height="5" rx="2.5" fill={`url(#${id}led)`} />
      <circle cx="152" cy="228" r="8" fill="#16242D" />

      {/* cable to car port */}
      <path d="M152 228 C190 292 300 282 340 232 L358 212" fill="none" stroke="#16242D" strokeWidth="5" strokeLinecap="round" />
      <circle cx="358" cy="212" r="5" fill="#57C785" />

      <g transform="translate(300 118) scale(.82)">
        <EVCarArt />
      </g>
    </svg>
  );
};
