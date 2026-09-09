exports.up = function up(knex) {
  return knex.schema.createTable('chats', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('unit_uuid')
      .notNullable()
      .references('uuid')
      .inTable('units')
      .onDelete('CASCADE');
    table
      .uuid('tenant_uuid')
      .notNullable()
      .references('uuid')
      .inTable('profiles')
      .onDelete('CASCADE');
    table
      .uuid('owner_uuid')
      .notNullable()
      .references('uuid')
      .inTable('profiles')
      .onDelete('CASCADE');
    table.string('status').notNullable().defaultTo('open');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index('unit_uuid');
    table.index('tenant_uuid');
    table.index('owner_uuid');
    table.unique(['unit_uuid', 'tenant_uuid']);

    table.check("status in ('open', 'closed')", [], 'chats_status_check');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('chats');
};
