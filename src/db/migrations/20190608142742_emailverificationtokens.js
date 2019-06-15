exports.up = knex => knex.schema.createTable('email_verification_tokens', (table) => {
  table.increments('id');
  table.string('token');
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.integer('user_id').unsigned();
  table.index('user_id');
  table.foreign('user_id').references('users.id');
});

exports.down = knex => knex.schema.dropTableIfExists('email_verification_tokens');
