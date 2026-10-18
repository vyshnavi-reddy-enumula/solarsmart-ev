import React from 'react';
import { SunMedium, Radio, Cpu, Wifi } from 'lucide-react';
import { DataBadge } from './DataBadge';
import { useStationData } from '../../context/StationDataContext';

export const HeroGeometricVisual: React.FC = () => {
  const { state } = useStationData();

  return (
    <div className="hero-geometric-visual select-none" aria-hidden="true">
      {/* Background Ambient Glow */}
      <div className="hero-ambient-glow" />

      {/* Decorative Layered Geometric Backdrop */}
      <div className="geometric-facet-backdrop" />

      {/* Primary Faceted Architecture Card */}
      <div className="geometric-facet-primary gradient-border-card space-y-5">
        {/* Top Header of the Facet */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primitive-green)] animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-text)]">
              Base 01 Architecture
            </span>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
            Scaled Demo
          </span>
        </div>

        {/* Node 1: Solar Harvesting */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex items-center justify-center">
              <SunMedium className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold block text-[var(--color-text)]">
                Solar Generation
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Mini Panel & Storage Circuit
              </span>
            </div>
          </div>
          <DataBadge kind="unavailable" label="Not measured" />
        </div>

        {/* Node 2: Wireless Inductive Transfer */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primitive-green)]/15 text-[var(--primitive-green-dark)] dark:text-[var(--primitive-green)] flex items-center justify-center">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold block text-[var(--color-text)]">
                Wireless Coils
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Primary Tx ↔ Toy EV Rx
              </span>
            </div>
          </div>
          {state.dataSourceMode === 'demo' ? (
            <DataBadge kind="simulated" label={state.operationalStatus === 'charging' ? 'Simulated: active' : 'Simulated: standby'} />
          ) : (
            <DataBadge kind="unavailable" />
          )}
        </div>

        {/* Node 3: Embedded Controller Bus */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primitive-lime)]/20 text-[#A08A12] dark:text-[var(--primitive-lime)] flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold block text-[var(--color-text)]">
                Arduino UNO & ESP32
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                RFID · sensing · Wi-Fi (planned)
              </span>
            </div>
          </div>
          <DataBadge kind={state.dataSourceMode === 'demo' ? 'simulated' : 'unavailable'} />
        </div>

        {/* Bottom Hardware Metric Pill */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-[var(--color-text-muted)]">
          <span className="flex items-center space-x-1">
            <Wifi className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Telemetry</span>
          </span>
          <span className="font-mono">
            {state.dataSourceMode === 'demo' ? 'SIMULATED FEED' : 'NO DATA SOURCE'}
          </span>
        </div>
      </div>
    </div>
  );
};
