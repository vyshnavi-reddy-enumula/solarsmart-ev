import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEMO_USER } from '../data/demoData';
import { useStationData } from './StationDataContext';
import { api, ApiCard, ApiError, ApiUser, getStoredToken, storeToken } from '../api/client';

const STORAGE_KEY = 'solarsmart-demo-account';

const initialsOf = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join('') || '?';

interface AccountContextType {
  /** Demo mode: the sample account flag. Live mode: a real signed-in backend account. */
  signedIn: boolean;
  user: { name: string; initials: string };
  /** Demo sign-in (no credentials). */
  signIn: () => void;
  signOut: () => void;
  signInOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;

  // Real account (live mode)
  apiUser: ApiUser | null;
  token: string | null;
  cards: ApiCard[];
  authBusy: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  linkCard: (cardUid: string, label?: string) => Promise<void>;
  refreshMe: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useStationData();
  const isDemo = state.dataSourceMode === 'demo';

  // Demo account: no credentials, no backend. It only toggles sample data on and off.
  const [demoSignedIn, setDemoSignedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [signInOpen, setSignInOpen] = useState(false);

  const persistDemo = (v: boolean) => {
    try {
      v ? localStorage.setItem(STORAGE_KEY, '1') : localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable: state stays in memory */
    }
  };

  // Real account
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [cards, setCards] = useState<ApiCard[]>([]);
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const dropAuth = useCallback(() => {
    storeToken(null);
    setToken(null);
    setApiUser(null);
    setCards([]);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return;
    try {
      const me = await api.me(token);
      setApiUser(me.user);
      setCards(me.cards);
    } catch (e) {
      // Only an explicit rejection signs the user out; a network blip keeps the session.
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) dropAuth();
    }
  }, [token, dropAuth]);

  // Restore a saved session when live mode is opened.
  useEffect(() => {
    if (!isDemo && token && !apiUser) void refreshMe();
  }, [isDemo, token, apiUser, refreshMe]);

  const authenticate = useCallback(async (run: () => Promise<{ token: string; user: ApiUser }>) => {
    setAuthBusy(true);
    setAuthError(null);
    try {
      const r = await run();
      storeToken(r.token);
      setToken(r.token);
      setApiUser(r.user);
      setSignInOpen(false);
      const me = await api.me(r.token).catch(() => null);
      if (me) setCards(me.cards);
    } catch (e) {
      setAuthError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setAuthBusy(false);
    }
  }, []);

  const login = useCallback((email: string, password: string) => authenticate(() => api.login(email, password)), [authenticate]);
  const register = useCallback(
    (name: string, email: string, password: string) => authenticate(() => api.register(name, email, password)),
    [authenticate]
  );

  const linkCard = useCallback(
    async (cardUid: string, label?: string) => {
      if (!token) throw new Error('Sign in first');
      await api.linkCard(token, cardUid, label);
      await refreshMe();
    },
    [token, refreshMe]
  );

  const signIn = useCallback(() => {
    setDemoSignedIn(true);
    persistDemo(true);
    setSignInOpen(false);
  }, []);

  const signOut = useCallback(() => {
    if (isDemo) {
      setDemoSignedIn(false);
      persistDemo(false);
    } else {
      dropAuth();
    }
  }, [isDemo, dropAuth]);

  const value = useMemo<AccountContextType>(
    () => ({
      signedIn: isDemo ? demoSignedIn : !!apiUser,
      user: isDemo || !apiUser ? DEMO_USER : { name: apiUser.name, initials: initialsOf(apiUser.name) },
      signIn,
      signOut,
      signInOpen,
      openSignIn: () => {
        setAuthError(null);
        setSignInOpen(true);
      },
      closeSignIn: () => setSignInOpen(false),
      apiUser,
      token,
      cards,
      authBusy,
      authError,
      clearAuthError: () => setAuthError(null),
      login,
      register,
      linkCard,
      refreshMe,
    }),
    [isDemo, demoSignedIn, apiUser, token, cards, authBusy, authError, signInOpen, signIn, signOut, login, register, linkCard, refreshMe]
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
};

export const useAccount = (): AccountContextType => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within an AccountProvider');
  return ctx;
};
