const { Model } = require('objection');
/* eslint-disable global-require */

class Course extends Model {
  // Define the table name
  static get tableName() {
    return 'courses';
  }

  // Define relations
  static get relationMappings() {
    const Profile = require('./Profile');

    return {
      // The owner of the course (the one that created it)
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'courses.owner_id',
          to: 'profiles.user_id',
        },
      },

      // The students in a course, related through a join table.
      students: {
        relation: Model.ManyToManyRelation,
        modelClass: Profile,
        join: {
          from: 'courses.id',
          through: {
            from: 'students_courses.course_id',
            to: 'students_courses.student_id',
          },
          to: 'profiles.user_id',
        },
      },

      // The instructors in a course, related through a different join table.
      instructors: {
        relation: Model.ManyToManyRelation,
        modelClass: Profile,
        join: {
          from: 'courses.id',
          through: {
            from: 'instructors_courses.course_id',
            to: 'instructors_courses.student_id',
          },
          to: 'profiles.user_id',
        },
      },
    };
  }
}

module.exports = Course;
