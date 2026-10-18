import React from 'react';
import { User, ShieldCheck, AlertCircle } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

interface DemoRoleSwitcherProps {
  onRoleChange?: (role: 'user' | 'operator') => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onRoleChange }) => {
  const { role, setRole } = useRole();

  const handleSelectRole = (newRole: 'user' | 'operator') => {
    setRole(newRole);
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  return (
    <div className="w-full bg-[var(--color-surface)] border-b border-[var(--color-border)] py-2.5 transition-colors duration-200">
      <div className="app-container flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Descriptive Label with Academic Disclosure */}
        <div className="flex items-center space-x-2 text-xs text-[var(--color-text-secondary)]">
          <AlertCircle className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
          <span className="font-semibold text-[var(--color-text)]">
            Demo View Mode:
          </span>
          <span className="hidden md:inline text-[var(--color-text-muted)]">
            Simulation perspective switcher (not secure authentication or role-based access control)
          </span>
        </div>

        {/* Segmented Switcher Controls */}
        <div className="inline-flex p-1 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)] self-start sm:self-auto shadow-inner">
          <button
            type="button"
            onClick={() => handleSelectRole('user')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
              role === 'user'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
            aria-pressed={role === 'user'}
          >
            <User className="w-3.5 h-3.5" />
            <span>Driver / User View</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('operator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] ${
              role === 'operator'
                ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
            aria-pressed={role === 'operator'}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operator / Admin View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
