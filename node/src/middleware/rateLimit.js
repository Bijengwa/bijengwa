function clientIp(req) {
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function emailFromBody(req) {
  return String(req.body?.email || '').trim().toLowerCase() || 'no-email';
}

function createRateLimiter({
  windowMs,
  max,
  keyFn,
  message = 'Too many requests. Please try again later.',
}) {
  const hits = new Map();

  function prune(now) {
    for (const [key, entry] of hits.entries()) {
      if (entry.resetAt <= now) {
        hits.delete(key);
      }
    }
  }

  function rateLimit(req, res, next) {
    const now = Date.now();

    if (hits.size > 10_000) {
      prune(now);
    }

    const key = keyFn(req);
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, max - entry.count);
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(remaining));
    res.setHeader('Retry-After', String(Math.max(0, Math.ceil((entry.resetAt - now) / 1000))));

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message,
      });
    }

    return next();
  }

  rateLimit.reset = () => hits.clear();

  return rateLimit;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const apiLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES,
  max: 300,
  keyFn: clientIp,
});

const loginLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  keyFn: (req) => `${clientIp(req)}:${emailFromBody(req)}`,
  message: 'Too many login attempts. Please try again later.',
});

const registerLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES,
  max: 5,
  keyFn: clientIp,
  message: 'Too many registration attempts. Please try again later.',
});

const verifyLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  keyFn: (req) => `${clientIp(req)}:${emailFromBody(req)}`,
  message: 'Too many verification attempts. Please try again later.',
});

const resendLimiter = createRateLimiter({
  windowMs: FIFTEEN_MINUTES,
  max: 5,
  keyFn: (req) => `${clientIp(req)}:${emailFromBody(req)}`,
  message: 'Too many verification code requests. Please try again later.',
});

module.exports = {
  createRateLimiter,
  apiLimiter,
  loginLimiter,
  registerLimiter,
  verifyLimiter,
  resendLimiter,
};
