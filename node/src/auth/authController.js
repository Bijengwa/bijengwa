const asyncHandler = require('../utils/asyncHandler');
const authService = require('./authService');
const {
  validateRegistration,
  validateLogin,
  validateVerification,
} = require('./authValidation');

const register = asyncHandler(async (req, res) => {
  validateRegistration(req.body);

  const result = await authService.register({
    full_name: req.body.full_name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(201).json({
    success: true,
    message: 'Account created. Please verify your email.',
    data: result,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  validateVerification(req.body);

  const result = await authService.verifyEmail({
    email: req.body.email,
    code: req.body.code,
  });

  res.json({
    success: true,
    message: 'Email verified successfully.',
    data: result,
  });
});

const requestVerificationCode = asyncHandler(async (req, res) => {
  const email = req.body.email;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Email address is required',
    });
  }

  await authService.resendVerificationCode(email);

  /*
   * Always return the same message so we don't expose
   * whether an email belongs to an account.
   */
  res.json({
    success: true,
    message: 'If the account exists and is not verified, a new verification code has been sent.',
  });
});

const login = asyncHandler(async (req, res) => {
  validateLogin(req.body);

  const result = await authService.login({
    email: req.body.email,
    password: req.body.password,
  });

  if (result.verification_required) {
    return res.status(403).json({
      success: false,
      message: 'Email verification is required.',
      data: {
        verification_required: true,
        email: result.email,
      },
    });
  }

  res.json({
    success: true,
    data: result,
  });
});

module.exports = {
  register,
  verifyEmail,
  requestVerificationCode,
  login,
};