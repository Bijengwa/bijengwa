const { Router } = require('express');
const propertyController = require('../controllers/propertyController');
const unitController = require('../controllers/unitController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/', authenticate, propertyController.createProperty);
router.get('/mine', authenticate, propertyController.getMyProperties);
router.get('/:uuid', propertyController.getProperty);
router.patch('/:uuid', authenticate, propertyController.updateProperty);
router.delete('/:uuid', authenticate, propertyController.deleteProperty);

router.post('/:propertyUuid/units', authenticate, unitController.createUnit);
router.get('/:propertyUuid/units', unitController.getUnitsForProperty);

module.exports = router;
