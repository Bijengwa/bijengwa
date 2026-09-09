exports.up = function up(knex) {
  return knex.schema.createTable('settings', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('user_uuid')
      .notNullable()
      .references('uuid')
      .inTable('profiles')
      .onDelete('CASCADE');
    table.string('language').notNullable().defaultTo('en');
    table.string('theme').notNullable().defaultTo('light');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.unique('user_uuid');

    table.check("language in ('en', 'sw')", [], 'settings_language_check');
    table.check("theme in ('light', 'dark')", [], 'settings_theme_check');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('settings');
};
