import React from 'react';
import { AREAS, DemoStation, availabilityStatus, STATUS_LABEL } from '../../data/demoData';
import { PinGraphic, STATUS_COLOR } from './pin';

interface FallbackMapProps {
  stations: DemoStation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

// Square-ish bounds around the five neighbourhoods.
const B = { minLat: 17.482, maxLat: 17.554, minLng: 78.343, maxLng: 78.418 };
const project = (lat: number, lng: number) => ({
  x: ((lng - B.minLng) / (B.maxLng - B.minLng)) * 640,
  y: ((B.maxLat - lat) / (B.maxLat - B.minLat)) * 640,
});

const ROADS = [
  'M-20 560 C 160 470 300 380 420 320 S 600 170 680 70',
  'M-20 250 C 150 290 300 320 420 320 S 560 380 680 450',
  'M130 -20 C 170 160 210 340 150 660',
  'M-20 120 C 200 140 380 110 680 160',
  'M300 -20 C 320 200 360 420 330 660',
  'M520 -20 C 500 180 560 420 600 660',
];
const STREETS = [
  'M60 380 L420 320', 'M200 640 L260 330', 'M420 320 L470 560', 'M420 320 L400 90',
  'M540 250 L680 300', 'M230 150 L520 200', 'M80 560 L330 600', 'M380 440 L640 520',
];

/** Local, offline map. Stylised and not to scale; pins use the same projection of the demo coordinates. */
export const FallbackMap: React.FC<FallbackMapProps> = ({ stations, selectedId, onSelect }) => (
  <svg viewBox="0 0 640 640" preserveAspectRatio="xMidYMid meet" className="h-full w-full" style={{ background: 'var(--color-surface-elevated)' }} role="group" aria-label="Stylised map of demo charging stations in Hyderabad">
    <rect x="-600" y="-600" width="1840" height="1840" style={{ fill: 'var(--color-surface-elevated)' }} />
    <ellipse cx="120" cy="520" rx="95" ry="58" fill="#2A7B9B" opacity=".16" />
    <ellipse cx="520" cy="110" rx="80" ry="48" fill="#57C785" opacity=".18" />
    <ellipse cx="470" cy="470" rx="70" ry="44" fill="#57C785" opacity=".14" />
    {STREETS.map((d, i) => <path key={i} d={d} fill="none" strokeWidth="4" strokeLinecap="round" style={{ stroke: 'var(--color-border)' }} />)}
    {ROADS.map((d, i) => <path key={`o${i}`} d={d} fill="none" strokeWidth="15" strokeLinecap="round" style={{ stroke: 'var(--color-border)' }} />)}
    {ROADS.map((d, i) => <path key={`i${i}`} d={d} fill="none" strokeWidth="10" strokeLinecap="round" style={{ stroke: 'var(--color-surface)' }} />)}
    {Object.values(AREAS).map((a) => {
      const p = project(a.lat, a.lng);
      return (
        <text key={a.name} x={p.x} y={p.y + 30} textAnchor="middle" fontSize="15" fontWeight="700" paintOrder="stroke" strokeWidth="5" strokeLinejoin="round" style={{ fill: 'var(--color-text-secondary)', stroke: 'var(--color-surface-elevated)' }}>
          {a.name}
        </text>
      );
    })}
    {stations.map((s) => {
      const p = project(s.lat, s.lng);
      const sel = s.id === selectedId;
      const status = availabilityStatus(s);
      return (
        <g
          key={s.id}
          role="button"
          tabIndex={0}
          aria-label={`${s.name}, ${AREAS[s.area].name}, ${STATUS_LABEL[status]}`}
          aria-pressed={sel}
          onClick={() => onSelect(s.id)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(s.id); } }}
          style={{ cursor: 'pointer', outline: 'none' }}
          className="fallback-pin"
        >
          {sel && <circle cx={p.x} cy={p.y} r="22" fill={STATUS_COLOR[status]} opacity=".22" />}
          <g transform={`translate(${p.x} ${p.y}) scale(${sel ? 1.3 : 1}) translate(-20 -46)`}>
            <PinGraphic status={status} />
          </g>
        </g>
      );
    })}
  </svg>
);
