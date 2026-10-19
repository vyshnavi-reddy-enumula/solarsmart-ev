import React from 'react';
import { Radio, Clock, Car, Zap, Wallet, Activity, Gauge, BatteryCharging, MapPin, UserRound } from 'lucide-react';
import { DataBadge } from '../components/common/DataBadge';
import { Notice } from '../components/common/Notice';
import { PageHeader } from '../components/common/PageHeader';
import { DataSourceNotice } from '../components/common/DataSourceNotice';
import { useReadingKind } from '../hooks/useReadingKind';
import { useAccount } from '../context/AccountContext';
import { EVCar } from '../components/visuals/EVCar';
import { ChargingScene } from '../components/visuals/ChargingScene';
import { BatteryGraphic } from '../components/visuals/BatteryGraphic';
import { ProgressRing } from '../components/visuals/ProgressRing';
import { MiniBarChart, Sparkline } from '../components/visuals/MiniCharts';
import { ConnectorIcon } from '../components/visuals/ConnectorIcon';
import { DEMO_VEHICLE, SAMPLE_SESSION, formatInr, getSessions, stationById, weeklyEnergy, weeklyTotals } from '../data/demoData';

const SignInGate: React.FC = () => {
  const { openSignIn } = useAccount();
  return (
    <div className="space-y-8">
      <PageHeader title="My EV" description="Your vehicle, charging status and recent sessions." badge={<DataBadge kind="simulated" label="Demo account" />} />
      <section className="rounded-3xl border border-[var(--color-border)] overflow-hidden bg-gradient-to-br from-[#2A7B9B]/12 via-[#57C785]/8 to-[#EDDD53]/16">
        <div className="grid lg:grid-cols-2 items-center gap-6 p-6 sm:p-10">
          <div className="space-y-5">
            <h2 className="h2-fluid text-[var(--color-text)]">See your EV and charging history</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)] max-w-md">
              Sign in with the demo account to open a sample vehicle profile, a simulated charging status and sample session history.
            </p>
            <button type="button" onClick={openSignIn} className="btn-primary">
              <UserRound className="w-4 h-4" />
              <span>Sign in (demo)</span>
            </button>
            <p className="text-xs text-[var(--color-text-muted)]">No password. No real account is created.</p>
          </div>
          <ChargingScene className="w-full h-auto" />
        </div>
      </section>
    </div>
  );
};

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string; unit?: string; spark?: number[] }> = ({ icon, label, value, unit, spark }) => (
  <div className="card-premium space-y-3">
    <div className="flex items-center justify-between">
      <span className="w-10 h-10 rounded-xl bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex items-center justify-center">{icon}</span>
      <DataBadge kind="simulated" label="Sample" />
    </div>
    <div className="flex items-end justify-between gap-2">
      <div>
        <div className="font-tabular text-2xl font-semibold text-[var(--color-text)]">
          {value}
          {unit && <span className="ml-1 text-sm font-medium text-[var(--color-text-muted)]">{unit}</span>}
        </div>
        <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{label}</div>
      </div>
      {spark && <Sparkline values={spark} className="w-20 h-8 flex-shrink-0" />}
    </div>
  </div>
);

export const MyEVView: React.FC = () => {
  const { signedIn, user } = useAccount();
  const { isDemo, baseKind, r } = useReadingKind();
  if (!signedIn) return <SignInGate />;

  const sessions = getSessions();
  const week = weeklyEnergy(sessions);
  const totals = weeklyTotals(sessions);
  const station = stationById(SAMPLE_SESSION.stationId)!;
  const pct = isDemo ? SAMPLE_SESSION.batteryPercent : null;

  return (
    <div className="space-y-12">
      <PageHeader title="My EV" description="Your vehicle, charging status and recent sessions." badge={<DataBadge kind="simulated" label={`Demo account · ${user.name}`} />} />
      <DataSourceNotice />

      {/* Hero: vehicle + charging status */}
      <section className="rounded-3xl border border-[var(--color-border)] overflow-hidden bg-gradient-to-br from-[#2A7B9B]/12 via-[#57C785]/8 to-[#EDDD53]/16">
        <div className="grid lg:grid-cols-12 gap-6 p-6 sm:p-10">
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div className="space-y-1">
              <h2 className="h2-fluid text-[var(--color-text)]">{DEMO_VEHICLE.name}</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">{DEMO_VEHICLE.description}</p>
            </div>
            <EVCar className="w-full max-w-xl h-auto self-center" />
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-surface)]/80 border border-[var(--color-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-text)]">
                <span className="text-[var(--color-primary)]"><ConnectorIcon type={DEMO_VEHICLE.connector} size={20} /></span>
                {DEMO_VEHICLE.connector} connector
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-surface)]/80 border border-[var(--color-border)] px-3.5 py-2 text-sm font-semibold text-[var(--color-text)]">
                <BatteryCharging className="w-4 h-4 text-[var(--color-primary)]" />
                {DEMO_VEHICLE.batteryKWh} kWh battery (sample)
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 space-y-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-bold text-[var(--color-text)]">Charging status</h3>
              <DataBadge kind={isDemo ? 'simulated' : 'unavailable'} />
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-6">
              <ProgressRing value={pct} size={176} stroke={15}>
                <span className="font-tabular text-4xl font-semibold text-[var(--color-text)]">{pct === null ? '—' : `${pct}%`}</span>
                <span className="text-xs text-[var(--color-text-muted)]">{pct === null ? 'unavailable' : 'battery (sample)'}</span>
              </ProgressRing>
              <div className="w-full space-y-4">
                <BatteryGraphic percent={pct} className="w-full max-w-[16rem] h-auto mx-auto" />
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-xl bg-[var(--color-surface-elevated)] p-3">
                    <Zap className="w-4 h-4 mx-auto text-[var(--color-primary)]" />
                    <div className="font-tabular text-lg font-semibold text-[var(--color-text)]">{isDemo ? SAMPLE_SESSION.energyKWh : '—'}<span className="text-xs text-[var(--color-text-muted)]"> kWh</span></div>
                  </div>
                  <div className="rounded-xl bg-[var(--color-surface-elevated)] p-3">
                    <Clock className="w-4 h-4 mx-auto text-[var(--color-primary)]" />
                    <div className="font-tabular text-lg font-semibold text-[var(--color-text)]">{isDemo ? SAMPLE_SESSION.minutes : '—'}<span className="text-xs text-[var(--color-text-muted)]"> min</span></div>
                  </div>
                </div>
              </div>
            </div>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              {isDemo ? `Sample session at ${station.name}. All values here are simulated.` : 'No live charging data is connected.'}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5" aria-label="This week (sample data)">
        <Stat icon={<Zap className="w-5 h-5" />} label="Energy this week" value={String(totals.kWh)} unit="kWh" spark={week.map((d) => d.value)} />
        <Stat icon={<Activity className="w-5 h-5" />} label="Sessions this week" value={String(totals.sessions)} />
        <Stat icon={<Wallet className="w-5 h-5" />} label="Cost (illustrative)" value={formatInr(totals.cost)} />
        <Stat icon={<Gauge className="w-5 h-5" />} label="Average per session" value={String(totals.avgKWh)} unit="kWh" />
      </section>

      {/* Chart + sessions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 card-premium space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--color-text)]">Energy used, last 7 days</h3>
            <DataBadge kind="simulated" label="Sample data" />
          </div>
          <MiniBarChart data={week} unit="kWh" ariaLabel={`Energy used per day over the last 7 days (sample data). Total ${totals.kWh} kilowatt-hours.`} />
        </div>

        <div className="lg:col-span-5 card-premium space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--color-text)]">Recent sessions</h3>
            <DataBadge kind="simulated" label="Sample data" />
          </div>
          <ol className="relative space-y-4 before:absolute before:left-[1.1rem] before:top-3 before:bottom-3 before:w-px before:bg-[var(--color-border)]">
            {sessions.slice(0, 4).map((s) => (
              <li key={s.id} className="relative flex gap-4">
                <span className="relative z-10 w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <ConnectorIcon type={s.connector} size={18} />
                </span>
                <div className="flex-1 min-w-0 rounded-xl bg-[var(--color-surface-elevated)] p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--color-text)] truncate">{s.stationName}</span>
                    <span className="font-tabular text-sm font-semibold text-[var(--color-text)]">{formatInr(s.cost)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>{s.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, {s.start} · {s.areaName}</span>
                    <span className="font-tabular">{s.kWh} kWh · {s.minutes} min</span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-[11px] text-[var(--color-text-muted)]">Costs are illustrative and not billing information.</p>
        </div>
      </section>

      {/* Prototype station items (existing) */}
      <section className="space-y-5">
        <h2 className="text-base font-bold font-sans text-[var(--color-text)]">At the prototype station</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="card-premium space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2"><Radio className="w-4 h-4 text-[var(--color-primary)]" /> RFID access</span>
              <DataBadge kind={isDemo ? 'simulated' : 'unavailable'} />
            </div>
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {isDemo ? 'Simulated reader: no card input is processed.' : 'Reader status unavailable.'} RFID identifies a card or tag. It does not measure battery level.
            </p>
          </div>
          <div className="card-premium space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2"><Clock className="w-4 h-4 text-[var(--color-primary)]" /> Prototype session</span>
              <DataBadge kind="unavailable" />
            </div>
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">No session reported by the prototype. Duration starts only when one is.</p>
          </div>
          <div className="card-premium space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2"><Car className="w-4 h-4 text-[var(--color-primary)]" /> Vehicle presence</span>
              <DataBadge kind={r.vehicleDetected === null ? 'unavailable' : baseKind} />
            </div>
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {r.vehicleDetected === null ? 'Presence sensor not integrated.' : r.vehicleDetected ? 'Detected.' : 'Not detected.'}
            </p>
          </div>
        </div>
      </section>

      <Notice title="What is real and what is sample">
        The battery level, charging progress, session figures and history above are simulated samples from a demo account. The prototype has no verified way to measure battery level or delivered energy yet.
      </Notice>
    </div>
  );
};
