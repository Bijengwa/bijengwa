exports.up = function up(knex) {
  return knex.schema.createTable('profiles', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.text('profile_pic');
    table.string('full_name').notNullable();
    table.string('username').notNullable();
    table.string('email').notNullable();
    table.string('phone_number');
    table.string('password').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.unique('username');
    table.unique('email');
    table.index('phone_number');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('profiles');
};
