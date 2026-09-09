const { Router } = require('express');
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/me', authenticate, profileController.getMe);
router.patch('/me', authenticate, profileController.updateMe);
router.get('/:uuid', profileController.getProfile);

module.exports = router;
