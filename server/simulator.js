// Pretends to be the ESP32 so you can test the whole stack without hardware.
//   npm run simulate                 -> sends readings every 3 s
//   npm run simulate -- --card 04:A3:5B:1C   -> also scans that card once at start (register it first)
const API = process.env.API_URL || 'http://localhost:3001';
const KEY = process.env.DEVICE_KEY || 'dev-device-key';
const INTERVAL_MS = 3000;
const cardIdx = process.argv.indexOf('--card');
const card = cardIdx > -1 ? process.argv[cardIdx + 1] : null;

const post = async (path, body) => {
  const r = await fetch(API + path, { method: 'POST', headers: { 'content-type': 'application/json', 'x-device-key': KEY }, body: JSON.stringify(body) });
  return { status: r.status, body: await r.json().catch(() => ({})) };
};

const jitter = (base, spread) => base + (Math.random() - 0.5) * spread;

if (card) console.log('scan ->', (await post('/api/scan', { cardUid: card })).body);

setInterval(async () => {
  try {
    const out = await post('/api/telemetry', {
      voltage: Number(jitter(4.92, 0.1).toFixed(2)),
      current: Math.round(jitter(380, 40)),
      hardware: { arduino: true, ina219: true, rc522: true, irVehicle: false },
    });
    console.log(new Date().toLocaleTimeString(), out.status, out.body);
  } catch (e) {
    console.log('send failed:', e.message);
  }
}, INTERVAL_MS);
console.log(`Simulating telemetry to ${API} every ${INTERVAL_MS / 1000}s. Ctrl+C to stop.`);
