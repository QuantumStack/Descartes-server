/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

exports.up = knex =>
  knex.schema.createTable('coupons', table => {
    // Identification
    table.increments('id');
    table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()'));
    table.unique('uuid');
    table.index('uuid');

    // Coupon code that is entered
    table.string('coupon_code').notNullable();
    table.unique('coupon_code');

    // Adjusted price
    table.integer('adjusted_price').notNullable();

    //  References
    table.uuid('plan_uuid').references('course_plans.uuid');
  });

exports.down = knex => knex.schema.dropTableIfExists('coupons');
