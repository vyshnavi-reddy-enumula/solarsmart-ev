import React from 'react';
import { AvailabilityStatus } from '../../data/demoData';

export const STATUS_COLOR: Record<AvailabilityStatus, string> = {
  available: '#2F9E64',
  limited: '#D97706',
  full: '#DC2626',
};

const DROP = 'M20 46 C20 46 4 30 4 18 A16 16 0 1 1 36 18 C36 30 20 46 20 46 Z';
const BOLT = 'M21.5 10 L14 20 h5 l-1.5 8 L26 17 h-5 z';

/** HTML string for Leaflet divIcon. */
export const pinMarkup = (status: AvailabilityStatus, selected: boolean) =>
  `<div class="ev-pin${selected ? ' ev-pin-selected' : ''}"><svg viewBox="0 0 40 48" width="40" height="48" aria-hidden="true"><path d="${DROP}" fill="${STATUS_COLOR[status]}" stroke="#fff" stroke-width="2.5"/><circle cx="20" cy="18" r="10" fill="#fff"/><path d="${BOLT}" fill="${STATUS_COLOR[status]}"/></svg></div>`;

/** Same pin for the SVG fallback map. Anchor point is the tip at (20,46). */
export const PinGraphic: React.FC<{ status: AvailabilityStatus }> = ({ status }) => (
  <>
    <path d={DROP} fill={STATUS_COLOR[status]} stroke="#fff" strokeWidth="2.5" />
    <circle cx="20" cy="18" r="10" fill="#fff" />
    <path d={BOLT} fill={STATUS_COLOR[status]} />
  </>
);
