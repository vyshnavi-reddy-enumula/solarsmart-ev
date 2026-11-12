// Thin client for the SolarSmart backend (server/). In dev, Vite proxies /api to :3001.

const TOKEN_KEY = 'solarsmart-auth-token';

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'operator';
}

export interface ApiCard {
  ref: string;
  label: string | null;
  created_at: string;
}

export interface ApiSession {
  id: number;
  stationId: string;
  startedAt: string;
  endedAt: string | null;
  endReason: string | null;
  /** Derived from voltage x current samples, not a calibrated meter reading. */
  energyWh: number;
  energyKWh: number;
  peakPowerW: number;
  userName?: string; // present for operators only
}

export interface AdminSummary {
  last24h: { sessions: number; energyWh: number };
  allTime: { sessions: number; energyWh: number };
  perDay: { day: string; sessions: number; wh: number }[];
  note: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const storeToken = (token: string | null) => {
  try {
    token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable: token stays in memory only */
  }
};

async function request<T>(path: string, opts: { method?: string; body?: unknown; token?: string | null } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: opts.method ?? 'GET',
      headers: {
        ...(opts.body ? { 'content-type': 'application/json' } : {}),
        ...(opts.token ? { authorization: `Bearer ${opts.token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new ApiError('Cannot reach the backend. Is the server running?', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError((data as { error?: string }).error ?? `Request failed (${res.status})`, res.status);
  return data as T;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/api/auth/register', { method: 'POST', body: { name, email, password } }),
  me: (token: string) => request<{ user: ApiUser; cards: ApiCard[] }>('/api/me', { token }),
  linkCard: (token: string, cardUid: string, label?: string) =>
    request<{ ok: true }>('/api/cards', { method: 'POST', token, body: { cardUid, label } }),
  sessions: (token: string, limit = 50) => request<{ sessions: ApiSession[] }>(`/api/sessions?limit=${limit}`, { token }),
  adminSummary: (token: string) => request<AdminSummary>('/api/admin/summary', { token }),
};
