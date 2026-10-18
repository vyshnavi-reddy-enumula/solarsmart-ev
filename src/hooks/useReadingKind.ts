import { useStationData } from '../context/StationDataContext';
import { ReadingKind } from '../types/station';

/** Shared labelling rule: demo values are 'simulated'; stale overrides; real values would be 'live'. */
export const useReadingKind = () => {
  const { state, isStale, secondsSinceLastHeartbeat } = useStationData();
  const isDemo = state.dataSourceMode === 'demo';
  const baseKind: ReadingKind = isStale ? 'stale' : isDemo ? 'simulated' : 'live';
  const derivedKind: ReadingKind = isStale ? 'stale' : isDemo ? 'simulated' : 'derived';
  const fmt = (v: number | null, digits: number) => (v === null ? null : v.toFixed(digits));
  return { state, isDemo, isStale, secondsSinceLastHeartbeat, baseKind, derivedKind, fmt, r: state.latestReadings };
};
