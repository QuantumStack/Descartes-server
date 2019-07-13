/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

exports.up = knex =>
  knex.schema.createTable('course_plans', table => {
    // Identification
    table.increments('id');
    table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()'));
    table.index('uuid');
    table.unique('uuid');

    // Plan details
    table.string('plan_name');
    table.string('price');
    table.integer('length_in_days');
  });

exports.down = knex => knex.schema.dropTableIfExists('course_plans');
