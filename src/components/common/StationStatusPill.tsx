import React from 'react';
import { useStationData } from '../../context/StationDataContext';

const MAP = {
  available: { label: 'Available', cls: 'status-pill-available', dot: 'bg-[var(--primitive-green)]' },
  charging: { label: 'Charging', cls: 'status-pill-charging', dot: 'bg-[var(--primitive-teal)]' },
  offline: { label: 'Offline', cls: 'status-pill-offline', dot: 'bg-red-500' },
  maintenance: { label: 'Maintenance', cls: 'status-pill-warning', dot: 'bg-amber-500' },
  unknown: { label: 'Status unknown', cls: 'status-pill-warning', dot: 'bg-[var(--color-status-idle)]' },
} as const;

export const StationStatusPill: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { state } = useStationData();
  const m = MAP[state.operationalStatus];
  return (
    <span className={`status-pill ${m.cls} ${className}`}>
      <span className={`w-2 h-2 rounded-full ${m.dot}`} aria-hidden="true" />
      <span>
        {m.label}
        {state.dataSourceMode === 'demo' ? ' · simulated' : ''}
      </span>
    </span>
  );
};
