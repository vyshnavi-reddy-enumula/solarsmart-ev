import React, { createContext, useCallback, useContext, useState } from 'react';
import { DEMO_USER } from '../data/demoData';

const STORAGE_KEY = 'solarsmart-demo-account';

interface AccountContextType {
  signedIn: boolean;
  user: typeof DEMO_USER;
  signIn: () => void;
  signOut: () => void;
  signInOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

/** Demo-only account state. No credentials, no backend: it just toggles sample data on and off. */
export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signedIn, setSignedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [signInOpen, setSignInOpen] = useState(false);

  const persist = (v: boolean) => {
    try {
      v ? localStorage.setItem(STORAGE_KEY, '1') : localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable: state stays in memory */
    }
  };

  const signIn = useCallback(() => {
    setSignedIn(true);
    persist(true);
    setSignInOpen(false);
  }, []);
  const signOut = useCallback(() => {
    setSignedIn(false);
    persist(false);
  }, []);

  return (
    <AccountContext.Provider
      value={{ signedIn, user: DEMO_USER, signIn, signOut, signInOpen, openSignIn: () => setSignInOpen(true), closeSignIn: () => setSignInOpen(false) }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within an AccountProvider');
  return ctx;
};
