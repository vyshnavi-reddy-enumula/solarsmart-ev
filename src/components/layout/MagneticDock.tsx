import React from 'react';
import { Home, UserCheck, Shield, BookOpen } from 'lucide-react';
import { ActiveView } from '../../types/navigation';
import { useRole } from '../../context/RoleContext';

interface MagneticDockProps {
  activeView: ActiveView;
  onNavigate: (view: ActiveView) => void;
}

interface DockItem {
  id: ActiveView;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  badge?: string;
}

export const MagneticDock: React.FC<MagneticDockProps> = ({ activeView, onNavigate }) => {
  const { isOperator } = useRole();

  const dockItems: DockItem[] = [
    {
      id: 'home',
      label: 'Home',
      shortLabel: 'Home',
      icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'user',
      label: 'User Dashboard',
      shortLabel: 'User',
      icon: <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: 'admin',
      label: 'Admin Dashboard',
      shortLabel: 'Admin',
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
      badge: isOperator ? 'Active Role' : undefined,
    },
    {
      id: 'about',
      label: 'About Project',
      shortLabel: 'About',
      icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  return (
    <nav
      className="magnetic-dock-container"
      role="navigation"
      aria-label="Main Application Navigation"
    >
      <div className="magnetic-dock-shell">
        {dockItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`magnetic-dock-item focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
                isActive ? 'active' : ''
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
              <span className="inline sm:hidden">{item.shortLabel}</span>

              {item.badge && !isActive && (
                <span
                  className="hidden md:inline-block w-2 h-2 rounded-full bg-[var(--primitive-lime)] animate-pulse"
                  title="Operator View Active"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
