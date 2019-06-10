
exports.up = (knex) => knex.schema
  .createTable('instructors_courses', (table) => {
    table.bigIncrements('id');

    // Instructor's ID
    table.integer('instructor_id').unsigned();
    table.foreign('instructor_id').references('profiles.user_id');
    table.boolean('is_course_admin').defaultTo(false);

    // Course's ID
    table.integer('course_id').unsigned();
    table.foreign('course_id').references('courses.id');
  });

exports.down = (knex) => knex.schema
  .dropTableIfExists('instructors_courses');
