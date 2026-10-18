import React from 'react';
import { MapPin, Layers } from 'lucide-react';
import { DataBadge } from '../components/common/DataBadge';
import { PageHeader } from '../components/common/PageHeader';
import { DataSourceNotice } from '../components/common/DataSourceNotice';
import { StationStatusPill } from '../components/common/StationStatusPill';
import { useStationData } from '../context/StationDataContext';

export const StationsView: React.FC = () => {
  const { state, secondsSinceLastHeartbeat, isStale } = useStationData();
  const isDemo = state.dataSourceMode === 'demo';

  return (
    <div className="space-y-12">
      <PageHeader title="Find Stations" description="Known charging stations and their current status." />
      <DataSourceNotice />

      <section className="card-premium space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-sans text-[var(--color-text)]">{state.stationName}</h2>
            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Location not provided
            </p>
          </div>
          <StationStatusPill />
        </div>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="card-flat space-y-1">
            <dt className="text-xs text-[var(--color-text-muted)]">Type</dt>
            <dd className="font-semibold text-[var(--color-text)]">Scaled prototype</dd>
          </div>
          <div className="card-flat space-y-1">
            <dt className="text-xs text-[var(--color-text-muted)]">Last update</dt>
            <dd className="font-semibold text-[var(--color-text)]">
              {state.lastHeartbeat ? `${secondsSinceLastHeartbeat ?? 0}s ago${isDemo ? ' (simulated)' : ''}` : 'None received'}
            </dd>
          </div>
          <div className="card-flat space-y-1">
            <dt className="text-xs text-[var(--color-text-muted)]">Data</dt>
            <dd>
              <DataBadge kind={isStale ? 'stale' : isDemo ? 'simulated' : 'unavailable'} />
            </dd>
          </div>
        </dl>
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          This is a toy-vehicle demonstration, not a commercial EV charger.
        </p>
      </section>

      <section className="card-flat flex items-start gap-4">
        <Layers className="w-5 h-5 text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-bold text-[var(--color-text)]">More stations</h3>
            <DataBadge kind="unavailable" label="Not implemented" />
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Station search, maps and multi-station availability are future scope. Only Base 01 exists.
          </p>
        </div>
      </section>
    </div>
  );
};
