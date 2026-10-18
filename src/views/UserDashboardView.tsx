import React from 'react';
import { Radio, Zap, Clock, ShieldAlert, Cpu, Activity, RefreshCw } from 'lucide-react';
import { useStationData } from '../context/StationDataContext';

export const UserDashboardView: React.FC = () => {
  const { state, refreshTelemetry } = useStationData();

  return (
    <div className="space-y-10">
      {/* Header & Station Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <h1 className="h2-fluid text-[var(--color-text)]">
              User Charging Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] border border-[var(--primitive-teal)]/20">
              {state.stationName}
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Real-time interface for RFID session authorization, duration tracking, and live electrical telemetry.
          </p>
        </div>

        {/* Data Stream Pill */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {state.dataSourceMode === 'demo' ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--primitive-lime)]/15 text-[#917B0E] dark:text-[var(--primitive-lime)] border border-[var(--primitive-lime)]/30">
              <Activity className="w-3.5 h-3.5" />
              <span>Simulated Demo Stream</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]">
              <Radio className="w-3.5 h-3.5" />
              <span>Live Telemetry Channel</span>
            </span>
          )}
        </div>
      </div>

      {/* Hardware Status Alert Banner if in Live Mode without physical link */}
      {state.dataSourceMode === 'live' && state.connectionStatus === 'unavailable' && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <span className="font-bold block">Hardware Link Notice:</span>
            <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-300/90">
              Physical ESP32 gateway telemetry is not yet connected. When the microcontroller begins broadcasting sensor packets, live voltage and current will appear here automatically.
            </p>
          </div>
        </div>
      )}

      {/* Core Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: RFID & Session State Container (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* RFID Status Card */}
          <div className="card-premium space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                RFID Access Point
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--primitive-green)] animate-pulse" />
            </div>

            <div className="p-8 rounded-xl bg-[var(--color-surface-elevated)] border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-[var(--primitive-teal)]/10 text-[var(--color-primary)] flex items-center justify-center shadow-xs">
                <Radio className="w-8 h-8" />
              </div>
              <div>
                <span className="text-sm font-bold text-[var(--color-text)] block">
                  RC522 RFID Reader Ready
                </span>
                <span className="text-xs text-[var(--color-text-muted)] mt-1 block">
                  Tap authorized prototype card/tag to initiate session
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[var(--color-text-muted)] bg-[var(--color-surface-elevated)] p-3.5 rounded-xl border border-[var(--color-border-subtle)] leading-relaxed">
              <strong className="text-[var(--color-text)]">Measurement Rule:</strong> RFID identifies user authorization. It does not measure or report battery state of charge (SoC).
            </div>
          </div>

          {/* Session Timer Shell */}
          <div className="card-premium space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
              <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                Session Duration
              </span>
              <Clock className="w-4 h-4 text-[var(--color-text-muted)]" />
            </div>

            <div className="font-tabular text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] tracking-widest text-center py-4 bg-[var(--color-surface-elevated)] rounded-xl border border-[var(--color-border)]">
              00:00:00
            </div>

            <p className="text-xs text-center text-[var(--color-text-muted)]">
              Timer initiates automatically upon valid RFID authorization.
            </p>
          </div>
        </div>

        {/* Right Columns: Telemetry Grid Shell (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card-premium space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--color-border-subtle)]">
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">
                  Electrical Telemetry & Sensors
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                  INA219 sensor channel monitoring the wireless receiver coil rail
                </p>
              </div>

              <button
                type="button"
                onClick={refreshTelemetry}
                className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] transition-all flex items-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Feed</span>
              </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Voltage Card */}
              <div className="card-flat space-y-2">
                <span className="text-xs text-[var(--color-text-muted)] font-medium block">
                  Voltage (V)
                </span>
                <div className="font-tabular text-2xl font-bold text-[var(--color-text)]">
                  {state.dataSourceMode === 'demo' ? '4.92 V' : '—'}
                </div>
                <span className="text-[11px] text-[var(--color-text-muted)] block">
                  {state.dataSourceMode === 'demo' ? 'Simulated rail' : 'Awaiting sensor'}
                </span>
              </div>

              {/* Current Card */}
              <div className="card-flat space-y-2">
                <span className="text-xs text-[var(--color-text-muted)] font-medium block">
                  Current (mA)
                </span>
                <div className="font-tabular text-2xl font-bold text-[var(--color-text)]">
                  {state.dataSourceMode === 'demo' ? '380 mA' : '—'}
                </div>
                <span className="text-[11px] text-[var(--color-text-muted)] block">
                  {state.dataSourceMode === 'demo' ? 'Simulated load' : 'Awaiting sensor'}
                </span>
              </div>

              {/* Power Card */}
              <div className="card-flat space-y-2">
                <span className="text-xs text-[var(--color-text-muted)] font-medium block">
                  Derived Power (W)
                </span>
                <div className="font-tabular text-2xl font-bold text-[var(--color-primary)]">
                  {state.dataSourceMode === 'demo' ? '1.87 W' : '—'}
                </div>
                <span className="text-[11px] text-[var(--color-text-muted)] block">
                  P = V × I (Derived)
                </span>
              </div>
            </div>

            {/* Vehicle Presence Sensor Row */}
            <div className="card-flat flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-secondary)] border border-[var(--color-border)] shadow-xs">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-[var(--color-text)] block">
                    Vehicle Positioning Alignment
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">
                    Toy electric vehicle alignment above wireless primary coil
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[var(--color-surface)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                {state.dataSourceMode === 'demo' ? 'Vehicle Present ●' : 'Sensor Uninstalled'}
              </span>
            </div>

            {/* Milestone 3 Engine Road-map Note */}
            <div className="pt-3 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border-subtle)] flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
              <span>
                <strong>Milestone 3 Roadmap:</strong> Interactive card tap visualizer, session lifecycle state transitions, and digital receipt modal will activate in the next release.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
