exports.up = function up(knex) {
  return knex.schema.createTable('units', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('property_uuid')
      .notNullable()
      .references('uuid')
      .inTable('properties')
      .onDelete('CASCADE');
    table.string('unit_name').notNullable();
    table.string('room_type');
    table.string('purpose').notNullable().defaultTo('living');
    table.decimal('rent_tzs', 14, 2).notNullable();
    table.string('minimum_stay');
    table.string('rent_paid_in_advance');
    table.integer('notice_before_leaving_days');
    table.text('description');
    table.jsonb('photos').notNullable().defaultTo('[]');
    table.string('status').notNullable().defaultTo('available');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index('property_uuid');
    table.index('status');
    table.index(['property_uuid', 'status']);
    table.index('rent_tzs');

    table.check("purpose in ('living', 'business')", [], 'units_purpose_check');
    table.check("status in ('available', 'occupied')", [], 'units_status_check');
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('units');
};
