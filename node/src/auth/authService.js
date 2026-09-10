const crypto = require('crypto');

const ApiError = require('../utils/ApiError');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateUsername } = require('../utils/username');
const { signToken } = require('../utils/jwt');
const { logVerificationCodeIssued } = require('../utils/authLog');
const profileModel = require('../models/profileModel');

const VERIFICATION_CODE_MINUTES = 10;
const MAX_VERIFICATION_ATTEMPTS = 5;
const INVALID_CREDENTIALS = 'Invalid email or password';
const INVALID_VERIFICATION = 'Invalid or expired verification code';

const SENSITIVE_PROFILE_FIELDS = [
  'password',
  'verification_code',
  'verification_code_expires_at',
  'verification_failed_attempts',
];

let dummyPasswordHashPromise;

function dummyPasswordHash() {
  if (!dummyPasswordHashPromise) {
    dummyPasswordHashPromise = hashPassword('bijengwa-timing-dummy');
  }
  return dummyPasswordHashPromise;
}

function generateVerificationCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function getVerificationExpiry() {
  return new Date(
    Date.now() + VERIFICATION_CODE_MINUTES * 60 * 1000,
  );
}

function toPublicProfile(profile) {
  const safeProfile = { ...profile };

  for (const field of SENSITIVE_PROFILE_FIELDS) {
    delete safeProfile[field];
  }

  return safeProfile;
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
        verification_failed_attempts: 0,
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

  logVerificationCodeIssued(profile.verification_code);

  return {
    profile: toPublicProfile(profile),
    verification_required: true,
  };
}

async function verifyEmail({ email, code }) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const submittedCode = String(code).trim();

  const profile = await profileModel.findByEmail(normalizedEmail);

  if (!profile) {
    throw ApiError.badRequest(INVALID_VERIFICATION);
  }

  if (profile.is_verified) {
    const token = signToken({ uuid: profile.uuid });

    return {
      profile: toPublicProfile(profile),
      token,
    };
  }

  if (
    !profile.verification_code ||
    !profile.verification_code_expires_at ||
    new Date(profile.verification_code_expires_at) < new Date()
  ) {
    throw ApiError.badRequest(
      `${INVALID_VERIFICATION}. Please request a new code.`,
    );
  }

  if (String(profile.verification_code) !== submittedCode) {
    const attempts = (profile.verification_failed_attempts || 0) + 1;

    if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
      await profileModel.update(profile.uuid, {
        verification_code: null,
        verification_code_expires_at: null,
        verification_failed_attempts: 0,
      });

      throw ApiError.badRequest(
        'Too many attempts. Please request a new code.',
      );
    }

    await profileModel.update(profile.uuid, {
      verification_failed_attempts: attempts,
    });

    throw ApiError.badRequest(INVALID_VERIFICATION);
  }

  const updated = await profileModel.update(profile.uuid, {
    is_verified: true,
    verification_code: null,
    verification_code_expires_at: null,
    verification_failed_attempts: 0,
  });

  const token = signToken({ uuid: updated.uuid });

  return {
    profile: toPublicProfile(updated),
    token,
  };
}

async function resendVerificationCode(email) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const profile = await profileModel.findByEmail(normalizedEmail);

  if (!profile || profile.is_verified) {
    return;
  }

  const verificationCode = generateVerificationCode();
  const expiresAt = getVerificationExpiry();

  await profileModel.update(profile.uuid, {
    verification_code: verificationCode,
    verification_code_expires_at: expiresAt,
    verification_failed_attempts: 0,
  });

  logVerificationCodeIssued(verificationCode);
}

async function login({ email, password }) {
  const normalizedEmail = String(email).trim().toLowerCase();

  const profile = await profileModel.findByEmail(normalizedEmail);

  if (!profile) {
    await comparePassword(password, await dummyPasswordHash());
    throw ApiError.unauthorized(INVALID_CREDENTIALS);
  }

  const match = await comparePassword(password, profile.password);

  if (!match) {
    throw ApiError.unauthorized(INVALID_CREDENTIALS);
  }

  if (!profile.is_verified) {
    return {
      verification_required: true,
      email: profile.email,
    };
  }

  const token = signToken({ uuid: profile.uuid });

  return {
    profile: toPublicProfile(profile),
    token,
    verification_required: false,
  };
}

module.exports = {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  MAX_VERIFICATION_ATTEMPTS,
};
