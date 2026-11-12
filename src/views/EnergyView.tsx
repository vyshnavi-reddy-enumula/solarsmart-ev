import React from 'react';
import { UserRound } from 'lucide-react';
import { DataBadge } from '../components/common/DataBadge';
import { ReadingTile } from '../components/common/ReadingTile';
import { Notice } from '../components/common/Notice';
import { PageHeader } from '../components/common/PageHeader';
import { DataSourceNotice } from '../components/common/DataSourceNotice';
import { MiniBarChart } from '../components/visuals/MiniCharts';
import { useReadingKind } from '../hooks/useReadingKind';
import { useAccount } from '../context/AccountContext';
import { formatInr, getSessions, weeklyEnergy, weeklyTotals } from '../data/demoData';
import { liveWeeklyEnergy, liveWeeklyTotals, useLiveSessions } from '../hooks/useLiveSessions';

export const EnergyView: React.FC = () => {
  const { isDemo, isStale, secondsSinceLastHeartbeat, baseKind, derivedKind, fmt, r } = useReadingKind();
  const { signedIn, openSignIn } = useAccount();
  const sessions = getSessions();
  const week = weeklyEnergy(sessions);
  const totals = weeklyTotals(sessions);
  const live = useLiveSessions();
  const liveWeek = liveWeeklyEnergy(live.sessions);
  const liveTotals = liveWeeklyTotals(live.sessions);

  return (
    <div className="space-y-12">
      <PageHeader title="Energy" description="Your sample charging energy, and the prototype's electrical readings, each labelled by source." />
      <DataSourceNotice />

      <section className="card-premium space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-sans text-[var(--color-text)]">My charging</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{isDemo ? 'Sample energy use from the demo account.' : 'Your recorded sessions, estimated from voltage × current.'}</p>
          </div>
          {isDemo ? <DataBadge kind="simulated" label="Sample data" /> : <DataBadge kind="derived" />}
        </div>
        {signedIn ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2">
              {isDemo
                ? <MiniBarChart data={week} unit="kWh per day" ariaLabel={`Energy used per day over the last 7 days (sample data). Total ${totals.kWh} kilowatt-hours.`} />
                : <MiniBarChart data={liveWeek} unit="Wh per day" ariaLabel={`Energy used per day over the last 7 days. Total ${liveTotals.wh} watt-hours.`} />}
            </div>
            <dl className="grid grid-cols-3 lg:grid-cols-1 gap-4">
              <div className="card-flat"><dt className="text-xs text-[var(--color-text-muted)]">Total</dt><dd className="font-tabular text-xl font-semibold text-[var(--color-text)]">{isDemo ? `${totals.kWh} kWh` : `${liveTotals.wh} Wh`}</dd></div>
              <div className="card-flat"><dt className="text-xs text-[var(--color-text-muted)]">Sessions</dt><dd className="font-tabular text-xl font-semibold text-[var(--color-text)]">{isDemo ? totals.sessions : liveTotals.sessions}</dd></div>
              <div className="card-flat"><dt className="text-xs text-[var(--color-text-muted)]">{isDemo ? 'Cost (illustrative)' : 'Peak power'}</dt><dd className="font-tabular text-xl font-semibold text-[var(--color-text)]">{isDemo ? formatInr(totals.cost) : `${liveTotals.peakW} W`}</dd></div>
            </dl>
          </div>
        ) : (
          <div className="card-flat flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-text-secondary)]">{isDemo ? 'Sign in with the demo account to see sample weekly energy use.' : 'Sign in to see the energy from your own charging sessions.'}</p>
            <button type="button" onClick={openSignIn} className="btn-secondary self-start"><UserRound className="w-4 h-4 text-[var(--color-primary)]" /><span>{isDemo ? 'Sign in (demo)' : 'Sign in'}</span></button>
          </div>
        )}
      </section>

      <section className="card-premium space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-sans text-[var(--color-text)]">Prototype readings: SolarSmart Base 01</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{isDemo ? `Simulated update ${secondsSinceLastHeartbeat ?? 0}s ago` : 'No readings received'}</p>
          </div>
          {isStale && <DataBadge kind="stale" label="Stale: not current" />}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <ReadingTile label="Voltage" value={fmt(r.voltage, 2)} unit="V" kind={baseKind} />
          <ReadingTile label="Current" value={fmt(r.current, 0)} unit="mA" kind={baseKind} />
          <ReadingTile label="Power" value={fmt(r.power, 2)} unit="W" kind={derivedKind} note="Derived: P = V × I" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ReadingTile label="Energy delivered" value={null} kind="unavailable" note="Needs a verified measurement method." />
          <ReadingTile label="Solar contribution" value={null} kind="unavailable" note="Needs a verified measurement method." />
        </div>
      </section>

      <Notice title="About these values">
        Sample charging history comes from a demo account. {isDemo ? 'Prototype voltage and current are simulated in demo mode' : 'Prototype voltage and current come from the station backend when the device is sending data'}, and power is always derived from them (P = V × I).
      </Notice>
    </div>
  );
};
