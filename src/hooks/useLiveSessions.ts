import { useCallback, useEffect, useState } from 'react';
import { api, ApiSession } from '../api/client';
import { useAccount } from '../context/AccountContext';
import { useStationData } from '../context/StationDataContext';

/** Fetches the signed-in account's real sessions in live mode. Does nothing in demo mode. */
export const useLiveSessions = (pollMs = 5000) => {
  const { token, apiUser } = useAccount();
  const { state } = useStationData();
  const enabled = state.dataSourceMode === 'live' && !!token && !!apiUser;
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      const r = await api.sessions(token);
      setSessions(r.sessions);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load sessions');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!enabled) {
      setSessions([]);
      setError(null);
      return;
    }
    setLoading(true);
    void load();
    const t = setInterval(load, pollMs);
    return () => clearInterval(t);
  }, [enabled, load, pollMs]);

  return { enabled, sessions, loading, error, reload: load };
};

export const sessionMinutes = (s: ApiSession) =>
  Math.max(0, Math.round(((s.endedAt ? new Date(s.endedAt).getTime() : Date.now()) - new Date(s.startedAt).getTime()) / 60000));

const dayStart = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/** Energy per day for the last 7 days, in Wh (the prototype delivers watts, not kilowatts). */
export const liveWeeklyEnergy = (sessions: ApiSession[]) => {
  const out: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = dayStart(new Date());
    d.setDate(d.getDate() - i);
    const value = sessions
      .filter((s) => dayStart(new Date(s.startedAt)).getTime() === d.getTime())
      .reduce((sum, s) => sum + s.energyWh, 0);
    out.push({ label: d.toLocaleDateString('en-IN', { weekday: 'short' }), value: Number(value.toFixed(2)) });
  }
  return out;
};

export const liveWeeklyTotals = (sessions: ApiSession[]) => {
  const cutoff = dayStart(new Date());
  cutoff.setDate(cutoff.getDate() - 6);
  const week = sessions.filter((s) => new Date(s.startedAt) >= cutoff);
  const wh = week.reduce((a, s) => a + s.energyWh, 0);
  return {
    sessions: week.length,
    wh: Number(wh.toFixed(2)),
    avgWh: week.length ? Number((wh / week.length).toFixed(2)) : 0,
    peakW: Number(week.reduce((m, s) => Math.max(m, s.peakPowerW), 0).toFixed(2)),
  };
};

/** Shows prototype energies in Wh, switching to kWh only at kilowatt-hour scale. */
export const formatEnergy = (wh: number) => (wh >= 1000 ? `${(wh / 1000).toFixed(2)} kWh` : `${wh.toFixed(wh < 10 ? 3 : 1)} Wh`);

export const endReasonLabel = (r: string | null) =>
  r === 'card' ? 'Ended by card' : r === 'timeout' ? 'Ended: no data' : r ? r : 'In progress';
