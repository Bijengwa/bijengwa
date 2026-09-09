const db = require('../config/db');

const TABLE = 'properties';

function create(data) {
  return db(TABLE).insert(data).returning('*').then(([row]) => row);
}

function findById(uuid) {
  return db(TABLE).where({ uuid }).first();
}

function findByOwner(ownerUuid) {
  return db(TABLE).where({ owner_uuid: ownerUuid }).orderBy('created_at', 'desc');
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

module.exports = { TABLE, create, findById, findByOwner, update, remove };
