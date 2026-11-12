import crypto from 'node:crypto';

const isProd = process.env.NODE_ENV === 'production';
const need = (name, devDefault) => {
  const v = process.env[name];
  if (v) return v;
  if (isProd) throw new Error(`${name} must be set in production`);
  console.warn(`[warn] ${name} not set, using an insecure dev default`);
  return devDefault;
};

export const TOKEN_SECRET = need('TOKEN_SECRET', 'dev-token-secret-change-me');
export const DEVICE_KEY = need('DEVICE_KEY', 'dev-device-key');
export const CARD_PEPPER = need('CARD_PEPPER', 'dev-card-pepper');

const b64 = (b) => Buffer.from(b).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('base64url');
const safeEq = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

export const hashPassword = (pw) => {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(pw, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
};
export const verifyPassword = (pw, stored) => {
  const [saltHex, hashHex] = stored.split(':');
  const hash = crypto.scryptSync(pw, Buffer.from(saltHex, 'hex'), 64);
  return crypto.timingSafeEqual(hash, Buffer.from(hashHex, 'hex'));
};

export const hashCardUid = (uid) =>
  crypto.createHash('sha256').update(`${CARD_PEPPER}:${String(uid).trim().toUpperCase()}`).digest('hex');

export const makeToken = (user, ttlSeconds = 60 * 60 * 12) => {
  const payload = b64(JSON.stringify({ sub: user.id, role: user.role, exp: Math.floor(Date.now() / 1000) + ttlSeconds }));
  return `${payload}.${sign(payload)}`;
};

const readToken = (token) => {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!safeEq(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() / 1000 ? data : null;
  } catch {
    return null;
  }
};

export const requireUser = (req, res, next) => {
  const h = req.get('authorization') || '';
  const data = readToken(h.startsWith('Bearer ') ? h.slice(7) : '');
  if (!data) return res.status(401).json({ error: 'Sign in required' });
  req.auth = { userId: data.sub, role: data.role };
  next();
};

// Role is enforced here on the server; the frontend role switcher is only a UI toggle.
export const requireOperator = (req, res, next) =>
  requireUser(req, res, () =>
    req.auth.role === 'operator' ? next() : res.status(403).json({ error: 'Operator access only' })
  );

export const requireDevice = (req, res, next) =>
  safeEq(req.get('x-device-key') || '', DEVICE_KEY) ? next() : res.status(401).json({ error: 'Invalid device key' });

// Tiny in-memory rate limiter (per IP) for auth endpoints.
export const rateLimit = (max, windowMs) => {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const arr = (hits.get(req.ip) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) return res.status(429).json({ error: 'Too many attempts, try again shortly' });
    arr.push(now);
    hits.set(req.ip, arr);
    next();
  };
};
