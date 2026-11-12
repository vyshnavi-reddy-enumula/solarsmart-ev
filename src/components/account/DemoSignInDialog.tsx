import React, { useRef, useState } from 'react';
import { X, UserRound } from 'lucide-react';
import { useAccount } from '../../context/AccountContext';
import { useStationData } from '../../context/StationDataContext';
import { useModal } from '../../hooks/useModal';
import { DataBadge } from '../common/DataBadge';

const inputCls =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3.5 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]';

const LiveForm: React.FC = () => {
  const { login, register, authBusy, authError, clearAuthError, closeSignIn } = useAccount();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void (tab === 'login' ? login(email, password) : register(name, email, password));
  };
  const tabBtn = (active: boolean) =>
    `flex-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${active ? 'bg-[var(--color-surface)] text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-text-muted)]'}`;

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="inline-flex w-full p-1 rounded-xl bg-[var(--color-surface-elevated)] border border-[var(--color-border)]" role="group" aria-label="Sign in or create account">
        <button type="button" className={tabBtn(tab === 'login')} aria-pressed={tab === 'login'} onClick={() => { setTab('login'); clearAuthError(); }}>Sign in</button>
        <button type="button" className={tabBtn(tab === 'register')} aria-pressed={tab === 'register'} onClick={() => { setTab('register'); clearAuthError(); }}>Create account</button>
      </div>

      {tab === 'register' && (
        <div className="space-y-1.5">
          <label htmlFor="acc-name" className="text-xs font-semibold text-[var(--color-text-secondary)]">Name</label>
          <input id="acc-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={80} />
        </div>
      )}
      <div className="space-y-1.5">
        <label htmlFor="acc-email" className="text-xs font-semibold text-[var(--color-text-secondary)]">Email</label>
        <input id="acc-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="acc-password" className="text-xs font-semibold text-[var(--color-text-secondary)]">Password {tab === 'register' && <span className="font-normal text-[var(--color-text-muted)]">(8 characters or more)</span>}</label>
        <input id="acc-password" type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={tab === 'login' ? 'current-password' : 'new-password'} required minLength={tab === 'register' ? 8 : 1} />
      </div>

      {authError && <p role="alert" className="text-sm text-[var(--color-danger,#C0392B)]">{authError}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="submit" disabled={authBusy} className="btn-primary flex-1 justify-center">
          {authBusy ? 'Please wait…' : tab === 'login' ? 'Sign in' : 'Create account'}
        </button>
        <button type="button" onClick={closeSignIn} className="btn-secondary justify-center">Cancel</button>
      </div>
    </form>
  );
};

export const DemoSignInDialog: React.FC = () => {
  const { signInOpen, closeSignIn, signIn, user } = useAccount();
  const { state } = useStationData();
  const isDemo = state.dataSourceMode === 'demo';
  const ref = useRef<HTMLDivElement>(null);
  useModal(signInOpen, closeSignIn, ref);
  if (!signInOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={closeSignIn} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="signin-title" className="drawer-panel relative w-full max-w-md rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        <button type="button" onClick={closeSignIn} aria-label="Close sign in" className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]">
          <X className="w-5 h-5" />
        </button>
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2A7B9B] via-[#57C785] to-[#EDDD53] flex items-center justify-center text-white">
            <UserRound className="w-7 h-7" />
          </div>
          <h2 id="signin-title" className="h2-fluid text-[var(--color-text)]">{isDemo ? 'Demo sign-in' : 'Account'}</h2>
          {isDemo ? (
            <>
              <DataBadge kind="simulated" label="Demo only" />
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                This opens a sample profile with a sample EV and charging history. There is no password and no account is created or stored anywhere.
              </p>
            </>
          ) : (
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Sign in to see your own charging sessions and link your RFID card. Your password is stored only as a salted hash.
            </p>
          )}
        </div>
        {isDemo ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={signIn} className="btn-primary flex-1 justify-center">Continue as {user.name}</button>
            <button type="button" onClick={closeSignIn} className="btn-secondary justify-center">Cancel</button>
          </div>
        ) : (
          <LiveForm />
        )}
      </div>
    </div>
  );
};
