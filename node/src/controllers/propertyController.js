const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { requireFields } = require('../utils/validate');
const propertyModel = require('../models/propertyModel');
const unitModel = require('../models/unitModel');

async function loadOwnedProperty(propertyUuid, userUuid) {
  const property = await propertyModel.findById(propertyUuid);
  if (!property) throw ApiError.notFound('Property not found');
  if (property.owner_uuid !== userUuid) {
    throw ApiError.forbidden('You do not own this property');
  }
  return property;
}

const createProperty = asyncHandler(async (req, res) => {
  requireFields(req.body, ['title']);
  const { title, property_type, pictures, location, street, description, house_rules } = req.body;

  const property = await propertyModel.create({
    owner_uuid: req.user.uuid,
    title,
    property_type,
    pictures: JSON.stringify(pictures || []),
    location,
    street,
    description,
    house_rules,
  });

  res.status(201).json({ success: true, data: property });
});

const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await propertyModel.findByOwner(req.user.uuid);
  res.json({ success: true, data: properties });
});

const getProperty = asyncHandler(async (req, res) => {
  const property = await propertyModel.findById(req.params.uuid);
  if (!property) throw ApiError.notFound('Property not found');
  const units = await unitModel.findByProperty(property.uuid);
  res.json({ success: true, data: { ...property, units } });
});

const updateProperty = asyncHandler(async (req, res) => {
  await loadOwnedProperty(req.params.uuid, req.user.uuid);

  const allowed = ['title', 'property_type', 'pictures', 'location', 'street', 'description', 'house_rules'];
  const data = {};
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) {
      data[field] = field === 'pictures' ? JSON.stringify(req.body[field]) : req.body[field];
    }
  });

  const property = await propertyModel.update(req.params.uuid, data);
  res.json({ success: true, data: property });
});

const deleteProperty = asyncHandler(async (req, res) => {
  await loadOwnedProperty(req.params.uuid, req.user.uuid);
  await propertyModel.remove(req.params.uuid);
  res.json({ success: true, message: 'Property deleted' });
});

module.exports = {
  loadOwnedProperty,
  createProperty,
  getMyProperties,
  getProperty,
  updateProperty,
  deleteProperty,
};
