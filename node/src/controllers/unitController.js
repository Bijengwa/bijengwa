const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { requireFields, assertOneOf } = require('../utils/validate');
const unitModel = require('../models/unitModel');
const propertyModel = require('../models/propertyModel');
const { loadOwnedProperty } = require('./propertyController');

async function loadOwnedUnit(unitUuid, userUuid) {
  const unit = await unitModel.findById(unitUuid);
  if (!unit) throw ApiError.notFound('Unit not found');
  const property = await propertyModel.findById(unit.property_uuid);
  if (!property || property.owner_uuid !== userUuid) {
    throw ApiError.forbidden('You do not own the property this unit belongs to');
  }
  return { unit, property };
}

const createUnit = asyncHandler(async (req, res) => {
  await loadOwnedProperty(req.params.propertyUuid, req.user.uuid);
  requireFields(req.body, ['unit_name', 'rent_tzs']);

  const {
    unit_name, room_type, purpose, rent_tzs, minimum_stay,
    rent_paid_in_advance, notice_before_leaving_days, description, photos, status,
  } = req.body;

  assertOneOf(purpose, ['living', 'business'], 'purpose');
  assertOneOf(status, ['available', 'occupied'], 'status');

  const unit = await unitModel.create({
    property_uuid: req.params.propertyUuid,
    unit_name,
    room_type,
    purpose: purpose || 'living',
    rent_tzs,
    minimum_stay,
    rent_paid_in_advance,
    notice_before_leaving_days,
    description,
    photos: JSON.stringify(photos || []),
    status: status || 'available',
  });

  res.status(201).json({ success: true, data: unit });
});

const getUnitsForProperty = asyncHandler(async (req, res) => {
  const units = await unitModel.findByProperty(req.params.propertyUuid);
  res.json({ success: true, data: units });
});

const getUnit = asyncHandler(async (req, res) => {
  const unit = await unitModel.findById(req.params.uuid);
  if (!unit) throw ApiError.notFound('Unit not found');
  const property = await propertyModel.findById(unit.property_uuid);
  res.json({ success: true, data: { ...unit, property } });
});

const updateUnit = asyncHandler(async (req, res) => {
  await loadOwnedUnit(req.params.uuid, req.user.uuid);

  const allowed = [
    'unit_name', 'room_type', 'purpose', 'rent_tzs', 'minimum_stay',
    'rent_paid_in_advance', 'notice_before_leaving_days', 'description', 'photos', 'status',
  ];
  const data = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      data[field] = field === 'photos' ? JSON.stringify(req.body[field]) : req.body[field];
    }
  });

  if (data.purpose) assertOneOf(data.purpose, ['living', 'business'], 'purpose');
  if (data.status) assertOneOf(data.status, ['available', 'occupied'], 'status');

  const unit = await unitModel.update(req.params.uuid, data);
  res.json({ success: true, data: unit });
});

const updateUnitStatus = asyncHandler(async (req, res) => {
  await loadOwnedUnit(req.params.uuid, req.user.uuid);
  requireFields(req.body, ['status']);
  assertOneOf(req.body.status, ['available', 'occupied'], 'status');

  const unit = await unitModel.update(req.params.uuid, { status: req.body.status });
  res.json({ success: true, data: unit });
});

const deleteUnit = asyncHandler(async (req, res) => {
  await loadOwnedUnit(req.params.uuid, req.user.uuid);
  await unitModel.remove(req.params.uuid);
  res.json({ success: true, message: 'Unit deleted' });
});

module.exports = {
  loadOwnedUnit,
  createUnit,
  getUnitsForProperty,
  getUnit,
  updateUnit,
  updateUnitStatus,
  deleteUnit,
};
