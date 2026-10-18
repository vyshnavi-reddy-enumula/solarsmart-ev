import React from 'react';
import { ActiveView, NAV_ITEMS } from '../../types/navigation';
import { useStationData } from '../../context/StationDataContext';
import { useRole } from '../../context/RoleContext';

interface FooterProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
  onOpenMethodology: () => void;
}

export const Footer: React.FC<FooterProps> = ({ activeView, onNavigate, onOpenMethodology }) => {
  const { state } = useStationData();
  const { isOperator } = useRole();
  const items = NAV_ITEMS.filter((i) => !i.operatorOnly || isOperator);
  const link = (active: boolean) => `hover:text-[var(--color-primary)] transition-colors ${active ? 'font-bold text-[var(--color-primary)]' : ''}`;

  return (
    <footer className="w-full border-t border-[var(--color-border)] py-10 pb-36 sm:pb-28 text-xs text-[var(--color-text-muted)] bg-[var(--color-surface)]">
      <div className="app-container space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left space-y-1">
            <span className="font-display text-lg text-[var(--color-text)] block">SolarSmart EV</span>
            <span className="block">Scaled prototype with a toy vehicle. Not a commercial EV charger.</span>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {items.map((i) => (
              <button key={i.id} type="button" onClick={() => onNavigate(i.id)} className={link(activeView === i.id)}>
                {i.label}
              </button>
            ))}
            <button type="button" onClick={onOpenMethodology} className={link(false)}>Methodology</button>
          </nav>
        </div>
        <div className="pt-4 border-t border-[var(--color-border-subtle)]">
          Data source:{' '}
          <span className="font-semibold text-[var(--color-text-secondary)]">
            {state.dataSourceMode === 'demo' ? 'Simulated demo data' : 'Live mode: no data source connected'}
          </span>
        </div>
      </div>
    </footer>
  );
};
