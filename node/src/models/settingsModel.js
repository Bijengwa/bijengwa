const db = require('../config/db');

const TABLE = 'settings';

function findByUser(userUuid) {
  return db(TABLE).where({ user_uuid: userUuid }).first();
}

function create(data) {
  return db(TABLE).insert(data).returning('*').then(([row]) => row);
}

async function upsert(userUuid, data) {
  const existing = await findByUser(userUuid);
  if (!existing) {
    return create({ user_uuid: userUuid, ...data });
  }
  const [row] = await db(TABLE)
    .where({ user_uuid: userUuid })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

module.exports = { TABLE, findByUser, create, upsert };
