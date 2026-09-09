const db = require('../config/db');

const TABLE = 'units';

function create(data) {
  return db(TABLE).insert(data).returning('*').then(([row]) => row);
}

function findById(uuid) {
  return db(TABLE).where({ uuid }).first();
}

function findByProperty(propertyUuid) {
  return db(TABLE).where({ property_uuid: propertyUuid }).orderBy('created_at', 'desc');
}

async function update(uuid, data) {
  const [row] = await db(TABLE)
    .where({ uuid })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

function remove(uuid) {
  return db(TABLE).where({ uuid }).del();
}

function searchAvailable({ location, purpose, roomType, minPrice, maxPrice, limit = 20, offset = 0 }) {
  const query = db(TABLE)
    .join('properties', 'units.property_uuid', 'properties.uuid')
    .join('profiles', 'properties.owner_uuid', 'profiles.uuid')
    .where('units.status', 'available')
    .select(
      'units.uuid as unit_uuid',
      'units.unit_name',
      'units.room_type',
      'units.purpose',
      'units.rent_tzs',
      'units.minimum_stay',
      'units.status',
      'units.photos',
      'units.description',
      'properties.uuid as property_uuid',
      'properties.title as property_title',
      'properties.property_type',
      'properties.pictures as property_pictures',
      'properties.location',
      'properties.street',
      'profiles.uuid as landlord_uuid',
      'profiles.full_name as landlord_name',
      'profiles.phone_number as landlord_phone'
    );

  if (location) {
    query.where(function whereLocation() {
      this.whereILike('properties.location', `%${location}%`).orWhereILike(
        'properties.street',
        `%${location}%`
      );
    });
  }
  if (purpose) {
    query.where('units.purpose', purpose);
  }
  if (roomType) {
    query.where('units.room_type', roomType);
  }
  if (minPrice) {
    query.where('units.rent_tzs', '>=', minPrice);
  }
  if (maxPrice) {
    query.where('units.rent_tzs', '<=', maxPrice);
  }

  return query.orderBy('units.created_at', 'desc').limit(limit).offset(offset);
}

module.exports = { TABLE, create, findById, findByProperty, update, remove, searchAvailable };
