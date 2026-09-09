const { Router } = require('express');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.post('/', paymentController.createPayment);
router.get('/mine/tenant', paymentController.getTenantPaymentHistory);
router.get('/mine/landlord', paymentController.getLandlordPaymentHistory);

module.exports = router;
