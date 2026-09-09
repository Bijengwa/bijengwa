const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { requireFields, isEmail } = require('../utils/validate');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateUsername } = require('../utils/username');
const { signToken } = require('../utils/jwt');
const profileModel = require('../models/profileModel');

const register = asyncHandler(async (req, res) => {
  const { full_name, email, password, confirm_password } = req.body;

  requireFields(req.body, ['full_name', 'email', 'password', 'confirm_password']);

  if (!isEmail(email)) {
    throw ApiError.badRequest('Invalid email address');
  }
  if (password !== confirm_password) {
    throw ApiError.badRequest('Password and confirm_password do not match');
  }
  if (password.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters');
  }

  const existing = await profileModel.findByEmail(email.toLowerCase());
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const passwordHash = await hashPassword(password);

  let username;
  let profile;
  for (let attempt = 0; attempt < 5 && !profile; attempt += 1) {
    username = generateUsername(full_name);
    try {
      // eslint-disable-next-line no-await-in-loop
      profile = await profileModel.create({
        full_name,
        email: email.toLowerCase(),
        username,
        password: passwordHash,
      });
    } catch (err) {
      if (attempt === 4) throw err;
    }
  }

  const token = signToken({ uuid: profile.uuid });
  const { password: _pw, ...safeProfile } = profile;

  res.status(201).json({ success: true, data: { profile: safeProfile, token } });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  requireFields(req.body, ['email', 'password']);

  const profile = await profileModel.findByEmail(String(email).toLowerCase());
  if (!profile) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const match = await comparePassword(password, profile.password);
  if (!match) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken({ uuid: profile.uuid });
  const { password: _pw, ...safeProfile } = profile;

  res.json({ success: true, data: { profile: safeProfile, token } });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  requireFields(req.body, ['email']);

  const profile = await profileModel.findByEmail(String(email).toLowerCase());

  res.json({
    success: true,
    message: 'If an account exists for this email, a reset link has been sent.',
    data: profile ? { reset_requested: true } : { reset_requested: false },
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { email, new_password, confirm_password } = req.body;
  requireFields(req.body, ['email', 'new_password', 'confirm_password']);

  if (new_password !== confirm_password) {
    throw ApiError.badRequest('new_password and confirm_password do not match');
  }
  if (new_password.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters');
  }

  const profile = await profileModel.findByEmail(String(email).toLowerCase());
  if (!profile) {
    throw ApiError.notFound('No account found for this email');
  }

  const passwordHash = await hashPassword(new_password);
  await profileModel.update(profile.uuid, { password: passwordHash });

  res.json({ success: true, message: 'Password reset successfully' });
});

module.exports = { register, login, forgotPassword, resetPassword };
