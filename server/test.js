// End-to-end check: node test.js  (uses a temporary in-memory database)
process.env.DB_FILE = ':memory:';
process.env.OPERATOR_PASSWORD = 'operator-test-pw';
process.env.TOKEN_SECRET = 'test-secret';
process.env.DEVICE_KEY = 'test-device';
process.env.CARD_PEPPER = 'test-pepper';

import assert from 'node:assert/strict';
const { app } = await import('./index.js');

const server = app.listen(0);
const base = `http://localhost:${server.address().port}`;
const call = async (method, path, { body, token, device } = {}) => {
  const r = await fetch(base + path, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(device ? { 'x-device-key': 'test-device' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, json: await r.json() };
};
const ok = (name) => console.log('  ok  ' + name);

// 1. No data yet: nothing may be claimed as connected
let r = await call('GET', '/api/station/base-01');
assert.equal(r.json.connectionStatus, 'unavailable');
assert.equal(r.json.operationalStatus, 'unknown');
assert.equal(r.json.latestReadings.voltage, null);
assert.equal(r.json.hardware.ina219Sensor, 'unavailable');
ok('empty station reports unavailable / unknown');

// 2. Device auth + validation
r = await call('POST', '/api/telemetry', { body: { voltage: 5, current: 300 } });
assert.equal(r.status, 401);
r = await call('POST', '/api/telemetry', { device: true, body: { voltage: 'abc', current: 300 } });
assert.equal(r.status, 400);
r = await call('POST', '/api/telemetry', { device: true, body: { voltage: 99, current: 300 } });
assert.equal(r.status, 400);
ok('telemetry rejects missing key and bad values');

// 3. Telemetry shows up as live, power derived
r = await call('POST', '/api/telemetry', { device: true, body: { voltage: 4.92, current: 380, hardware: { ina219: true, rc522: false } } });
assert.equal(r.status, 201);
r = await call('GET', '/api/station/base-01');
assert.equal(r.json.connectionStatus, 'connected');
assert.equal(r.json.operationalStatus, 'available');
assert.equal(r.json.latestReadings.power, 1.87);
assert.equal(r.json.hardware.esp32Gateway, 'connected');
assert.equal(r.json.hardware.ina219Sensor, 'connected');
assert.equal(r.json.hardware.rc522Reader, 'unavailable'); // device said false
assert.equal(r.json.hardware.irVehicleSensor, 'unavailable'); // never reported
assert.equal(r.json.latestReadings.vehicleDetected, null);
ok('live reading, derived power, per-node link status');

// 3b. Hardware flags survive a reading that omits them
await call('POST', '/api/telemetry', { device: true, body: { voltage: 4.9, current: 360 } });
r = await call('GET', '/api/station/base-01');
assert.equal(r.json.hardware.ina219Sensor, 'connected');
ok('hardware flags persist when a reading omits them');

// 4. Users, roles
r = await call('POST', '/api/auth/register', { body: { name: 'Test Driver', email: 'a@b.co', password: 'password123' } });
assert.equal(r.status, 201);
const userToken = r.json.token;
r = await call('POST', '/api/auth/register', { body: { name: 'X', email: 'a@b.co', password: 'password123' } });
assert.equal(r.status, 409);
r = await call('POST', '/api/auth/login', { body: { email: 'a@b.co', password: 'wrong-password' } });
assert.equal(r.status, 401);
r = await call('GET', '/api/admin/summary', { token: userToken });
assert.equal(r.status, 403);
r = await call('GET', '/api/admin/summary');
assert.equal(r.status, 401);
r = await call('POST', '/api/auth/login', { body: { email: 'operator@solarsmart.local', password: 'operator-test-pw' } });
assert.equal(r.json.user.role, 'operator');
const opToken = r.json.token;
r = await call('GET', '/api/admin/summary', { token: opToken });
assert.equal(r.status, 200);
ok('register/login, duplicate email, operator-only admin route enforced');

// 5. RFID flow: unknown card denied, linked card starts/ends session, energy accumulates
r = await call('POST', '/api/scan', { device: true, body: { cardUid: '04:A3:5B:1C' } });
assert.equal(r.json.authorized, false);
r = await call('POST', '/api/cards', { token: userToken, body: { cardUid: '04:A3:5B:1C', label: 'Blue tag' } });
assert.equal(r.status, 201);
r = await call('POST', '/api/scan', { device: true, body: { cardUid: '04a35b1c'.replace(/(..)(?=.)/g, '$1:') } });
assert.equal(r.json.action, 'started'); // UID matching is case-insensitive
const sid = r.json.sessionId;
r = await call('GET', '/api/station/base-01');
assert.equal(r.json.operationalStatus, 'charging');
await new Promise((res) => setTimeout(res, 1100));
await call('POST', '/api/telemetry', { device: true, body: { voltage: 5, current: 400 } });
r = await call('GET', '/api/station/base-01');
assert.ok(r.json.activeSession.energyWh > 0, 'energy should accumulate');
r = await call('POST', '/api/scan', { device: true, body: { cardUid: '04:A3:5B:1C' } });
assert.equal(r.json.action, 'ended');
assert.equal(r.json.sessionId, sid);
ok('unknown card denied, card links, session starts/ends, energy integrates');

// 6. Session visibility
r = await call('GET', '/api/sessions', { token: userToken });
assert.equal(r.json.sessions.length, 1);
assert.equal(r.json.sessions[0].endReason, 'card');
assert.ok(r.json.sessions[0].energyWh > 0, 'short sessions must not round to zero energy');
r = await call('GET', '/api/admin/summary', { token: opToken });
assert.ok(r.json.allTime.energyWh > 0);
r = await call('GET', '/api/me', { token: userToken });
assert.equal(r.json.cards.length, 1);
assert.equal(JSON.stringify(r.json).includes('04:A3'), false); // raw UID never returned
ok('user sees own sessions; raw card UID never stored or returned');

server.close();
console.log('\nAll backend checks passed.');
