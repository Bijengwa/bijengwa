const db = require('../config/db');

const TABLE = 'chats';

function create(data) {
  return db(TABLE).insert(data).returning('*').then(([row]) => row);
}

function findById(uuid) {
  return db(TABLE).where({ uuid }).first();
}

function findByUnitAndTenant(unitUuid, tenantUuid) {
  return db(TABLE).where({ unit_uuid: unitUuid, tenant_uuid: tenantUuid }).first();
}

function findForUser(userUuid) {
  return db(TABLE)
    .join('units', 'chats.unit_uuid', 'units.uuid')
    .join('properties', 'units.property_uuid', 'properties.uuid')
    .where('chats.tenant_uuid', userUuid)
    .orWhere('chats.owner_uuid', userUuid)
    .select('chats.*', 'units.unit_name', 'properties.title as property_title')
    .orderBy('chats.updated_at', 'desc');
}

module.exports = { TABLE, create, findById, findByUnitAndTenant, findForUser };
