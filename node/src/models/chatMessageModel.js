const db = require('../config/db');

const TABLE = 'chat_messages';

function create(data) {
  return db(TABLE).insert(data).returning('*').then(([row]) => row);
}

function findByChat(chatUuid) {
  return db(TABLE).where({ chat_uuid: chatUuid }).orderBy('created_at', 'asc');
}

module.exports = { TABLE, create, findByChat };
