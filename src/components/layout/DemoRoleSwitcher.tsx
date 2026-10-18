import React from 'react';
import { User, ShieldCheck } from 'lucide-react';
import { useRole } from '../../context/RoleContext';

interface DemoRoleSwitcherProps {
  onRoleChange?: (role: 'user' | 'operator') => void;
}

export const DemoRoleSwitcher: React.FC<DemoRoleSwitcherProps> = ({ onRoleChange }) => {
  const { role, setRole } = useRole();

  const select = (next: 'user' | 'operator') => {
    setRole(next);
    onRoleChange?.(next);
  };

  const btn = (active: boolean) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
      active
        ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm'
        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
    }`;

  return (
    <div className="w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="app-container py-2.5 flex items-center justify-between gap-3">
        <span className="text-xs text-[var(--color-text-muted)]">
          <span className="font-semibold text-[var(--color-text)]">Demo view</span>
          <span className="hidden sm:inline"> · a perspective switch, not a login or access control</span>
          <span className="sm:hidden"> · not a login</span>
        </span>
        <div className="inline-flex p-1 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]" role="group" aria-label="Demo view">
          <button type="button" onClick={() => select('user')} aria-pressed={role === 'user'} className={btn(role === 'user')}>
            <User className="w-3.5 h-3.5" />
            <span>Driver</span>
          </button>
          <button type="button" onClick={() => select('operator')} aria-pressed={role === 'operator'} className={btn(role === 'operator')}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
