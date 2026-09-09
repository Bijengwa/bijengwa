const db = require('../config/db');

const TABLE = 'rental_agreements';

function create(data, trx) {
  const query = trx ? trx(TABLE) : db(TABLE);
  return query.insert(data).returning('*').then(([row]) => row);
}

function findById(uuid) {
  return db(TABLE).where({ uuid }).first();
}

function findDetailedById(uuid) {
  return db(TABLE)
    .join('units', 'rental_agreements.unit_uuid', 'units.uuid')
    .join('properties', 'units.property_uuid', 'properties.uuid')
    .join('profiles as tenant', 'rental_agreements.tenant_uuid', 'tenant.uuid')
    .join('profiles as landlord', 'properties.owner_uuid', 'landlord.uuid')
    .where('rental_agreements.uuid', uuid)
    .select(
      'rental_agreements.*',
      'units.unit_name',
      'units.room_type',
      'properties.title as property_title',
      'properties.location',
      'tenant.full_name as tenant_name',
      'landlord.uuid as landlord_uuid',
      'landlord.full_name as landlord_name'
    )
    .first();
}

function findByTenant(tenantUuid) {
  return db(TABLE)
    .join('units', 'rental_agreements.unit_uuid', 'units.uuid')
    .join('properties', 'units.property_uuid', 'properties.uuid')
    .where('rental_agreements.tenant_uuid', tenantUuid)
    .select('rental_agreements.*', 'units.unit_name', 'properties.title as property_title')
    .orderBy('rental_agreements.created_at', 'desc');
}

function findByLandlord(landlordUuid) {
  return db(TABLE)
    .join('units', 'rental_agreements.unit_uuid', 'units.uuid')
    .join('properties', 'units.property_uuid', 'properties.uuid')
    .join('profiles as tenant', 'rental_agreements.tenant_uuid', 'tenant.uuid')
    .where('properties.owner_uuid', landlordUuid)
    .select(
      'rental_agreements.*',
      'units.unit_name',
      'properties.title as property_title',
      'tenant.full_name as tenant_name'
    )
    .orderBy('rental_agreements.created_at', 'desc');
}

async function update(uuid, data, trx) {
  const query = trx ? trx(TABLE) : db(TABLE);
  const [row] = await query
    .where({ uuid })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

module.exports = {
  TABLE,
  create,
  findById,
  findDetailedById,
  findByTenant,
  findByLandlord,
  update,
};
