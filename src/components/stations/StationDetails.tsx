import React from 'react';
import { MapPin, Wallet } from 'lucide-react';
import { AREAS, CONNECTOR_INFO, DemoStation, STATUS_LABEL, availabilityStatus, connectorKw, formatInr, DEMO_DATA_LABEL } from '../../data/demoData';
import { ConnectorIcon } from '../visuals/ConnectorIcon';
import { StationIllustration } from '../visuals/StationIllustration';
import { DataBadge } from '../common/DataBadge';
import { STATUS_COLOR } from './pin';
import { AvailabilityDots } from './StationCard';

/** Compact summary shown under the map. */
export const StationSummaryPanel: React.FC<{ station: DemoStation | null; onViewDetails: () => void }> = ({ station, onViewDetails }) => {
  if (!station) {
    return (
      <div className="card-flat flex items-center gap-4">
        <StationIllustration total={3} available={0} className="w-28 h-auto flex-shrink-0 opacity-70" />
        <p className="text-sm text-[var(--color-text-secondary)]">Select a pin or a station card to see its details here.</p>
      </div>
    );
  }
  const status = availabilityStatus(station);
  return (
    <div className="card-premium flex flex-col sm:flex-row sm:items-center gap-5">
      <StationIllustration total={station.total} available={station.available} className="w-full max-w-[11rem] h-auto flex-shrink-0 self-center" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="text-base font-bold font-sans text-[var(--color-text)]">{station.name}</h2>
          <span className="text-xs font-bold" style={{ color: STATUS_COLOR[status] }}>{STATUS_LABEL[status]}</span>
        </div>
        <p className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
          <MapPin className="w-3.5 h-3.5" /> {AREAS[station.area].name} · ~{station.distanceKm} km (illustrative)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <AvailabilityDots total={station.total} available={station.available} />
          <span className="text-xs font-semibold text-[var(--color-text)]">{station.available} of {station.total} available</span>
        </div>
      </div>
      <button type="button" onClick={onViewDetails} className="btn-primary self-start sm:self-center">View details</button>
    </div>
  );
};

/** Full details shown in the drawer. */
export const StationDetailContent: React.FC<{ station: DemoStation }> = ({ station }) => {
  const status = availabilityStatus(station);
  return (
    <>
      <div className="rounded-2xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] p-4">
        <StationIllustration total={station.total} available={station.available} className="w-full h-auto" />
      </div>
      <div className="space-y-2">
        <h2 className="h3-fluid text-[var(--color-text)]">{station.name}</h2>
        <p className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
          <MapPin className="w-4 h-4" /> {AREAS[station.area].name}, Hyderabad · ~{station.distanceKm} km (illustrative)
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <AvailabilityDots total={station.total} available={station.available} />
          <span className="text-sm font-semibold text-[var(--color-text)]">{station.available} of {station.total} available</span>
          <span className="text-sm font-bold" style={{ color: STATUS_COLOR[status] }}>{STATUS_LABEL[status]}</span>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-[var(--color-text)]">Connectors</h3>
        {station.connectors.map((c) => {
          const info = CONNECTOR_INFO[c];
          return (
            <div key={c} className="card-flat flex items-center gap-4">
              <span className="w-11 h-11 rounded-xl bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                <ConnectorIcon type={c} size={26} />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-bold text-[var(--color-text)]">{c}</span>
                <span className="block text-xs text-[var(--color-text-muted)]">{info.kind} · up to {connectorKw(station, c)} kW</span>
              </span>
              <span className="text-right">
                <span className="block font-tabular text-sm font-semibold text-[var(--color-text)]">{formatInr(info.pricePerKwh)}/kWh</span>
                <span className="block text-[10px] text-[var(--color-text-muted)]">illustrative</span>
              </span>
            </div>
          );
        })}
      </section>

      <div className="card-flat flex items-center gap-3">
        <Wallet className="w-5 h-5 text-[var(--color-text-muted)] flex-shrink-0" />
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
          Example: a 20 kWh charge at {formatInr(CONNECTOR_INFO[station.connectors[0]].pricePerKwh)}/kWh would be about {formatInr(20 * CONNECTOR_INFO[station.connectors[0]].pricePerKwh)} (illustrative).
        </p>
      </div>

      <div className="space-y-3">
        <DataBadge kind="simulated" label={DEMO_DATA_LABEL} />
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          This is a fictional demonstration station, not a verified business. Availability, distance, speeds and prices are illustrative.
        </p>
      </div>
    </>
  );
};
