# SolarSmart EV backend

Node + Express + SQLite. It sits behind the teammate's React frontend and receives data from the ESP32.

## Run it

```bash
# terminal 1: backend
cd server
npm install
npm start                # http://localhost:3001

# terminal 2: frontend (project root)
npm install
npm run dev              # http://localhost:5173, /api is proxied to :3001

# terminal 3 (optional): fake hardware, no ESP32 needed
cd server
npm run simulate
```

In the app header, switch from **Demo** to **Live**. With the simulator running the badges show
"Live". Stop the simulator and after 10 s the data shows as stale, then the status falls to unknown.

`npm test` (inside `server/`) runs an end-to-end check on a temporary in-memory database.

## API

| Method | Path | Who | Purpose |
|---|---|---|---|
| POST | `/api/telemetry` | ESP32 (`x-device-key`) | `{ voltage (V), current (mA), vehicleDetected?, solarActive?, hardware?: { arduino, ina219, rc522, irVehicle } }` |
| POST | `/api/scan` | ESP32 (`x-device-key`) | `{ cardUid }`. A registered card starts a session; the same card again ends it |
| GET | `/api/station/base-01` | public | Station state, shaped like the frontend's `StationDataState` |
| POST | `/api/auth/register`, `/api/auth/login` | public | Returns a bearer token |
| GET | `/api/me` | user | Profile and linked cards (hash reference only) |
| POST | `/api/cards` | user | Link an RFID card: `{ cardUid, label? }` |
| GET | `/api/sessions` | user / operator | Own sessions (operator sees all). Energy as `energyWh` (precise) and `energyKWh` |
| GET | `/api/admin/summary` | operator only | Aggregated sessions and energy, no personal data |

## ESP32 side

Send every 3-5 s (the frontend marks data stale after 10 s):

```
POST http://<server-ip>:3001/api/telemetry
x-device-key: <DEVICE_KEY>
Content-Type: application/json

{"voltage": 4.92, "current": 380, "hardware": {"ina219": true, "rc522": true, "arduino": true}}
```

Only report a part as `true` when it is really working; the dashboard shows "Connected" only for those.
Leave out `vehicleDetected` and `solarActive` unless a real sensor exists; they stay "unknown".

## Honest-data rules built in

- No data, or data older than 10 s, is never shown as connected. The API says `unavailable` or `stale`.
- Power is always derived (V x I). Session energy is an integral of those samples, so it is an estimate, not a calibrated meter reading. Say so in the report.
- Raw RFID UIDs are never stored, only a salted SHA-256 hash.
- Operator access is enforced on the server (the frontend role switcher is only a UI toggle). Operator accounts come from `OPERATOR_EMAIL` / `OPERATOR_PASSWORD`, never from public sign-up.

## Real deployment

Set `NODE_ENV=production`, `TOKEN_SECRET`, `DEVICE_KEY`, `CARD_PEPPER` and `OPERATOR_PASSWORD`. The server refuses to start in production without the first three. In dev it falls back to insecure defaults and warns.

## How the frontend uses it

- **Demo mode** (header toggle) is unchanged: sample account, sample sessions, no backend calls.
- **Live mode** uses real accounts. "Sign in" opens a form (sign in or create account). After that:
  - **My EV** shows your own sessions, this week's totals, the live readings, and a form to link an RFID card.
  - **Energy** shows your weekly chart from real sessions.
  - **Station Management** shows real session history and totals, but only for an operator account. The Driver / Operator switch only changes the view; the server decides who may read the data.
- Energy is shown in **Wh**, because the prototype delivers watts, not kilowatts.

### Try the whole flow without hardware

1. Start the server and the frontend, switch to **Live**, and create an account.
2. In **My EV**, link a card with UID `04:A3:5B:1C`.
3. Run `npm run simulate -- --card 04:A3:5B:1C` in `server/`. It scans the card (session starts) and streams readings.
4. Watch **My EV** update. Stop and run the simulator with `--card` again, or scan the same card, to end the session.
5. Sign out and sign in as the operator (`OPERATOR_EMAIL` / `OPERATOR_PASSWORD`, defaults in dev: `operator@solarsmart.local` / `operator-dev-password`) to see session history in **Station Management**.

## Not done yet (list as future scope)

- HTTPS, password reset, multi-station support.
- Verify INA219 readings against a multimeter before quoting any numbers.
- The map and "Stations" list still use the fictional demo stations; only Base 01 is real.
