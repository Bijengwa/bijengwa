const crypto = require('crypto');

const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateUsername } = require('../utils/username');
const { signToken } = require('../utils/jwt');
const profileModel = require('../models/profileModel');

const VERIFICATION_CODE_MINUTES = 10;

function generateVerificationCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function getVerificationExpiry() {
  return new Date(
    Date.now() + VERIFICATION_CODE_MINUTES * 60 * 1000,
  );
}

async function register({
  full_name,
  email,
  password,
}) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const existing = await profileModel.findByEmail(normalizedEmail);

  if (existing) {
    throw ApiError.conflict(
      'An account with this email already exists',
    );
  }

  const passwordHash = await hashPassword(password);

  let profile;

  for (let attempt = 0; attempt < 5 && !profile; attempt += 1) {
    const username = generateUsername(full_name);

    try {
      profile = await profileModel.create({
        full_name: String(full_name).trim(),
        email: normalizedEmail,
        username,
        password: passwordHash,
        is_verified: false,
        verification_code: generateVerificationCode(),
        verification_code_expires_at: getVerificationExpiry(),
      });
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
    }
  }

  if (!profile) {
    throw new Error('Unable to create account');
  }

  const verificationCode = profile.verification_code;

  /*
   * Temporary development delivery.
   *
   * Until a real email provider is configured,
   * the code is printed to the backend terminal.
   */
  console.log(
    `[DEV] Email verification code for ${normalizedEmail}: ${verificationCode}`,
  );

  const {
    password: _password,
    verification_code: _code,
    verification_code_expires_at: _expires,
    ...safeProfile
  } = profile;

  return {
    profile: safeProfile,
    verification_required: true,
  };
}

async function verifyEmail({ email, code }) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const profile = await profileModel.findByEmail(normalizedEmail);

  if (!profile) {
    throw ApiError.notFound('No account found for this email');
  }

  if (profile.is_verified) {
    const token = signToken({ uuid: profile.uuid });

    const {
      password: _password,
      verification_code: _code,
      verification_code_expires_at: _expires,
      ...safeProfile
    } = profile;

    return {
      profile: safeProfile,
      token,
    };
  }

  if (!profile.verification_code) {
    throw ApiError.badRequest(
      'No verification code is available. Please request a new code.',
    );
  }

  if (
    !profile.verification_code_expires_at ||
    new Date(profile.verification_code_expires_at) < new Date()
  ) {
    throw ApiError.badRequest(
      'Verification code expired. Please request a new code.',
    );
  }

  if (String(profile.verification_code) !== String(code).trim()) {
    throw ApiError.badRequest('Invalid verification code');
  }

  const updated = await profileModel.update(profile.uuid, {
    is_verified: true,
    verification_code: null,
    verification_code_expires_at: null,
  });

  const token = signToken({ uuid: updated.uuid });

  const {
    password: _password,
    verification_code: _code,
    verification_code_expires_at: _expires,
    ...safeProfile
  } = updated;

  return {
    profile: safeProfile,
    token,
  };
}

async function resendVerificationCode(email) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const profile = await profileModel.findByEmail(normalizedEmail);

  /*
   * Don't reveal whether an email exists.
   */
  if (!profile) {
    return;
  }

  if (profile.is_verified) {
    return;
  }

  const verificationCode = generateVerificationCode();
  const expiresAt = getVerificationExpiry();

  await profileModel.update(profile.uuid, {
    verification_code: verificationCode,
    verification_code_expires_at: expiresAt,
  });

  console.log(
    `[DEV] Email verification code for ${normalizedEmail}: ${verificationCode}`,
  );
}

async function login({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const profile = await profileModel.findByEmail(normalizedEmail);

  if (!profile) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const match = await comparePassword(password, profile.password);

  if (!match) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  if (!profile.is_verified) {
    return {
      verification_required: true,
      email: profile.email,
    };
  }

  const token = signToken({ uuid: profile.uuid });

  const {
    password: _password,
    verification_code: _code,
    verification_code_expires_at: _expires,
    ...safeProfile
  } = profile;

  return {
    profile: safeProfile,
    token,
    verification_required: false,
  };
}

module.exports = {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
};