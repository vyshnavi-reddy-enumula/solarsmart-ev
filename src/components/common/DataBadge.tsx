import React from 'react';
import { ReadingKind } from '../../types/station';

const LABELS: Record<ReadingKind, string> = {
  live: 'Live',
  derived: 'Derived',
  simulated: 'Simulated',
  unavailable: 'Unavailable',
  stale: 'Stale',
};

interface DataBadgeProps {
  kind: ReadingKind;
  label?: string;
}

export const DataBadge: React.FC<DataBadgeProps> = ({ kind, label }) => (
  <span className={`data-badge data-badge-${kind}`}>{label ?? LABELS[kind]}</span>
);
