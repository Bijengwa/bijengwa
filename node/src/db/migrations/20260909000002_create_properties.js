exports.up = function up(knex) {
  return knex.schema.createTable('properties', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('owner_uuid')
      .notNullable()
      .references('uuid')
      .inTable('profiles')
      .onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('property_type');
    table.jsonb('pictures').notNullable().defaultTo('[]');
    table.string('location');
    table.string('street');
    table.text('description');
    table.text('house_rules');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index('owner_uuid');
    table.index('location');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('properties');
};
