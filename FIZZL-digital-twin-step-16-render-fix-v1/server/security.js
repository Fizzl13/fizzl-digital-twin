
const crypto = require("crypto");

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 30);
const MAX_BODY_BYTES = 20 * 1024;
const buckets = new Map();

function clientKey(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "unknown";
}

function rateLimit(req) {
  const key = clientKey(req);
  const now = Date.now();
  const bucket = buckets.get(key) || {start: now, count: 0};

  if (now - bucket.start >= WINDOW_MS) {
    bucket.start = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  buckets.set(key, bucket);

  return bucket.count <= MAX_REQUESTS;
}

function bodyAllowed(req) {
  const length = Number(req.headers["content-length"] || 0);
  return !Number.isFinite(length) || length <= MAX_BODY_BYTES;
}

function allowedOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const configured = String(process.env.ALLOWED_ORIGINS || "")
    .split(",").map(x => x.trim()).filter(Boolean);

  // If configured, require an exact allowlisted origin.
  if (configured.length) return configured.includes(origin);

  // Safe default for same-origin requests during local development.
  return false;
}

function applySecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy",
    "default-src 'self'; connect-src 'self'; img-src 'self' data:; " +
    "style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'self';");
}

function safeEqual(a, b) {
  if (!a || !b) return false;
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

module.exports = {
  rateLimit,
  bodyAllowed,
  allowedOrigin,
  applySecurityHeaders,
  safeEqual
};
