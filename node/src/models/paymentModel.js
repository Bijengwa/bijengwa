const db = require('../config/db');

const TABLE = 'payments';

function create(data) {
  return db(TABLE).insert(data).returning('*').then(([row]) => row);
}

function findById(uuid) {
  return db(TABLE).where({ uuid }).first();
}

function findByRentalAgreement(rentalAgreementUuid) {
  return db(TABLE)
    .where({ rental_agreement_uuid: rentalAgreementUuid })
    .orderBy('payment_date', 'desc');
}

function findByTenant(tenantUuid) {
  return db(TABLE)
    .join('rental_agreements', 'payments.rental_agreement_uuid', 'rental_agreements.uuid')
    .join('units', 'rental_agreements.unit_uuid', 'units.uuid')
    .join('properties', 'units.property_uuid', 'properties.uuid')
    .where('rental_agreements.tenant_uuid', tenantUuid)
    .select('payments.*', 'units.unit_name', 'properties.title as property_title')
    .orderBy('payments.payment_date', 'desc');
}

function findByLandlord(landlordUuid) {
  return db(TABLE)
    .join('rental_agreements', 'payments.rental_agreement_uuid', 'rental_agreements.uuid')
    .join('units', 'rental_agreements.unit_uuid', 'units.uuid')
    .join('properties', 'units.property_uuid', 'properties.uuid')
    .join('profiles as tenant', 'rental_agreements.tenant_uuid', 'tenant.uuid')
    .where('properties.owner_uuid', landlordUuid)
    .select(
      'payments.*',
      'units.unit_name',
      'properties.title as property_title',
      'tenant.full_name as tenant_name'
    )
    .orderBy('payments.payment_date', 'desc');
}

module.exports = { TABLE, create, findById, findByRentalAgreement, findByTenant, findByLandlord };
