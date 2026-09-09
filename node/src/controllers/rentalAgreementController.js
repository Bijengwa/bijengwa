const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { requireFields, assertOneOf } = require('../utils/validate');
const db = require('../config/db');
const rentalAgreementModel = require('../models/rentalAgreementModel');
const unitModel = require('../models/unitModel');
const propertyModel = require('../models/propertyModel');

async function assertLandlordOrTenant(agreement, userUuid) {
  const unit = await unitModel.findById(agreement.unit_uuid);
  const property = await propertyModel.findById(unit.property_uuid);
  const isTenant = agreement.tenant_uuid === userUuid;
  const isLandlord = property.owner_uuid === userUuid;
  if (!isTenant && !isLandlord) {
    throw ApiError.forbidden('You are not part of this rental agreement');
  }
  return { unit, property, isTenant, isLandlord };
}

const createRentalAgreement = asyncHandler(async (req, res) => {
  requireFields(req.body, ['unit_uuid', 'tenant_uuid', 'start_date', 'monthly_rent_tzs']);
  const {
    unit_uuid, tenant_uuid, start_date, end_date, monthly_rent_tzs,
    months_paid_in_advance, minimum_stay, notice_before_leaving_days, status,
  } = req.body;

  const unit = await unitModel.findById(unit_uuid);
  if (!unit) throw ApiError.notFound('Unit not found');

  const property = await propertyModel.findById(unit.property_uuid);
  if (property.owner_uuid !== req.user.uuid) {
    throw ApiError.forbidden('Only the property owner can create a rental agreement for this unit');
  }

  if (unit.status === 'occupied') {
    throw ApiError.conflict('Unit is already occupied');
  }

  assertOneOf(status, ['pending', 'active', 'ended', 'cancelled'], 'status');

  const agreement = await db.transaction(async (trx) => {
    const created = await rentalAgreementModel.create(
      {
        unit_uuid,
        tenant_uuid,
        start_date,
        end_date,
        monthly_rent_tzs,
        months_paid_in_advance: months_paid_in_advance || 0,
        minimum_stay,
        notice_before_leaving_days,
        status: status || 'active',
      },
      trx
    );

    if ((status || 'active') === 'active') {
      await trx('units').where({ uuid: unit_uuid }).update({ status: 'occupied', updated_at: trx.fn.now() });
    }

    return created;
  });

  res.status(201).json({ success: true, data: agreement });
});

const getTenantRentals = asyncHandler(async (req, res) => {
  const rentals = await rentalAgreementModel.findByTenant(req.user.uuid);
  res.json({ success: true, data: rentals });
});

const getLandlordRentals = asyncHandler(async (req, res) => {
  const rentals = await rentalAgreementModel.findByLandlord(req.user.uuid);
  res.json({ success: true, data: rentals });
});

const getRentalAgreement = asyncHandler(async (req, res) => {
  const agreement = await rentalAgreementModel.findById(req.params.uuid);
  if (!agreement) throw ApiError.notFound('Rental agreement not found');
  await assertLandlordOrTenant(agreement, req.user.uuid);

  const detailed = await rentalAgreementModel.findDetailedById(req.params.uuid);
  res.json({ success: true, data: detailed });
});

const updateRentalAgreement = asyncHandler(async (req, res) => {
  const agreement = await rentalAgreementModel.findById(req.params.uuid);
  if (!agreement) throw ApiError.notFound('Rental agreement not found');
  const { property, isLandlord } = await assertLandlordOrTenant(agreement, req.user.uuid);

  if (!isLandlord) {
    throw ApiError.forbidden('Only the landlord can update this rental agreement');
  }

  const allowed = ['end_date', 'monthly_rent_tzs', 'months_paid_in_advance', 'minimum_stay', 'notice_before_leaving_days', 'status'];
  const data = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) data[field] = req.body[field];
  });

  if (data.status) assertOneOf(data.status, ['pending', 'active', 'ended', 'cancelled'], 'status');

  const updated = await db.transaction(async (trx) => {
    const result = await rentalAgreementModel.update(req.params.uuid, data, trx);

    if (data.status === 'ended' || data.status === 'cancelled') {
      await trx('units').where({ uuid: agreement.unit_uuid }).update({ status: 'available', updated_at: trx.fn.now() });
    } else if (data.status === 'active') {
      await trx('units').where({ uuid: agreement.unit_uuid }).update({ status: 'occupied', updated_at: trx.fn.now() });
    }

    return result;
  });

  res.json({ success: true, data: updated });
});

module.exports = {
  createRentalAgreement,
  getTenantRentals,
  getLandlordRentals,
  getRentalAgreement,
  updateRentalAgreement,
  assertLandlordOrTenant,
};
