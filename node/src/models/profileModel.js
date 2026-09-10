const db = require('../config/db');

const TABLE = 'profiles';
const PUBLIC_COLUMNS = [
  'uuid',
  'profile_pic',
  'full_name',
  'username',
  'email',
  'phone_number',
  'is_verified',
  'created_at',
  'updated_at',
];

function findById(uuid) {
  return db(TABLE).where({ uuid }).first();
}

function findPublicById(uuid) {
  return db(TABLE).where({ uuid }).select(PUBLIC_COLUMNS).first();
}

function findByEmail(email) {
  return db(TABLE).where({ email }).first();
}

function findByUsername(username) {
  return db(TABLE).where({ username }).first();
}

async function create(data) {
  const [row] = await db(TABLE).insert(data).returning('*');
  return row;
}

async function update(uuid, data) {
  const [row] = await db(TABLE)
    .where({ uuid })
    .update({ ...data, updated_at: db.fn.now() })
    .returning('*');
  return row;
}

module.exports = {
  TABLE,
  PUBLIC_COLUMNS,
  findById,
  findPublicById,
  findByEmail,
  findByUsername,
  create,
  update,
};
