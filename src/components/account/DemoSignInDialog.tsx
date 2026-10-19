import React, { useRef } from 'react';
import { X, UserRound } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { useModal } from '../../hooks/useModal';
import { DataBadge } from '../common/DataBadge';

export const DemoSignInDialog: React.FC = () => {
  const { signInOpen, closeSignIn, signIn, user } = useAccount();
  const ref = useRef<HTMLDivElement>(null);
  useModal(signInOpen, closeSignIn, ref);
  if (!signInOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={closeSignIn} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="signin-title" className="drawer-panel relative w-full max-w-md rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-7 space-y-6">
        <button type="button" onClick={closeSignIn} aria-label="Close sign in" className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]">
          <X className="w-5 h-5" />
        </button>
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A7B9B] via-[#57C785] to-[#EDDD53] flex items-center justify-center text-white">
            <UserRound className="w-7 h-7" />
          </div>
          <h2 id="signin-title" className="h2-fluid text-[var(--color-text)]">Demo sign-in</h2>
          <DataBadge kind="simulated" label="Demo only" />
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This opens a sample profile with a sample EV and charging history. There is no password and no account is created or stored anywhere.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={signIn} className="btn-primary flex-1 justify-center">
            Continue as {user.name}
          </button>
          <button type="button" onClick={closeSignIn} className="btn-secondary justify-center">Cancel</button>
        </div>
      </div>
    </div>
  );
};
