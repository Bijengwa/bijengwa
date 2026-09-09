const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { requireFields } = require('../utils/validate');
const paymentModel = require('../models/paymentModel');
const rentalAgreementModel = require('../models/rentalAgreementModel');
const { assertLandlordOrTenant } = require('./rentalAgreementController');

const createPayment = asyncHandler(async (req, res) => {
  requireFields(req.body, ['rental_agreement_uuid', 'amount_tzs', 'payment_date', 'period_start_date', 'period_end_date']);
  const {
    rental_agreement_uuid, amount_tzs, months_paid_for, payment_date,
    period_start_date, period_end_date, payment_method, reference_number, status,
  } = req.body;

  const agreement = await rentalAgreementModel.findById(rental_agreement_uuid);
  if (!agreement) throw ApiError.notFound('Rental agreement not found');
  const { isLandlord } = await assertLandlordOrTenant(agreement, req.user.uuid);
  if (!isLandlord) {
    throw ApiError.forbidden('Only the landlord can record a payment for this rental agreement');
  }

  const payment = await paymentModel.create({
    rental_agreement_uuid,
    amount_tzs,
    months_paid_for: months_paid_for || 1,
    payment_date,
    period_start_date,
    period_end_date,
    payment_method,
    reference_number,
    status: status || 'completed',
  });

  res.status(201).json({ success: true, data: payment });
});

const getPaymentsForAgreement = asyncHandler(async (req, res) => {
  const agreement = await rentalAgreementModel.findById(req.params.agreementUuid);
  if (!agreement) throw ApiError.notFound('Rental agreement not found');
  await assertLandlordOrTenant(agreement, req.user.uuid);

  const payments = await paymentModel.findByRentalAgreement(req.params.agreementUuid);
  res.json({ success: true, data: payments });
});

const getTenantPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await paymentModel.findByTenant(req.user.uuid);
  res.json({ success: true, data: payments });
});

const getLandlordPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await paymentModel.findByLandlord(req.user.uuid);
  res.json({ success: true, data: payments });
});

module.exports = {
  createPayment,
  getPaymentsForAgreement,
  getTenantPaymentHistory,
  getLandlordPaymentHistory,
};
