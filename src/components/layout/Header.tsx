import React from 'react';
import { Sun, Moon, Zap, Radio, Activity, BookOpen, UserRound, LogOut } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { useTheme } from '../../context/ThemeContext';
import { useStationData } from '../../context/StationDataContext';
import { StationStatusPill } from '../common/StationStatusPill';

interface HeaderProps {
  onOpenMethodology: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMethodology }) => {
  const { theme, toggleTheme } = useTheme();
  const { state, setDataSourceMode } = useStationData();
  const { signedIn, user, openSignIn, signOut } = useAccount();

  const segment = (active: boolean) =>
    `px-2.5 py-1.5 rounded-md font-medium transition-all ${
      active
        ? 'bg-[var(--color-primary)] text-white dark:text-[#0B1319] shadow-sm font-semibold'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
    }`;
  const iconBtn =
    'p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-[var(--color-border-glow)] transition-all shadow-sm';

  const toggle = (
          <div className="inline-flex p-0.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-xs" role="group" aria-label="Data source">
            <button type="button" onClick={() => setDataSourceMode('live')} aria-pressed={state.dataSourceMode === 'live'} title="Live data from the SolarSmart backend" className={segment(state.dataSourceMode === 'live')}>
              <span className="flex items-center gap-1.5"><Radio className="w-3 h-3" />Live</span>
            </button>
            <button type="button" onClick={() => setDataSourceMode('demo')} aria-pressed={state.dataSourceMode === 'demo'} title="Simulated demo data" className={segment(state.dataSourceMode === 'demo')}>
              <span className="flex items-center gap-1.5"><Activity className="w-3 h-3" />Demo</span>
            </button>
          </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[var(--color-surface-translucent)] border-b border-[var(--color-border)] transition-colors duration-200">
      <div className="app-container h-16 sm:h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A7B9B] via-[#57C785] to-[#EDDD53] flex items-center justify-center shadow-sm flex-shrink-0">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <span className="font-display text-xl text-[var(--color-text)] block">
              SolarSmart <span className="text-[var(--color-primary)]">EV</span>
            </span>
            <span className="hidden md:block text-xs text-[var(--color-text-muted)]">{state.stationName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <StationStatusPill className="hidden sm:inline-flex" />
          <div className="hidden sm:block">{toggle}</div>

          {signedIn ? (
            <button type="button" onClick={signOut} className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] pl-1.5 pr-1.5 md:pr-3 py-1.5 text-xs font-semibold text-[var(--color-text-secondary)] hover:border-[var(--color-border-glow)] shadow-sm" aria-label={`Sign out (${user.name})`} title="Sign out">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2A7B9B] to-[#57C785] text-white flex items-center justify-center text-[11px] font-bold">{user.initials}</span>
              <span className="hidden md:inline">{state.dataSourceMode === 'demo' ? 'Demo account' : user.name.split(' ')[0]}</span>
              <LogOut className="hidden md:block w-3.5 h-3.5" />
            </button>
          ) : (
            <button type="button" onClick={openSignIn} className={`${iconBtn} md:flex md:items-center md:gap-2 md:px-3.5 md:py-2 text-xs font-semibold`} aria-label="Sign in" title="Sign in">
              <UserRound className="w-5 h-5 md:w-4 md:h-4" />
              <span className="hidden md:inline">Sign in</span>
            </button>
          )}
          <button type="button" onClick={onOpenMethodology} className={iconBtn} aria-label="Open methodology" title="Methodology">
            <BookOpen className="w-5 h-5" />
          </button>
          <button type="button" onClick={toggleTheme} className={iconBtn} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} title="Toggle theme">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-[var(--primitive-lime)]" />}
          </button>
        </div>
      </div>
      <div className="sm:hidden app-container pb-3 flex items-center justify-between gap-3">
        <StationStatusPill />
        {toggle}
      </div>
    </header>
  );
};
