exports.up = function up(knex) {
  return knex.schema.createTable('rental_agreements', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('unit_uuid')
      .notNullable()
      .references('uuid')
      .inTable('units')
      .onDelete('RESTRICT');
    table
      .uuid('tenant_uuid')
      .notNullable()
      .references('uuid')
      .inTable('profiles')
      .onDelete('CASCADE');
    table.date('start_date').notNullable();
    table.date('end_date');
    table.decimal('monthly_rent_tzs', 14, 2).notNullable();
    table.integer('months_paid_in_advance').notNullable().defaultTo(0);
    table.string('minimum_stay');
    table.integer('notice_before_leaving_days');
    table.string('status').notNullable().defaultTo('pending');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index('unit_uuid');
    table.index('tenant_uuid');
    table.index('status');

    table.check(
      "status in ('pending', 'active', 'ended', 'cancelled')",
      [],
      'rental_agreements_status_check'
    );
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('rental_agreements');
};
