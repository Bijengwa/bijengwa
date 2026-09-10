const jwt = require('jsonwebtoken');
const env = require('../config/env');

const SIGN_OPTIONS = {
  expiresIn: env.JWT_EXPIRES_IN,
  algorithm: 'HS256',
};

const VERIFY_OPTIONS = {
  algorithms: ['HS256'],
};

function signToken(payload) {
  return jwt.sign(
    { uuid: payload.uuid },
    env.JWT_SECRET,
    SIGN_OPTIONS,
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET, VERIFY_OPTIONS);
}

module.exports = { signToken, verifyToken };
