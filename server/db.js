import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const db = new Database(process.env.DB_FILE || path.join(here, 'solarsmart.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','operator')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Only a salted hash of the RFID UID is stored, never the raw UID.
CREATE TABLE IF NOT EXISTS cards (
  uid_hash TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id TEXT NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id),
  started_at TEXT NOT NULL,
  ended_at TEXT,
  end_reason TEXT,
  energy_wh REAL NOT NULL DEFAULT 0,   -- derived: integral of V x I over time
  peak_power_w REAL NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, started_at);

CREATE TABLE IF NOT EXISTS readings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  station_id TEXT NOT NULL,
  voltage_v REAL NOT NULL,
  current_ma REAL NOT NULL,
  power_w REAL NOT NULL,               -- derived: V x I / 1000
  vehicle_detected INTEGER,            -- NULL = no sensor
  solar_active INTEGER,                -- NULL = no sensor
  session_id INTEGER REFERENCES sessions(id),
  ts TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_readings_station_ts ON readings(station_id, ts);

CREATE TABLE IF NOT EXISTS station_heartbeat (
  station_id TEXT PRIMARY KEY,
  last_seen TEXT NOT NULL,
  hardware_json TEXT NOT NULL DEFAULT '{}'
);
`);
