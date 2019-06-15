exports.up = knex => knex.schema.table('profiles', (table) => {
  table.uuid('uuid').defaultTo(knex.raw('uuid_generate_v4()'));
  table.index('uuid');
  table.unique('uuid');
});

exports.down = knex => knex.schema.table('profiles', (table) => {
  table.dropColumn('uuid');
});
