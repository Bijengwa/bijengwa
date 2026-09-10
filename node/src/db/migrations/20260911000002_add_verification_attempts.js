exports.up = function up(knex) {
  return knex.schema.alterTable('profiles', (table) => {
    table
      .integer('verification_failed_attempts')
      .notNullable()
      .defaultTo(0);
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('profiles', (table) => {
    table.dropColumn('verification_failed_attempts');
  });
};
