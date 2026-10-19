import React from 'react';
import { MapPin, Zap } from 'lucide-react';
import { AREAS, DemoStation, STATUS_LABEL, availabilityStatus, SPEED_LABEL, speedTier } from '../../data/demoData';
import { ConnectorIcon } from '../visuals/ConnectorIcon';
import { STATUS_COLOR } from './pin';

export const AvailabilityDots: React.FC<{ total: number; available: number }> = ({ total, available }) => {
  const color = STATUS_COLOR[availabilityStatus({ available })];
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="h-2 w-5 rounded-full" style={{ background: i < available ? color : 'var(--color-border)' }} />
      ))}
    </span>
  );
};

interface StationCardProps {
  station: DemoStation;
  selected: boolean;
  onSelect: () => void;
}

export const StationCard = React.forwardRef<HTMLButtonElement, StationCardProps>(({ station, selected, onSelect }, ref) => {
  const status = availabilityStatus(station);
  return (
    <button
      ref={ref}
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      data-station-id={station.id}
      className={`w-full text-left rounded-2xl border p-4 space-y-3 transition-all bg-[var(--color-surface)] ${
        selected ? 'border-[var(--color-primary)] shadow-[var(--shadow-md)] ring-2 ring-[var(--color-primary)]/25' : 'border-[var(--color-border)] hover:border-[var(--color-border-glow)] hover:shadow-[var(--shadow-sm)]'
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block text-sm font-bold text-[var(--color-text)] truncate">{station.name}</span>
          <span className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {AREAS[station.area].name}
          </span>
        </span>
        <span className="flex-shrink-0 text-right">
          <span className="block font-tabular text-sm font-semibold text-[var(--color-text)]">~{station.distanceKm} km</span>
          <span className="block text-[10px] text-[var(--color-text-muted)]">illustrative</span>
        </span>
      </span>

      <span className="flex flex-wrap items-center gap-2">
        {station.connectors.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-elevated)] px-2 py-1 text-xs font-semibold text-[var(--color-text-secondary)]">
            <ConnectorIcon type={c} size={16} /> {c}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <Zap className="w-3.5 h-3.5" /> {SPEED_LABEL[speedTier(station.maxKw)].split(' ')[0]}
        </span>
      </span>

      <span className="flex items-center justify-between gap-3">
        <AvailabilityDots total={station.total} available={station.available} />
        <span className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[var(--color-text)]">{station.available} of {station.total} available</span>
          <span className="font-bold" style={{ color: STATUS_COLOR[status] }}>{STATUS_LABEL[status]}</span>
        </span>
      </span>
    </button>
  );
});
StationCard.displayName = 'StationCard';
