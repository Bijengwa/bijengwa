exports.up = function up(knex) {
  return knex.schema.createTable('payments', (table) => {
    table.uuid('uuid').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table
      .uuid('rental_agreement_uuid')
      .notNullable()
      .references('uuid')
      .inTable('rental_agreements')
      .onDelete('CASCADE');
    table.decimal('amount_tzs', 14, 2).notNullable();
    table.integer('months_paid_for').notNullable().defaultTo(1);
    table.date('payment_date').notNullable();
    table.date('period_start_date').notNullable();
    table.date('period_end_date').notNullable();
    table.string('payment_method');
    table.string('reference_number');
    table.string('status').notNullable().defaultTo('completed');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.index('rental_agreement_uuid');
    table.index('payment_date');
    table.index('status');

    table.check(
      "status in ('pending', 'completed', 'failed', 'refunded')",
      [],
      'payments_status_check'
    );
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('payments');
};
