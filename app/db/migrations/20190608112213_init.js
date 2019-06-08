
exports.up = knex => knex.schema
  .createTable('users', (table) => {
    // General ID for the User
    table.increments('id');

    // Identifies time information about this user
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('last_updated').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('last_login');

    // Stores whether the user deleted the account
    table.boolean('is_deleted').defaultTo(false);

    // Store the email and password of the user
    table.string('email', 255).notNullable();
    table.string('password');

    // We want to index by the email of the user
    table.index('email');
    table.unique(['email']);

    // Store information about access
    table.boolean('is_admin').defaultTo(false);
    table.boolean('is_email_verified').defaultTo(false);

  })
  .createTable('profiles', (table) => {
    // Profiles stores more information about the user that is unrelated to
    // authentication.
    table.integer('user_id').unsigned();
    table.foreign('user_id').references('users.id');

    // Store the first and last name of the user.
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
  });

exports.down = knex => knex.schema
  .dropTable('profiles')
  .dropTable('users');
