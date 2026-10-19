/**
 * Single demo dataset used across the app.
 * EVERYTHING in this file is fictional and illustrative: stations are not real businesses,
 * and availability, distances, speeds, prices and sessions are sample values.
 */

export type ConnectorType = 'CCS2' | 'Type 2';
export type AreaId = 'bachupally' | 'kphb' | 'pragathi-nagar' | 'jntu' | 'miyapur';
export type AvailabilityStatus = 'available' | 'limited' | 'full';
export type SpeedTier = 'standard' | 'fast' | 'rapid';

export const DEMO_DATA_LABEL = 'Demo data — not live station information';

/** Approximate neighbourhood centres (Hyderabad, Telangana). Pins are offset, fictional positions. */
export const AREAS: Record<AreaId, { name: string; lat: number; lng: number }> = {
  miyapur: { name: 'Miyapur', lat: 17.4968, lng: 78.3614 },
  bachupally: { name: 'Bachupally', lat: 17.5446, lng: 78.3646 },
  kphb: { name: 'KPHB', lat: 17.4948, lng: 78.3996 },
  'pragathi-nagar': { name: 'Pragathi Nagar', lat: 17.516, lng: 78.386 },
  jntu: { name: 'JNTU', lat: 17.4933, lng: 78.3914 },
};

export const CONNECTOR_INFO: Record<ConnectorType, { kind: string; pricePerKwh: number }> = {
  CCS2: { kind: 'DC fast charging', pricePerKwh: 22 }, // illustrative INR per kWh
  'Type 2': { kind: 'AC charging', pricePerKwh: 16 }, // illustrative INR per kWh
};

export interface DemoStation {
  id: string;
  name: string;
  area: AreaId;
  connectors: ConnectorType[];
  total: number;
  available: number;
  distanceKm: number; // illustrative
  maxKw: number; // illustrative top speed
  lat: number;
  lng: number;
}

export const DEMO_STATIONS: DemoStation[] = [
  { id: 'voltnest', name: 'VoltNest Charging Hub', area: 'miyapur', connectors: ['CCS2', 'Type 2'], total: 4, available: 3, distanceKm: 1.2, maxKw: 30, lat: 17.4985, lng: 78.3585 },
  { id: 'greenspark', name: 'GreenSpark EV Point', area: 'bachupally', connectors: ['CCS2'], total: 3, available: 2, distanceKm: 2.4, maxKw: 30, lat: 17.547, lng: 78.361 },
  { id: 'chargeloop', name: 'ChargeLoop Central', area: 'kphb', connectors: ['CCS2', 'Type 2'], total: 4, available: 1, distanceKm: 3.1, maxKw: 60, lat: 17.4965, lng: 78.401 },
  { id: 'sunroute', name: 'SunRoute Charge Park', area: 'pragathi-nagar', connectors: ['Type 2'], total: 2, available: 2, distanceKm: 3.8, maxKw: 7.4, lat: 17.5175, lng: 78.384 },
  { id: 'emotion', name: 'E-Motion Charging Plaza', area: 'jntu', connectors: ['CCS2', 'Type 2'], total: 5, available: 2, distanceKm: 4.5, maxKw: 60, lat: 17.4912, lng: 78.3938 },
  { id: 'bluevolt', name: 'BlueVolt Express', area: 'miyapur', connectors: ['CCS2'], total: 3, available: 1, distanceKm: 5.2, maxKw: 30, lat: 17.4935, lng: 78.3662 },
  { id: 'greenlane', name: 'GreenLane EV Stop', area: 'bachupally', connectors: ['Type 2'], total: 3, available: 2, distanceKm: 5.8, maxKw: 7.4, lat: 17.541, lng: 78.369 },
];

export const stationById = (id: string) => DEMO_STATIONS.find((s) => s.id === id);

export const availabilityStatus = (s: Pick<DemoStation, 'available'>): AvailabilityStatus =>
  s.available === 0 ? 'full' : s.available === 1 ? 'limited' : 'available';

export const STATUS_LABEL: Record<AvailabilityStatus, string> = {
  available: 'Available',
  limited: 'Limited',
  full: 'Full',
};

export const speedTier = (kw: number): SpeedTier => (kw >= 60 ? 'rapid' : kw >= 30 ? 'fast' : 'standard');
export const SPEED_LABEL: Record<SpeedTier, string> = {
  standard: 'Standard (7.4 kW)',
  fast: 'Fast (30 kW)',
  rapid: 'Rapid (60 kW)',
};

/** Rate used for a connector at a station (illustrative). */
export const connectorKw = (s: DemoStation, c: ConnectorType) => (c === 'CCS2' ? s.maxKw : 7.4);

// ---------- Demo account ----------
export const DEMO_USER = { name: 'Demo Driver', initials: 'DD' };

export const DEMO_VEHICLE = {
  name: 'Nova S1',
  description: 'Sample EV (fictional model)',
  connector: 'CCS2' as ConnectorType,
  batteryKWh: 40,
};

/** Simulated in-progress session. Shown only with a "Simulated" label. */
export const SAMPLE_SESSION = {
  stationId: 'voltnest',
  batteryPercent: 68,
  energyKWh: 14.2,
  minutes: 38,
};

interface RawSession {
  id: string;
  stationId: string;
  connector: ConnectorType;
  kWh: number;
  minutes: number;
  daysAgo: number;
  start: string;
}

const RAW_SESSIONS: RawSession[] = [
  { id: 's1', stationId: 'voltnest', connector: 'CCS2', kWh: 18.4, minutes: 52, daysAgo: 1, start: '18:20' },
  { id: 's2', stationId: 'chargeloop', connector: 'CCS2', kWh: 9.6, minutes: 31, daysAgo: 2, start: '09:05' },
  { id: 's3', stationId: 'greenspark', connector: 'CCS2', kWh: 22.1, minutes: 64, daysAgo: 4, start: '19:40' },
  { id: 's4', stationId: 'emotion', connector: 'CCS2', kWh: 12.8, minutes: 38, daysAgo: 5, start: '13:15' },
  { id: 's5', stationId: 'bluevolt', connector: 'CCS2', kWh: 7.2, minutes: 24, daysAgo: 8, start: '08:30' },
];

export interface DemoSession extends RawSession {
  stationName: string;
  areaName: string;
  date: Date;
  cost: number; // illustrative INR
}

export const getSessions = (): DemoSession[] =>
  RAW_SESSIONS.map((r) => {
    const st = stationById(r.stationId)!;
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - r.daysAgo);
    return {
      ...r,
      stationName: st.name,
      areaName: AREAS[st.area].name,
      date,
      cost: Math.round(r.kWh * CONNECTOR_INFO[r.connector].pricePerKwh),
    };
  });

/** Energy per day for the last 7 days, derived from the same session list. */
export const weeklyEnergy = (sessions: DemoSession[]) => {
  const out: { label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const value = sessions
      .filter((s) => s.date.getTime() === d.getTime())
      .reduce((sum, s) => sum + s.kWh, 0);
    out.push({ label: d.toLocaleDateString('en-IN', { weekday: 'short' }), value: Number(value.toFixed(1)) });
  }
  return out;
};

export const weeklyTotals = (sessions: DemoSession[]) => {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - 6);
  const week = sessions.filter((s) => s.date >= cutoff);
  const kWh = week.reduce((a, s) => a + s.kWh, 0);
  const cost = week.reduce((a, s) => a + s.cost, 0);
  return { sessions: week.length, kWh: Number(kWh.toFixed(1)), cost, avgKWh: week.length ? Number((kWh / week.length).toFixed(1)) : 0 };
};

export const formatInr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
