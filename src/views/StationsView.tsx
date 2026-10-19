import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { PageHeader } from '../components/common/PageHeader';
import { DataBadge } from '../components/common/DataBadge';
import { Drawer } from '../components/common/Drawer';
import { StationPageStatus } from './StationPageStatus';
import { StationMap } from '../components/stations/StationMap';
import { StationCard } from '../components/stations/StationCard';
import { StationDetailContent, StationSummaryPanel } from '../components/stations/StationDetails';
import { StationIllustration } from '../components/visuals/StationIllustration';
import { AREAS, availabilityStatus, ConnectorType, DEMO_DATA_LABEL, DEMO_STATIONS, SPEED_LABEL, SpeedTier, speedTier } from '../data/demoData';

type ConnectorFilter = 'all' | ConnectorType;
type SpeedFilter = 'all' | SpeedTier;
type AvailabilityFilter = 'all' | 'available' | 'limited';

const Chips = <T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; text: string }[]; onChange: (v: T) => void }) => (
  <div className="flex items-center gap-2 flex-wrap" role="group" aria-label={label}>
    <span className="text-xs font-semibold text-[var(--color-text-muted)] mr-1">{label}</span>
    {options.map((o) => (
      <button
        key={o.id}
        type="button"
        aria-pressed={value === o.id}
        onClick={() => onChange(o.id)}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          value === o.id
            ? 'bg-[var(--color-primary)] text-white border-transparent dark:text-[#0B1319]'
            : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
        }`}
      >
        {o.text}
      </button>
    ))}
  </div>
);

export const StationsView: React.FC = () => {
  const [query, setQuery] = useState('');
  const [connector, setConnector] = useState<ConnectorFilter>('all');
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [speed, setSpeed] = useState<SpeedFilter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(DEMO_STATIONS[0].id);
  const [detailOpen, setDetailOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const fromPin = useRef(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DEMO_STATIONS.filter((s) => {
      if (q && !(s.name.toLowerCase().includes(q) || AREAS[s.area].name.toLowerCase().includes(q))) return false;
      if (connector !== 'all' && !s.connectors.includes(connector)) return false;
      if (availability !== 'all' && availabilityStatus(s) !== availability) return false;
      if (speed !== 'all' && speedTier(s.maxKw) !== speed) return false;
      return true;
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [query, connector, availability, speed]);

  // Keep the selection valid when filters change.
  useEffect(() => {
    if (selectedId && !results.some((s) => s.id === selectedId)) setSelectedId(results[0]?.id ?? null);
  }, [results, selectedId]);

  // When a pin is clicked on desktop, bring its card into view inside the list.
  useEffect(() => {
    if (!fromPin.current || !selectedId) return;
    fromPin.current = false;
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-station-id="${selectedId}"]`);
    if (el && listRef.current) listRef.current.scrollTo({ top: el.offsetTop - listRef.current.offsetTop - 8, behavior: 'smooth' });
  }, [selectedId]);

  const selected = results.find((s) => s.id === selectedId) ?? null;
  const filtersActive = query !== '' || connector !== 'all' || availability !== 'all' || speed !== 'all';
  const reset = () => { setQuery(''); setConnector('all'); setAvailability('all'); setSpeed('all'); };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Find Stations"
        description="Charging stations around Miyapur, Bachupally, KPHB, Pragathi Nagar and JNTU in Hyderabad."
        badge={<DataBadge kind="simulated" label={DEMO_DATA_LABEL} />}
      />

      <div className="space-y-4">
        <label className="relative block">
          <span className="sr-only">Search by area or station name</span>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search an area or station, for example KPHB"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] py-3.5 pl-12 pr-12 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/25"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]">
              <X className="w-4 h-4" />
            </button>
          )}
        </label>

        <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-8">
          <Chips<ConnectorFilter> label="Connector" value={connector} onChange={setConnector} options={[{ id: 'all', text: 'All' }, { id: 'CCS2', text: 'CCS2' }, { id: 'Type 2', text: 'Type 2' }]} />
          <Chips<AvailabilityFilter> label="Availability" value={availability} onChange={setAvailability} options={[{ id: 'all', text: 'All' }, { id: 'available', text: 'Available' }, { id: 'limited', text: 'Limited' }]} />
          <Chips<SpeedFilter> label="Speed" value={speed} onChange={setSpeed} options={[{ id: 'all', text: 'Any' }, { id: 'standard', text: SPEED_LABEL.standard }, { id: 'fast', text: SPEED_LABEL.fast }, { id: 'rapid', text: SPEED_LABEL.rapid }]} />
          <span className="text-xs text-[var(--color-text-muted)] lg:ml-auto" aria-live="polite">
            {results.length} of {DEMO_STATIONS.length} stations
            {filtersActive && (
              <button type="button" onClick={reset} className="ml-3 font-semibold text-[var(--color-primary)] hover:underline">Reset filters</button>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
        <div className="space-y-5 min-w-0">
          <div className="h-[22rem] sm:h-[28rem] lg:h-[34rem]">
            <StationMap
              stations={results}
              selectedId={selected?.id ?? null}
              onSelect={(id) => { fromPin.current = true; setSelectedId(id); }}
            />
          </div>
          <StationSummaryPanel station={selected} onViewDetails={() => setDetailOpen(true)} />
        </div>

        <div ref={listRef} className="relative space-y-3 min-w-0 lg:max-h-[48rem] lg:overflow-y-auto lg:pr-1" aria-label="Station list">
          {results.length > 0 ? (
            results.map((s) => (
              <StationCard key={s.id} station={s} selected={s.id === selectedId} onSelect={() => setSelectedId(s.id)} />
            ))
          ) : (
            <div className="card-flat flex flex-col items-center text-center gap-4 py-10">
              <StationIllustration total={3} available={0} className="w-40 h-auto opacity-70" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-[var(--color-text)]">No stations match these filters</p>
                <p className="text-xs text-[var(--color-text-muted)]">Try a different area, connector or speed.</p>
              </div>
              <button type="button" onClick={reset} className="btn-secondary">Reset filters</button>
            </div>
          )}
        </div>
      </div>

      <StationPageStatus />

      <Drawer open={detailOpen && !!selected} onClose={() => setDetailOpen(false)} title="Station details">
        {selected && <StationDetailContent station={selected} />}
      </Drawer>
    </div>
  );
};

