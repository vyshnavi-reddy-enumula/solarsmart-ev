import React, { useId } from 'react';

/** Car artwork without an <svg> wrapper, so it can be placed inside other illustrations. */
export const EVCarArt: React.FC = () => {
  const id = useId().replace(/:/g, '');
  return (
    <>
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3EA0C4" />
          <stop offset="1" stopColor="#1F6B88" />
        </linearGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E3F4FA" />
          <stop offset="1" stopColor="#8CC3D6" />
        </linearGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#57C785" />
          <stop offset="1" stopColor="#EDDD53" />
        </linearGradient>
        <radialGradient id={`${id}h`}>
          <stop offset="0" stopColor="#EDDD53" stopOpacity=".9" />
          <stop offset="1" stopColor="#EDDD53" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="243" cy="176" rx="205" ry="9" fill="#0E202B" opacity=".18" />
      <path d="M30 138 C30 122 38 114 54 110 L118 98 C138 72 170 54 214 52 L300 52 C338 52 366 70 386 96 L426 104 C448 109 456 122 456 138 L456 150 C456 154 452 156 448 156 L38 156 C33 156 30 153 30 150 Z" fill={`url(#${id}b)`} />
      <path d="M214 52 L300 52" stroke="#fff" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
      <path d="M142 96 C156 78 178 64 210 62 L240 62 L240 96 Z" fill={`url(#${id}g)`} />
      <path d="M250 62 L298 62 C322 62 342 78 358 96 L250 96 Z" fill={`url(#${id}g)`} />
      <path d="M246 96 L246 146" stroke="#0E202B" strokeOpacity=".25" strokeWidth="2" />
      <rect x="212" y="106" width="22" height="4" rx="2" fill="#fff" fillOpacity=".55" />
      <rect x="262" y="106" width="22" height="4" rx="2" fill="#fff" fillOpacity=".55" />
      <path d="M40 140 L448 140" stroke={`url(#${id}s)`} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="441" cy="120" r="18" fill={`url(#${id}h)`} />
      <path d="M432 112 L452 118 L452 127 L431 122 Z" fill="#EDDD53" />
      <rect x="30" y="118" width="8" height="13" rx="3" fill="#FF7A6B" />
      <circle cx="74" cy="114" r="9" fill="#57C785" fillOpacity=".35" />
      <circle cx="74" cy="114" r="5" fill="#57C785" />
      <circle cx="74" cy="114" r="2" fill="#0E202B" />
      {[118, 372].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="156" r="34" fill="#0B1319" />
          <circle cx={cx} cy="156" r="27" fill="#16242D" />
          <circle cx={cx} cy="156" r="17" fill="#D6E3EA" />
          <circle cx={cx} cy="156" r="17" fill="none" stroke="#9DB7C5" strokeWidth="2" />
          {[0, 72, 144, 216, 288].map((a) => (
            <line key={a} x1={cx} y1="156" x2={cx + 15 * Math.cos((a * Math.PI) / 180)} y2={156 + 15 * Math.sin((a * Math.PI) / 180)} stroke="#9DB7C5" strokeWidth="3" strokeLinecap="round" />
          ))}
          <circle cx={cx} cy="156" r="5" fill="#16242D" />
        </g>
      ))}
    </>
  );
};

/** Side-view EV illustration in the brand palette. Decorative. */
export const EVCar: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 480 190" className={className} role="img" aria-label="Illustration of an electric car" xmlns="http://www.w3.org/2000/svg">
    <EVCarArt />
  </svg>
);
