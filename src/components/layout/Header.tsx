import React from 'react';
import { Sun, Moon, Zap, Radio, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useStationData } from '../../context/StationDataContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { state, setDataSourceMode } = useStationData();

  const getStatusBadge = () => {
    switch (state.operationalStatus) {
      case 'available':
        return {
          label: 'AVAILABLE',
          dotClass: 'bg-[var(--primitive-green)] animate-pulse',
          pillClass: 'status-pill-available',
        };
      case 'charging':
        return {
          label: 'CHARGING',
          dotClass: 'bg-[var(--primitive-teal)] animate-ping',
          pillClass: 'status-pill-charging',
        };
      case 'offline':
        return {
          label: 'OFFLINE',
          dotClass: 'bg-red-500',
          pillClass: 'status-pill-offline',
        };
      case 'unknown':
        return {
          label: 'STATUS UNKNOWN',
          dotClass: 'bg-[var(--color-status-idle)]',
          pillClass: 'status-pill-warning',
        };
      default:
        return {
          label: 'MAINTENANCE',
          dotClass: 'bg-amber-500',
          pillClass: 'status-pill-warning',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[var(--color-surface-translucent)] border-b border-[var(--color-border)] transition-colors duration-200">
      <div className="app-container h-20 flex items-center justify-between gap-4">
        {/* Brand & Station Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A7B9B] via-[#57C785] to-[#EDDD53] flex items-center justify-center shadow-sm flex-shrink-0">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-[var(--color-text)]">
                SolarSmart <span className="text-[var(--color-primary)]">EV</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                {state.stationName}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] hidden md:block">
              RFID-Enabled Smart Solar EV Charging & Monitoring Station
            </p>
          </div>
        </div>

        {/* Operational Status Pill & Controls */}
        <div className="flex items-center space-x-3">
          {/* Station Status Pill */}
          <div className={`hidden sm:inline-flex status-pill ${statusBadge.pillClass}`}>
            <span className={`w-2 h-2 rounded-full ${statusBadge.dotClass}`} />
            <span>{statusBadge.label}{state.dataSourceMode === 'demo' ? ' · SIMULATED' : ''}</span>
          </div>

          {/* Data Source Mode Toggle Pill (Live vs Demo) */}
          <div className="inline-flex p-0.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs">
            <button
              type="button"
              onClick={() => setDataSourceMode('live')}
              aria-pressed={state.dataSourceMode === 'live'}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                state.dataSourceMode === 'live'
                  ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              title="Live data: no source connected yet"
            >
              <span className="flex items-center space-x-1.5">
                <Radio className="w-3 h-3" />
                <span className="hidden sm:inline">Live Hardware</span>
                <span className="sm:hidden">Live</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDataSourceMode('demo')}
              aria-pressed={state.dataSourceMode === 'demo'}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                state.dataSourceMode === 'demo'
                  ? 'bg-[var(--color-primary)] text-white shadow-sm font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
              title="Switch to Deterministic Demo Simulation"
            >
              <span className="flex items-center space-x-1.5">
                <Activity className="w-3 h-3" />
                <span className="hidden sm:inline">Demo Mode</span>
                <span className="sm:hidden">Demo</span>
              </span>
            </button>
          </div>

          {/* Light/Dark Theme Switcher */}
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-border-glow)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] shadow-sm"
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 transition-transform duration-200 hover:-rotate-12" />
            ) : (
              <Sun className="w-5 h-5 transition-transform duration-200 hover:rotate-45 text-[var(--primitive-lime)]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
