import React from 'react';
import { MapPin } from 'lucide-react';
import { useStationData } from '../context/StationDataContext';
import { DataBadge } from '../components/common/DataBadge';
import { StationStatusPill } from '../components/common/StationStatusPill';

/** Keeps the real prototype station visible, separate from the fictional Hyderabad demo stations. */
export const StationPageStatus: React.FC = () => {
  const { state, secondsSinceLastHeartbeat, isStale } = useStationData();
  const isDemo = state.dataSourceMode === 'demo';
  return (
    <section className="card-flat flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-[var(--color-text)]">Our prototype: {state.stationName}</h3>
        <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
          <MapPin className="w-3.5 h-3.5" /> Location not provided · scaled toy-vehicle demonstration
        </p>
        <p className="text-xs text-[var(--color-text-secondary)]">
          Last update: {state.lastHeartbeat ? `${secondsSinceLastHeartbeat ?? 0}s ago${isDemo ? ' (simulated)' : ''}` : 'none received'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <StationStatusPill />
        <DataBadge kind={isStale ? 'stale' : isDemo ? 'simulated' : 'unavailable'} />
      </div>
    </section>
  );
};
