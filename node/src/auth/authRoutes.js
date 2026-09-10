const { Router } = require('express');
const authController = require('./authController');
const {
  loginLimiter,
  registerLimiter,
  verifyLimiter,
  resendLimiter,
} = require('../middleware/rateLimit');

const router = Router();

router.post('/register', registerLimiter, authController.register);

router.post('/login', loginLimiter, authController.login);

router.post(
  '/verify-email',
  verifyLimiter,
  authController.verifyEmail,
);

router.post(
  '/request-verification-code',
  resendLimiter,
  authController.requestVerificationCode,
);

module.exports = router;