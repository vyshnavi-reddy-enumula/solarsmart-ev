import React from 'react';
import { ShieldCheck, Wifi, Cpu, AlertTriangle, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { useStationData } from '../context/StationDataContext';

export const AdminDashboardView: React.FC = () => {
  const { state, isStale, secondsSinceLastHeartbeat, simulateStateChange, refreshTelemetry } = useStationData();

  return (
    <div className="space-y-10">
      {/* Header & Station Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="h2-fluid text-[var(--color-text)]">
              Station Operator Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primitive-green)]/10 text-[var(--color-secondary)] border border-[var(--primitive-green)]/20">
              Station Health & Diagnostics
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Operational status, hardware link heartbeats, and data stream management for {state.stationName}.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={refreshTelemetry}
            className="btn-secondary text-xs py-2 px-3.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            <span>Heartbeat Ping</span>
          </button>
        </div>
      </div>

      {/* Freshness / Stale Data Alert if Stale Threshold Exceeded */}
      {isStale && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <span className="font-bold block">Stale Data Warning:</span>
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300/90">
              No packet received in the last {secondsSinceLastHeartbeat} seconds (exceeds {state.staleThresholdSeconds}s threshold). Readings may not reflect current physical status.
            </p>
          </div>
        </div>
      )}

      {/* Hardware Link Heartbeat Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--color-text)]">
            Hardware Link Status (Base 01)
          </h2>
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            4 Monitored Nodes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ESP32 Gateway */}
          <div className="card-premium space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                ESP32 Gateway
              </span>
              <Wifi className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <div className="flex items-center space-x-2 pt-1">
              {state.hardware.esp32Gateway ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />
                  <span className="text-sm font-bold text-[var(--color-text)]">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    Not Detected
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block">
              {state.dataSourceMode === 'demo' ? 'Simulated gateway link' : 'Awaiting physical link'}
            </span>
          </div>

          {/* Arduino UNO */}
          <div className="card-premium space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                Arduino UNO
              </span>
              <Cpu className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <div className="flex items-center space-x-2 pt-1">
              {state.hardware.arduinoLocal ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />
                  <span className="text-sm font-bold text-[var(--color-text)]">
                    Serial Active
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    Offline
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block">
              Local logic & state engine
            </span>
          </div>

          {/* RC522 RFID Reader */}
          <div className="card-premium space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                RC522 RFID
              </span>
              <ShieldCheck className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <div className="flex items-center space-x-2 pt-1">
              {state.hardware.rc522Reader ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />
                  <span className="text-sm font-bold text-[var(--color-text)]">
                    Ready
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    Not Ready
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block">
              Tag UID validation
            </span>
          </div>

          {/* INA219 Sensor */}
          <div className="card-premium space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-xs text-[var(--color-text-muted)] font-semibold uppercase tracking-wider">
                INA219 Power
              </span>
              <Cpu className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>
            <div className="flex items-center space-x-2 pt-1">
              {state.hardware.ina219Sensor ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-secondary)] flex-shrink-0" />
                  <span className="text-sm font-bold text-[var(--color-text)]">
                    I2C Ready
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    Offline
                  </span>
                </>
              )}
            </div>
            <span className="text-[11px] text-[var(--color-text-muted)] block">
              Voltage & current channel
            </span>
          </div>
        </div>
      </section>

      {/* Operator Diagnostics & State Testing Panel */}
      <section className="card-premium space-y-5">
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)]">
            Prototype Diagnostic Testing Controls
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Simulate prototype conditions to verify that the UI gracefully transitions across operational, stale, and disconnected states.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => simulateStateChange({ operationalStatus: 'available' })}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              state.operationalStatus === 'available'
                ? 'bg-[var(--primitive-green)]/15 text-[var(--color-secondary)] border-[var(--primitive-green)]/35 shadow-xs'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
            }`}
          >
            Station: Available
          </button>

          <button
            type="button"
            onClick={() => simulateStateChange({ operationalStatus: 'charging' })}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              state.operationalStatus === 'charging'
                ? 'bg-[var(--primitive-teal)]/15 text-[var(--color-primary)] border-[var(--primitive-teal)]/35 shadow-xs'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
            }`}
          >
            Station: Charging
          </button>

          <button
            type="button"
            onClick={() => simulateStateChange({ operationalStatus: 'offline' })}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              state.operationalStatus === 'offline'
                ? 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/35 shadow-xs'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
            }`}
          >
            Station: Offline
          </button>

          <button
            type="button"
            onClick={() =>
              simulateStateChange({
                lastHeartbeat: new Date(Date.now() - 15000), // 15s ago to trigger stale
              })
            }
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-all"
          >
            Trigger Stale Watchdog (&gt;10s)
          </button>
        </div>
      </section>

      {/* Milestone 4 Session History Shell Preview */}
      <section className="card-flat space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
            Recent Session Activity Log
          </h3>
          <span className="text-xs text-[var(--color-text-muted)] font-mono">
            Milestone 4 Target
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          The in-memory session logging table and CSV/JSON export actions will activate in Milestone 4, recording authenticated charging intervals, peak power measurements, and session termination events.
        </p>
      </section>
    </div>
  );
};
