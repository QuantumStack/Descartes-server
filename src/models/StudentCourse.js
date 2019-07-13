/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const { Model } = require('objection');
/* eslint-disable global-require */

class StudentCourse extends Model {
  // Define the table name
  static get tableName() {
    return 'students_courses';
  }

  // Define relations
  static get relationMappings() {
    const Profile = require('./Profile');
    const Course = require('./Course');

    return {
      student: {
        relation: Model.BelongsToOneRelation,
        modelClass: Profile,
        join: {
          from: 'students_courses.student_id',
          to: 'profiles.user_id',
        },
      },
      course: {
        relation: Model.BelongsToOneRelation,
        modelClass: Course,
        join: {
          from: 'students_courses.course_id',
          to: 'courses.id',
        },
      },
    };
  }
}

module.exports = StudentCourse;
