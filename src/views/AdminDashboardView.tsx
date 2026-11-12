import React from 'react';
import { AlertTriangle, Info, ClipboardList } from 'lucide-react';
import { useStationData } from '../context/StationDataContext';
import { DataBadge } from '../components/common/DataBadge';
import { Notice } from '../components/common/Notice';
import { HardwareLinkStatus, NodeLinkStatus, ReadingKind } from '../types/station';
import { LiveOperatorPanel } from './LiveOperatorPanel';

const NODES: { key: keyof HardwareLinkStatus; name: string; role: string; offLabel: string }[] = [
  { key: 'esp32Gateway', name: 'ESP32 gateway', role: 'Wi-Fi communication (planned)', offLabel: 'Not connected' },
  { key: 'arduinoLocal', name: 'Arduino UNO', role: 'Local control (planned)', offLabel: 'Not connected' },
  { key: 'rc522Reader', name: 'RC522 RFID reader', role: 'Card / tag identification', offLabel: 'Not connected' },
  { key: 'ina219Sensor', name: 'INA219 sensor', role: 'Voltage and current', offLabel: 'Not connected' },
  { key: 'irVehicleSensor', name: 'Vehicle presence sensor', role: 'Vehicle detection', offLabel: 'Not integrated' },
];

const nodeKind = (s: NodeLinkStatus): ReadingKind =>
  s === 'connected' ? 'live' : s === 'simulated' ? 'simulated' : 'unavailable';

export const AdminDashboardView: React.FC = () => {
  const { state, isStale, secondsSinceLastHeartbeat, simulateStateChange, simulateStale, simulatedStale, refreshTelemetry } =
    useStationData();
  const isDemo = state.dataSourceMode === 'demo';

  const statusBtn = (active: boolean) =>
    `px-4 py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
      active
        ? 'bg-[var(--color-primary)] text-white border-transparent dark:text-[#0B1319]'
        : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
    }`;

  return (
    <div className="space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-[var(--color-border)]">
        <div className="space-y-2">
          <h1 className="h2-fluid text-[var(--color-text)]">Station Management</h1>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-xl">
            Status and link overview for {state.stationName}.
          </p>
        </div>
        <DataBadge kind={isDemo ? 'simulated' : state.connectionStatus === 'unavailable' ? 'unavailable' : state.connectionStatus === 'stale' ? 'stale' : 'live'} label={isDemo ? 'Simulated demo data' : state.connectionStatus === 'unavailable' ? 'No live data source' : state.connectionStatus === 'stale' ? 'Live source, stale' : 'Live data'} />
      </div>

      {isDemo ? (
        <Notice variant="simulated" icon={<Info className="w-5 h-5" />} title="Hardware links shown are simulated">
          No hardware is being read. Link states below demonstrate the interface only.
        </Notice>
      ) : state.errorMessage ? (
        <Notice variant="warning" icon={<AlertTriangle className="w-5 h-5" />} title="Station status unknown">
          {state.errorMessage}
        </Notice>
      ) : null}

      {isStale && (
        <Notice variant="warning" icon={<AlertTriangle className="w-5 h-5" />} title={`Stale data${isDemo ? ' (simulated)' : ''}`}>
          No update for {secondsSinceLastHeartbeat}s (threshold {state.staleThresholdSeconds}s). Readings may not reflect the current state.
        </Notice>
      )}

      <section className="space-y-5">
        <h2 className="text-base font-bold text-[var(--color-text)] font-sans">Hardware links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NODES.map((n) => {
            const status = state.hardware[n.key];
            return (
              <div key={n.key} className="card-premium space-y-3">
                <span className="text-sm font-semibold text-[var(--color-text)] block">{n.name}</span>
                <span className="text-xs text-[var(--color-text-muted)] block">{n.role}</span>
                <DataBadge
                  kind={nodeKind(status)}
                  label={status === 'connected' ? 'Connected' : status === 'simulated' ? 'Simulated link' : n.offLabel}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-premium space-y-5">
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)] font-sans">Demo state controls</h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            {isDemo
              ? 'These controls change the simulated interface state only. They do not affect hardware.'
              : 'Available in demo mode only. Switch to Demo to test interface states.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={!isDemo} className={statusBtn(isDemo && state.operationalStatus === 'available')} onClick={() => simulateStateChange({ operationalStatus: 'available' })}>Available</button>
          <button type="button" disabled={!isDemo} className={statusBtn(isDemo && state.operationalStatus === 'charging')} onClick={() => simulateStateChange({ operationalStatus: 'charging' })}>Charging</button>
          <button type="button" disabled={!isDemo} className={statusBtn(isDemo && state.operationalStatus === 'offline')} onClick={() => simulateStateChange({ operationalStatus: 'offline' })}>Offline</button>
          <button type="button" disabled={!isDemo || simulatedStale} className={statusBtn(false)} onClick={simulateStale}>Simulate stale data</button>
          <button type="button" disabled={!isDemo || !simulatedStale} className={statusBtn(false)} onClick={refreshTelemetry}>Clear stale</button>
        </div>
      </section>

      {!isDemo && <LiveOperatorPanel />}

      {isDemo && (
      <section className="card-flat flex items-start gap-4">
        <ClipboardList className="w-5 h-5 text-[var(--color-text-muted)] mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-sm font-bold text-[var(--color-text)]">Session history</h3>
            <DataBadge kind="unavailable" label="Not implemented" />
          </div>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
            Past sessions need persistence, which is an open backend decision. Nothing is recorded yet.
          </p>
        </div>
      </section>
      )}
    </div>
  );
};
