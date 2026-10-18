import React from 'react';
import { DataBadge } from '../components/common/DataBadge';
import { ReadingTile } from '../components/common/ReadingTile';
import { Notice } from '../components/common/Notice';
import { PageHeader } from '../components/common/PageHeader';
import { DataSourceNotice } from '../components/common/DataSourceNotice';
import { useReadingKind } from '../hooks/useReadingKind';

export const EnergyView: React.FC = () => {
  const { isDemo, isStale, secondsSinceLastHeartbeat, baseKind, derivedKind, fmt, r } = useReadingKind();

  return (
    <div className="space-y-12">
      <PageHeader title="Energy" description="Electrical readings at the wireless receiver, with the source of every value labelled." />
      <DataSourceNotice />

      <section className="card-premium space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-sans text-[var(--color-text)]">Electrical readings</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {isDemo ? `Simulated update ${secondsSinceLastHeartbeat ?? 0}s ago` : 'No readings received'}
            </p>
          </div>
          {isStale && <DataBadge kind="stale" label="Stale: not current" />}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <ReadingTile label="Voltage" value={fmt(r.voltage, 2)} unit="V" kind={baseKind} />
          <ReadingTile label="Current" value={fmt(r.current, 0)} unit="mA" kind={baseKind} />
          <ReadingTile label="Power" value={fmt(r.power, 2)} unit="W" kind={derivedKind} note="Derived: P = V × I" />
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <ReadingTile label="Energy delivered" value={null} kind="unavailable" note="Needs a verified measurement method." />
        <ReadingTile label="Solar contribution" value={null} kind="unavailable" note="Needs a verified measurement method." />
      </section>

      <Notice title="About these values">
        Voltage and current come from a sensor that is not connected yet. Demo values are simulated and power is always derived from voltage and current.
      </Notice>
    </div>
  );
};
