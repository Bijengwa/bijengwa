require('dotenv').config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = required('JWT_SECRET');

if (NODE_ENV === 'production' && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production');
}

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV,
  DATABASE_URL: required('DATABASE_URL'),
  JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '',
  TRUST_PROXY: process.env.TRUST_PROXY === 'true',
};
