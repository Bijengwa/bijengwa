const { Router } = require('express');
const rentalAgreementController = require('../controllers/rentalAgreementController');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.post('/', rentalAgreementController.createRentalAgreement);
router.get('/mine/tenant', rentalAgreementController.getTenantRentals);
router.get('/mine/landlord', rentalAgreementController.getLandlordRentals);
router.get('/:uuid', rentalAgreementController.getRentalAgreement);
router.patch('/:uuid', rentalAgreementController.updateRentalAgreement);

router.get('/:agreementUuid/payments', paymentController.getPaymentsForAgreement);

module.exports = router;
