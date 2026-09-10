exports.up = function up(knex) {
  return knex.schema.alterTable('profiles', (table) => {
    table.boolean('is_verified').notNullable().defaultTo(false);

    table.string('verification_code', 6);

    table
      .timestamp('verification_code_expires_at')
      .nullable();

    table.index('is_verified');
    table.index('verification_code');
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('profiles', (table) => {
    table.dropIndex('is_verified');
    table.dropIndex('verification_code');

    table.dropColumn('verification_code_expires_at');
    table.dropColumn('verification_code');
    table.dropColumn('is_verified');
  });
};