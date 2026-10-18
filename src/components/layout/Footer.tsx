import React from 'react';
import { ActiveView } from '../../types/navigation';
import { useStationData } from '../../context/StationDataContext';

interface FooterProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeView, onNavigate }) => {
  const { state } = useStationData();

  return (
    <footer className="w-full border-t border-[var(--color-border)] py-10 pb-36 sm:pb-28 text-xs text-[var(--color-text-muted)] transition-colors duration-200 bg-[var(--color-surface)]">
      <div className="app-container space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <span className="font-bold text-sm text-[var(--color-text)] block">
              SolarSmart EV — RFID-Enabled Smart Solar EV Charging & Monitoring Station
            </span>
            <span className="text-xs text-[var(--color-text-muted)] block">
              Design Thinking Course-Based Project • Scaled Prototype Demonstration
            </span>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[var(--color-primary)] transition-colors ${
                activeView === 'home' ? 'font-bold text-[var(--color-primary)]' : ''
              }`}
            >
              Home
            </button>
            <span className="text-[var(--color-border)]">•</span>
            <button
              onClick={() => onNavigate('user')}
              className={`hover:text-[var(--color-primary)] transition-colors ${
                activeView === 'user' ? 'font-bold text-[var(--color-primary)]' : ''
              }`}
            >
              User Dashboard
            </button>
            <span className="text-[var(--color-border)]">•</span>
            <button
              onClick={() => onNavigate('admin')}
              className={`hover:text-[var(--color-primary)] transition-colors ${
                activeView === 'admin' ? 'font-bold text-[var(--color-primary)]' : ''
              }`}
            >
              Admin Dashboard
            </button>
            <span className="text-[var(--color-border)]">•</span>
            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-[var(--color-primary)] transition-colors ${
                activeView === 'about' ? 'font-bold text-[var(--color-primary)]' : ''
              }`}
            >
              About Project
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            Data source:{' '}
            <span className="font-semibold text-[var(--color-text-secondary)] uppercase">
              {state.dataSourceMode === 'demo' ? 'Simulated demo data' : 'Live mode: no data source connected'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
