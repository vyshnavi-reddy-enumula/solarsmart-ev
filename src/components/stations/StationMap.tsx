import React, { useState } from 'react';
import { DemoStation, DEMO_DATA_LABEL } from '../../data/demoData';
import { LeafletMap } from './LeafletMap';
import { FallbackMap } from './FallbackMap';
import { STATUS_COLOR } from './pin';

interface StationMapProps {
  stations: DemoStation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

/** OpenStreetMap tiles via Leaflet; switches to a local drawn map if tiles cannot load. */
export const StationMap: React.FC<StationMapProps> = (props) => {
  const [offline, setOffline] = useState(false);

  return (
    <div className="relative isolate h-full w-full overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      {offline ? (
        <FallbackMap {...props} />
      ) : (
        <LeafletMap {...props} onTilesFailed={() => setOffline(true)} />
      )}

      <div className="pointer-events-none absolute left-14 top-3 z-[1000] flex flex-col gap-2 items-start max-w-[calc(100%-4.5rem)]">
        <span className="rounded-full px-3 py-1 text-[11px] font-semibold bg-[var(--color-surface)]/95 text-[var(--color-status-simulated)] border border-[rgba(200,182,44,.5)] shadow-sm">
          {DEMO_DATA_LABEL}
        </span>
        {offline && (
          <span className="rounded-full px-3 py-1 text-[11px] font-medium bg-[var(--color-surface)]/95 text-[var(--color-text-secondary)] border border-[var(--color-border)] shadow-sm">
            Map tiles unavailable. Showing a stylised map, not to scale.
          </span>
        )}
      </div>

      <div className="pointer-events-none absolute left-3 bottom-3 z-[1000] flex items-center gap-3 rounded-full bg-[var(--color-surface)]/95 border border-[var(--color-border)] px-3 py-1.5 text-[11px] text-[var(--color-text-secondary)] shadow-sm">
        {(['available', 'limited', 'full'] as const).map((k) => (
          <span key={k} className="flex items-center gap-1.5 capitalize">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[k] }} />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
};
