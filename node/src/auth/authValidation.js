const ApiError = require('../utils/ApiError');
const { isEmail } = require('../utils/validate');

function validateRegistration(data) {
  const {
    full_name,
    email,
    password,
    confirm_password,
  } = data;

  if (!full_name || !email || !password || !confirm_password) {
    throw ApiError.badRequest('All registration fields are required');
  }

  if (!isEmail(email)) {
    throw ApiError.badRequest('Invalid email address');
  }

  if (password.length < 8) {
    throw ApiError.badRequest(
      'Password must be at least 8 characters',
    );
  }

  if (password !== confirm_password) {
    throw ApiError.badRequest(
      'Password and confirm_password do not match',
    );
  }
}

function validateLogin(data) {
  const { email, password } = data;

  if (!email || !password) {
    throw ApiError.badRequest(
      'Email and password are required',
    );
  }

  if (!isEmail(String(email))) {
    throw ApiError.badRequest('Invalid email address');
  }
}

function validateVerification(data) {
  const { email, code } = data;

  if (!email || !code) {
    throw ApiError.badRequest(
      'Email and verification code are required',
    );
  }

  if (!isEmail(String(email))) {
    throw ApiError.badRequest('Invalid email address');
  }

  if (!/^\d{6}$/.test(String(code))) {
    throw ApiError.badRequest(
      'Verification code must be 6 digits',
    );
  }
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateVerification,
};