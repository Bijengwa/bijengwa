const ApiError = require('./ApiError');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireFields(body, fields) {
  const missing = fields.filter((f) => body[f] === undefined || body[f] === null || body[f] === '');
  if (missing.length) {
    throw ApiError.badRequest(`Missing required field(s): ${missing.join(', ')}`);
  }
}

function isEmail(value) {
  return EMAIL_RE.test(String(value));
}

function assertOneOf(value, allowed, fieldName) {
  if (value !== undefined && !allowed.includes(value)) {
    throw ApiError.badRequest(`${fieldName} must be one of: ${allowed.join(', ')}`);
  }
}

module.exports = { requireFields, isEmail, assertOneOf };
