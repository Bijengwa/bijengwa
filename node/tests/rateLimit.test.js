const { createRateLimiter } = require('../src/middleware/rateLimit');

function mockReq(ip = '127.0.0.1') {
  return {
    ip,
    socket: { remoteAddress: ip },
    body: {},
  };
}

function mockRes() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('createRateLimiter', () => {
  it('allows requests under the max and blocks extras', () => {
    const limiter = createRateLimiter({
      windowMs: 60_000,
      max: 2,
      keyFn: (req) => req.ip,
      message: 'Too many requests. Please try again later.',
    });

    const next = jest.fn();

    const first = mockRes();
    limiter(mockReq(), first, next);
    expect(next).toHaveBeenCalledTimes(1);
    expect(first.statusCode).toBe(200);

    const second = mockRes();
    limiter(mockReq(), second, next);
    expect(next).toHaveBeenCalledTimes(2);

    const third = mockRes();
    limiter(mockReq(), third, next);
    expect(next).toHaveBeenCalledTimes(2);
    expect(third.statusCode).toBe(429);
    expect(third.body.success).toBe(false);
    expect(third.body.message).toBe('Too many requests. Please try again later.');
  });

  it('tracks keys independently', () => {
    const limiter = createRateLimiter({
      windowMs: 60_000,
      max: 1,
      keyFn: (req) => req.ip,
    });

    const next = jest.fn();

    limiter(mockReq('1.1.1.1'), mockRes(), next);
    limiter(mockReq('2.2.2.2'), mockRes(), next);

    expect(next).toHaveBeenCalledTimes(2);

    const blocked = mockRes();
    limiter(mockReq('1.1.1.1'), blocked, next);

    expect(blocked.statusCode).toBe(429);
    expect(next).toHaveBeenCalledTimes(2);
  });
});
