import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { api, AdminSummary, ApiSession } from '../api/client';
import { useAccount } from '../context/AccountContext';
import { DataBadge } from '../components/common/DataBadge';
import { Notice } from '../components/common/Notice';
import { MiniBarChart } from '../components/visuals/MiniCharts';
import { endReasonLabel, formatEnergy, sessionMinutes } from '../hooks/useLiveSessions';

/** Real operator data. The server checks the account's role; this component only reflects it. */
export const LiveOperatorPanel: React.FC = () => {
  const { apiUser, token, openSignIn } = useAccount();
  const [summary, setSummary] = useState<AdminSummary | null>(null);
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const [error, setError] = useState<string | null>(null);
  const isOperator = apiUser?.role === 'operator';

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const [s, list] = await Promise.all([api.adminSummary(token), api.sessions(token, 20)]);
      setSummary(s);
      setSessions(list.sessions);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load operator data');
    }
  }, [token]);

  useEffect(() => {
    if (!isOperator) return;
    void load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, [isOperator, load]);

  if (!isOperator) {
    return (
      <Notice icon={<ShieldCheck className="w-5 h-5" />} title="Operator sign-in required">
        {apiUser
          ? 'You are signed in as a driver. Session history is only available to an operator account. The Driver / Operator switch above changes the view only.'
          : 'Sign in with an operator account to see session history and totals. The Driver / Operator switch above changes the view only.'}
        {!apiUser && (
          <button type="button" onClick={openSignIn} className="btn-secondary mt-3">Sign in</button>
        )}
      </Notice>
    );
  }

  const perDay = (summary?.perDay ?? []).map((d) => ({ label: d.day.slice(5), value: Number(d.wh.toFixed(2)) }));

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-bold font-sans text-[var(--color-text)]">Session history</h2>
        <DataBadge kind="derived" label="Estimated from V × I" />
      </div>
      {error && <p role="alert" className="text-sm text-[var(--color-danger,#C0392B)]">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-premium"><div className="font-tabular text-2xl font-semibold text-[var(--color-text)]">{summary?.last24h.sessions ?? '—'}</div><div className="text-xs text-[var(--color-text-muted)] mt-0.5">Sessions, last 24 h</div></div>
        <div className="card-premium"><div className="font-tabular text-2xl font-semibold text-[var(--color-text)]">{summary ? formatEnergy(summary.last24h.energyWh) : '—'}</div><div className="text-xs text-[var(--color-text-muted)] mt-0.5">Energy, last 24 h</div></div>
        <div className="card-premium"><div className="font-tabular text-2xl font-semibold text-[var(--color-text)]">{summary?.allTime.sessions ?? '—'}</div><div className="text-xs text-[var(--color-text-muted)] mt-0.5">Sessions, all time</div></div>
        <div className="card-premium"><div className="font-tabular text-2xl font-semibold text-[var(--color-text)]">{summary ? formatEnergy(summary.allTime.energyWh) : '—'}</div><div className="text-xs text-[var(--color-text-muted)] mt-0.5">Energy, all time</div></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 card-premium space-y-4">
          <h3 className="text-base font-bold text-[var(--color-text)]">Energy per day (Wh)</h3>
          {perDay.length ? <MiniBarChart data={perDay} unit="Wh" ariaLabel="Energy per day in watt-hours over the last 7 days" /> : <p className="text-sm text-[var(--color-text-secondary)]">No sessions in the last 7 days.</p>}
        </div>
        <div className="lg:col-span-6 card-premium space-y-4">
          <h3 className="text-base font-bold text-[var(--color-text)]">Latest sessions</h3>
          {sessions.length === 0 ? (
            <p className="text-sm text-[var(--color-text-secondary)]">Nothing recorded yet.</p>
          ) : (
            <ol className="space-y-3">
              {sessions.slice(0, 8).map((s) => (
                <li key={s.id} className="rounded-xl bg-[var(--color-surface-elevated)] p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-bold text-[var(--color-text)]">{s.userName ?? 'User'}</span>
                    <span className="font-tabular text-sm font-semibold text-[var(--color-text)]">{formatEnergy(s.energyWh)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[var(--color-text-muted)]">
                    <span>{new Date(s.startedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {endReasonLabel(s.endReason)}</span>
                    <span className="font-tabular">{sessionMinutes(s)} min</span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
      <p className="text-[11px] text-[var(--color-text-muted)]">{summary?.note}</p>
    </section>
  );
};
