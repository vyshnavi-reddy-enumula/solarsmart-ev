import express from 'express';
import cors from 'cors';
import { db } from './db.js';
import {
  hashPassword, verifyPassword, hashCardUid, makeToken,
  requireUser, requireOperator, requireDevice, rateLimit,
} from './auth.js';

const PORT = Number(process.env.PORT || 3001);
const STATION_ID = 'base-01';
const STALE_SECONDS = 10;          // matches the approved spec used by the frontend
const SESSION_TIMEOUT_SECONDS = 120; // auto-close a session if telemetry stops this long
const MAX_GAP_SECONDS = 30;        // never integrate energy across a longer gap

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',') }));

const now = () => new Date().toISOString();
const secondsSince = (iso) => (iso ? (Date.now() - new Date(iso).getTime()) / 1000 : null);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const triState = (v) => (v === true ? 1 : v === false ? 0 : null);
const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email, role: u.role });

// ---------------------------------------------------------------- seed operator
// Operator accounts are created only here (from env), never through public registration.
const seedOperator = () => {
  const email = process.env.OPERATOR_EMAIL || 'operator@solarsmart.local';
  if (process.env.NODE_ENV === 'production' && !process.env.OPERATOR_PASSWORD) {
    throw new Error('OPERATOR_PASSWORD must be set in production');
  }
  const password = process.env.OPERATOR_PASSWORD || 'operator-dev-password';
  if (!process.env.OPERATOR_PASSWORD) console.warn('[warn] OPERATOR_PASSWORD not set, using an insecure dev default');
  if (!db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) {
    db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
      .run('Station Operator', email, hashPassword(password), 'operator');
    console.log(`Seeded operator account: ${email}`);
  }
};
seedOperator();

// ---------------------------------------------------------------- sessions
const activeSession = () =>
  db.prepare('SELECT * FROM sessions WHERE station_id = ? AND ended_at IS NULL ORDER BY id DESC LIMIT 1').get(STATION_ID);

const endSession = (id, reason, at = now()) =>
  db.prepare('UPDATE sessions SET ended_at = ?, end_reason = ? WHERE id = ? AND ended_at IS NULL').run(at, reason, id);

// Close a session whose telemetry went silent (device unplugged, Wi-Fi lost).
const closeTimedOutSession = () => {
  const s = activeSession();
  if (!s) return;
  const hb = db.prepare('SELECT last_seen FROM station_heartbeat WHERE station_id = ?').get(STATION_ID);
  const age = secondsSince(hb?.last_seen ?? s.started_at);
  if (age > SESSION_TIMEOUT_SECONDS) endSession(s.id, 'timeout', hb?.last_seen ?? s.started_at);
};

// ---------------------------------------------------------------- health
app.get('/api/health', (_req, res) => res.json({ ok: true, time: now() }));

// ---------------------------------------------------------------- auth
const authLimiter = rateLimit(10, 60_000);

app.post('/api/auth/register', authLimiter, (req, res) => {
  const { name, email, password } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.length > 80) return res.status(400).json({ error: 'Name is required' });
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || email.length > 120) return res.status(400).json({ error: 'Valid email is required' });
  if (typeof password !== 'string' || password.length < 8 || password.length > 100) return res.status(400).json({ error: 'Password must be 8-100 characters' });
  try {
    const info = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)')
      .run(name.trim(), email.trim().toLowerCase(), hashPassword(password));
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered' });
    throw e;
  }
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body || {};
  const user = typeof email === 'string' ? db.prepare('SELECT * FROM users WHERE email = ?').get(email.trim().toLowerCase()) : null;
  if (!user || typeof password !== 'string' || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }
  res.json({ token: makeToken(user), user: publicUser(user) });
});

app.get('/api/me', requireUser, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.auth.userId);
  if (!user) return res.status(401).json({ error: 'Account no longer exists' });
  const cards = db.prepare('SELECT substr(uid_hash,1,8) AS ref, label, created_at FROM cards WHERE user_id = ?').all(user.id);
  res.json({ user: publicUser(user), cards });
});

// Link an RFID card to the signed-in user.
app.post('/api/cards', requireUser, (req, res) => {
  const { cardUid, label } = req.body || {};
  if (typeof cardUid !== 'string' || !/^[0-9A-Fa-f:\- ]{4,32}$/.test(cardUid)) return res.status(400).json({ error: 'cardUid must be a hex UID, e.g. "04:A3:5B:1C"' });
  try {
    db.prepare('INSERT INTO cards (uid_hash, user_id, label) VALUES (?,?,?)')
      .run(hashCardUid(cardUid), req.auth.userId, typeof label === 'string' ? label.slice(0, 40) : null);
    res.status(201).json({ ok: true });
  } catch (e) {
    if (String(e.message).includes('UNIQUE') || String(e.message).includes('PRIMARY')) return res.status(409).json({ error: 'Card already linked' });
    throw e;
  }
});

// ---------------------------------------------------------------- device endpoints (ESP32)
// Body: { voltage: V, current: mA, vehicleDetected?: bool, solarActive?: bool,
//         hardware?: { arduino?: bool, ina219?: bool, rc522?: bool, irVehicle?: bool } }
app.post('/api/telemetry', requireDevice, (req, res) => {
  const { voltage, current, vehicleDetected, solarActive, hardware } = req.body || {};
  if (!isNum(voltage) || voltage < 0 || voltage > 32) return res.status(400).json({ error: 'voltage must be a number in volts, 0-32' });
  if (!isNum(current) || current < -3200 || current > 3200) return res.status(400).json({ error: 'current must be a number in mA, -3200 to 3200' });

  const ts = now();
  const power = Number(((voltage * current) / 1000).toFixed(3)); // derived P = V x I
  closeTimedOutSession();
  const s = activeSession();

  const tx = db.transaction(() => {
    if (s) {
      const prev = db.prepare('SELECT ts FROM readings WHERE session_id = ? ORDER BY id DESC LIMIT 1').get(s.id);
      const gap = Math.min(secondsSince(prev?.ts ?? s.started_at) ?? 0, MAX_GAP_SECONDS);
      const addWh = (Math.max(power, 0) * gap) / 3600;
      db.prepare('UPDATE sessions SET energy_wh = energy_wh + ?, peak_power_w = MAX(peak_power_w, ?) WHERE id = ?').run(addWh, power, s.id);
    }
    db.prepare(`INSERT INTO readings (station_id, voltage_v, current_ma, power_w, vehicle_detected, solar_active, session_id, ts)
                VALUES (?,?,?,?,?,?,?,?)`)
      .run(STATION_ID, voltage, current, power, triState(vehicleDetected), triState(solarActive), s?.id ?? null, ts);
    // Hardware flags persist until the device reports new ones, so a reading that omits them
    // does not flip every part to "unavailable".
    const prevHw = db.prepare('SELECT hardware_json FROM station_heartbeat WHERE station_id = ?').get(STATION_ID);
    const hwJson = hardware && typeof hardware === 'object' && !Array.isArray(hardware)
      ? JSON.stringify(hardware)
      : prevHw?.hardware_json ?? '{}';
    db.prepare(`INSERT INTO station_heartbeat (station_id, last_seen, hardware_json) VALUES (?,?,?)
                ON CONFLICT(station_id) DO UPDATE SET last_seen = excluded.last_seen, hardware_json = excluded.hardware_json`)
      .run(STATION_ID, ts, hwJson);
    // Keep the table small for a long-running demo: drop readings older than 7 days.
    db.prepare("DELETE FROM readings WHERE ts < datetime('now','-7 days')").run();
  });
  tx();
  res.status(201).json({ ok: true, power });
});

// RFID scan: first scan of a registered card starts a session, scanning again ends it.
app.post('/api/scan', requireDevice, (req, res) => {
  const { cardUid } = req.body || {};
  if (typeof cardUid !== 'string' || !/^[0-9A-Fa-f:\- ]{4,32}$/.test(cardUid)) return res.status(400).json({ error: 'cardUid required' });
  closeTimedOutSession();
  const card = db.prepare('SELECT user_id FROM cards WHERE uid_hash = ?').get(hashCardUid(cardUid));
  if (!card) return res.json({ authorized: false, action: 'denied' });

  const open = activeSession();
  if (open) {
    if (open.user_id !== card.user_id) return res.json({ authorized: false, action: 'denied', reason: 'station in use' });
    endSession(open.id, 'card');
    return res.json({ authorized: true, action: 'ended', sessionId: open.id });
  }
  const info = db.prepare('INSERT INTO sessions (station_id, user_id, started_at) VALUES (?,?,?)').run(STATION_ID, card.user_id, now());
  res.status(201).json({ authorized: true, action: 'started', sessionId: info.lastInsertRowid });
});

// ---------------------------------------------------------------- station state (public)
// Shaped like the frontend's StationDataState so it can be dropped straight in.
app.get('/api/station/:id', (req, res) => {
  if (req.params.id !== STATION_ID) return res.status(404).json({ error: 'Unknown station' });
  closeTimedOutSession();

  const hb = db.prepare('SELECT * FROM station_heartbeat WHERE station_id = ?').get(STATION_ID);
  const last = db.prepare('SELECT * FROM readings WHERE station_id = ? ORDER BY id DESC LIMIT 1').get(STATION_ID);
  const age = secondsSince(hb?.last_seen);
  const fresh = age !== null && age < STALE_SECONDS;
  const connectionStatus = !hb ? 'unavailable' : fresh ? 'connected' : 'stale';
  const reported = hb ? JSON.parse(hb.hardware_json) : {};
  // 'connected' only while data is actually arriving AND the device reports that part healthy.
  const link = (flag) => (fresh && flag === true ? 'connected' : 'unavailable');
  const session = activeSession();

  res.json({
    stationId: STATION_ID,
    stationName: 'SolarSmart Base 01',
    operationalStatus: !hb || !fresh ? 'unknown' : session ? 'charging' : 'available',
    dataSourceMode: 'live',
    connectionStatus,
    hardware: {
      esp32Gateway: fresh ? 'connected' : 'unavailable',
      arduinoLocal: link(reported.arduino),
      ina219Sensor: link(reported.ina219),
      rc522Reader: link(reported.rc522),
      irVehicleSensor: link(reported.irVehicle),
    },
    latestReadings: last
      ? {
          voltage: last.voltage_v,
          current: last.current_ma,
          power: last.power_w,
          vehicleDetected: last.vehicle_detected === null ? null : !!last.vehicle_detected,
          solarActive: last.solar_active === null ? null : !!last.solar_active,
          timestamp: last.ts,
        }
      : { voltage: null, current: null, power: null, vehicleDetected: null, solarActive: null, timestamp: null },
    lastHeartbeat: hb?.last_seen ?? null,
    secondsSinceHeartbeat: age === null ? null : Math.floor(age),
    staleThresholdSeconds: STALE_SECONDS,
    activeSession: session
      ? { id: session.id, startedAt: session.started_at, energyWh: Number(session.energy_wh.toFixed(4)) }
      : null,
    serverTime: now(),
  });
});

// ---------------------------------------------------------------- sessions & admin
const mapSession = (s) => ({
  id: s.id,
  stationId: s.station_id,
  startedAt: s.started_at,
  endedAt: s.ended_at,
  endReason: s.end_reason,
  energyWh: Number(s.energy_wh.toFixed(4)),             // derived from V x I, not a metered value
  energyKWh: Number((s.energy_wh / 1000).toFixed(7)),
  peakPowerW: s.peak_power_w,
  ...(s.user_name ? { userName: s.user_name } : {}),
});

app.get('/api/sessions', requireUser, (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  const rows = req.auth.role === 'operator'
    ? db.prepare('SELECT s.*, u.name AS user_name FROM sessions s JOIN users u ON u.id = s.user_id ORDER BY s.id DESC LIMIT ?').all(limit)
    : db.prepare('SELECT * FROM sessions WHERE user_id = ? ORDER BY id DESC LIMIT ?').all(req.auth.userId, limit);
  res.json({ sessions: rows.map(mapSession) });
});

// Aggregates only: no card IDs or personal data go to the operator dashboard.
app.get('/api/admin/summary', requireOperator, (_req, res) => {
  const day = db.prepare("SELECT COUNT(*) AS n, COALESCE(SUM(energy_wh),0) AS wh FROM sessions WHERE started_at >= datetime('now','-1 day')").get();
  const all = db.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(energy_wh),0) AS wh FROM sessions').get();
  const perDay = db.prepare(`SELECT date(started_at) AS day, COUNT(*) AS sessions, ROUND(SUM(energy_wh), 4) AS wh
                             FROM sessions WHERE started_at >= datetime('now','-7 days') GROUP BY day ORDER BY day`).all();
  res.json({
    last24h: { sessions: day.n, energyWh: Number(day.wh.toFixed(4)) },
    allTime: { sessions: all.n, energyWh: Number(all.wh.toFixed(4)) },
    perDay,
    note: 'Energy is derived from voltage x current samples, not a calibrated meter.',
  });
});

// ---------------------------------------------------------------- errors
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, _req, res, _next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

export { app };
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  app.listen(PORT, () => console.log(`SolarSmart API listening on http://localhost:${PORT}`));
}
