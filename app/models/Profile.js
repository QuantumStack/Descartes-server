const { Model } = require('objection');
/* eslint-disable global-require */

class Profile extends Model {
  // Define the table name
  static get tableName() {
    return 'profiles';
  }

  // Define relations
  static get relationMappings() {
    const User = require('./User');
    const Course = require('./Course');

    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'profiles.user_id',
          to: 'users.id',
        },
      },
      ownerCourses: {
        relation: Model.HasManyRelation,
        modelClass: Course,
        join: {
          from: 'profiles.user_id',
          to: 'courses.owner_id',
        },
      },

      // Courses for which this user is a student
      studentCourses: {
        relation: Model.ManyToManyRelation,
        modelClass: Course,
        join: {
          from: 'profiles.user_id',
          through: {
            from: 'students_courses.student_id',
            to: 'students_courses.course_id',
          },
          to: 'courses.id',
        },
      },

      // Courses for which this user is an instructor
      instructorCourses: {
        relation: Model.ManyToManyRelation,
        modelClass: Course,
        join: {
          from: 'profiles.user_id',
          through: {
            from: 'instructors_courses.instructor_id',
            to: 'instructors_courses.course_id',
          },
          to: 'courses.id',
        },
      },
    };
  }
}

module.exports = Profile;
