import React, { useState } from 'react';
import { Activity, Clock, Gauge, Radio, Zap, CreditCard, UserRound } from 'lucide-react';
import { DataBadge } from '../components/common/DataBadge';
import { Notice } from '../components/common/Notice';
import { PageHeader } from '../components/common/PageHeader';
import { DataSourceNotice } from '../components/common/DataSourceNotice';
import { ReadingTile } from '../components/common/ReadingTile';
import { MiniBarChart } from '../components/visuals/MiniCharts';
import { ChargingScene } from '../components/visuals/ChargingScene';
import { useReadingKind } from '../hooks/useReadingKind';
import { useAccount } from '../context/AccountContext';
import { endReasonLabel, formatEnergy, liveWeeklyEnergy, liveWeeklyTotals, sessionMinutes, useLiveSessions } from '../hooks/useLiveSessions';

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string; unit?: string }> = ({ icon, label, value, unit }) => (
  <div className="card-premium space-y-3">
    <div className="flex items-center justify-between">
      <span className="w-10 h-10 rounded-xl bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex items-center justify-center">{icon}</span>
      <DataBadge kind="derived" label="From V × I" />
    </div>
    <div>
      <div className="font-tabular text-2xl font-semibold text-[var(--color-text)]">
        {value}
        {unit && <span className="ml-1 text-sm font-medium text-[var(--color-text-muted)]">{unit}</span>}
      </div>
      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{label}</div>
    </div>
  </div>
);

const inputCls =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]';

/** Sign-in gate for live mode (real account). */
export const LiveSignInGate: React.FC = () => {
  const { openSignIn } = useAccount();
  return (
    <div className="space-y-8">
      <PageHeader title="My EV" description="Your charging sessions and RFID card." badge={<DataBadge kind="unavailable" label="Signed out" />} />
      <DataSourceNotice />
      <section className="rounded-3xl border border-[var(--color-border)] overflow-hidden bg-gradient-to-br from-[#2A7B9B]/12 via-[#57C785]/8 to-[#EDDD53]/16">
        <div className="grid lg:grid-cols-2 items-center gap-6 p-6 sm:p-10">
          <div className="space-y-5">
            <h2 className="h2-fluid text-[var(--color-text)]">See your charging sessions</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--color-text-secondary)] max-w-md">
              Sign in or create an account, link your RFID card, then tap it at the station to start and stop a session.
            </p>
            <button type="button" onClick={openSignIn} className="btn-primary">
              <UserRound className="w-4 h-4" />
              <span>Sign in</span>
            </button>
          </div>
          <ChargingScene className="w-full h-auto" />
        </div>
      </section>
    </div>
  );
};

export const LiveMyEV: React.FC = () => {
  const { apiUser, cards, linkCard } = useAccount();
  const { state, isStale, baseKind, derivedKind, fmt, r } = useReadingKind();
  const { sessions, loading, error } = useLiveSessions();
  const [uid, setUid] = useState('');
  const [label, setLabel] = useState('');
  const [linkBusy, setLinkBusy] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const week = liveWeeklyEnergy(sessions);
  const totals = liveWeeklyTotals(sessions);
  const active = sessions.find((s) => s.endedAt === null) ?? null;
  const fresh = state.connectionStatus === 'connected';

  const onLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLinkBusy(true);
    setLinkMsg(null);
    try {
      await linkCard(uid, label || undefined);
      setUid('');
      setLabel('');
      setLinkMsg({ ok: true, text: 'Card linked. Tap it at the station to start a session.' });
    } catch (err) {
      setLinkMsg({ ok: false, text: err instanceof Error ? err.message : 'Could not link the card' });
    } finally {
      setLinkBusy(false);
    }
  };

  return (
    <div className="space-y-12">
      <PageHeader title="My EV" description="Your charging sessions and RFID card." badge={<DataBadge kind="live" label={`Signed in · ${apiUser?.name ?? ''}`} />} />
      <DataSourceNotice />

      {/* Current session */}
      <section className="card-premium space-y-6">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-sans text-[var(--color-text)]">Charging now</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {active ? `Your session started at ${new Date(active.startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}.` : 'No active session. Tap your linked RFID card at the station to start one.'}
            </p>
          </div>
          <DataBadge kind={active ? (isStale ? 'stale' : 'live') : 'unavailable'} label={active ? (isStale ? 'Stale' : 'In progress') : 'Idle'} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <ReadingTile label="Voltage" value={fmt(r.voltage, 2)} unit="V" kind={fresh ? baseKind : 'unavailable'} />
          <ReadingTile label="Current" value={fmt(r.current, 0)} unit="mA" kind={fresh ? baseKind : 'unavailable'} />
          <ReadingTile label="Power" value={fmt(r.power, 2)} unit="W" kind={fresh ? derivedKind : 'unavailable'} note="Derived: P = V × I" />
          <ReadingTile label="Energy this session" value={active ? active.energyWh.toFixed(3) : null} unit="Wh" kind={active ? 'derived' : 'unavailable'} note="Integral of V × I samples" />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-5" aria-label="This week">
        <Stat icon={<Zap className="w-5 h-5" />} label="Energy this week" value={String(totals.wh)} unit="Wh" />
        <Stat icon={<Activity className="w-5 h-5" />} label="Sessions this week" value={String(totals.sessions)} />
        <Stat icon={<Gauge className="w-5 h-5" />} label="Average per session" value={String(totals.avgWh)} unit="Wh" />
        <Stat icon={<Zap className="w-5 h-5" />} label="Peak power" value={String(totals.peakW)} unit="W" />
      </section>

      {/* Chart + sessions */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 card-premium space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--color-text)]">Energy used, last 7 days</h3>
            <DataBadge kind="derived" />
          </div>
          <MiniBarChart data={week} unit="Wh" ariaLabel={`Energy used per day over the last 7 days. Total ${totals.wh} watt-hours.`} />
        </div>

        <div className="lg:col-span-5 card-premium space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-bold text-[var(--color-text)]">Recent sessions</h3>
            <DataBadge kind="derived" />
          </div>
          {error && <p role="alert" className="text-xs text-[var(--color-danger,#C0392B)]">{error}</p>}
          {sessions.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">{loading ? 'Loading…' : 'No sessions yet. Link a card and tap it at the station.'}</p>
          ) : (
            <ol className="space-y-3">
              {sessions.slice(0, 6).map((s) => (
                <li key={s.id} className="rounded-xl bg-[var(--color-surface-elevated)] p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--color-text)]">
                      {new Date(s.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })},{' '}
                      {new Date(s.startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="font-tabular text-sm font-semibold text-[var(--color-text)]">{formatEnergy(s.energyWh)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>{endReasonLabel(s.endReason)}</span>
                    <span className="font-tabular"><Clock className="inline w-3 h-3 mr-1" />{sessionMinutes(s)} min · peak {s.peakPowerW.toFixed(2)} W</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* RFID cards */}
      <section className="space-y-5">
        <h2 className="text-base font-bold font-sans text-[var(--color-text)]">Your RFID cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="card-premium space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2"><CreditCard className="w-4 h-4 text-[var(--color-primary)]" /> Linked cards</span>
              <DataBadge kind="live" label={`${cards.length} linked`} />
            </div>
            {cards.length === 0 ? (
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">No card linked yet. Add the UID printed by your reader.</p>
            ) : (
              <ul className="space-y-2">
                {cards.map((c) => (
                  <li key={c.ref} className="flex items-center justify-between rounded-xl bg-[var(--color-surface-elevated)] px-3 py-2 text-sm">
                    <span className="font-semibold text-[var(--color-text)]">{c.label || 'RFID card'}</span>
                    <span className="font-tabular text-xs text-[var(--color-text-muted)]">ref {c.ref}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[11px] text-[var(--color-text-muted)]">Only a salted hash of the UID is stored. The reference above is part of that hash, not the UID.</p>
          </div>

          <form onSubmit={onLink} className="card-premium space-y-4">
            <span className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2"><Radio className="w-4 h-4 text-[var(--color-primary)]" /> Link a card</span>
            <div className="space-y-1.5">
              <label htmlFor="card-uid" className="text-xs font-semibold text-[var(--color-text-secondary)]">Card UID</label>
              <input id="card-uid" className={inputCls} value={uid} onChange={(e) => setUid(e.target.value)} placeholder="04:A3:5B:1C" required pattern="[0-9A-Fa-f:\- ]{4,32}" title="Hex digits, e.g. 04:A3:5B:1C" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="card-label" className="text-xs font-semibold text-[var(--color-text-secondary)]">Label (optional)</label>
              <input id="card-label" className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} maxLength={40} placeholder="Blue tag" />
            </div>
            {linkMsg && <p role={linkMsg.ok ? 'status' : 'alert'} className={`text-sm ${linkMsg.ok ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-danger,#C0392B)]'}`}>{linkMsg.text}</p>}
            <button type="submit" disabled={linkBusy} className="btn-primary">{linkBusy ? 'Linking…' : 'Link card'}</button>
          </form>
        </div>
      </section>

      <Notice title="About these values">
        Energy is estimated by adding up voltage × current samples over time. It is not a calibrated meter reading. A session ends when the same card is tapped again, or after the station stops sending data.
      </Notice>
    </div>
  );
};
