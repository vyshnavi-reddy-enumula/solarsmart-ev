import React from 'react';
import { Home, Car, MapPin, Zap, Settings2 } from 'lucide-react';
import { ActiveView, NAV_ITEMS } from '../../types/navigation';
import { useRole } from '../../context/RoleContext';

interface MagneticDockProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

const ICONS: Record<ActiveView, React.ReactNode> = {
  home: <Home className="w-5 h-5" />,
  'my-ev': <Car className="w-5 h-5" />,
  stations: <MapPin className="w-5 h-5" />,
  energy: <Zap className="w-5 h-5" />,
  manage: <Settings2 className="w-5 h-5" />,
};

export const MagneticDock: React.FC<MagneticDockProps> = ({ activeView, onNavigate }) => {
  const { isOperator } = useRole();
  const items = NAV_ITEMS.filter((i) => !i.operatorOnly || isOperator);

  return (
    <nav className="magnetic-dock-container" aria-label="Main navigation">
      <div className="magnetic-dock-shell">
        {items.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`magnetic-dock-item ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {ICONS[item.id]}
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
