import React from 'react';
import { Gauge, Radio, Clock } from 'lucide-react';
import { useStationData } from '../../context/StationDataContext';
import { DataBadge } from './DataBadge';
import { StationStatusPill } from './StationStatusPill';
import { ChargingScene } from '../visuals/ChargingScene';

/** Station snapshot card for the hero. Every value is labelled by its source. */
export const HeroGeometricVisual: React.FC = () => {
  const { state, isStale, secondsSinceLastHeartbeat } = useStationData();
  const isDemo = state.dataSourceMode === 'demo';
  const r = state.latestReadings;
  const kind = isStale ? 'stale' : isDemo ? 'simulated' : 'unavailable';

  const row = 'flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]';

  return (
    <div className="hero-geometric-visual">
      <div className="hero-ambient-glow" aria-hidden="true" />
      <div className="geometric-facet-backdrop" aria-hidden="true" />

      <div className="geometric-facet-primary gradient-border-card space-y-4">
        <div className="-mx-2 -mt-2 rounded-2xl overflow-hidden border border-[var(--color-border-subtle)] bg-gradient-to-br from-[#2A7B9B]/15 via-[#57C785]/10 to-[#EDDD53]/20">
          <ChargingScene className="w-full h-auto" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--color-border)]">
          <span className="text-sm font-semibold text-[var(--color-text)]">{state.stationName}</span>
          <StationStatusPill />
        </div>

        <div className={row}>
          <span className="flex items-center gap-2.5 text-xs font-semibold text-[var(--color-text)]">
            <Gauge className="w-4 h-4 text-[var(--color-primary)]" /> Electrical readings
          </span>
          <span className="flex items-center gap-2">
            <span className="font-tabular text-xs text-[var(--color-text-secondary)]">
              {r.voltage !== null && r.current !== null ? `${r.voltage.toFixed(2)} V · ${r.current.toFixed(0)} mA` : '—'}
            </span>
            <DataBadge kind={kind} />
          </span>
        </div>

        <div className={row}>
          <span className="flex items-center gap-2.5 text-xs font-semibold text-[var(--color-text)]">
            <Radio className="w-4 h-4 text-[var(--color-primary)]" /> RFID reader
          </span>
          <DataBadge kind={isDemo ? 'simulated' : 'unavailable'} />
        </div>

        <div className={row}>
          <span className="flex items-center gap-2.5 text-xs font-semibold text-[var(--color-text)]">
            <Clock className="w-4 h-4 text-[var(--color-primary)]" /> Last update
          </span>
          <span className="text-xs text-[var(--color-text-secondary)]">
            {state.lastHeartbeat ? `${secondsSinceLastHeartbeat ?? 0}s ago${isDemo ? ' (simulated)' : ''}` : 'None received'}
          </span>
        </div>

        <p className="text-[11px] text-[var(--color-text-muted)] pt-1">
          {isDemo ? 'Values on this card are simulated.' : state.connectionStatus === 'unavailable' ? 'No live data source is connected.' : 'Values on this card come from the station backend.'}
        </p>
      </div>
    </div>
  );
};
