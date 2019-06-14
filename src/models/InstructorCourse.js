const { Model } = require('objection');
/* eslint-disable global-require */

class InstructorCourse extends Model {
  // Define the table name
  static get tableName() {
    return 'instructors_courses';
  }

  // Define relations
  static get relationMappings() {
    const Profile = require('./Profile');
    const Course = require('./Course');

    return {
      instructor: {
        relation: Model.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'instructors_courses.student_id',
          to: 'profiles.user_id',
        },
      },
      course: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'instructors_courses.course_id',
          to: 'courses.id',
        },
      },
    };
  }
}

module.exports = InstructorCourse;
