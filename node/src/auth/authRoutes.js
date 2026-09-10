const { Router } = require('express');
const authController = require('./authController');

const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post(
  '/verify-email',
  authController.verifyEmail,
);

router.post(
  '/request-verification-code',
  authController.requestVerificationCode,
);

module.exports = router;