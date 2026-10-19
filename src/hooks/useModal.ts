import { RefObject, useEffect } from 'react';

/** Escape to close, Tab focus trap, body scroll lock, and focus restore for dialogs and drawers. */
export const useModal = (open: boolean, onClose: () => void, panelRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      panelRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), [href], input, select, [tabindex]:not([tabindex="-1"])') ?? [];
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open, onClose, panelRef]);
};
