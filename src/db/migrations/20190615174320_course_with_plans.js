exports.up = knex =>
  knex.schema.table('courses', table => {
    table
      .uuid('plan_uuid')
      .notNullable()
      .references('course_plans.uuid');
  });

exports.down = knex =>
  knex.schema.table('courses', table => {
    table.dropColumn('plan_uuid');
  });
