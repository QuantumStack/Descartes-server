exports.up = knex =>
  knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('courses', table => {
      // Create identification
      table.increments('id');
      table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()'));
      table.unique('uuid');
      table.index('uuid');

      // Create relations to profiles.
      table.integer('owner_id').unsigned();
      table.foreign('owner_id').references('profiles.user_id');

      // Other information
      table.string('name').notNullable();
      table.string('description');
      table.string('plan_id').notNullable();

      // Date and time information
      table.dateTime('expires_at');
      table.dateTime('created_at').defaultTo(knex.fn.now());

      // Other features
      table.boolean('has_oh').defaultTo(false);
    });

exports.down = knex =>
  knex.schema
    .dropTableIfExists('courses')
    .raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
