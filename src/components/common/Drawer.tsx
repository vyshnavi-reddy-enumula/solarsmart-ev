import React, { useRef } from 'react';
import { X } from 'lucide-react';
import { useModal } from '../../hooks/useModal';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  useModal(open, onClose, ref);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className="drawer-panel absolute right-0 top-0 h-full w-full sm:w-[30rem] overflow-y-auto bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-[var(--shadow-lg)]">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
          <span className="text-sm font-bold text-[var(--color-text)]">{title}</span>
          <button type="button" onClick={onClose} aria-label="Close details" className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-6">{children}</div>
      </div>
    </div>
  );
};
