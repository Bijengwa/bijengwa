exports.up = function up(knex) {
  return knex.schema.createTable('chat_messages', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('chat_uuid')
      .notNullable()
      .references('uuid')
      .inTable('chats')
      .onDelete('CASCADE');
    table
      .uuid('sender_uuid')
      .notNullable()
      .references('uuid')
      .inTable('profiles')
      .onDelete('CASCADE');
    table.text('message').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index('chat_uuid');
    table.index('sender_uuid');
    table.index(['chat_uuid', 'created_at']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('chat_messages');
};
