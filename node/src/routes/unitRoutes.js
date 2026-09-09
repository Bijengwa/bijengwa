const { Router } = require('express');
const unitController = require('../controllers/unitController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.get('/:uuid', unitController.getUnit);
router.patch('/:uuid', authenticate, unitController.updateUnit);
router.patch('/:uuid/status', authenticate, unitController.updateUnitStatus);
router.delete('/:uuid', authenticate, unitController.deleteUnit);

module.exports = router;
