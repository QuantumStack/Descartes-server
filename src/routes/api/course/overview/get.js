/*
 * Copyright (c) 2019, QuantumStack. All rights reserved.
 */

const express = require('express');

const router = express.Router();

/**
 * getInstructorCourseDetails takes a course object and compiles it to the
 * correct form for returning it to the user.
 *
 * @param course to be processed.
 */
const getInstructorCourseDetails = (profile, course) => {
  const { name, uuid } = course;
  const hasOh = course.has_oh;
  const isExpired = course.expires_at < Date.now();

  return {
    uuid,
    name,
    hasOh,
    isExpired,
  };
};

/**
 * instructorCourses finds and returns a dictionary of the courses for which
 * user is an instructor.
 * @param user to be processed.
 */
const instructorCourses = user =>
  user
    .$relatedQuery('profile')
    .then(profile =>
      profile
        .$relatedQuery('instructorCourses')
        .then(courses =>
          courses.map(course => getInstructorCourseDetails(profile, course))
        )
    );

/**
 * studentCourses finds and returns a dictionary of the courses for which
 * user is an student.
 * @param user
 */
const studentCourses = user =>
  user
    .$relatedQuery('profile')
    .then(profile =>
      profile.$relatedQuery('studentCourses').then(courses => courses)
    );

/**
 * overviewHelper returns an object of the overview that is to be sent to user.
 * @param user
 * @returns JSON object defined in API specs.
 */
const overviewHelper = user =>
  Promise.all([instructorCourses(user), studentCourses(user)]).then(
    results => ({
      instructorCourses: results[0],
      studentCourses: results[1],
    })
  );

/**
 * GET /api/course/overview
 *
 * Gives an overview of the courses for both instructors and students.
 */
router.get('/', (req, res) =>
  overviewHelper(req.user).then(result => res.status(200).json(result))
);

module.exports = router;
