exports.up = knex =>
  knex.schema.createTable('students_courses', table => {
    table.bigIncrements('id');

    // Student's ID
    table.integer('student_id').unsigned();
    table.foreign('student_id').references('profiles.user_id');

    // Course's ID
    table.integer('course_id').unsigned();
    table.foreign('course_id').references('courses.id');
  });

exports.down = knex => knex.schema.dropTableIfExists('students_courses');
